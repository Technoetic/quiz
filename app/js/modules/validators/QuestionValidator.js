/**
 * QuestionValidator 클래스
 * 문제 데이터 검증
 */

import { AppConstants } from '../constants/AppConstants.js';

export class QuestionValidator {
    /**
     * 문제 데이터 검증
     * @param {Object} questionData - 문제 데이터
     * @returns {Object} 검증 결과 { valid: boolean, errors: string[] }
     */
    static validate(questionData) {
        const errors = [];

        // 기본 필드 검증
        if (!questionData.type) {
            errors.push('문제 유형이 지정되지 않았습니다.');
        } else if (!Object.values(AppConstants.QUESTION_TYPES).includes(questionData.type)) {
            errors.push('올바르지 않은 문제 유형입니다.');
        }

        if (!questionData.subject || questionData.subject.trim() === '') {
            errors.push('과목을 입력해주세요.');
        }

        if (!questionData.question || questionData.question.trim() === '') {
            errors.push('문제를 입력해주세요.');
        }

        // 문제 유형별 검증
        if (questionData.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
            this.validateMultipleChoice(questionData, errors);
        } else if (questionData.type === AppConstants.QUESTION_TYPES.SUBJECTIVE) {
            this.validateSubjective(questionData, errors);
        } else if (questionData.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
            this.validateSequence(questionData, errors);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 객관식 문제 검증
     * @param {Object} questionData - 문제 데이터
     * @param {string[]} errors - 에러 배열
     */
    static validateMultipleChoice(questionData, errors) {
        // 옵션 검증
        if (!questionData.options || !Array.isArray(questionData.options)) {
            errors.push('보기가 배열 형태가 아닙니다.');
            return;
        }

        if (questionData.options.length !== AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT) {
            errors.push(`보기는 ${AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT}개여야 합니다.`);
        }

        // 빈 옵션 검증
        const emptyOptions = questionData.options.filter(opt => !opt || opt.trim() === '');
        if (emptyOptions.length > 0) {
            errors.push('모든 보기를 입력해주세요.');
        }

        // 정답 검증
        if (questionData.correctAnswer === undefined || questionData.correctAnswer === null) {
            errors.push('정답을 선택해주세요.');
        } else {
            const correctAnswer = Number(questionData.correctAnswer);
            if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT) {
                errors.push(`정답은 1~${AppConstants.MULTIPLE_CHOICE_OPTIONS_COUNT} 사이의 숫자여야 합니다.`);
            }
        }
    }

    /**
     * 주관식 문제 검증
     * @param {Object} questionData - 문제 데이터
     * @param {string[]} errors - 에러 배열
     */
    static validateSubjective(questionData, errors) {
        if (!questionData.correctAnswer || questionData.correctAnswer.trim() === '') {
            errors.push('정답을 입력해주세요.');
        }

        // 대체 답변 검증 (선택사항)
        if (questionData.alternativeAnswers) {
            if (!Array.isArray(questionData.alternativeAnswers)) {
                errors.push('대체 답변이 배열 형태가 아닙니다.');
            }
        }
    }

    /**
     * 순서 나열 문제 검증
     * @param {Object} questionData - 문제 데이터
     * @param {string[]} errors - 에러 배열
     */
    static validateSequence(questionData, errors) {
        if (!questionData.correctOrder || !Array.isArray(questionData.correctOrder)) {
            errors.push('순서가 배열 형태가 아닙니다.');
            return;
        }

        if (questionData.correctOrder.length < AppConstants.SEQUENCE_MIN_ITEMS) {
            errors.push(`최소 ${AppConstants.SEQUENCE_MIN_ITEMS}개 이상의 항목이 필요합니다.`);
        }

        // 빈 항목 검증
        const emptyItems = questionData.correctOrder.filter(item => !item || item.trim() === '');
        if (emptyItems.length > 0) {
            errors.push('모든 항목을 입력해주세요.');
        }

        // 중복 항목 검증
        const uniqueItems = new Set(questionData.correctOrder.map(item => item.trim().toLowerCase()));
        if (uniqueItems.size !== questionData.correctOrder.length) {
            errors.push('중복된 항목이 있습니다.');
        }
    }

    /**
     * 빠른 검증 (boolean만 반환)
     * @param {Object} questionData - 문제 데이터
     * @returns {boolean} 유효성
     */
    static isValid(questionData) {
        return this.validate(questionData).valid;
    }

    /**
     * 첫 번째 에러 메시지 반환
     * @param {Object} questionData - 문제 데이터
     * @returns {string|null} 에러 메시지 또는 null
     */
    static getFirstError(questionData) {
        const result = this.validate(questionData);
        return result.errors.length > 0 ? result.errors[0] : null;
    }
}
