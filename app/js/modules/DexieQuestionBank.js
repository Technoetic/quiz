/**
 * DexieQuestionBank 클래스
 * Dexie.js를 사용한 브라우저 영구 저장소
 */

import Dexie from '../lib/dexie.mjs';
import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

export class DexieQuestionBank {
    constructor() {
        this.db = new Dexie('QuestionBankDB');
        this.questions = [];
        this.questionsCache = [];
    }

    /**
     * Dexie 초기화
     */
    async init() {
        try {
            console.log('Dexie 초기화 시작...');

            // 데이터베이스 스키마 정의
            this.db.version(1).stores({
                questions: '++id, type, subject, deleted'
            });

            console.log('Dexie 스키마 정의 완료');

            // 메모리에 로드
            await this.load();

            console.log('Dexie 초기화 완료');
        } catch (error) {
            console.error('Dexie 초기화 실패:', error);
            throw error;
        }
    }


    /**
     * 모든 문제 로드
     */
    async load() {
        try {
            const rows = await this.db.questions.toArray();

            this.questionsCache = rows.map(row => ({
                id: row.id,
                type: row.type,
                subject: row.subject,
                question: row.question,
                options: row.options,
                correctAnswer: row.correctAnswer,
                correctOrder: row.correctOrder,
                alternativeAnswers: row.alternativeAnswers,
                deleted: row.deleted
            }));

            this.questions = this.questionsCache.map((q, index) => new Question({ ...q, index }));

            console.log(`총 ${this.questions.length}개 문제 로드 완료 (Dexie)`);
        } catch (error) {
            console.error('문제 로드 실패:', error);
            this.questionsCache = [];
            this.questions = [];
        }
    }

    /**
     * 새 문제 추가
     */
    async add(questionData) {
        const newQuestion = {
            type: questionData.type,
            subject: questionData.subject,
            question: questionData.question,
            options: questionData.options || null,
            correctAnswer: questionData.correctAnswer,
            correctOrder: questionData.correctOrder || null,
            alternativeAnswers: questionData.alternativeAnswers || null,
            deleted: false
        };

        await this.db.questions.add(newQuestion);
        await this.load();

        console.log('문제 추가 완료');
        return this.questions[this.questions.length - 1];
    }

    /**
     * 문제 업데이트
     */
    async update(index, questionData) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        await this.db.questions.update(dbId, {
            type: questionData.type,
            subject: questionData.subject,
            question: questionData.question,
            options: questionData.options || null,
            correctAnswer: questionData.correctAnswer,
            correctOrder: questionData.correctOrder || null,
            alternativeAnswers: questionData.alternativeAnswers || null
        });

        await this.load();

        console.log('문제 업데이트 완료');
        return true;
    }

    /**
     * 문제 삭제 (soft delete)
     */
    async delete(index) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        await this.db.questions.update(dbId, { deleted: true });
        await this.load();

        console.log('문제 삭제 완료 (soft delete)');
        return true;
    }

    /**
     * 삭제된 문제 복원
     */
    async restore(index) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;
        console.log('restore() - index:', index, 'dbId:', dbId, 'type:', typeof dbId);

        await this.db.questions.update(dbId, { deleted: false });
        await this.load();

        console.log('문제 복원 완료');
        return true;
    }

    /**
     * 문제 영구 삭제
     */
    async permanentDelete(index) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        await this.db.questions.delete(dbId);
        await this.load();

        console.log('문제 영구 삭제 완료');
        return true;
    }

    /**
     * 모든 문제 삭제 (soft delete)
     */
    async deleteAllQuestions() {
        try {
            // 모든 문제 조회 후 필터
            const allQuestions = await this.db.questions.toArray();
            const activeQuestions = allQuestions.filter(q => !q.deleted);

            // 각 문제를 순회하며 deleted 플래그 업데이트
            for (const question of activeQuestions) {
                await this.db.questions.update(question.id, { deleted: true });
            }

            await this.load();

            console.log('모든 문제 삭제 완료');
            return true;
        } catch (error) {
            console.error('문제 삭제 실패:', error);
            console.error('에러 상세:', error.message, error.stack);
            return false;
        }
    }

    /**
     * 활성 문제 목록 조회
     */
    getAll() {
        return this.questions.filter(q => !q.deleted);
    }

    /**
     * 삭제된 문제 목록 조회
     */
    getDeleted() {
        console.log('getDeleted() 호출 - 전체 문제:', this.questions.length);
        console.log('deleted=true인 문제:', this.questions.filter(q => q.deleted).length);
        console.log('샘플 문제 deleted 상태:', this.questions.slice(0, 3).map(q => ({ id: q.id, deleted: q.deleted })));
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
     * 문제 통계 조회
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
     * 데이터베이스 백업 (JSON)
     */
    async downloadBackup() {
        const allQuestions = await this.db.questions.toArray();

        const exportData = {
            version: '1.0',
            exported_at: new Date().toISOString(),
            questions: allQuestions
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions-backup.json';
        a.click();
        URL.revokeObjectURL(url);

        console.log('백업 파일 다운로드 완료');
    }
}
