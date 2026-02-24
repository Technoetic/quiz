/**
 * AutoBackup 클래스
 * 문제 데이터 자동 백업 시스템
 * 변경 시 JSON 파일 자동 다운로드
 */

export class AutoBackup {
    constructor(questionBank, indexedDB) {
        this.questionBank = questionBank;
        this.indexedDB = indexedDB;
        this.lastBackupTime = 0;
        this.backupInterval = 5 * 60 * 1000; // 5분
        this.autoBackupEnabled = false;
        this.hasChanges = false;

        this.loadSettings();
    }

    /**
     * 설정 로드
     */
    loadSettings() {
        const saved = localStorage.getItem('autoBackupSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.autoBackupEnabled = settings.enabled !== false; // 기본값 true
            this.backupInterval = settings.interval || (5 * 60 * 1000);
        } else {
            this.autoBackupEnabled = true; // 기본값 활성화
        }
    }

    /**
     * 설정 저장
     */
    saveSettings() {
        localStorage.setItem('autoBackupSettings', JSON.stringify({
            enabled: this.autoBackupEnabled,
            interval: this.backupInterval
        }));
    }

    /**
     * 자동 백업 시작
     */
    start() {
        if (this.autoBackupEnabled) {
            this.intervalId = setInterval(() => {
                if (this.hasChanges) {
                    this.createBackup();
                    this.hasChanges = false;
                }
            }, this.backupInterval);

            console.log(`자동 백업 시작 (${this.backupInterval / 1000}초 간격)`);
        }
    }

    /**
     * 자동 백업 중지
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('자동 백업 중지');
        }
    }

    /**
     * 변경사항 표시
     */
    markChanged() {
        this.hasChanges = true;
    }

    /**
     * 즉시 백업 생성 및 다운로드
     * @param {boolean} autoDownload - 자동 다운로드 여부
     * @returns {Promise<Object>} 백업 데이터
     */
    async createBackup(autoDownload = false) {
        try {
            const questions = this.questionBank.getAll();
            const deletedQuestions = this.questionBank.getDeleted();
            const stats = this.questionBank.getStats();

            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                questionCount: questions.length,
                deletedCount: deletedQuestions.length,
                stats: stats,
                questions: questions.map(q => q.toJSON()),
                deletedQuestions: deletedQuestions.map(q => q.toJSON())
            };

            // IndexedDB에 백업 메타데이터 저장
            if (this.indexedDB) {
                await this.indexedDB.saveBackupMetadata({
                    questionCount: backupData.questionCount,
                    deletedCount: backupData.deletedCount,
                    timestamp: Date.now()
                });
            }

            // 자동 다운로드가 아닌 경우에만 파일 다운로드
            if (autoDownload) {
                this.downloadBackup(backupData);
            }

            this.lastBackupTime = Date.now();
            console.log('백업 생성 완료:', backupData.timestamp);

            return backupData;
        } catch (error) {
            console.error('백업 생성 실패:', error);
            throw error;
        }
    }

    /**
     * 백업 파일 다운로드
     * @param {Object} backupData - 백업 데이터
     */
    downloadBackup(backupData) {
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `quiz-backup-${timestamp}.json`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        // 클린업
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        console.log(`백업 파일 다운로드: ${filename}`);
    }

    /**
     * 백업 파일에서 복원
     * @param {File} file - 백업 JSON 파일
     * @returns {Promise<Object>} 복원 결과
     */
    async restoreFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);

                    // 백업 데이터 검증
                    if (!backupData.version || !backupData.questions) {
                        throw new Error('잘못된 백업 파일 형식');
                    }

                    // 기존 데이터 백업
                    const currentBackup = await this.createBackup(false);

                    // 문제 복원
                    this.questionBank.questions = [];
                    backupData.questions.forEach(q => {
                        this.questionBank.add(q);
                    });

                    // 삭제된 문제 복원
                    if (backupData.deletedQuestions) {
                        backupData.deletedQuestions.forEach(q => {
                            const added = this.questionBank.add(q);
                            this.questionBank.delete(added.index);
                        });
                    }

                    const result = {
                        success: true,
                        restoredCount: backupData.questionCount,
                        deletedCount: backupData.deletedCount || 0,
                        backupTimestamp: backupData.timestamp
                    };

                    console.log('복원 완료:', result);
                    resolve(result);

                } catch (error) {
                    console.error('복원 실패:', error);
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('파일 읽기 실패'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * 문제 추가 시 자동 백업 트리거
     */
    onQuestionAdded() {
        this.markChanged();

        // 즉시 백업 옵션이 켜져있으면 바로 백업
        if (this.autoBackupEnabled && this.backupInterval === 0) {
            this.createBackup(false);
        }
    }

    /**
     * 문제 수정 시 자동 백업 트리거
     */
    onQuestionUpdated() {
        this.markChanged();
    }

    /**
     * 문제 삭제 시 자동 백업 트리거
     */
    onQuestionDeleted() {
        this.markChanged();
    }

    /**
     * 자동 백업 활성화/비활성화
     * @param {boolean} enabled - 활성화 여부
     */
    setEnabled(enabled) {
        this.autoBackupEnabled = enabled;
        this.saveSettings();

        if (enabled) {
            this.start();
        } else {
            this.stop();
        }
    }

    /**
     * 백업 간격 설정
     * @param {number} minutes - 분 단위 간격 (0 = 즉시)
     */
    setInterval(minutes) {
        this.backupInterval = minutes * 60 * 1000;
        this.saveSettings();

        // 인터벌 재시작
        this.stop();
        if (this.autoBackupEnabled) {
            this.start();
        }
    }

    /**
     * 마지막 백업 시간 조회
     * @returns {string} 마지막 백업 시간 (human-readable)
     */
    getLastBackupTime() {
        if (!this.lastBackupTime) {
            return '백업 없음';
        }

        const elapsed = Date.now() - this.lastBackupTime;
        const minutes = Math.floor(elapsed / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return '방금 전';
    }

    /**
     * 백업 이력 조회
     * @returns {Promise<Array>} 백업 목록
     */
    async getBackupHistory() {
        if (this.indexedDB) {
            return await this.indexedDB.getBackupHistory();
        }
        return [];
    }

    /**
     * 전체 백업 (모든 데이터 포함)
     * @returns {Promise<Object>} 백업 데이터
     */
    async createFullBackup() {
        const backupData = await this.createBackup(false);

        // 진행 상황 데이터 추가
        const progressData = localStorage.getItem('quizProgress');
        if (progressData) {
            backupData.progress = JSON.parse(progressData);
        }

        // 설정 데이터 추가
        const settingsData = localStorage.getItem('quizSettings');
        if (settingsData) {
            backupData.settings = JSON.parse(settingsData);
        }

        this.downloadBackup(backupData);
        return backupData;
    }
}
