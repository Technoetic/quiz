/**
 * PureFileQuestionBank 클래스
 * 100% 파일 기반 저장소 (브라우저 내장 저장소 미사용)
 *
 * 사용 방법:
 * 1. 첫 실행: "파일 선택" 버튼 클릭 → questions.db 파일 선택/생성
 * 2. 작업: 문제 추가/수정/삭제
 * 3. 저장: "저장" 버튼 클릭 → questions.db 파일 다운로드
 * 4. 다른 컴퓨터: app 폴더 + questions.db 파일 복사 → "파일 선택"으로 로드
 */

import initSqlJs from '../lib/sql-wasm.js';
import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';

export class PureFileQuestionBank {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.questions = [];
        this.dbFileName = 'questions.db';
        this.hasUnsavedChanges = false;
    }

    /**
     * 초기화
     */
    async init() {
        console.log('순수 파일 DB 초기화 시작...');

        // sql.js 초기화
        this.SQL = await initSqlJs({
            locateFile: file => `../lib/${file}`
        });

        // 빈 DB로 시작
        this.db = new this.SQL.Database();
        this.createTables();

        console.log('⚠️  파일을 선택하여 DB를 로드하세요.');
        console.log('순수 파일 DB 초기화 완료');
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
     * 파일 선택 대화상자 (로드)
     */
    async selectAndLoadFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.db,.sqlite,.sqlite3';

            input.onchange = async (e) => {
                try {
                    const file = e.target.files[0];
                    if (!file) {
                        reject(new Error('파일 선택 취소'));
                        return;
                    }

                    const reader = new FileReader();

                    reader.onload = (event) => {
                        try {
                            const arrayBuffer = event.target.result;
                            const uint8Array = new Uint8Array(arrayBuffer);

                            // 기존 DB 닫기
                            if (this.db) {
                                this.db.close();
                            }

                            // 새 DB 로드
                            this.db = new this.SQL.Database(uint8Array);
                            this.loadQuestions();
                            this.hasUnsavedChanges = false;

                            console.log(`✅ ${file.name} 로드 완료`);
                            resolve(true);
                        } catch (error) {
                            reject(error);
                        }
                    };

                    reader.onerror = () => reject(reader.error);
                    reader.readAsArrayBuffer(file);
                } catch (error) {
                    reject(error);
                }
            };

            input.click();
        });
    }

    /**
     * DB 파일 다운로드 (저장)
     */
    async saveToFile() {
        try {
            const data = this.db.export();
            const blob = new Blob([data], { type: 'application/x-sqlite3' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.dbFileName;
            a.click();
            URL.revokeObjectURL(url);

            this.hasUnsavedChanges = false;

            console.log(`✅ ${this.dbFileName} 저장 완료`);
            console.log('📁 app 폴더와 함께 이 파일을 복사하면 다른 컴퓨터에서 사용 가능');
        } catch (error) {
            console.error('DB 저장 실패:', error);
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

            this.loadQuestions();
            this.hasUnsavedChanges = true;

            console.log('문제 추가 완료 (저장 필요)');
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

            this.loadQuestions();
            this.hasUnsavedChanges = true;

            console.log('문제 업데이트 완료 (저장 필요)');
            return true;
        } catch (error) {
            console.error('문제 업데이트 실패:', error);
            return false;
        }
    }

    /**
     * 문제 삭제
     */
    async delete(index) {
        const question = this.questions[index];
        if (!question) return false;

        try {
            const stmt = this.db.prepare('UPDATE questions SET deleted = 1 WHERE id = ?');
            stmt.run([question.id]);
            stmt.free();

            this.loadQuestions();
            this.hasUnsavedChanges = true;

            console.log('문제 삭제 완료 (저장 필요)');
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

            this.loadQuestions();
            this.hasUnsavedChanges = true;

            console.log('문제 복원 완료 (저장 필요)');
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

            this.loadQuestions();
            this.hasUnsavedChanges = true;

            console.log('문제 영구 삭제 완료 (저장 필요)');
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

            this.loadQuestions();
            this.hasUnsavedChanges = true;

            console.log('모든 문제 삭제 완료 (저장 필요)');
            return true;
        } catch (error) {
            console.error('모든 문제 삭제 실패:', error);
            return false;
        }
    }

    // 조회 메서드들 (Dexie와 동일)
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

    /**
     * 백업 다운로드
     */
    async downloadBackup() {
        await this.saveToFile();
    }
}
