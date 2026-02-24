/**
 * App 클래스
 * 애플리케이션 진입점 및 전역 상태 관리
 */

import { SupabaseQuestionBank } from './SupabaseQuestionBank.js';
import { ToastNotification } from './ToastNotification.js';
import { LoadingIndicator } from './LoadingIndicator.js';
import { FeedbackUI } from './FeedbackUI.js';
import { QuizUI } from './QuizUI.js';
import { AdminUI } from './AdminUI.js';
import { TabManager } from './TabManager.js';
import { DOMEventHandler } from './handlers/DOMEventHandler.js';
import { domCache } from './utils/DOMCache.js';
import { SettingsUI } from './SettingsUI.js';
import { DeletedQuestionsUI } from './DeletedQuestionsUI.js';

export class App {
    constructor() {
        this.questionBank = new SupabaseQuestionBank();
        this.toast = new ToastNotification();
        this.loading = new LoadingIndicator();

        this.init();

        // 전역에서 접근 가능하도록 (SettingsUI, DeletedQuestionsUI에서 사용)
        window.app = this;
    }

    /**
     * 애플리케이션 초기화
     */
    async init() {
        // DOM 캐시 초기화 (첫 번째로 실행)
        domCache.init();

        // QuestionBank 초기화 먼저 실행
        await this.questionBank.init();

        // UI 컴포넌트 초기화 (QuestionBank 로드 후)
        const resultElement = document.getElementById('result');
        if (resultElement) {
            this.feedbackUI = new FeedbackUI(resultElement);
            this.quizUI = new QuizUI(this.questionBank, this.feedbackUI, this.toast);
        }
        this.adminUI = new AdminUI(this.questionBank, this.toast);
        this.settingsUI = new SettingsUI(this.questionBank, null, this.toast);
        this.deletedQuestionsUI = new DeletedQuestionsUI(this.questionBank, this.toast);
        this.tabManager = new TabManager();
        this.eventHandler = new DOMEventHandler(this);

        // QuestionBank 로드 완료 후 UI 업데이트
        this.adminUI.updateQuestionList();

        // 과목 드롭다운 동적 업데이트
        this.updateSubjectDropdown();

        // 과목 관리 드롭다운 초기화 (localStorage에서 삭제된 과목 반영)
        if (typeof window.updateAllSubjectDropdowns === 'function') {
            window.updateAllSubjectDropdowns();
        }

        // 초기 문제 생성 (페이지 로드 시 자동으로 문제 표시)
        if (this.quizUI) {
            this.quizUI.updateProgress();
            this.quizUI.generateQuestion();
        }

        // DOM 이벤트 핸들러 초기화
        this.eventHandler.init();

        // 키보드 단축키 초기화
        this.initKeyboardShortcuts();

        // list.html에서 수정 버튼 클릭 후 이동한 경우 자동으로 수정 모드 열기
        const editIndex = sessionStorage.getItem('editQuestionIndex');
        if (editIndex !== null && document.getElementById('tab-edit')) {
            sessionStorage.removeItem('editQuestionIndex');
            this.adminUI.editQuestion(Number(editIndex));
        }

        console.log('Quiz App 초기화 완료');
        console.log(`DOM 캐시: ${domCache.size()}개 요소`);
        console.log(`문제 수: ${this.questionBank.getAll().length}개`);
        console.log(`저장소: SQLite 파일 기반 (자동 로드/저장)`);
    }

    /**
     * 과목 드롭다운 업데이트
     */
    updateSubjectDropdown() {
        const dropdown = domCache.get('subjectDropdown');
        if (!dropdown) return;

        // 모든 문제에서 과목 추출
        const questions = this.questionBank.getAll();
        const subjects = new Set(questions.map(q => q.subject));

        // 기존 옵션은 유지하고 새 과목만 추가
        const existingOptions = Array.from(dropdown.options).map(opt => opt.value);

        subjects.forEach(subject => {
            if (!existingOptions.includes(subject) && subject) {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                dropdown.appendChild(option);
            }
        });
    }

    /**
     * 애플리케이션 정리
     */
    destroy() {
        if (this.eventHandler) {
            this.eventHandler.destroy();
        }
        domCache.clear();
    }
}

// 전역 함수로 노출 (HTML onclick에서 사용)
window.toggleQuestionType = function(type) {
    if (window.app && window.app.adminUI) {
        window.app.adminUI.switchQuestionType(type);
    }
};

// 과목 관리 모달 열기
window.manageSubjects = function(selectId) {
    const modal = document.getElementById('subjectModal');
    const subjectList = document.getElementById('subjectList');

    // 저장된 과목 목록 가져오기
    const savedSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');
    const deletedDefaultSubjects = JSON.parse(localStorage.getItem('deletedDefaultSubjects') || '[]');
    const defaultSubjects = [];

    // 삭제되지 않은 기본 과목만 포함
    const activeDefaultSubjects = defaultSubjects.filter(s => !deletedDefaultSubjects.includes(s));

    // 모든 과목 목록 생성 (활성 기본 과목 + 사용자 추가)
    const allSubjects = [...new Set([...activeDefaultSubjects, ...savedSubjects])];

    // 과목 목록 렌더링
    subjectList.innerHTML = '';
    allSubjects.forEach(subject => {
        const item = document.createElement('div');
        item.className = 'subject-item';
        item.innerHTML = `
            <span class="subject-item-name">${subject}</span>
            <button class="subject-item-delete" onclick="deleteSubject('${subject}')">삭제</button>
        `;
        subjectList.appendChild(item);
    });

    // 모달 표시
    modal.style.display = 'flex';
};

// 과목 관리 모달 닫기
window.closeSubjectModal = function() {
    const modal = document.getElementById('subjectModal');
    modal.style.display = 'none';
};

// 과목 삭제
window.deleteSubject = function(subject) {
    if (!confirm(`"${subject}" 과목을 삭제하시겠습니까?`)) {
        return;
    }

    // 저장된 과목 목록 가져오기
    const savedSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');
    const deletedDefaultSubjects = JSON.parse(localStorage.getItem('deletedDefaultSubjects') || '[]');
    const defaultSubjects = [];

    // 기본 과목인지 확인
    if (defaultSubjects.includes(subject)) {
        // 기본 과목 삭제: deletedDefaultSubjects에 추가
        if (!deletedDefaultSubjects.includes(subject)) {
            deletedDefaultSubjects.push(subject);
            localStorage.setItem('deletedDefaultSubjects', JSON.stringify(deletedDefaultSubjects));
        }
    } else {
        // 사용자 추가 과목 삭제: customSubjects에서 제거
        const updatedCustomSubjects = savedSubjects.filter(s => s !== subject);
        localStorage.setItem('customSubjects', JSON.stringify(updatedCustomSubjects));
    }

    // 모든 드롭다운 업데이트
    window.updateAllSubjectDropdowns();

    // 모달 닫기
    window.closeSubjectModal();

    // Toast 알림
    if (window.app && window.app.toast) {
        window.app.toast.show(`"${subject}" 과목이 삭제되었습니다.`, 'success');
    }
};

// 등록/수정 탭 전환
window.switchAdminTab = function(tab) {
    const addSection = document.getElementById('add-section');
    const editSection = document.getElementById('edit-section');
    const tabAdd = document.getElementById('tab-add');
    const tabEdit = document.getElementById('tab-edit');

    if (tab === 'add') {
        if (addSection) addSection.style.display = '';
        if (editSection) editSection.style.display = 'none';
        if (tabAdd) tabAdd.classList.add('active');
        if (tabEdit) { tabEdit.classList.remove('active'); tabEdit.style.display = 'none'; }
    } else {
        if (addSection) addSection.style.display = 'none';
        if (editSection) editSection.style.display = '';
        if (tabAdd) tabAdd.classList.remove('active');
        if (tabEdit) { tabEdit.classList.add('active'); tabEdit.style.display = 'inline-block'; }
    }
};

// 수정 폼 문제 유형 전환 (전역 함수로 노출)
window.switchEditQuestionType = function(type) {
    const editForms = {
        multiple: document.getElementById('editMcForm'),
        subjective: document.getElementById('editSubForm'),
        sequence: document.getElementById('editSeqForm')
    };

    const buttons = document.querySelectorAll('#edit-section .question-type-select .tab-btn');

    // 모든 폼 숨기기
    Object.values(editForms).forEach(form => {
        if (form) form.classList.remove('active');
    });

    // 모든 버튼 비활성화
    buttons.forEach(btn => btn.classList.remove('active'));

    // 선택된 폼 표시
    if (editForms[type]) {
        editForms[type].classList.add('active');
    }

    // 선택된 버튼 활성화
    const typeMap = { multiple: 'edit-tab-multiple', subjective: 'edit-tab-subjective', sequence: 'edit-tab-sequence' };
    const btn = document.getElementById(typeMap[type]);
    if (btn) btn.classList.add('active');
};

// 모든 과목 드롭다운 업데이트 (전역 함수로 노출)
window.updateAllSubjectDropdowns = function() {
    const selectIds = ['mcSubject', 'subSubject', 'seqSubject', 'editMcSubject', 'editSubSubject', 'editSeqSubject'];

    selectIds.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        // 현재 선택된 값 저장
        const currentValue = select.value;

        // 기본 과목과 사용자 과목 가져오기
        const savedSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');
        const defaultSubjects = [];
        const deletedDefaultSubjects = JSON.parse(localStorage.getItem('deletedDefaultSubjects') || '[]');

        // 삭제되지 않은 기본 과목만
        const activeDefaultSubjects = defaultSubjects.filter(s => !deletedDefaultSubjects.includes(s));

        // 모든 과목 목록 (기본 + 사용자 추가)
        const allSubjects = [...new Set([...activeDefaultSubjects, ...savedSubjects])];

        // 드롭다운 재구성
        select.innerHTML = '<option value="" disabled selected>과목을 선택하세요</option>';

        allSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });

        // 등록 폼에만 "직접 입력" 옵션 추가
        if (['mcSubject', 'subSubject', 'seqSubject'].includes(selectId)) {
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = '직접 입력';
            select.appendChild(customOption);
        }

        // 이전 선택값 복원 (가능한 경우)
        if (currentValue && allSubjects.includes(currentValue)) {
            select.value = currentValue;
        }
    });
};

/**
 * 키보드 단축키 초기화
 */
App.prototype.initKeyboardShortcuts = function() {
    document.addEventListener('keydown', (e) => {
        // 입력 필드에서는 단축키 무시
        const tagName = e.target.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            return;
        }

        // 객관식 문제에서 1-4번 키로 답변 선택
        if (e.key >= '1' && e.key <= '4') {
            const buttonIndex = parseInt(e.key) - 1;
            const buttons = document.querySelectorAll('.options button');

            if (buttons[buttonIndex] && !buttons[buttonIndex].disabled) {
                e.preventDefault();
                buttons[buttonIndex].click();
            }
        }
    });
};
