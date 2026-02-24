/**
 * DOMEventHandler 클래스
 * 모든 DOM 이벤트를 모듈 방식으로 관리
 * HTML에서 인라인 이벤트 핸들러를 완전히 제거하고 JavaScript에서 관리
 */

export class DOMEventHandler {
    /**
     * @param {Object} app - 앱 인스턴스
     */
    constructor(app) {
        this.app = app;
        this.boundHandlers = new Map();
    }

    /**
     * 모든 이벤트 리스너 초기화
     */
    init() {
        this.initTabButtons();
        this.initQuizFilters();
        this.initAdminForms();
        this.initEditForms();
        this.initListFilters();
        this.initSettingsForm();
        this.initFormSubmits();
    }

    /**
     * 탭 버튼 이벤트
     */
    initTabButtons() {
        const tabButtons = [
            { id: 'tab-quiz', name: 'quiz' },
            { id: 'tab-admin', name: 'admin' },
            { id: 'tab-list', name: 'list' },
            { id: 'tab-settings', name: 'settings' },
            { id: 'tab-edit', name: 'edit' }
        ];

        tabButtons.forEach(({ id, name }) => {
            const button = document.getElementById(id);
            if (button) {
                const handler = () => this.handleTabSwitch(name);
                button.addEventListener('click', handler);
                this.boundHandlers.set(`tab-${id}`, { element: button, event: 'click', handler });
            }
        });
    }

    /**
     * 탭 전환 핸들러
     * @param {string} tabName - 탭 이름
     */
    handleTabSwitch(tabName) {
        if (this.app && this.app.tabManager) {
            this.app.tabManager.switchTab(tabName);
        }
    }

    /**
     * 퀴즈 필터 이벤트
     */
    initQuizFilters() {
        const subjectDropdown = document.getElementById('subjectDropdown');
        if (subjectDropdown) {
            const handler = (e) => this.handleQuizSubjectFilter(e.target.value);
            subjectDropdown.addEventListener('change', handler);
            this.boundHandlers.set('subject-dropdown', { element: subjectDropdown, event: 'change', handler });
        }
    }

    /**
     * 과목별 퀴즈 필터링 핸들러
     * @param {string} subject - 과목명
     */
    handleQuizSubjectFilter(subject) {
        if (this.app && this.app.quizUI) {
            this.app.quizUI.filterBySubject(subject);
            this.app.quizUI.generateQuestion();
        }
    }

    /**
     * 관리자 폼 이벤트 (문제 등록)
     */
    initAdminForms() {
        // 문제 유형 선택 버튼은 HTML onclick 속성으로 처리 (toggleQuestionType)

        // 순서 나열 항목 추가 버튼
        const addSeqButton = document.querySelector('#sequenceForm .add-btn');
        if (addSeqButton) {
            const handler = () => this.handleAddSequenceItem('sequenceItems');
            addSeqButton.addEventListener('click', handler);
            this.boundHandlers.set('add-seq-item', { element: addSeqButton, event: 'click', handler });
        }
    }

    /**
     * 수정 폼 이벤트
     */
    initEditForms() {
        // 문제 유형 선택 버튼은 HTML onclick 속성으로 처리 (switchEditQuestionType)

        // 순서 나열 항목 추가 버튼
        const addEditSeqButton = document.querySelector('#editSequenceForm .add-btn');
        if (addEditSeqButton) {
            const handler = () => this.handleAddSequenceItem('editSequenceItems');
            addEditSeqButton.addEventListener('click', handler);
            this.boundHandlers.set('add-edit-seq-item', { element: addEditSeqButton, event: 'click', handler });
        }
    }

    /**
     * 문제 유형 토글 핸들러
     * @param {string} type - 문제 유형
     */
    handleQuestionTypeToggle(type) {
        if (this.app && this.app.adminUI) {
            this.app.adminUI.switchQuestionType(type);
        }
    }

    /**
     * 순서 나열 항목 추가 핸들러
     * @param {string} containerId - 컨테이너 ID
     */
    handleAddSequenceItem(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const itemCount = container.children.length;
        const newItem = document.createElement('div');
        newItem.className = 'sequence-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'sequence-input';
        input.name = containerId === 'sequenceItems'
            ? `sequence-item-${itemCount + 1}`
            : `edit-sequence-item-${itemCount + 1}`;
        input.placeholder = `순서 ${itemCount + 1}`;
        input.required = true;

        newItem.appendChild(input);

        // 2개 이상일 때 삭제 버튼 추가
        if (itemCount >= 2) {
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.addEventListener('click', () => this.handleRemoveSequenceItem(newItem, container));
            newItem.appendChild(deleteBtn);
        }

        container.appendChild(newItem);
    }

    /**
     * 순서 나열 항목 제거 핸들러
     * @param {HTMLElement} item - 삭제할 항목
     * @param {HTMLElement} container - 컨테이너
     */
    handleRemoveSequenceItem(item, container) {
        if (container.children.length <= 2) {
            if (this.app && this.app.toast) {
                this.app.toast.show('최소 2개의 항목이 필요합니다.', 'error');
            }
            return;
        }

        container.removeChild(item);
    }

    /**
     * 목록 필터 이벤트
     */
    initListFilters() {
        const listSection = document.getElementById('list-section');
        if (listSection) {
            const filterButtons = listSection.querySelectorAll('.filter-btn');
            const filters = ['all', 'multiple', 'subjective', 'sequence'];

            filterButtons.forEach((button, index) => {
                const handler = () => this.handleFilterQuestions(filters[index]);
                button.addEventListener('click', handler);
                this.boundHandlers.set(`filter-${index}`, { element: button, event: 'click', handler });
            });

            // 모든 문제 삭제 버튼
            const deleteAllBtn = listSection.querySelector('.delete-all-btn');
            if (deleteAllBtn) {
                const handler = () => this.handleDeleteAllQuestions();
                deleteAllBtn.addEventListener('click', handler);
                this.boundHandlers.set('delete-all', { element: deleteAllBtn, event: 'click', handler });
            }

            // 텍스트 검색 input
            const searchInput = document.getElementById('questionSearchInput');
            if (searchInput) {
                const handler = () => this.handleSearchFilter();
                searchInput.addEventListener('input', handler);
                this.boundHandlers.set('search-input', { element: searchInput, event: 'input', handler });
            }
        }
    }

    /**
     * 문제 필터링 핸들러
     * @param {string} type - 필터 타입
     */
    handleFilterQuestions(type) {
        if (this.app && this.app.adminUI) {
            this.app.adminUI.filterAndDisplayQuestions(type);
        }
    }

    /**
     * 텍스트 검색 필터 핸들러
     */
    handleSearchFilter() {
        if (this.app && this.app.adminUI) {
            const searchInput = document.getElementById('questionSearchInput');
            const textFilter = searchInput ? searchInput.value.trim() : '';
            const activeBtn = document.querySelector('#list-section .subject-filters .filter-btn.active');
            const filterButtons = document.querySelectorAll('#list-section .subject-filters .filter-btn');
            const typeOrder = ['all', 'multiple', 'subjective', 'sequence'];
            let currentType = 'all';
            filterButtons.forEach((btn, i) => {
                if (btn.classList.contains('active')) currentType = typeOrder[i];
            });
            this.app.adminUI.updateQuestionList(currentType, '', textFilter);
        }
    }

    /**
     * 모든 문제 삭제 핸들러
     */
    handleDeleteAllQuestions() {
        // AdminUI의 deleteAllQuestions 메서드 호출 (파일 기반 저장소)
        if (this.app && this.app.adminUI) {
            this.app.adminUI.deleteAllQuestions();
        }
    }

    /**
     * 설정 폼 이벤트
     */
    initSettingsForm() {
        const settingsSection = document.getElementById('settings-section');
        if (settingsSection) {
            const saveBtn = settingsSection.querySelector('.submit-btn');
            if (saveBtn) {
                const handler = () => this.handleSaveSettings();
                saveBtn.addEventListener('click', handler);
                this.boundHandlers.set('save-settings', { element: saveBtn, event: 'click', handler });
            }
        }
    }

    /**
     * 설정 저장 핸들러
     */
    handleSaveSettings() {
        const apiKey = document.getElementById('apiKey')?.value;
        const enableRephrase = document.getElementById('enableRephrase')?.checked;

        const settings = {
            apiKey,
            enableRephrase
        };

        localStorage.setItem('quizAppSettings', JSON.stringify(settings));

        if (this.app && this.app.toast) {
            this.app.toast.show('설정이 저장되었습니다.', 'success');
        }
    }

    /**
     * 폼 제출 이벤트 (preventDefault만 처리)
     */
    initFormSubmits() {
        const forms = [
            'multipleChoiceForm',
            'subjectiveForm',
            'sequenceForm',
            'editMcForm',
            'editSubForm',
            'editSeqForm'
        ];

        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                const handler = (e) => {
                    e.preventDefault();
                    // 수정 폼인 경우 수정 처리
                    if (formId.startsWith('edit')) {
                        this.handleEditFormSubmit(formId);
                    }
                };
                form.addEventListener('submit', handler);
                this.boundHandlers.set(`form-${formId}`, { element: form, event: 'submit', handler });
            }
        });
    }

    /**
     * 수정 폼 제출 처리
     * @param {string} formId - 폼 ID
     */
    handleEditFormSubmit(formId) {
        const index = this.app.adminUI.editingQuestionIndex;
        if (index === undefined || index === null) {
            this.app.toast.show('수정할 문제를 찾을 수 없습니다.', 'error');
            return;
        }

        const question = this.app.questionBank.questions[index];
        if (!question) {
            this.app.toast.show('문제를 찾을 수 없습니다.', 'error');
            return;
        }

        let updatedQuestion = null;

        if (formId === 'editMcForm') {
            const subject = document.getElementById('editMcSubject').value.trim();
            const questionText = document.getElementById('editMcQuestion').value.trim();
            const options = [
                document.getElementById('editOption1').value.trim(),
                document.getElementById('editOption2').value.trim(),
                document.getElementById('editOption3').value.trim(),
                document.getElementById('editOption4').value.trim()
            ];
            const correctAnswer = parseInt(document.getElementById('editMcCorrectAnswer').value) - 1;

            updatedQuestion = {
                ...question,
                subject,
                question: questionText,
                options,
                correctAnswer
            };
        } else if (formId === 'editSubForm') {
            const subject = document.getElementById('editSubSubject').value.trim();
            const questionText = document.getElementById('editSubQuestion').value.trim();
            const correctAnswer = document.getElementById('editSubCorrectAnswer').value.trim();

            updatedQuestion = {
                ...question,
                subject,
                question: questionText,
                correctAnswer
            };
        } else if (formId === 'editSeqForm') {
            const subject = document.getElementById('editSeqSubject').value.trim();
            const questionText = document.getElementById('editSeqQuestion').value.trim();
            const inputs = document.querySelectorAll('#editSequenceItems .sequence-input');
            const correctOrder = Array.from(inputs).map(input => input.value.trim());

            updatedQuestion = {
                ...question,
                subject,
                question: questionText,
                correctOrder
            };
        }

        if (updatedQuestion) {
            this.app.questionBank.update(index, updatedQuestion);
            this.app.toast.show('문제가 수정되었습니다!', 'success');

            // 수정 탭 숨기고 목록 탭으로 전환
            const tabEdit = document.getElementById('tab-edit');
            if (tabEdit) {
                tabEdit.style.display = 'none';
            }

            const tabList = document.getElementById('tab-list');
            if (tabList) {
                tabList.click();
            }

            // 편집 인덱스 초기화
            this.app.adminUI.editingQuestionIndex = null;
        }
    }

    /**
     * 모든 이벤트 리스너 제거
     */
    destroy() {
        this.boundHandlers.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.boundHandlers.clear();
    }
}
