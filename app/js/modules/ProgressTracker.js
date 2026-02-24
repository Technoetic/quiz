/**
 * ProgressTracker 클래스
 * 퀴즈 진행 상황 추적 및 표시
 */

import { AppConstants } from './constants/AppConstants.js';

export class ProgressTracker {
    /**
     * @param {HTMLElement} progressFill - 진행 바 채우기 요소
     * @param {HTMLElement} progressText - 진행 텍스트 요소
     */
    constructor(progressFill, progressText) {
        this.progressFill = progressFill;
        this.progressText = progressText;
        this.answeredQuestions = new Set();

        this.loadFromStorage();
    }

    /**
     * LocalStorage에서 진행 상황 로드
     */
    loadFromStorage() {
        const saved = localStorage.getItem(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS);
        if (saved) {
            this.answeredQuestions = new Set(JSON.parse(saved));
        }
    }

    /**
     * LocalStorage에 진행 상황 저장
     */
    saveToStorage() {
        localStorage.setItem(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS,
            JSON.stringify(Array.from(this.answeredQuestions)));
    }

    /**
     * 답변한 문제 추가
     * @param {number} questionIndex - 문제 인덱스
     */
    markAsAnswered(questionIndex) {
        this.answeredQuestions.add(questionIndex);
        this.saveToStorage();
    }

    /**
     * 특정 문제를 답변했는지 확인
     * @param {number} questionIndex - 문제 인덱스
     * @returns {boolean} 답변 여부
     */
    isAnswered(questionIndex) {
        return this.answeredQuestions.has(questionIndex);
    }

    /**
     * 진행 상황 초기화
     */
    reset() {
        this.answeredQuestions.clear();
        this.saveToStorage();
    }

    /**
     * 진행 바 업데이트
     * @param {Question[]} questions - 전체 문제 목록
     * @param {QuestionBank} questionBank - 문제 저장소 (삭제 여부 확인용)
     * @param {string} currentSubject - 현재 선택된 과목
     */
    updateProgress(questions, questionBank, currentSubject = '') {
        // 답변한 문제 수 계산 (삭제되지 않은 문제만)
        const answeredCount = Array.from(this.answeredQuestions)
            .filter(index => {
                const q = questionBank.questions[index];
                return q && !q.deleted && (!currentSubject || q.subject === currentSubject);
            }).length;

        const totalCount = questions.length;
        const percentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

        // 진행 바 업데이트
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }

        // 진행 텍스트 업데이트
        if (this.progressText) {
            this.progressText.textContent = `진행 상황: ${answeredCount}/${totalCount}`;
        }
    }

    /**
     * 완료 여부 확인
     * @param {Question[]} questions - 전체 문제 목록
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {string} currentSubject - 현재 선택된 과목
     * @returns {boolean} 완료 여부
     */
    isCompleted(questions, questionBank, currentSubject = '') {
        const answeredCount = Array.from(this.answeredQuestions)
            .filter(index => {
                const q = questionBank.questions[index];
                return q && !q.deleted && (!currentSubject || q.subject === currentSubject);
            }).length;

        return answeredCount >= questions.length && questions.length > 0;
    }

    /**
     * 답변되지 않은 문제 목록 반환
     * @param {Question[]} questions - 전체 문제 목록
     * @returns {Question[]} 답변되지 않은 문제
     */
    getUnansweredQuestions(questions) {
        return questions.filter(q => !this.answeredQuestions.has(q.index));
    }

    /**
     * 답변한 문제 수 반환
     * @param {Question[]} allQuestions - 전체 문제 목록
     * @param {string} currentSubject - 현재 선택된 과목
     * @returns {number} 답변한 문제 수
     */
    getAnsweredCount(allQuestions, currentSubject = '') {
        return Array.from(this.answeredQuestions)
            .filter(index => {
                const q = allQuestions[index];
                return q && !q.deleted && (!currentSubject || q.subject === currentSubject);
            }).length;
    }
}
