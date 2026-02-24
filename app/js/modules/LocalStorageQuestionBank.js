/**
 * LocalStorageQuestionBank 클래스
 * localStorage + JSON 파일 기반 저장소
 * app 폴더 복사 시 JSON 파일도 함께 복사하면 데이터 이동 가능
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

export class LocalStorageQuestionBank {
    constructor() {
        this.questions = [];
        this.storageKey = 'QuestionBankDB';
        this.jsonFilePath = '../data/questions-db.json'; // app/data/ 폴더
    }

    /**
     * 초기화
     */
    async init() {
        try {
            console.log('LocalStorage 초기화 시작...');

            // JSON 파일에서 로드 시도
            await this.loadFromFile();

            console.log('LocalStorage 초기화 완료');
        } catch (error) {
            console.error('초기화 실패:', error);
            // 파일 로드 실패 시 localStorage에서 로드
            this.loadFromLocalStorage();
        }
    }

    /**
     * JSON 파일에서 로드
     */
    async loadFromFile() {
        try {
            const response = await fetch(this.jsonFilePath);
            if (response.ok) {
                const data = await response.json();
                this.questions = data.questions.map((q, index) => new Question({ ...q, index }));
                console.log(`JSON 파일에서 ${this.questions.length}개 문제 로드 완료`);

                // localStorage에도 저장
                this.saveToLocalStorage();
            } else {
                throw new Error('JSON 파일 없음');
            }
        } catch (error) {
            console.log('JSON 파일 로드 실패, localStorage에서 로드 시도');
            this.loadFromLocalStorage();
        }
    }

    /**
     * localStorage에서 로드
     */
    loadFromLocalStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            const parsed = JSON.parse(data);
            this.questions = parsed.map((q, index) => new Question({ ...q, index }));
            console.log(`localStorage에서 ${this.questions.length}개 문제 로드 완료`);
        } else {
            this.questions = [];
            console.log('데이터 없음, 빈 DB로 시작');
        }
    }

    /**
     * localStorage에 저장
     */
    saveToLocalStorage() {
        const data = this.questions.map(q => ({
            id: q.id,
            type: q.type,
            subject: q.subject,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            correctOrder: q.correctOrder,
            alternativeAnswers: q.alternativeAnswers,
            deleted: q.deleted
        }));

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    /**
     * JSON 파일로 저장 (다운로드)
     */
    async saveToFile() {
        const data = {
            version: '1.0',
            exported_at: new Date().toISOString(),
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

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions-db.json';
        a.click();
        URL.revokeObjectURL(url);

        console.log('✅ questions-db.json 파일 다운로드 완료');
        console.log('📁 app/data/ 폴더에 저장하면 다른 컴퓨터에서도 자동 로드됩니다.');
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
        this.saveToLocalStorage();

        // 변경사항 발생 시 자동으로 JSON 파일 다운로드 제안
        console.log('💾 변경사항 저장됨. "설정 > 수동 백업"으로 JSON 파일을 다운로드하세요.');

        return newQuestion;
    }

    /**
     * 문제 업데이트
     */
    async update(index, questionData) {
        if (index < 0 || index >= this.questions.length) return false;

        const question = this.questions[index];
        Object.assign(question, questionData);

        this.saveToLocalStorage();
        return true;
    }

    /**
     * 문제 삭제 (soft delete)
     */
    async delete(index) {
        if (index < 0 || index >= this.questions.length) return false;

        this.questions[index].deleted = true;
        this.saveToLocalStorage();
        return true;
    }

    /**
     * 문제 복원
     */
    async restore(index) {
        if (index < 0 || index >= this.questions.length) return false;

        this.questions[index].deleted = false;
        this.saveToLocalStorage();
        return true;
    }

    /**
     * 문제 영구 삭제
     */
    async permanentDelete(index) {
        if (index < 0 || index >= this.questions.length) return false;

        this.questions.splice(index, 1);

        // 인덱스 재정렬
        this.questions.forEach((q, i) => q.index = i);

        this.saveToLocalStorage();
        return true;
    }

    /**
     * 모든 문제 삭제 (soft delete)
     */
    async deleteAllQuestions() {
        this.questions.forEach(q => {
            if (!q.deleted) q.deleted = true;
        });

        this.saveToLocalStorage();
        return true;
    }

    /**
     * 활성 문제 조회
     */
    getAll() {
        return this.questions.filter(q => !q.deleted);
    }

    /**
     * 삭제된 문제 조회
     */
    getDeleted() {
        return this.questions.filter(q => q.deleted);
    }

    /**
     * 과목별 문제 조회
     */
    getBySubject(subject) {
        return this.questions.filter(q => !q.deleted && q.subject === subject);
    }

    /**
     * 유형별 문제 조회
     */
    getByType(type) {
        return this.questions.filter(q => !q.deleted && q.type === type);
    }

    /**
     * 통계 조회
     */
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

    /**
     * 백업 다운로드
     */
    async downloadBackup() {
        await this.saveToFile();
    }
}
