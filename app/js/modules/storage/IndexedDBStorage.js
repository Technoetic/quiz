/**
 * IndexedDBStorage 클래스
 * IndexedDB를 사용한 대용량 데이터 저장소
 * LocalStorage 대체용 (50MB+ 저장 가능)
 */

import { AppConstants } from '../constants/AppConstants.js';

export class IndexedDBStorage {
    constructor() {
        this.dbName = 'QuizAppDB';
        this.version = 1;
        this.db = null;
    }

    /**
     * IndexedDB 초기화
     * @returns {Promise<IDBDatabase>} 데이터베이스 인스턴스
     */
    async init() {
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('IndexedDB 열기 실패:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB 연결 성공');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 문제 저장소
                if (!db.objectStoreNames.contains('questions')) {
                    const questionStore = db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
                    questionStore.createIndex('subject', 'subject', { unique: false });
                    questionStore.createIndex('type', 'type', { unique: false });
                    questionStore.createIndex('deleted', 'deleted', { unique: false });
                }

                // 진행 상황 저장소
                if (!db.objectStoreNames.contains('progress')) {
                    db.createObjectStore('progress', { keyPath: 'id' });
                }

                // 설정 저장소
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                // 백업 메타데이터
                if (!db.objectStoreNames.contains('backups')) {
                    const backupStore = db.createObjectStore('backups', { keyPath: 'id', autoIncrement: true });
                    backupStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                console.log('IndexedDB 스토어 생성 완료');
            };
        });
    }

    /**
     * 모든 문제 저장
     * @param {Array} questions - 문제 목록
     * @returns {Promise<void>}
     */
    async saveQuestions(questions) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readwrite');
            const store = transaction.objectStore('questions');

            // 기존 데이터 모두 삭제
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                // 새 데이터 추가
                questions.forEach((question, index) => {
                    store.add({ ...question, id: index + 1 });
                });
            };

            transaction.oncomplete = () => {
                console.log(`${questions.length}개 문제 저장 완료`);
                resolve();
            };

            transaction.onerror = () => {
                console.error('문제 저장 실패:', transaction.error);
                reject(transaction.error);
            };
        });
    }

    /**
     * 모든 문제 불러오기
     * @returns {Promise<Array>} 문제 목록
     */
    async loadQuestions() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();

            request.onsuccess = () => {
                const questions = request.result.map(q => {
                    const { id, ...questionData } = q;
                    return questionData;
                });
                console.log(`${questions.length}개 문제 로드 완료`);
                resolve(questions);
            };

            request.onerror = () => {
                console.error('문제 로드 실패:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * 문제 추가
     * @param {Object} question - 문제 데이터
     * @returns {Promise<number>} 추가된 문제 ID
     */
    async addQuestion(question) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readwrite');
            const store = transaction.objectStore('questions');
            const request = store.add(question);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 문제 업데이트
     * @param {number} id - 문제 ID
     * @param {Object} question - 업데이트할 문제 데이터
     * @returns {Promise<void>}
     */
    async updateQuestion(id, question) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readwrite');
            const store = transaction.objectStore('questions');
            const request = store.put({ ...question, id });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 문제 삭제
     * @param {number} id - 문제 ID
     * @returns {Promise<void>}
     */
    async deleteQuestion(id) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readwrite');
            const store = transaction.objectStore('questions');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 모든 데이터 삭제
     * @returns {Promise<void>}
     */
    async clearAll() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions', 'progress', 'settings'], 'readwrite');

            transaction.objectStore('questions').clear();
            transaction.objectStore('progress').clear();
            transaction.objectStore('settings').clear();

            transaction.oncomplete = () => {
                console.log('모든 데이터 삭제 완료');
                resolve();
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    /**
     * 백업 메타데이터 저장
     * @param {Object} metadata - 백업 정보
     * @returns {Promise<number>} 백업 ID
     */
    async saveBackupMetadata(metadata) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['backups'], 'readwrite');
            const store = transaction.objectStore('backups');
            const request = store.add({
                ...metadata,
                timestamp: Date.now()
            });

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 백업 이력 조회
     * @returns {Promise<Array>} 백업 목록
     */
    async getBackupHistory() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['backups'], 'readonly');
            const store = transaction.objectStore('backups');
            const index = store.index('timestamp');
            const request = index.getAll();

            request.onsuccess = () => {
                resolve(request.result.reverse()); // 최신순 정렬
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * LocalStorage에서 IndexedDB로 마이그레이션
     * @returns {Promise<boolean>} 마이그레이션 성공 여부
     */
    async migrateFromLocalStorage() {
        try {
            await this.init();

            const localData = localStorage.getItem(AppConstants.STORAGE_KEYS.QUESTION_BANK);
            if (!localData) {
                console.log('LocalStorage에 마이그레이션할 데이터 없음');
                return false;
            }

            const questions = JSON.parse(localData);
            await this.saveQuestions(questions);

            console.log('LocalStorage → IndexedDB 마이그레이션 완료');
            return true;
        } catch (error) {
            console.error('마이그레이션 실패:', error);
            return false;
        }
    }

    /**
     * IndexedDB 지원 여부 확인
     * @returns {boolean} 지원 여부
     */
    static isSupported() {
        return 'indexedDB' in window;
    }
}
