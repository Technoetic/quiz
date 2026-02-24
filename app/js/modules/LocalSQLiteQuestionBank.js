/**
 * LocalSQLiteQuestionBank 클래스
 * @sqlite.org/sqlite-wasm을 사용한 로컬 SQLite 저장소
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';
import { questions as initialQuestions } from '../data/questions.js';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

export class LocalSQLiteQuestionBank {
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
            console.log('SQLite WASM 초기화 시작...');

            // sqlite3 초기화
            this.sqlite3 = await sqlite3InitModule({
                print: console.log,
                printErr: console.error,
                locateFile: (file) => {
                    // 로컬 wasm 디렉토리 사용
                    return `../wasm/${file}`;
                }
            });

            console.log('SQLite WASM 로드 완료:', this.sqlite3.version.libVersion);

            // LocalStorage에서 DB 복원 시도
            const savedDb = localStorage.getItem('sqliteDb');
            if (savedDb) {
                const uint8Array = new Uint8Array(JSON.parse(savedDb));
                this.db = new this.sqlite3.oo1.DB();
                const rc = this.sqlite3.capi.sqlite3_deserialize(
                    this.db.pointer, 'main', uint8Array, uint8Array.length,
                    uint8Array.length, this.sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
                );
                console.log('LocalStorage에서 DB 복원 완료');
            } else {
                // 새 메모리 기반 DB
                this.db = new this.sqlite3.oo1.DB(':memory:', 'c');
                console.log('새 메모리 기반 DB 생성 완료');
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

            // LocalStorage에 저장
            this.saveDatabase();

            console.log('초기 데이터 삽입 완료');
        }
    }

    /**
     * 데이터베이스를 LocalStorage에 저장
     */
    saveDatabase() {
        const exported = this.sqlite3.capi.sqlite3_js_db_export(this.db.pointer);
        const arr = Array.from(exported);
        localStorage.setItem('sqliteDb', JSON.stringify(arr));
        console.log('DB를 LocalStorage에 저장 완료');
    }

    /**
     * 모든 문제 로드
     */
    async load() {
        try {
            const rows = [];

            // selectObjects를 사용하여 모든 행을 객체 배열로 가져오기
            this.db.exec({
                sql: 'SELECT * FROM questions ORDER BY id',
                rowMode: 'object',
                resultRows: rows
            });

            this.questionsCache = rows.map(row => ({
                id: row.id,
                type: row.type,
                subject: row.subject,
                question: row.question,
                options: row.options ? JSON.parse(row.options) : null,
                correctAnswer: row.type === 'multiple' ? parseInt(row.correctAnswer) : row.correctAnswer,
                correctOrder: row.correctOrder ? JSON.parse(row.correctOrder) : null,
                alternativeAnswers: row.alternativeAnswers ? JSON.parse(row.alternativeAnswers) : null,
                deleted: row.deleted === 1
            }));

            this.questions = this.questionsCache.map((q, index) => new Question({ ...q, index }));

            console.log(`총 ${this.questions.length}개 문제 로드 완료 (SQLite)`);
        } catch (error) {
            console.error('문제 로드 실패:', error);
            this.questionsCache = [];
            this.questions = [];
        }
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

        // DB 저장 및 메모리 다시 로드
        this.saveDatabase();
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

        // DB 저장 및 메모리 다시 로드
        this.saveDatabase();
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

        // DB 저장 및 메모리 다시 로드
        this.saveDatabase();
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

        // DB 저장 및 메모리 다시 로드
        this.saveDatabase();
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

        // DB 저장 및 메모리 다시 로드
        this.saveDatabase();
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

            // DB 저장 및 메모리 다시 로드
            this.saveDatabase();
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
     * 데이터베이스 백업 (JSON)
     */
    downloadBackup() {
        const exportData = {
            version: '1.0',
            exported_at: new Date().toISOString(),
            questions: this.questionsCache
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
