/**
 * FileSystemQuestionBank 클래스
 * File System Access API를 사용한 파일 기반 저장소
 * app/data/questions.json 파일에 자동 저장
 *
 * 지원 브라우저: Chrome 86+, Edge 86+
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

export class FileSystemQuestionBank {
    constructor() {
        this.questions = [];
        this.fileHandle = null;
        this.fileName = 'questions-db.json';
    }

    /**
     * 초기화
     */
    async init() {
        console.log('FileSystem 초기화 시작...');

        // 저장된 파일 핸들 복원 시도
        await this.restoreFileHandle();

        if (this.fileHandle) {
            await this.loadFromFile();
        } else {
            console.log('파일 핸들 없음. 사용자가 파일을 선택해야 합니다.');
            this.questions = [];
        }

        console.log('FileSystem 초기화 완료');
    }

    /**
     * 파일 핸들 복원
     */
    async restoreFileHandle() {
        try {
            // IndexedDB에서 파일 핸들 복원
            const db = await this.openIndexedDB();
            const handle = await this.getStoredFileHandle(db);

            if (handle) {
                // 권한 확인
                const permission = await handle.queryPermission({ mode: 'readwrite' });
                if (permission === 'granted') {
                    this.fileHandle = handle;
                    console.log('파일 핸들 복원 성공');
                } else {
                    // 권한 요청
                    const newPermission = await handle.requestPermission({ mode: 'readwrite' });
                    if (newPermission === 'granted') {
                        this.fileHandle = handle;
                        console.log('파일 핸들 권한 획득 성공');
                    }
                }
            }
        } catch (error) {
            console.log('파일 핸들 복원 실패:', error.message);
        }
    }

    /**
     * IndexedDB 열기
     */
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('FileHandleDB', 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('fileHandles')) {
                    db.createObjectStore('fileHandles');
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 저장된 파일 핸들 가져오기
     */
    async getStoredFileHandle(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['fileHandles'], 'readonly');
            const store = transaction.objectStore('fileHandles');
            const request = store.get('questionsFile');

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 파일 핸들 저장
     */
    async storeFileHandle(handle) {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['fileHandles'], 'readwrite');
            const store = transaction.objectStore('fileHandles');
            const request = store.put(handle, 'questionsFile');

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 파일 선택 대화상자 표시
     */
    async selectFile() {
        try {
            // 파일 선택 또는 생성
            [this.fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON 파일',
                    accept: { 'application/json': ['.json'] }
                }],
                multiple: false
            });

            await this.storeFileHandle(this.fileHandle);
            await this.loadFromFile();

            console.log('파일 선택 완료:', this.fileHandle.name);
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('파일 선택 실패:', error);
            }
            return false;
        }
    }

    /**
     * 새 파일 생성
     */
    async createNewFile() {
        try {
            this.fileHandle = await window.showSaveFilePicker({
                suggestedName: this.fileName,
                types: [{
                    description: 'JSON 파일',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            await this.storeFileHandle(this.fileHandle);
            await this.saveToFile();

            console.log('새 파일 생성 완료:', this.fileHandle.name);
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('파일 생성 실패:', error);
            }
            return false;
        }
    }

    /**
     * 파일에서 로드
     */
    async loadFromFile() {
        if (!this.fileHandle) {
            throw new Error('파일 핸들 없음');
        }

        try {
            const file = await this.fileHandle.getFile();
            const text = await file.text();
            const data = JSON.parse(text);

            this.questions = data.questions.map((q, index) => new Question({ ...q, index }));
            console.log(`파일에서 ${this.questions.length}개 문제 로드 완료`);
        } catch (error) {
            console.error('파일 로드 실패:', error);
            this.questions = [];
        }
    }

    /**
     * 파일에 저장
     */
    async saveToFile() {
        if (!this.fileHandle) {
            console.warn('파일 핸들 없음. 사용자가 파일을 선택해야 합니다.');
            return false;
        }

        try {
            const writable = await this.fileHandle.createWritable();

            const data = {
                version: '1.0',
                saved_at: new Date().toISOString(),
                questions: this.questions.map(q => ({
                    id: q.id,
                    type: q.type,
                    subject: q.subject,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    correctOrder: q.correctOrder,
                    alternativeAnswers: q.alternativeAnswers,
                    deleted: q.deleted
                }))
            };

            await writable.write(JSON.stringify(data, null, 2));
            await writable.close();

            console.log('✅ 파일 저장 완료:', this.fileHandle.name);
            return true;
        } catch (error) {
            console.error('파일 저장 실패:', error);
            return false;
        }
    }

    /**
     * 문제 추가
     */
    async add(questionData) {
        const newId = this.questions.length > 0
            ? Math.max(...this.questions.map(q => q.id || 0)) + 1
            : 1;

        const newQuestion = new Question({
            ...questionData,
            id: newId,
            index: this.questions.length,
            deleted: false
        });

        this.questions.push(newQuestion);
        await this.saveToFile(); // 자동 저장

        return newQuestion;
    }

    /**
     * 문제 업데이트
     */
    async update(index, questionData) {
        if (index < 0 || index >= this.questions.length) return false;

        const question = this.questions[index];
        Object.assign(question, questionData);

        await this.saveToFile(); // 자동 저장
        return true;
    }

    /**
     * 문제 삭제
     */
    async delete(index) {
        if (index < 0 || index >= this.questions.length) return false;

        this.questions[index].deleted = true;
        await this.saveToFile(); // 자동 저장
        return true;
    }

    /**
     * 문제 복원
     */
    async restore(index) {
        if (index < 0 || index >= this.questions.length) return false;

        this.questions[index].deleted = false;
        await this.saveToFile(); // 자동 저장
        return true;
    }

    /**
     * 문제 영구 삭제
     */
    async permanentDelete(index) {
        if (index < 0 || index >= this.questions.length) return false;

        this.questions.splice(index, 1);
        this.questions.forEach((q, i) => q.index = i);

        await this.saveToFile(); // 자동 저장
        return true;
    }

    /**
     * 모든 문제 삭제
     */
    async deleteAllQuestions() {
        this.questions.forEach(q => {
            if (!q.deleted) q.deleted = true;
        });

        await this.saveToFile(); // 자동 저장
        return true;
    }

    // getAll, getDeleted, getBySubject, getByType, getStats 등은 동일
    getAll() {
        return this.questions.filter(q => !q.deleted);
    }

    getDeleted() {
        return this.questions.filter(q => q.deleted);
    }

    getBySubject(subject) {
        return this.questions.filter(q => !q.deleted && q.subject === subject);
    }

    getByType(type) {
        return this.questions.filter(q => !q.deleted && q.type === type);
    }

    getStats() {
        const all = this.getAll();
        return {
            total: all.length,
            multiple: all.filter(q => q.type === AppConstants.QUESTION_TYPES.MULTIPLE).length,
            subjective: all.filter(q => q.type === AppConstants.QUESTION_TYPES.SUBJECTIVE).length,
            sequence: all.filter(q => q.type === AppConstants.QUESTION_TYPES.SEQUENCE).length,
            deleted: this.getDeleted().length
        };
    }

    async downloadBackup() {
        await this.saveToFile();
    }
}
