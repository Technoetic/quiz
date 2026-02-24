/**
 * DOMCache 클래스
 * DOM 요소를 캐싱하여 반복적인 쿼리 최적화
 */

import { AppConstants } from '../constants/AppConstants.js';

export class DOMCache {
    constructor() {
        this.cache = new Map();
        this.initialized = false;
    }

    /**
     * 모든 주요 DOM 요소 캐싱
     */
    init() {
        if (this.initialized) return;

        // 탭 버튼
        this.set('tabQuiz', AppConstants.DOM_IDS.TAB_QUIZ);
        this.set('tabAdmin', AppConstants.DOM_IDS.TAB_ADMIN);
        this.set('tabList', AppConstants.DOM_IDS.TAB_LIST);
        this.set('tabDeleted', 'tab-deleted');
        this.set('tabSettings', AppConstants.DOM_IDS.TAB_SETTINGS);
        this.set('tabEdit', AppConstants.DOM_IDS.TAB_EDIT);

        // 섹션
        this.set('quizSection', AppConstants.DOM_IDS.QUIZ_SECTION);
        this.set('adminSection', AppConstants.DOM_IDS.ADMIN_SECTION);
        this.set('listSection', AppConstants.DOM_IDS.LIST_SECTION);
        this.set('settingsSection', AppConstants.DOM_IDS.SETTINGS_SECTION);
        this.set('editSection', AppConstants.DOM_IDS.EDIT_SECTION);
        this.set('deletedSection', AppConstants.DOM_IDS.DELETED_SECTION);

        // 퀴즈 요소
        this.set('question', AppConstants.DOM_IDS.QUESTION);
        this.set('questionContent', AppConstants.DOM_IDS.QUESTION_CONTENT);
        this.set('result', AppConstants.DOM_IDS.RESULT);
        this.set('progress', AppConstants.DOM_IDS.PROGRESS);
        this.set('subjectDropdown', AppConstants.DOM_IDS.SUBJECT_DROPDOWN);

        // 객관식 폼
        this.set('mcForm', AppConstants.DOM_IDS.MC_FORM);
        this.set('mcSubject', AppConstants.DOM_IDS.MC_SUBJECT);
        this.set('mcQuestion', AppConstants.DOM_IDS.MC_QUESTION);
        this.set('mcCorrectAnswer', AppConstants.DOM_IDS.MC_CORRECT_ANSWER);

        // 주관식 폼
        this.set('subForm', AppConstants.DOM_IDS.SUB_FORM);
        this.set('subSubject', AppConstants.DOM_IDS.SUB_SUBJECT);
        this.set('subQuestion', AppConstants.DOM_IDS.SUB_QUESTION);
        this.set('subCorrectAnswer', AppConstants.DOM_IDS.SUB_CORRECT_ANSWER);

        // 순서 나열 폼
        this.set('seqForm', AppConstants.DOM_IDS.SEQ_FORM);
        this.set('seqSubject', AppConstants.DOM_IDS.SEQ_SUBJECT);
        this.set('seqQuestion', AppConstants.DOM_IDS.SEQ_QUESTION);
        this.set('seqItems', AppConstants.DOM_IDS.SEQ_ITEMS);

        // 수정 폼
        this.set('editMcForm', AppConstants.DOM_IDS.EDIT_MC_FORM);
        this.set('editSubForm', AppConstants.DOM_IDS.EDIT_SUB_FORM);
        this.set('editSeqForm', AppConstants.DOM_IDS.EDIT_SEQ_FORM);
        this.set('editSeqItems', AppConstants.DOM_IDS.EDIT_SEQ_ITEMS);

        // 목록
        this.set('questionList', AppConstants.DOM_IDS.QUESTION_LIST);
        this.set('questionStats', AppConstants.DOM_IDS.QUESTION_STATS);

        // 설정
        this.set('apiKey', AppConstants.DOM_IDS.API_KEY);
        this.set('enableRephrase', AppConstants.DOM_IDS.ENABLE_REPHRASE);

        // 기타
        this.set('toastContainer', AppConstants.DOM_IDS.TOAST_CONTAINER);
        this.set('loadingSpinner', AppConstants.DOM_IDS.LOADING_SPINNER);

        // querySelector로 찾는 요소들
        this.setByQuery('progressFill', '.progress-fill');
        this.setByQuery('progressText', '.progress-text');
        this.setByQuery('resultIcon', '.result-icon');
        this.setByQuery('resultText', '.result-text');

        this.initialized = true;
    }

    /**
     * ID로 요소 캐싱
     * @param {string} key - 캐시 키
     * @param {string} id - DOM ID
     */
    set(key, id) {
        const element = document.getElementById(id);
        if (element) {
            this.cache.set(key, element);
        }
    }

    /**
     * querySelector로 요소 캐싱
     * @param {string} key - 캐시 키
     * @param {string} selector - CSS 선택자
     */
    setByQuery(key, selector) {
        const element = document.querySelector(selector);
        if (element) {
            this.cache.set(key, element);
        }
    }

    /**
     * querySelectorAll로 요소 캐싱
     * @param {string} key - 캐시 키
     * @param {string} selector - CSS 선택자
     */
    setAllByQuery(key, selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            this.cache.set(key, Array.from(elements));
        }
    }

    /**
     * 캐시된 요소 가져오기
     * @param {string} key - 캐시 키
     * @returns {HTMLElement|null} DOM 요소
     */
    get(key) {
        return this.cache.get(key) || null;
    }

    /**
     * 캐시 존재 확인
     * @param {string} key - 캐시 키
     * @returns {boolean} 존재 여부
     */
    has(key) {
        return this.cache.has(key);
    }

    /**
     * 특정 캐시 삭제
     * @param {string} key - 캐시 키
     */
    remove(key) {
        this.cache.delete(key);
    }

    /**
     * 모든 캐시 초기화
     */
    clear() {
        this.cache.clear();
        this.initialized = false;
    }

    /**
     * 캐시된 요소 개수
     * @returns {number} 개수
     */
    size() {
        return this.cache.size;
    }

    /**
     * 캐시 키 목록
     * @returns {Array<string>} 키 배열
     */
    keys() {
        return Array.from(this.cache.keys());
    }

    /**
     * 옵션 요소 가져오기 (객관식)
     * @param {number} index - 옵션 인덱스 (1-4)
     * @returns {HTMLElement|null} 옵션 요소
     */
    getOption(index) {
        const key = `option${index}`;
        if (!this.has(key)) {
            this.set(key, key);
        }
        return this.get(key);
    }

    /**
     * 수정 폼 옵션 요소 가져오기
     * @param {number} index - 옵션 인덱스 (1-4)
     * @returns {HTMLElement|null} 옵션 요소
     */
    getEditOption(index) {
        const key = `editOption${index}`;
        if (!this.has(key)) {
            this.set(key, key);
        }
        return this.get(key);
    }

    /**
     * 통계 요소 가져오기
     * @param {string} type - 통계 타입 ('all', 'multiple', 'subjective', 'sequence')
     * @returns {HTMLElement|null} 통계 요소
     */
    getStat(type) {
        const key = `stat${type.charAt(0).toUpperCase()}${type.slice(1)}`;
        if (!this.has(key)) {
            this.set(key, key);
        }
        return this.get(key);
    }

    /**
     * 동적 요소 새로고침
     * 동적으로 생성되는 요소는 필요 시 재캐싱
     * @param {string} key - 캐시 키
     * @param {string} idOrSelector - ID 또는 선택자
     * @param {boolean} useQuery - querySelector 사용 여부
     */
    refresh(key, idOrSelector, useQuery = false) {
        this.remove(key);
        if (useQuery) {
            this.setByQuery(key, idOrSelector);
        } else {
            this.set(key, idOrSelector);
        }
    }
}

// 싱글톤 인스턴스 생성
export const domCache = new DOMCache();
