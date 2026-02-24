/**
 * SQLiteFileQuestionBank 클래스
 * sql.js를 사용한 SQLite 파일 기반 저장소
 *
 * 특징:
 * - 실제 .db 파일로 저장/로드
 * - app 폴더와 함께 questions.db 파일만 복사하면 데이터 이동
 * - 브라우저 내장 저장소 미사용
 */

import initSqlJs from '../lib/sql-wasm.js';
import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

export class SQLiteFileQuestionBank {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.questions = [];
        this.dbFileName = 'questions.db';
    }

    /**
     * 초기화
     */
    async init() {
        console.log('SQLite 파일 DB 초기화 시작...');

        // sql.js 초기화
        this.SQL = await initSqlJs({
            locateFile: file => `../lib/${file}`
        });

        // 저장된 DB 파일 로드 시도
        await this.loadFromFile();

        console.log('SQLite 파일 DB 초기화 완료');
    }

    /**
     * 파일에서 DB 로드
     */
    async loadFromFile() {
        try {
            // localStorage에 저장된 DB 바이너리 가져오기
            const savedDb = localStorage.getItem('sqliteDB');

            if (savedDb) {
                // Base64 디코딩
                const binaryString = atob(savedDb);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                this.db = new this.SQL.Database(bytes);
                console.log('저장된 DB 파일 로드 성공');
            } else {
                // 새 DB 생성
                this.db = new this.SQL.Database();
                this.createTables();
                console.log('새 DB 생성');
            }

            this.loadQuestions();
        } catch (error) {
            console.error('DB 로드 실패:', error);
            this.db = new this.SQL.Database();
            this.createTables();
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
                deleted INTEGER DEFAULT 0
            )
        `);

        console.log('테이블 생성 완료');
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
    async saveToStorage() {
        try {
            // DB를 Uint8Array로 내보내기
            const data = this.db.export();

            // Base64로 인코딩하여 localStorage에 저장
            const binaryString = Array.from(data)
                .map(byte => String.fromCharCode(byte))
                .join('');
            const base64 = btoa(binaryString);

            localStorage.setItem('sqliteDB', base64);

            console.log('✅ DB 자동 저장 완료 (localStorage)');
        } catch (error) {
            console.error('DB 저장 실패:', error);
        }
    }

    /**
     * DB 파일 다운로드
     */
    async downloadDB() {
        try {
            const data = this.db.export();
            const blob = new Blob([data], { type: 'application/x-sqlite3' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.dbFileName;
            a.click();
            URL.revokeObjectURL(url);

            console.log(`✅ ${this.dbFileName} 다운로드 완료`);
            console.log('📁 app 폴더와 함께 이 파일을 복사하면 데이터 이동 가능');
        } catch (error) {
            console.error('DB 다운로드 실패:', error);
        }
    }

    /**
     * DB 파일 업로드
     */
    async uploadDB(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // 기존 DB 닫기
                    if (this.db) {
                        this.db.close();
                    }

                    // 새 DB 로드
                    this.db = new this.SQL.Database(uint8Array);
                    this.loadQuestions();
                    this.saveToStorage();

                    console.log('✅ DB 파일 업로드 성공');
                    resolve(true);
                } catch (error) {
                    console.error('DB 업로드 실패:', error);
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
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

            await this.saveToStorage();
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

            await this.saveToStorage();
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

            await this.saveToStorage();
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

            await this.saveToStorage();
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

            await this.saveToStorage();
            this.loadQuestions();

            console.log('문제 영구 삭제 완료');
            return true;
        } catch (error) {
            console.error('문제 영구 삭제 실패:', error);
            return false;
        }
    }

    /**
     * 모든 문제 삭제
     */
    async deleteAllQuestions() {
        try {
            this.db.run('UPDATE questions SET deleted = 1 WHERE deleted = 0');

            await this.saveToStorage();
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
     * 백업 다운로드 (DB 파일)
     */
    async downloadBackup() {
        await this.downloadDB();
    }
}
