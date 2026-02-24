/**
 * ProgressStorage 클래스
 * 진행 상황 저장 전담
 */

import { StorageManager } from './StorageManager.js';
import { AppConstants } from '../constants/AppConstants.js';

export class ProgressStorage {
    constructor() {
        this.storage = new StorageManager(AppConstants.STORAGE_KEYS.APP_NAME);
    }

    /**
     * 답변한 문제 목록 저장
     * @param {Set<number>} answeredQuestions - 답변한 문제 인덱스 Set
     */
    saveProgress(answeredQuestions) {
        const array = Array.from(answeredQuestions);
        this.storage.set(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS, array);
    }

    /**
     * 답변한 문제 목록 로드
     * @returns {Set<number>} 답변한 문제 인덱스 Set
     */
    loadProgress() {
        const array = this.storage.get(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS, []);
        return new Set(array);
    }

    /**
     * 진행 상황 삭제
     */
    clearProgress() {
        this.storage.remove(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS);
    }

    /**
     * 진행 상황 존재 여부
     * @returns {boolean} 존재 여부
     */
    hasProgress() {
        return this.storage.has(AppConstants.STORAGE_KEYS.ANSWERED_QUESTIONS);
    }
}
