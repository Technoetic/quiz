/**
 * Question 클래스
 * 개별 문제를 표현하는 모델
 */

import { AppConstants } from './constants/AppConstants.js';

export class Question {
    /**
     * @param {Object} data - 문제 데이터
     * @param {string} data.type - 문제 유형 ('multiple', 'subjective', 'sequence')
     * @param {string} data.subject - 과목명
     * @param {string} data.question - 문제 내용
     * @param {number} data.index - 문제 인덱스
     */
    constructor(data) {
        this.id = data.id; // DB의 primary key (Dexie용)
        this.type = data.type;
        this.subject = data.subject;
        this.question = data.question;
        this.index = data.index;

        // 타입별 속성
        if (this.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
            this.options = data.options;
            this.correctAnswer = data.correctAnswer;
        } else if (this.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
            this.correctAnswer = data.correctAnswer;
            this.alternativeAnswers = data.alternativeAnswers || [];
        } else if (this.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
            this.correctOrder = data.correctOrder;
        }

        this.deleted = data.deleted || false;
    }

    /**
     * JSON 직렬화
     * @returns {Object} JSON 객체
     */
    toJSON() {
        const base = {
            type: this.type,
            subject: this.subject,
            question: this.question
        };

        if (this.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
            return { ...base, options: this.options, correctAnswer: this.correctAnswer };
        } else if (this.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
            return { ...base, correctAnswer: this.correctAnswer, alternativeAnswers: this.alternativeAnswers };
        } else if (this.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
            return { ...base, correctOrder: this.correctOrder };
        }

        return base;
    }

    /**
     * 사용자 답변 확인
     * @param {*} userAnswer - 사용자 답변
     * @returns {boolean} 정답 여부
     */
    checkAnswer(userAnswer) {
        if (this.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
            // userAnswer is boolean (isCorrect) from MultipleChoiceRenderer
            return userAnswer === true;
        } else if (this.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
            const normalized = userAnswer.trim().toLowerCase();
            return normalized === this.correctAnswer.trim().toLowerCase() ||
                   this.alternativeAnswers.some(alt => normalized === alt.trim().toLowerCase());
        } else if (this.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
            return JSON.stringify(userAnswer) === JSON.stringify(this.correctOrder);
        }
        return false;
    }
}
