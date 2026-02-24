/**
 * SettingsUI 클래스
 * 설정 화면 UI 관리 (백업/복원 포함)
 */

import { domCache } from './utils/DOMCache.js';

export class SettingsUI {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {AutoBackup} autoBackup - 자동 백업 시스템
     * @param {ToastNotification} toast - Toast 알림
     */
    constructor(questionBank, autoBackup, toast) {
        this.questionBank = questionBank;
        this.autoBackup = autoBackup;
        this.toast = toast;

        this.initializeEventListeners();
        this.loadSettings();
        this.updateBackupStatus();
    }

    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
        // 수동 백업 버튼
        document.getElementById('btnManualBackup')?.addEventListener('click', () => {
            this.handleManualBackup();
        });

        // 백업 복원 버튼
        document.getElementById('btnRestoreBackup')?.addEventListener('click', () => {
            this.handleRestoreBackup();
        });

        // 기본 문제로 복원 버튼
        document.getElementById('btnRestoreDefaults')?.addEventListener('click', () => {
            this.handleRestoreDefaults();
        });

        // 파일 선택 (백업 복원)
        document.getElementById('backupFileInput')?.addEventListener('change', (e) => {
            this.handleFileSelected(e);
        });

        // 자동 백업 활성화 토글
        document.getElementById('autoBackupEnabled')?.addEventListener('change', (e) => {
            this.handleAutoBackupToggle(e.target.checked);
        });

        // 백업 간격 변경
        document.getElementById('backupInterval')?.addEventListener('change', (e) => {
            this.handleBackupIntervalChange(parseInt(e.target.value));
        });

        // 설정 저장 버튼
        document.getElementById('btnSaveSettings')?.addEventListener('click', () => {
            this.handleSaveSettings();
        });
    }

    /**
     * 설정 로드
     */
    loadSettings() {
        // API 키
        const apiKey = localStorage.getItem('chatgptApiKey') || '';
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            apiKeyInput.value = apiKey;
        }

        // 재구성 사용 여부
        const enableRephrase = localStorage.getItem('enableRephrase') !== 'false';
        const rephraseCheckbox = document.getElementById('enableRephrase');
        if (rephraseCheckbox) {
            rephraseCheckbox.checked = enableRephrase;
        }

        // 자동 백업 설정
        const autoBackupSettings = JSON.parse(localStorage.getItem('autoBackupSettings') || '{}');
        const autoBackupCheckbox = document.getElementById('autoBackupEnabled');
        if (autoBackupCheckbox) {
            autoBackupCheckbox.checked = autoBackupSettings.enabled !== false;
        }

        const backupInterval = document.getElementById('backupInterval');
        if (backupInterval && autoBackupSettings.interval !== undefined) {
            const minutes = autoBackupSettings.interval / 60000;
            backupInterval.value = minutes.toString();
        }
    }

    /**
     * 설정 저장
     */
    handleSaveSettings() {
        // API 키 저장
        const apiKey = document.getElementById('apiKey')?.value || '';
        localStorage.setItem('chatgptApiKey', apiKey);

        // 재구성 사용 여부 저장
        const enableRephrase = document.getElementById('enableRephrase')?.checked || false;
        localStorage.setItem('enableRephrase', enableRephrase.toString());

        // 자동 백업 설정 저장
        const autoBackupEnabled = document.getElementById('autoBackupEnabled')?.checked || false;
        const backupInterval = parseInt(document.getElementById('backupInterval')?.value || '5');

        this.autoBackup.setEnabled(autoBackupEnabled);
        this.autoBackup.setInterval(backupInterval);

        this.toast.show('설정이 저장되었습니다', 'success');
    }

    /**
     * 수동 백업 처리
     */
    async handleManualBackup() {
        try {
            await this.autoBackup.createBackup(true);
            this.toast.show('백업 파일이 다운로드되었습니다', 'success');
            this.updateBackupStatus();
        } catch (error) {
            console.error('백업 실패:', error);
            this.toast.show('백업 실패: ' + error.message, 'error');
        }
    }

    /**
     * 백업 복원 처리 (파일 선택 대화상자 열기)
     */
    handleRestoreBackup() {
        const fileInput = document.getElementById('backupFileInput');
        if (fileInput) {
            fileInput.click();
        }
    }

    /**
     * 파일 선택 처리
     */
    async handleFileSelected(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!confirm('백업 파일로 복원하시겠습니까? 현재 데이터는 백업됩니다.')) {
            event.target.value = ''; // 파일 선택 초기화
            return;
        }

        try {
            const result = await this.autoBackup.restoreFromFile(file);

            this.toast.show(
                `복원 완료: ${result.restoredCount}개 문제 복원됨`,
                'success'
            );

            // UI 갱신
            if (window.app && window.app.adminUI) {
                window.app.adminUI.updateQuestionList();
            }

            this.updateBackupStatus();
        } catch (error) {
            console.error('복원 실패:', error);
            this.toast.show('복원 실패: ' + error.message, 'error');
        }

        // 파일 선택 초기화
        event.target.value = '';
    }

    /**
     * 기본 문제로 복원 처리
     */
    async handleRestoreDefaults() {
        if (!confirm('기본 문제로 복원하시겠습니까? 현재 데이터는 백업됩니다.')) {
            return;
        }

        try {
            await this.questionBank.restoreDefaults();

            this.toast.show('기본 문제로 복원되었습니다', 'success');

            // UI 갱신
            if (window.app && window.app.adminUI) {
                window.app.adminUI.updateQuestionList();
            }

            this.updateBackupStatus();
        } catch (error) {
            console.error('복원 실패:', error);
            this.toast.show('복원 실패: ' + error.message, 'error');
        }
    }

    /**
     * 자동 백업 토글 처리
     */
    handleAutoBackupToggle(enabled) {
        this.autoBackup.setEnabled(enabled);

        if (enabled) {
            this.toast.show('자동 백업이 활성화되었습니다', 'info');
        } else {
            this.toast.show('자동 백업이 비활성화되었습니다', 'info');
        }
    }

    /**
     * 백업 간격 변경 처리
     */
    handleBackupIntervalChange(minutes) {
        this.autoBackup.setInterval(minutes);

        if (minutes === 0) {
            this.toast.show('즉시 백업 모드로 설정되었습니다', 'info');
        } else {
            this.toast.show(`백업 간격: ${minutes}분`, 'info');
        }
    }

    /**
     * 백업 상태 업데이트
     */
    updateBackupStatus() {
        const statusDiv = document.getElementById('backupStatus');
        const lastBackupTimeSpan = document.getElementById('lastBackupTime');

        if (statusDiv && lastBackupTimeSpan) {
            const lastBackupTime = this.autoBackup.getLastBackupTime();
            lastBackupTimeSpan.textContent = lastBackupTime;
            statusDiv.style.display = 'block';
        }

        // 주기적 업데이트 (1분마다)
        if (!this.statusUpdateInterval) {
            this.statusUpdateInterval = setInterval(() => {
                this.updateBackupStatus();
            }, 60000);
        }
    }

    /**
     * 백업 이력 표시 (선택 사항)
     */
    async showBackupHistory() {
        try {
            const history = await this.autoBackup.getBackupHistory();

            if (history.length === 0) {
                this.toast.show('백업 이력이 없습니다', 'info');
                return;
            }

            // 간단한 목록 표시
            const list = history.slice(0, 5).map((backup, i) => {
                const date = new Date(backup.timestamp);
                return `${i + 1}. ${date.toLocaleString()} (${backup.questionCount}개 문제)`;
            }).join('\n');

            alert(`최근 백업 이력:\n\n${list}`);
        } catch (error) {
            console.error('백업 이력 조회 실패:', error);
        }
    }

    /**
     * 정리
     */
    destroy() {
        if (this.statusUpdateInterval) {
            clearInterval(this.statusUpdateInterval);
            this.statusUpdateInterval = null;
        }
    }
}
