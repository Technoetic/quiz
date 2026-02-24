/**
 * StorageManager 클래스
 * LocalStorage 추상화 계층
 */

export class StorageManager {
    /**
     * @param {string} prefix - Storage 키 접두사
     */
    constructor(prefix = 'quizApp') {
        this.prefix = prefix;
    }

    /**
     * 키 생성 (접두사 포함)
     * @param {string} key - 키
     * @returns {string} 접두사가 포함된 키
     */
    getKey(key) {
        return `${this.prefix}_${key}`;
    }

    /**
     * 데이터 저장
     * @param {string} key - 키
     * @param {*} value - 값 (객체는 자동으로 JSON 직렬화)
     */
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.getKey(key), serialized);
        } catch (error) {
            console.error('Storage save error:', error);
        }
    }

    /**
     * 데이터 조회
     * @param {string} key - 키
     * @param {*} defaultValue - 기본값
     * @returns {*} 저장된 값 또는 기본값
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.getKey(key));
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    }

    /**
     * 데이터 삭제
     * @param {string} key - 키
     */
    remove(key) {
        localStorage.removeItem(this.getKey(key));
    }

    /**
     * 모든 데이터 삭제
     */
    clear() {
        // 접두사로 시작하는 모든 키 삭제
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));
    }

    /**
     * 키 존재 여부 확인
     * @param {string} key - 키
     * @returns {boolean} 존재 여부
     */
    has(key) {
        return localStorage.getItem(this.getKey(key)) !== null;
    }

    /**
     * 모든 키 목록 반환
     * @returns {string[]} 키 목록 (접두사 제거됨)
     */
    keys() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(`${this.prefix}_`, ''));
    }
}
