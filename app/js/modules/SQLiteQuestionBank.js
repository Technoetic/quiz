/**
 * SQLiteQuestionBank 클래스
 * SQLite WASM을 사용한 문제 저장소
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';
import { questions as initialQuestions } from '../data/questions.js';

export class SQLiteQuestionBank {
    constructor() {
        this.db = null;
        this.sqlite3 = null;
        this.questions = [];
        this.questionsCache = [];
    }

    /**
     * SQLite 초기화
     */
    async init() {
        try {
            // SQLite WASM 로드 (CDN 사용)
            if (!window.sqlite3InitModule) {
                throw new Error('SQLite WASM이 로드되지 않았습니다. HTML에 스크립트를 추가하세요.');
            }

            this.sqlite3 = await window.sqlite3InitModule({
                print: console.log,
                printErr: console.error,
            });

            console.log('SQLite WASM 로드 완료:', this.sqlite3.version.libVersion);

            // 데이터베이스 생성 (메모리 기반)
            this.db = new this.sqlite3.oo1.DB('/mydb.sqlite3', 'ct');

            // 테이블 생성
            this.createTables();

            // 초기 데이터 로드
            await this.loadInitialData();

            // 메모리에 로드
            await this.load();

            console.log('SQLite 초기화 완료');
        } catch (error) {
            console.error('SQLite 초기화 실패:', error);
            throw error;
        }
    }

    /**
     * 테이블 생성
     */
    createTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                subject TEXT NOT NULL,
                question TEXT NOT NULL,
                options TEXT,
                correctAnswer TEXT,
                correctOrder TEXT,
                alternativeAnswers TEXT,
                deleted INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_deleted ON questions(deleted);
            CREATE INDEX IF NOT EXISTS idx_subject ON questions(subject);
            CREATE INDEX IF NOT EXISTS idx_type ON questions(type);
        `);

        console.log('테이블 생성 완료');
    }

    /**
     * 초기 데이터 로드
     */
    async loadInitialData() {
        // 이미 데이터가 있는지 확인
        const count = this.db.selectValue('SELECT COUNT(*) FROM questions');

        if (count === 0 && initialQuestions.length > 0) {
            console.log(`초기 데이터 ${initialQuestions.length}개 삽입 중...`);

            const stmt = this.db.prepare(`
                INSERT INTO questions (type, subject, question, options, correctAnswer, correctOrder, alternativeAnswers, deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0)
            `);

            initialQuestions.forEach(q => {
                stmt.bind([
                    q.type,
                    q.subject,
                    q.question,
                    q.options ? JSON.stringify(q.options) : null,
                    typeof q.correctAnswer === 'number' ? q.correctAnswer.toString() : q.correctAnswer,
                    q.correctOrder ? JSON.stringify(q.correctOrder) : null,
                    q.alternativeAnswers ? JSON.stringify(q.alternativeAnswers) : null
                ]);
                stmt.step();
                stmt.reset();
            });

            stmt.finalize();
            console.log('초기 데이터 삽입 완료');
        }
    }

    /**
     * 모든 문제 로드
     */
    async load() {
        const rows = this.db.exec({
            sql: 'SELECT * FROM questions ORDER BY id',
            returnValue: 'resultRows',
            rowMode: 'object'
        });

        this.questionsCache = rows.map(row => ({
            type: row.type,
            subject: row.subject,
            question: row.question,
            options: row.options ? JSON.parse(row.options) : null,
            correctAnswer: row.type === 'multiple' ? parseInt(row.correctAnswer) : row.correctAnswer,
            correctOrder: row.correctOrder ? JSON.parse(row.correctOrder) : null,
            alternativeAnswers: row.alternativeAnswers ? JSON.parse(row.alternativeAnswers) : null,
            deleted: row.deleted === 1,
            id: row.id
        }));

        this.questions = this.questionsCache.map((q, index) => new Question({ ...q, index }));

        console.log(`총 ${this.questions.length}개 문제 로드 완료 (DB)`);
    }

    /**
     * 새 문제 추가
     */
    add(questionData) {
        const stmt = this.db.prepare(`
            INSERT INTO questions (type, subject, question, options, correctAnswer, correctOrder, alternativeAnswers, deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `);

        stmt.bind([
            questionData.type,
            questionData.subject,
            questionData.question,
            questionData.options ? JSON.stringify(questionData.options) : null,
            typeof questionData.correctAnswer === 'number' ? questionData.correctAnswer.toString() : questionData.correctAnswer,
            questionData.correctOrder ? JSON.stringify(questionData.correctOrder) : null,
            questionData.alternativeAnswers ? JSON.stringify(questionData.alternativeAnswers) : null
        ]);

        stmt.step();
        stmt.finalize();

        // 메모리 다시 로드
        this.load();

        console.log('문제 추가 완료');
        return this.questions[this.questions.length - 1];
    }

    /**
     * 문제 업데이트
     */
    update(index, questionData) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        this.db.exec({
            sql: `UPDATE questions SET
                type = ?,
                subject = ?,
                question = ?,
                options = ?,
                correctAnswer = ?,
                correctOrder = ?,
                alternativeAnswers = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
            bind: [
                questionData.type,
                questionData.subject,
                questionData.question,
                questionData.options ? JSON.stringify(questionData.options) : null,
                typeof questionData.correctAnswer === 'number' ? questionData.correctAnswer.toString() : questionData.correctAnswer,
                questionData.correctOrder ? JSON.stringify(questionData.correctOrder) : null,
                questionData.alternativeAnswers ? JSON.stringify(questionData.alternativeAnswers) : null,
                dbId
            ]
        });

        // 메모리 다시 로드
        this.load();

        console.log('문제 업데이트 완료');
        return true;
    }

    /**
     * 문제 삭제 (soft delete)
     */
    delete(index) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        this.db.exec({
            sql: 'UPDATE questions SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            bind: [dbId]
        });

        // 메모리 다시 로드
        this.load();

        console.log('문제 삭제 완료 (soft delete)');
        return true;
    }

    /**
     * 삭제된 문제 복원
     */
    restore(index) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        this.db.exec({
            sql: 'UPDATE questions SET deleted = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            bind: [dbId]
        });

        // 메모리 다시 로드
        this.load();

        console.log('문제 복원 완료');
        return true;
    }

    /**
     * 문제 영구 삭제
     */
    permanentDelete(index) {
        const question = this.questions[index];
        if (!question) return false;

        const dbId = question.id;

        this.db.exec({
            sql: 'DELETE FROM questions WHERE id = ?',
            bind: [dbId]
        });

        // 메모리 다시 로드
        this.load();

        console.log('문제 영구 삭제 완료');
        return true;
    }

    /**
     * 모든 문제 삭제 (soft delete)
     */
    async deleteAllQuestions() {
        try {
            this.db.exec('UPDATE questions SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE deleted = 0');

            // 메모리 다시 로드
            await this.load();

            console.log('모든 문제 삭제 완료');
            return true;
        } catch (error) {
            console.error('문제 삭제 실패:', error);
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
     * 데이터베이스 내보내기 (백업용)
     */
    exportDatabase() {
        const rows = this.db.exec({
            sql: 'SELECT * FROM questions',
            returnValue: 'resultRows',
            rowMode: 'object'
        });

        const exportData = {
            version: '1.0',
            exported_at: new Date().toISOString(),
            questions: rows
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions-backup.json';
        a.click();
        URL.revokeObjectURL(url);

        console.log('데이터베이스 백업 완료');
    }

    /**
     * 데이터베이스 파일 다운로드 (SQLite)
     */
    downloadDatabaseFile() {
        const data = this.sqlite3.capi.sqlite3_js_db_export(this.db.pointer);
        const blob = new Blob([data], { type: 'application/x-sqlite3' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions.sqlite3';
        a.click();
        URL.revokeObjectURL(url);

        console.log('SQLite 데이터베이스 파일 다운로드 완료');
    }

    /**
     * questions.js 파일 형식으로 다운로드 (호환성)
     */
    downloadQuestionsFile() {
        const activeQuestions = this.questionsCache;

        const fileContent = `/**
 * 문제 은행
 * SQLite 데이터베이스에서 내보낸 데이터 (백업용)
 */

export const questions = ${JSON.stringify(activeQuestions, null, 4)};
`;

        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions.js';
        a.click();
        URL.revokeObjectURL(url);

        console.log('questions.js 파일 다운로드 완료');
    }
}
