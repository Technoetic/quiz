/**
 * QuestionStorage 클래스
 * 문제 데이터 저장 전담
 */

import { StorageManager } from './StorageManager.js';
import { AppConstants } from '../constants/AppConstants.js';

export class QuestionStorage {
    constructor() {
        this.storage = new StorageManager(AppConstants.STORAGE_KEYS.APP_NAME);
    }

    /**
     * 문제 목록 저장
     * @param {Object[]} questions - 문제 목록
     */
    saveQuestions(questions) {
        this.storage.set(AppConstants.STORAGE_KEYS.QUESTION_BANK, questions);
    }

    /**
     * 문제 목록 로드
     * @returns {Object[]|null} 문제 목록 또는 null
     */
    loadQuestions() {
        return this.storage.get(AppConstants.STORAGE_KEYS.QUESTION_BANK, null);
    }

    /**
     * 문제 목록 삭제
     */
    clearQuestions() {
        this.storage.remove(AppConstants.STORAGE_KEYS.QUESTION_BANK);
    }

    /**
     * 문제 존재 여부
     * @returns {boolean} 존재 여부
     */
    hasQuestions() {
        return this.storage.has(AppConstants.STORAGE_KEYS.QUESTION_BANK);
    }
}
