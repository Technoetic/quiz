/**
 * SupabaseQuestionBank 클래스
 * Supabase PostgreSQL 기반 저장소
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

const SUPABASE_URL = 'https://dxaehcocrbvhatyfmrvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YWVoY29jcmJ2aGF0eWZtcnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDAwMTcsImV4cCI6MjA4NzUxNjAxN30.pkeDachOuRpjJX1KCUvMtEY2sio2kSq5hbhH5pPp75U';

export class SupabaseQuestionBank {
    constructor() {
        this.questions = [];
        this.baseUrl = `${SUPABASE_URL}/rest/v1/questions`;
        this.headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    async init() {
        console.log('Supabase QuestionBank 초기화...');
        await this.loadQuestions();
        console.log('Supabase QuestionBank 초기화 완료');
    }

    async loadQuestions() {
        try {
            const res = await fetch(`${this.baseUrl}?order=id.asc`, {
                headers: this.headers
            });
            if (!res.ok) throw new Error(`로드 실패: ${res.status}`);
            const rows = await res.json();
            this.questions = rows.map((row, index) => new Question({
                id: row.id,
                type: row.type,
                subject: row.subject,
                question: row.question,
                options: row.options || null,
                correctAnswer: row.correct_answer || null,
                correctOrder: row.correct_order || null,
                deleted: row.deleted || false,
                index
            }));
            console.log(`${this.questions.length}개 문제 로드 완료`);
        } catch (error) {
            console.error('문제 로드 실패:', error);
            this.questions = [];
        }
    }

    async add(questionData) {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    type: questionData.type,
                    subject: questionData.subject,
                    question: questionData.question,
                    options: questionData.options || null,
                    correct_answer: questionData.correctAnswer || null,
                    correct_order: questionData.correctOrder || null,
                    deleted: false
                })
            });
            if (!res.ok) throw new Error(`추가 실패: ${res.status}`);
            await this.loadQuestions();
            console.log('문제 추가 완료');
            return this.questions[this.questions.length - 1];
        } catch (error) {
            console.error('문제 추가 실패:', error);
            throw error;
        }
    }

    async update(index, questionData) {
        const question = this.questions[index];
        if (!question) return false;
        try {
            const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({
                    type: questionData.type,
                    subject: questionData.subject,
                    question: questionData.question,
                    options: questionData.options || null,
                    correct_answer: questionData.correctAnswer || null,
                    correct_order: questionData.correctOrder || null
                })
            });
            if (!res.ok) throw new Error(`수정 실패: ${res.status}`);
            await this.loadQuestions();
            console.log('문제 수정 완료');
            return true;
        } catch (error) {
            console.error('문제 수정 실패:', error);
            return false;
        }
    }

    async delete(index) {
        const question = this.questions[index];
        if (!question) return false;
        try {
            const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({ deleted: true })
            });
            if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
            await this.loadQuestions();
            return true;
        } catch (error) {
            console.error('문제 삭제 실패:', error);
            return false;
        }
    }

    async restore(index) {
        const question = this.questions[index];
        if (!question) return false;
        try {
            const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({ deleted: false })
            });
            if (!res.ok) throw new Error(`복원 실패: ${res.status}`);
            await this.loadQuestions();
            return true;
        } catch (error) {
            console.error('문제 복원 실패:', error);
            return false;
        }
    }

    async permanentDelete(index) {
        const question = this.questions[index];
        if (!question) return false;
        try {
            const res = await fetch(`${this.baseUrl}?id=eq.${question.id}`, {
                method: 'DELETE',
                headers: this.headers
            });
            if (!res.ok) throw new Error(`영구 삭제 실패: ${res.status}`);
            await this.loadQuestions();
            return true;
        } catch (error) {
            console.error('문제 영구 삭제 실패:', error);
            return false;
        }
    }

    async deleteAllQuestions() {
        try {
            const res = await fetch(`${this.baseUrl}?deleted=eq.false`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({ deleted: true })
            });
            if (!res.ok) throw new Error(`전체 삭제 실패: ${res.status}`);
            await this.loadQuestions();
            return true;
        } catch (error) {
            console.error('전체 삭제 실패:', error);
            return false;
        }
    }

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
        const all = this.questions;
        const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}
