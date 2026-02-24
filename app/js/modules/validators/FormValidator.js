/**
 * FormValidator 클래스
 * 폼 검증 로직
 */

export class FormValidator {
    /**
     * 필수 입력 검증
     * @param {string} value - 입력값
     * @returns {boolean} 유효성
     */
    static required(value) {
        return value !== null && value !== undefined && value.trim() !== '';
    }

    /**
     * 이메일 검증
     * @param {string} email - 이메일
     * @returns {boolean} 유효성
     */
    static email(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * 최소 길이 검증
     * @param {string} value - 입력값
     * @param {number} min - 최소 길이
     * @returns {boolean} 유효성
     */
    static minLength(value, min) {
        return value.length >= min;
    }

    /**
     * 최대 길이 검증
     * @param {string} value - 입력값
     * @param {number} max - 최대 길이
     * @returns {boolean} 유효성
     */
    static maxLength(value, max) {
        return value.length <= max;
    }

    /**
     * 숫자 범위 검증
     * @param {number} value - 숫자 값
     * @param {number} min - 최소값
     * @param {number} max - 최대값
     * @returns {boolean} 유효성
     */
    static range(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * 패턴 검증
     * @param {string} value - 입력값
     * @param {RegExp} pattern - 정규식 패턴
     * @returns {boolean} 유효성
     */
    static pattern(value, pattern) {
        return pattern.test(value);
    }

    /**
     * 폼 전체 검증
     * @param {HTMLFormElement} form - 폼 요소
     * @param {Object} rules - 검증 규칙
     * @returns {Object} 검증 결과 { valid: boolean, errors: Object }
     */
    static validateForm(form, rules) {
        const errors = {};
        let valid = true;

        Object.entries(rules).forEach(([fieldName, fieldRules]) => {
            const field = form.elements[fieldName];
            if (!field) return;

            const value = field.value;
            const fieldErrors = [];

            fieldRules.forEach(rule => {
                if (rule.type === 'required' && !this.required(value)) {
                    fieldErrors.push(rule.message || '필수 입력 항목입니다.');
                } else if (rule.type === 'email' && !this.email(value)) {
                    fieldErrors.push(rule.message || '올바른 이메일 형식이 아닙니다.');
                } else if (rule.type === 'minLength' && !this.minLength(value, rule.value)) {
                    fieldErrors.push(rule.message || `최소 ${rule.value}자 이상 입력해주세요.`);
                } else if (rule.type === 'maxLength' && !this.maxLength(value, rule.value)) {
                    fieldErrors.push(rule.message || `최대 ${rule.value}자까지 입력 가능합니다.`);
                } else if (rule.type === 'range' && !this.range(value, rule.min, rule.max)) {
                    fieldErrors.push(rule.message || `${rule.min}~${rule.max} 범위의 값을 입력해주세요.`);
                } else if (rule.type === 'pattern' && !this.pattern(value, rule.value)) {
                    fieldErrors.push(rule.message || '형식이 올바르지 않습니다.');
                } else if (rule.type === 'custom' && !rule.validator(value)) {
                    fieldErrors.push(rule.message || '유효하지 않은 값입니다.');
                }
            });

            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
                valid = false;
            }
        });

        return { valid, errors };
    }

    /**
     * 에러 메시지 표시
     * @param {HTMLFormElement} form - 폼 요소
     * @param {Object} errors - 에러 객체
     */
    static displayErrors(form, errors) {
        // 기존 에러 메시지 제거
        form.querySelectorAll('.error-message').forEach(el => el.remove());

        Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
            const field = form.elements[fieldName];
            if (!field) return;

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '4px';
            errorDiv.textContent = fieldErrors[0]; // 첫 번째 에러만 표시

            field.parentNode.appendChild(errorDiv);
            field.classList.add('error');
        });
    }

    /**
     * 에러 메시지 제거
     * @param {HTMLFormElement} form - 폼 요소
     */
    static clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
}
