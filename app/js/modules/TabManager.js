/**
 * TabManager 클래스
 * 탭 전환 관리
 */

import { AppConstants } from './constants/AppConstants.js';
import { domCache } from './utils/DOMCache.js';

export class TabManager {
    constructor() {
        this.currentTab = 'quiz';
        this.initializeEventListeners();
    }

    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
        // 메인 탭 버튼만 선택 (id가 tab-으로 시작하는 것만)
        const tabButtons = document.querySelectorAll('.tab-buttons .tab-btn[id^="tab-"]');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.id;
                const tabName = tabId.replace('tab-', '');
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
    }

    /**
     * 탭 전환
     * @param {string} tabName - 탭 이름
     */
    switchTab(tabName) {
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        // 선택된 탭 버튼 활성화
        const selectedTabBtn = domCache.get(`tab${tabName.charAt(0).toUpperCase()}${tabName.slice(1)}`);
        if (selectedTabBtn) {
            selectedTabBtn.classList.add('active');
            selectedTabBtn.setAttribute('aria-selected', 'true');
        }

        // 모든 섹션 숨기기
        const quizSection = domCache.get('quizSection');
        const adminSection = domCache.get('adminSection');
        const editSection = domCache.get('editSection');
        const listSection = domCache.get('listSection');
        const settingsSection = domCache.get('settingsSection');
        const deletedSection = domCache.get('deletedSection');

        [quizSection, adminSection, editSection, listSection, settingsSection, deletedSection].forEach(section => {
            if (section) section.style.display = 'none';
        });

        // 선택된 섹션 표시
        const sectionMap = {
            'quiz': quizSection,
            'admin': adminSection,
            'edit': editSection,
            'list': listSection,
            'settings': settingsSection,
            'deleted': deletedSection
        };

        const targetSection = sectionMap[tabName];
        if (targetSection) {
            targetSection.style.display = tabName === 'quiz' ? 'flex' : 'block';
        }

        // 탭별 초기화 로직
        if (tabName === 'admin' && window.app?.adminUI) {
            window.app.adminUI.switchQuestionType(AppConstants.QUESTION_TYPES.MULTIPLE);
        } else if (tabName === 'list' && window.app?.adminUI) {
            window.app.adminUI.filterAndDisplayQuestions('all');
        }

        this.currentTab = tabName;
    }
}
