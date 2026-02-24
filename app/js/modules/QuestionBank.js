/**
 * QuestionBank 클래스
 * 문제 저장소를 관리하는 클래스
 * 파일 기반 (questions.js)
 */

import { Question } from './Question.js';
import { AppConstants } from './constants/AppConstants.js';
import { questions } from '../data/questions.js';

export class QuestionBank {
    constructor() {
        this.questions = [];
        this.questionsCache = []; // 모든 문제 캐시

        this.init();
    }

    /**
     * 초기화
     */
    async init() {
        await this.load();
    }

    /**
     * 새 문제 추가
     * @param {Object} questionData - 문제 데이터
     * @returns {Question} 추가된 문제 객체
     */
    add(questionData) {
        const question = new Question({ ...questionData, index: this.questions.length });
        this.questions.push(question);
        this.questionsCache.push(questionData);

        // SessionStorage 업데이트
        sessionStorage.setItem('tempQuestions', JSON.stringify(this.questionsCache));

        return question;
    }

    /**
     * 문제 업데이트
     * @param {number} index - 문제 인덱스
     * @param {Object} questionData - 업데이트할 데이터
     * @returns {boolean} 성공 여부
     */
    update(index, questionData) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index] = new Question({ ...questionData, index });
            this.questionsCache[index] = questionData;

            // SessionStorage 업데이트
            sessionStorage.setItem('tempQuestions', JSON.stringify(this.questionsCache));

            return true;
        }
        return false;
    }

    /**
     * 문제 삭제 (soft delete - 휴지통)
     * @param {number} index - 문제 인덱스
     * @returns {boolean} 성공 여부
     */
    delete(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index].deleted = true;
            this.questionsCache[index].deleted = true;

            // SessionStorage 업데이트
            sessionStorage.setItem('tempQuestions', JSON.stringify(this.questionsCache));

            return true;
        }
        return false;
    }

    /**
     * 삭제된 문제 복원
     * @param {number} index - 문제 인덱스
     * @returns {boolean} 성공 여부
     */
    restore(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index].deleted = false;
            this.questionsCache[index].deleted = false;

            // SessionStorage 업데이트
            sessionStorage.setItem('tempQuestions', JSON.stringify(this.questionsCache));

            return true;
        }
        return false;
    }

    /**
     * 문제 영구 삭제 (배열에서 완전 제거)
     * @param {number} index - 문제 인덱스
     * @returns {boolean} 성공 여부
     */
    permanentDelete(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions.splice(index, 1);
            this.questionsCache.splice(index, 1);

            // 인덱스 재조정
            this.questions.forEach((q, i) => {
                q.index = i;
            });

            // SessionStorage 업데이트
            sessionStorage.setItem('tempQuestions', JSON.stringify(this.questionsCache));

            return true;
        }
        return false;
    }

    /**
     * 활성 문제 목록 조회 (삭제되지 않은 문제)
     * @returns {Question[]} 삭제되지 않은 문제 목록
     */
    getAll() {
        return this.questions.filter(q => !q.deleted);
    }

    /**
     * 삭제된 문제 목록 조회
     * @returns {Question[]} 삭제된 문제 목록
     */
    getDeleted() {
        return this.questions.filter(q => q.deleted);
    }

    /**
     * 과목별 문제 조회
     * @param {string} subject - 과목명
     * @returns {Question[]} 해당 과목의 문제 목록
     */
    getBySubject(subject) {
        return this.questions.filter(q => !q.deleted && q.subject === subject);
    }

    /**
     * 유형별 문제 조회
     * @param {string} type - 문제 유형
     * @returns {Question[]} 해당 유형의 문제 목록
     */
    getByType(type) {
        return this.questions.filter(q => !q.deleted && q.type === type);
    }

    /**
     * 파일 기반 로드 (questions.js)
     */
    async load() {
        // SessionStorage에서 임시 변경사항 확인
        const tempQuestions = sessionStorage.getItem('tempQuestions');

        if (tempQuestions) {
            // 임시 저장된 문제가 있으면 사용
            this.questionsCache = JSON.parse(tempQuestions);
            console.log('SessionStorage에서 임시 변경사항 로드');
        } else if (questions && questions.length > 0) {
            // questions.js에서 모든 문제 로드
            this.questionsCache = [...questions];
        }

        // Question 객체로 변환
        this.questions = this.questionsCache.map((q, index) => new Question({ ...q, index }));

        console.log(`총 ${this.questions.length}개 문제 로드 완료`);
    }

    /**
     * 모든 문제를 questions.js 파일로 Export
     * @returns {string} 다운로드할 파일 내용
     */
    exportQuestions() {
        const fileContent = `/**
 * 문제 은행
 * Admin 페이지에서 문제를 추가/수정/삭제하면 이 파일을 다운로드하여 app/js/data/ 폴더에 저장하세요.
 */

export const questions = ${JSON.stringify(this.questionsCache, null, 4)};
`;
        return fileContent;
    }

    /**
     * 파일 다운로드 트리거
     */
    downloadQuestionsFile() {
        const content = this.exportQuestions();
        const blob = new Blob([content], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions.js';
        a.click();
        URL.revokeObjectURL(url);

        console.log('questions.js 파일 다운로드 완료');
    }

    /**
     * 모든 문제 삭제 (휴지통으로 이동)
     * @returns {boolean} 성공 여부
     */
    async deleteAllQuestions() {
        try {
            // 모든 문제를 삭제 상태로 변경
            this.questions.forEach(q => {
                q.deleted = true;
            });
            this.questionsCache.forEach(q => {
                q.deleted = true;
            });

            // SessionStorage에 임시 저장 (페이지 이동 시 유지)
            sessionStorage.setItem('tempQuestions', JSON.stringify(this.questionsCache));

            // 파일 다운로드
            this.downloadQuestionsFile();

            console.log('모든 문제 삭제 완료');
            return true;
        } catch (error) {
            console.error('문제 삭제 실패:', error);
            return false;
        }
    }

    /**
     * 문제 통계 조회
     * @returns {Object} 문제 통계 객체
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
}
