/**
 * AutoLoadFileQuestionBank 클래스
 * server.js + 파일 기반 자동 로드/저장 저장소
 *
 * 특징:
 * - app/data/questions.db 파일에서 자동 로드
 * - 변경사항 자동 저장 (server.js API 사용)
 * - 브라우저 내장 저장소 미사용 (localStorage, IndexedDB 없음)
 * - app 폴더 복사만으로 데이터 이동 가능
 *
 * 요구사항:
 * - server.js 실행 필요
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

export class AutoLoadFileQuestionBank {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.questions = [];
        this.dbFilePath = '/data/questions.db';
        this.saveApiPath = '/api/save-db';
    }

    /**
     * 초기화
     */
    async init() {
        console.log('AutoLoad 파일 DB 초기화 시작...');

        // window.initSqlJs 대기 (HTML에서 로드된 전역 함수)
        await this.waitForSqlJs();

        // sql.js 초기화
        this.SQL = await window.initSqlJs({
            locateFile: file => `/js/lib/${file}`
        });

        // app/data/questions.db 파일에서 자동 로드
        await this.loadFromFile();

        console.log('AutoLoad 파일 DB 초기화 완료');
    }

    /**
     * window.initSqlJs 대기 (전역 함수가 로드될 때까지)
     */
    async waitForSqlJs() {
        let attempts = 0;
        while (typeof window.initSqlJs !== 'function' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        if (typeof window.initSqlJs !== 'function') {
            throw new Error('sql.js 로드 실패 - window.initSqlJs is not a function');
        }
        console.log('✅ window.initSqlJs 로드 완료');
    }

    /**
     * 파일에서 DB 로드
     */
    async loadFromFile() {
        try {
            const response = await fetch(this.dbFilePath);

            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);

                this.db = new this.SQL.Database(uint8Array);
                console.log('✅ questions.db 파일 자동 로드 성공');
            } else {
                throw new Error('DB 파일 없음');
            }
        } catch (error) {
            console.log('⚠️ DB 파일 없음, 새 DB 생성');
            this.db = new this.SQL.Database();
            this.createTables();
            await this.saveToFile(); // 빈 DB 파일 생성
        }

        this.loadQuestions();
    }

    /**
     * 테이블 생성
     */
    createTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                subject TEXT NOT NULL,
                question TEXT NOT NULL,
                options TEXT,
                correctAnswer TEXT,
                correctOrder TEXT,
                alternativeAnswers TEXT,
                deleted INTEGER DEFAULT 0
            )
        `);
    }

    /**
     * 메모리에 문제 로드
     */
    loadQuestions() {
        const stmt = this.db.prepare('SELECT * FROM questions');
        const rows = [];

        while (stmt.step()) {
            const row = stmt.getAsObject();
            rows.push({
                id: row.id,
                type: row.type,
                subject: row.subject,
                question: row.question,
                options: row.options ? JSON.parse(row.options) : null,
                correctAnswer: row.correctAnswer,
                correctOrder: row.correctOrder ? JSON.parse(row.correctOrder) : null,
                alternativeAnswers: row.alternativeAnswers ? JSON.parse(row.alternativeAnswers) : null,
                deleted: row.deleted === 1
            });
        }
        stmt.free();

        this.questions = rows.map((row, index) => new Question({ ...row, index }));
        console.log(`${this.questions.length}개 문제 로드 완료`);
    }

    /**
     * DB를 파일로 저장 (자동)
     */
    async saveToFile() {
        try {
            const data = this.db.export();

            const response = await fetch(this.saveApiPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                body: data
            });

            if (response.ok) {
                console.log('✅ questions.db 자동 저장 완료');
            } else {
                throw new Error(`저장 실패: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ DB 저장 실패:', error);
            throw error;
        }
    }

    /**
     * 문제 추가
     */
    async add(questionData) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO questions (type, subject, question, options, correctAnswer, correctOrder, alternativeAnswers, deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0)
            `);

            stmt.run([
                questionData.type,
                questionData.subject,
                questionData.question,
                questionData.options ? JSON.stringify(questionData.options) : null,
                questionData.correctAnswer || null,
                questionData.correctOrder ? JSON.stringify(questionData.correctOrder) : null,
                questionData.alternativeAnswers ? JSON.stringify(questionData.alternativeAnswers) : null
            ]);

            stmt.free();

            await this.saveToFile(); // 자동 저장
            this.loadQuestions();

            console.log('문제 추가 완료');
            return this.questions[this.questions.length - 1];
        } catch (error) {
            console.error('문제 추가 실패:', error);
            throw error;
        }
    }

    /**
     * 문제 업데이트
     */
    async update(index, questionData) {
        const question = this.questions[index];
        if (!question) return false;

        try {
            const stmt = this.db.prepare(`
                UPDATE questions
                SET type = ?, subject = ?, question = ?, options = ?, correctAnswer = ?, correctOrder = ?, alternativeAnswers = ?
                WHERE id = ?
            `);

            stmt.run([
                questionData.type,
                questionData.subject,
                questionData.question,
                questionData.options ? JSON.stringify(questionData.options) : null,
                questionData.correctAnswer || null,
                questionData.correctOrder ? JSON.stringify(questionData.correctOrder) : null,
                questionData.alternativeAnswers ? JSON.stringify(questionData.alternativeAnswers) : null,
                question.id
            ]);

            stmt.free();

            await this.saveToFile(); // 자동 저장
            this.loadQuestions();

            console.log('문제 업데이트 완료');
            return true;
        } catch (error) {
            console.error('문제 업데이트 실패:', error);
            return false;
        }
    }

    /**
     * 문제 삭제 (soft delete)
     */
    async delete(index) {
        const question = this.questions[index];
        if (!question) return false;

        try {
            const stmt = this.db.prepare('UPDATE questions SET deleted = 1 WHERE id = ?');
            stmt.run([question.id]);
            stmt.free();

            await this.saveToFile(); // 자동 저장
            this.loadQuestions();

            console.log('문제 삭제 완료');
            return true;
        } catch (error) {
            console.error('문제 삭제 실패:', error);
            return false;
        }
    }

    /**
     * 문제 복원
     */
    async restore(index) {
        const question = this.questions[index];
        if (!question) return false;

        try {
            const stmt = this.db.prepare('UPDATE questions SET deleted = 0 WHERE id = ?');
            stmt.run([question.id]);
            stmt.free();

            await this.saveToFile(); // 자동 저장
            this.loadQuestions();

            console.log('문제 복원 완료');
            return true;
        } catch (error) {
            console.error('문제 복원 실패:', error);
            return false;
        }
    }

    /**
     * 문제 영구 삭제
     */
    async permanentDelete(index) {
        const question = this.questions[index];
        if (!question) return false;

        try {
            const stmt = this.db.prepare('DELETE FROM questions WHERE id = ?');
            stmt.run([question.id]);
            stmt.free();

            await this.saveToFile(); // 자동 저장
            this.loadQuestions();

            console.log('문제 영구 삭제 완료');
            return true;
        } catch (error) {
            console.error('문제 영구 삭제 실패:', error);
            return false;
        }
    }

    /**
     * 모든 문제 삭제 (soft delete)
     */
    async deleteAllQuestions() {
        try {
            this.db.run('UPDATE questions SET deleted = 1 WHERE deleted = 0');

            await this.saveToFile(); // 자동 저장
            this.loadQuestions();

            console.log('모든 문제 삭제 완료');
            return true;
        } catch (error) {
            console.error('모든 문제 삭제 실패:', error);
            return false;
        }
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
        try {
            const data = this.db.export();
            const blob = new Blob([data], { type: 'application/x-sqlite3' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'questions-backup.db';
            a.click();
            URL.revokeObjectURL(url);

            console.log('✅ 백업 다운로드 완료');
        } catch (error) {
            console.error('백업 다운로드 실패:', error);
            throw error;
        }
    }
}
