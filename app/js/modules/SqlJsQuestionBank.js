/**
 * SqlJsQuestionBank 클래스
 * sql.js를 사용한 SQLite 기반 문제 저장소
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';
import { questions as initialQuestions } from '../data/questions.js';
import initSqlJs from 'sql.js';

export class SqlJsQuestionBank {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.questions = [];
        this.questionsCache = [];
    }

    /**
     * SQLite 초기화
     */
    async init() {
        try {
            // sql.js 로드
            this.SQL = await initSqlJs({
                locateFile: file => `https://sql.js.org/dist/${file}`
            });

            console.log('sql.js 로드 완료');

            // LocalStorage에서 기존 DB 로드 시도
            const savedDb = localStorage.getItem('sqliteDb');
            if (savedDb) {
                const uint8Array = new Uint8Array(JSON.parse(savedDb));
                this.db = new this.SQL.Database(uint8Array);
                console.log('LocalStorage에서 DB 로드 완료');
            } else {
                // 새 데이터베이스 생성
                this.db = new this.SQL.Database();
                console.log('새 DB 생성 완료');
            }

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
                deleted INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('테이블 생성 완료');
    }

    /**
     * 초기 데이터 로드
     */
    async loadInitialData() {
        // 이미 데이터가 있는지 확인
        const result = this.db.exec('SELECT COUNT(*) as count FROM questions');
        const count = result[0]?.values[0][0] || 0;

        if (count === 0 && initialQuestions.length > 0) {
            console.log(`초기 데이터 ${initialQuestions.length}개 삽입 중...`);

            initialQuestions.forEach(q => {
                this.db.run(
                    `INSERT INTO questions (type, subject, question, options, correctAnswer, correctOrder, alternativeAnswers, deleted)
                     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
                    [
                        q.type,
                        q.subject,
                        q.question,
                        q.options ? JSON.stringify(q.options) : null,
                        typeof q.correctAnswer === 'number' ? q.correctAnswer.toString() : q.correctAnswer,
                        q.correctOrder ? JSON.stringify(q.correctOrder) : null,
                        q.alternativeAnswers ? JSON.stringify(q.alternativeAnswers) : null
                    ]
                );
            });

            // DB 저장
            this.saveDatabase();

            console.log('초기 데이터 삽입 완료');
        }
    }

    /**
     * 데이터베이스를 LocalStorage에 저장
     */
    saveDatabase() {
        const data = this.db.export();
        const arr = Array.from(data);
        localStorage.setItem('sqliteDb', JSON.stringify(arr));
        console.log('DB를 LocalStorage에 저장 완료');
    }

    /**
     * 모든 문제 로드
     */
    async load() {
        const result = this.db.exec('SELECT * FROM questions ORDER BY id');

        if (result.length === 0) {
            this.questionsCache = [];
            this.questions = [];
            return;
        }

        const columns = result[0].columns;
        const values = result[0].values;

        this.questionsCache = values.map(row => {
            const obj = {};
            columns.forEach((col, idx) => {
                obj[col] = row[idx];
            });

            return {
                type: obj.type,
                subject: obj.subject,
                question: obj.question,
                options: obj.options ? JSON.parse(obj.options) : null,
                correctAnswer: obj.type === 'multiple' ? parseInt(obj.correctAnswer) : obj.correctAnswer,
                correctOrder: obj.correctOrder ? JSON.parse(obj.correctOrder) : null,
                alternativeAnswers: obj.alternativeAnswers ? JSON.parse(obj.alternativeAnswers) : null,
                deleted: obj.deleted === 1,
                id: obj.id
            };
        });

        this.questions = this.questionsCache.map((q, index) => new Question({ ...q, index }));

        console.log(`총 ${this.questions.length}개 문제 로드 완료 (SQLite)`);
    }

    /**
     * 새 문제 추가
     */
    add(questionData) {
        this.db.run(
            `INSERT INTO questions (type, subject, question, options, correctAnswer, correctOrder, alternativeAnswers, deleted)
             VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
            [
                questionData.type,
                questionData.subject,
                questionData.question,
                questionData.options ? JSON.stringify(questionData.options) : null,
                typeof questionData.correctAnswer === 'number' ? questionData.correctAnswer.toString() : questionData.correctAnswer,
                questionData.correctOrder ? JSON.stringify(questionData.correctOrder) : null,
                questionData.alternativeAnswers ? JSON.stringify(questionData.alternativeAnswers) : null
            ]
        );

        // DB 저장
        this.saveDatabase();

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

        this.db.run(
            `UPDATE questions SET
                type = ?,
                subject = ?,
                question = ?,
                options = ?,
                correctAnswer = ?,
                correctOrder = ?,
                alternativeAnswers = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                questionData.type,
                questionData.subject,
                questionData.question,
                questionData.options ? JSON.stringify(questionData.options) : null,
                typeof questionData.correctAnswer === 'number' ? questionData.correctAnswer.toString() : questionData.correctAnswer,
                questionData.correctOrder ? JSON.stringify(questionData.correctOrder) : null,
                questionData.alternativeAnswers ? JSON.stringify(questionData.alternativeAnswers) : null,
                dbId
            ]
        );

        // DB 저장
        this.saveDatabase();

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

        this.db.run('UPDATE questions SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [dbId]);

        // DB 저장
        this.saveDatabase();

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

        this.db.run('UPDATE questions SET deleted = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [dbId]);

        // DB 저장
        this.saveDatabase();

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

        this.db.run('DELETE FROM questions WHERE id = ?', [dbId]);

        // DB 저장
        this.saveDatabase();

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
            this.db.run('UPDATE questions SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE deleted = 0');

            // DB 저장
            this.saveDatabase();

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
     * 데이터베이스 파일 다운로드
     */
    downloadDatabaseFile() {
        const data = this.db.export();
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
     * questions.js 파일 형식으로 다운로드 (백업용)
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
        a.download = 'questions-backup.js';
        a.click();
        URL.revokeObjectURL(url);

        console.log('questions.js 백업 파일 다운로드 완료');
    }
}
