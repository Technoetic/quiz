/**
 * 유틸리티 클래스
 * 공통으로 사용되는 헬퍼 함수들을 제공
 */

export class Utils {
    /**
     * HTML 이스케이프 처리
     * @param {string} text - 이스케이프할 텍스트
     * @returns {string} 이스케이프 처리된 HTML
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 배열 섞기 (Fisher-Yates 알고리즘)
     * @param {Array} array - 섞을 배열
     * @returns {Array} 섞인 배열의 복사본
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * 텍스트 너비 측정
     * @param {string} text - 측정할 텍스트
     * @param {string} font - 폰트 스타일
     * @returns {number} 텍스트 너비 (픽셀)
     */
    static getTextWidth(text, font) {
        const canvas = Utils.getTextWidth.canvas || (Utils.getTextWidth.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    /**
     * Debounce 함수
     * 연속된 호출을 지연시키고 마지막 호출만 실행
     * @param {Function} func - 실행할 함수
     * @param {number} delay - 지연 시간 (ms)
     * @returns {Function} Debounced 함수
     */
    static debounce(func, delay = 300) {
        let timeoutId;
        return function(...args) {
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    /**
     * Throttle 함수
     * 일정 시간 간격으로만 함수 실행
     * @param {Function} func - 실행할 함수
     * @param {number} limit - 실행 간격 (ms)
     * @returns {Function} Throttled 함수
     */
    static throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 딥 클론
     * 객체를 깊은 복사
     * @param {any} obj - 복사할 객체
     * @returns {any} 복사된 객체
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (obj instanceof Object) {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = Utils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }

    /**
     * 숫자 포맷팅
     * @param {number} num - 숫자
     * @param {number} decimals - 소수점 자릿수
     * @returns {string} 포맷된 문자열
     */
    static formatNumber(num, decimals = 0) {
        return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * 시간 포맷팅 (ms -> MM:SS)
     * @param {number} ms - 밀리초
     * @returns {string} MM:SS 형식
     */
    static formatTime(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * 랜덤 ID 생성
     * @param {number} length - ID 길이
     * @returns {string} 랜덤 ID
     */
    static generateId(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    /**
     * 배열 청크 분할
     * @param {Array} array - 배열
     * @param {number} size - 청크 크기
     * @returns {Array} 분할된 배열
     */
    static chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * 배열 중복 제거
     * @param {Array} array - 배열
     * @param {string} key - 중복 체크할 키 (객체 배열인 경우)
     * @returns {Array} 중복 제거된 배열
     */
    static unique(array, key = null) {
        if (!key) {
            return [...new Set(array)];
        }
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
}
