/**
 * AdminUI 클래스
 * 관리자 화면 (문제 등록/수정/삭제) UI를 관리
 */

import { AppConstants } from './constants/AppConstants.js';
import { domCache } from './utils/DOMCache.js';

export class AdminUI {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {ToastNotification} toast - Toast 알림 관리자
     */
    constructor(questionBank, toast) {
        this.questionBank = questionBank;
        this.toast = toast;
        this.editingIndex = null;

        this.initializeEventListeners();
        this.updateQuestionList();
    }

    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
        // 객관식 문제 등록
        const multipleChoiceForm = domCache.get('mcForm');
        if (multipleChoiceForm) {
            multipleChoiceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMultipleChoiceQuestion();
            });
        }

        // 주관식 문제 등록
        const subjectiveForm = domCache.get('subForm');
        if (subjectiveForm) {
            subjectiveForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addSubjectiveQuestion();
            });
        }

        // 순서 나열 문제 등록
        const sequenceForm = domCache.get('seqForm');
        if (sequenceForm) {
            sequenceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addSequenceQuestion();
            });
        }

        // 과목 선택 드롭다운 이벤트 (직접 입력 기능)
        this.initializeSubjectSelectors();

        // 엔터 키로 폼 제출 (텍스트 입력 필드)
        this.initializeEnterKeySubmit();

        // 모든 문제 삭제 버튼
        const deleteAllBtn = document.querySelector('.delete-all-btn');
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', () => {
                this.deleteAllQuestions();
            });
        }
    }

    /**
     * 엔터 키로 폼 제출 활성화
     */
    initializeEnterKeySubmit() {
        // 객관식 정답 번호 입력
        const mcCorrectAnswer = domCache.get('mcCorrectAnswer');
        if (mcCorrectAnswer) {
            mcCorrectAnswer.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const form = domCache.get('mcForm');
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            });
        }

        // 주관식 정답 입력
        const subCorrectAnswer = domCache.get('subCorrectAnswer');
        if (subCorrectAnswer) {
            subCorrectAnswer.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const form = domCache.get('subForm');
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            });
        }
    }

    /**
     * 과목 선택 드롭다운 초기화 (직접 입력 기능)
     */
    initializeSubjectSelectors() {
        const subjectSelectors = [
            { select: 'mcSubject', input: 'mcSubjectCustom', wrapper: 'mcSubjectCustomWrapper', clear: 'mcSubjectClear' },
            { select: 'subSubject', input: 'subSubjectCustom', wrapper: 'subSubjectCustomWrapper', clear: 'subSubjectClear' },
            { select: 'seqSubject', input: 'seqSubjectCustom', wrapper: 'seqSubjectCustomWrapper', clear: 'seqSubjectClear' }
        ];

        subjectSelectors.forEach(({ select, input, wrapper, clear }) => {
            const selectElement = document.getElementById(select);
            const wrapperElement = document.getElementById(wrapper);
            const inputElement = document.getElementById(input);
            const clearButton = document.getElementById(clear);

            if (selectElement && wrapperElement && inputElement && clearButton) {
                // 드롭다운 변경 이벤트
                selectElement.addEventListener('change', (e) => {
                    if (e.target.value === 'custom') {
                        wrapperElement.style.display = 'flex';
                        inputElement.required = true;
                        selectElement.required = false;
                        inputElement.focus();
                    } else {
                        wrapperElement.style.display = 'none';
                        inputElement.required = false;
                        selectElement.required = true;
                        inputElement.value = '';
                    }
                });

                // 삭제 버튼 클릭 이벤트
                clearButton.addEventListener('click', () => {
                    selectElement.value = '';
                    wrapperElement.style.display = 'none';
                    inputElement.value = '';
                    inputElement.required = false;
                    selectElement.required = true;
                });
            }
        });
    }

    /**
     * 커스텀 과목 입력 필드 초기화
     */
    resetCustomSubjectInput(wrapperId) {
        const wrapperElement = document.getElementById(wrapperId);
        if (wrapperElement) {
            wrapperElement.style.display = 'none';
            const inputElement = wrapperElement.querySelector('input');
            if (inputElement) {
                inputElement.value = '';
                inputElement.required = false;
            }
        }
    }

    /**
     * 커스텀 과목을 localStorage에 저장하고 드롭다운에 추가
     */
    saveCustomSubject(subject) {
        if (!subject) return;

        // 저장된 커스텀 과목 가져오기
        const savedSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');

        // 이미 존재하면 추가하지 않음
        if (savedSubjects.includes(subject)) return;

        // 새 과목 추가
        savedSubjects.push(subject);
        localStorage.setItem('customSubjects', JSON.stringify(savedSubjects));

        // 드롭다운 업데이트
        if (typeof window.updateAllSubjectDropdowns === 'function') {
            window.updateAllSubjectDropdowns();
        }
    }

    /**
     * 객관식 문제 추가
     */
    async addMultipleChoiceQuestion() {
        const subjectSelect = domCache.get('mcSubject');
        const subjectCustom = document.getElementById('mcSubjectCustom');
        const subject = (subjectSelect?.value === 'custom' ? subjectCustom?.value : subjectSelect?.value)?.trim();
        const question = domCache.get('mcQuestion')?.value;
        const options = [
            domCache.getOption(1)?.value,
            domCache.getOption(2)?.value,
            domCache.getOption(3)?.value,
            domCache.getOption(4)?.value
        ];
        const correctAnswer = parseInt(domCache.get('mcCorrectAnswer')?.value) - 1;

        if (!subject || !question || options.some(opt => !opt) || isNaN(correctAnswer)) {
            this.toast.show(AppConstants.ERROR_MESSAGES.REQUIRED_FIELDS, AppConstants.NOTIFICATION_TYPES.ERROR);
            return;
        }

        // 커스텀 과목인 경우 저장
        if (subjectSelect?.value === 'custom') {
            this.saveCustomSubject(subject);
        }

        await this.questionBank.add({
            type: AppConstants.QUESTION_TYPES.MULTIPLE,
            subject,
            question,
            options,
            correctAnswer
        });

        domCache.get('mcForm')?.reset();
        this.resetCustomSubjectInput('mcSubjectCustomWrapper');
        this.toast.show('문제가 등록되었습니다.', AppConstants.NOTIFICATION_TYPES.SUCCESS);
        this.updateQuestionList();
    }

    /**
     * 주관식 문제 추가
     */
    async addSubjectiveQuestion() {
        const subjectSelect = domCache.get('subSubject');
        const subjectCustom = document.getElementById('subSubjectCustom');
        const subject = (subjectSelect?.value === 'custom' ? subjectCustom?.value : subjectSelect?.value)?.trim();
        const question = domCache.get('subQuestion')?.value;
        const correctAnswer = domCache.get('subCorrectAnswer')?.value.trim();
        const altAnswers = Array.from(document.querySelectorAll('.alternative-answer input'))
            .map(input => input.value.trim())
            .filter(v => v);

        if (!subject || !question || !correctAnswer) {
            this.toast.show(AppConstants.ERROR_MESSAGES.REQUIRED_FIELDS, AppConstants.NOTIFICATION_TYPES.ERROR);
            return;
        }

        // 커스텀 과목인 경우 저장
        if (subjectSelect?.value === 'custom') {
            this.saveCustomSubject(subject);
        }

        await this.questionBank.add({
            type: AppConstants.QUESTION_TYPES.SUBJECTIVE,
            subject,
            question,
            correctAnswer,
            alternativeAnswers: altAnswers
        });

        domCache.get('subForm')?.reset();
        this.resetCustomSubjectInput('subSubjectCustomWrapper');
        this.toast.show('문제가 등록되었습니다.', AppConstants.NOTIFICATION_TYPES.SUCCESS);
        this.updateQuestionList();
    }

    /**
     * 순서 나열 문제 추가
     */
    async addSequenceQuestion() {
        const subjectSelect = domCache.get('seqSubject');
        const subjectCustom = document.getElementById('seqSubjectCustom');
        const subject = (subjectSelect?.value === 'custom' ? subjectCustom?.value : subjectSelect?.value)?.trim();
        const question = domCache.get('seqQuestion')?.value;
        const seqItems = domCache.get('seqItems');
        const items = seqItems ? Array.from(seqItems.querySelectorAll('.sequence-input'))
            .map(input => input.value.trim())
            .filter(v => v) : [];

        if (!subject || !question || items.length < AppConstants.SEQUENCE_MIN_ITEMS) {
            this.toast.show('최소 2개 이상의 항목이 필요합니다.', AppConstants.NOTIFICATION_TYPES.ERROR);
            return;
        }

        // 커스텀 과목인 경우 저장
        if (subjectSelect?.value === 'custom') {
            this.saveCustomSubject(subject);
        }

        await this.questionBank.add({
            type: AppConstants.QUESTION_TYPES.SEQUENCE,
            subject,
            question,
            correctOrder: items
        });

        domCache.get('seqForm')?.reset();
        this.resetCustomSubjectInput('seqSubjectCustomWrapper');
        this.toast.show('문제가 등록되었습니다.', AppConstants.NOTIFICATION_TYPES.SUCCESS);
        this.updateQuestionList();
    }

    /**
     * 문제 목록 업데이트
     * @param {string} filterType - 필터 타입 ('all', 'multiple', 'subjective', 'sequence')
     * @param {string} subjectFilter - 과목 필터
     */
    updateQuestionList(filterType = 'all', subjectFilter = '', textFilter = '') {
        let questions = this.questionBank.getAll();

        if (filterType !== 'all') {
            questions = questions.filter(q => q.type === filterType);
        }

        if (subjectFilter) {
            questions = questions.filter(q => q.subject.includes(subjectFilter));
        }

        if (textFilter) {
            const keyword = textFilter.toLowerCase();
            questions = questions.filter(q => q.question.toLowerCase().includes(keyword));
        }

        const listElement = document.getElementById('questionList');
        if (!listElement) return;

        listElement.innerHTML = '';

        if (questions.length === 0) {
            listElement.innerHTML = '<div class="no-questions">등록된 문제가 없습니다.</div>';
            return;
        }

        questions.forEach((question) => {
            const questionItem = this.createQuestionListItem(question);
            listElement.appendChild(questionItem);
        });

        this.updateStats();
    }

    /**
     * 문제 목록 아이템 생성
     * @param {Question} question - 문제 객체
     * @returns {HTMLElement} 문제 아이템 요소
     */
    createQuestionListItem(question) {
        const div = document.createElement('div');
        div.className = 'question-item';

        const typeLabels = {
            'multiple': '객관식',
            'subjective': '주관식',
            'sequence': '순서나열'
        };

        const questionPreview = (question.question || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

        // 정답 표시
        let answerDisplay = '';
        if (question.type === 'multiple' && question.options) {
            const correctOptionText = question.options[Number(question.correctAnswer)];
            answerDisplay = `<span class="answer-info">정답: ${correctOptionText || ''}</span>`;
        } else if (question.type === 'subjective' && question.correctAnswer) {
            answerDisplay = `<span class="answer-info">정답: ${question.correctAnswer}</span>`;
        } else if (question.type === 'sequence' && question.correctOrder) {
            answerDisplay = `<span class="answer-info">정답: ${question.correctOrder.join(' → ')}</span>`;
        }

        div.innerHTML = `
            <div class="question-header">
                <div class="question-info">
                    <span class="question-type-label">${typeLabels[question.type]}</span>
                    <span class="question-number">#${question.index + 1}</span>
                </div>
                <div class="question-actions">
                    <button class="edit-btn" onclick="app.adminUI.editQuestion(${question.index})" aria-label="문제 수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="app.adminUI.deleteQuestion(${question.index})" aria-label="문제 삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="question-content">
                <p><strong>${question.subject}</strong></p>
                <p>${questionPreview}</p>
                <p style="margin-top: 8px; color: #4caf50; font-weight: bold;">${answerDisplay}</p>
            </div>
        `;

        return div;
    }

    /**
     * 문제 수정
     * @param {number} index - 문제 인덱스
     */
    editQuestion(index) {
        const question = this.questionBank.questions[index];
        if (!question || question.deleted) {
            this.toast.show('문제를 찾을 수 없습니다.', 'error');
            return;
        }

        // list.html에서 호출된 경우 admin.html로 이동
        if (!document.getElementById('tab-edit')) {
            sessionStorage.setItem('editQuestionIndex', index);
            window.location.href = 'admin.html';
            return;
        }

        // 수정 중인 문제 인덱스 저장
        this.editingQuestionIndex = index;

        // 수정 탭으로 전환
        if (typeof window.switchAdminTab === 'function') {
            window.switchAdminTab('edit');
        }

        // 문제 유형에 따라 폼 전환
        if (typeof window.switchEditQuestionType === 'function') {
            window.switchEditQuestionType(question.type);
        }

        // 과목 드롭다운 헬퍼: 옵션 추가 후 선택
        const setSubjectSelect = (selectId, subject) => {
            const select = document.getElementById(selectId);
            if (!select) return;
            // 해당 과목 옵션이 없으면 추가
            if (subject && !Array.from(select.options).some(o => o.value === subject)) {
                const opt = document.createElement('option');
                opt.value = subject;
                opt.textContent = subject;
                select.appendChild(opt);
            }
            select.value = subject || '';
        };

        // 폼에 데이터 채우기
        if (question.type === 'multiple') {
            setSubjectSelect('editMcSubject', question.subject);
            document.getElementById('editMcQuestion').value = question.question || '';
            document.getElementById('editOption1').value = question.options[0] || '';
            document.getElementById('editOption2').value = question.options[1] || '';
            document.getElementById('editOption3').value = question.options[2] || '';
            document.getElementById('editOption4').value = question.options[3] || '';
            document.getElementById('editMcCorrectAnswer').value = (Number(question.correctAnswer) + 1) || '';
        } else if (question.type === 'subjective') {
            setSubjectSelect('editSubSubject', question.subject);
            document.getElementById('editSubQuestion').value = question.question || '';
            document.getElementById('editSubCorrectAnswer').value = question.correctAnswer || '';
        } else if (question.type === 'sequence') {
            setSubjectSelect('editSeqSubject', question.subject);
            document.getElementById('editSeqQuestion').value = question.question || '';

            // 순서 나열 항목 설정
            const container = document.getElementById('editSequenceItems');
            container.innerHTML = '';
            question.correctOrder.forEach((item, i) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'sequence-item';
                itemDiv.innerHTML = `
                    <input type="text" class="sequence-input" name="edit-sequence-item-${i + 1}" placeholder="순서 ${i + 1}" value="${item}" required>
                `;
                container.appendChild(itemDiv);
            });
        }

        this.toast.show('문제를 수정할 수 있습니다.', 'info');
    }

    /**
     * 문제 삭제
     * @param {number} index - 문제 인덱스
     */
    async deleteQuestion(index) {
        if (confirm('정말로 이 문제를 삭제하시겠습니까?')) {
            await this.questionBank.delete(index);

            this.toast.show('문제가 삭제되었습니다.', 'success');
            this.updateQuestionList();
        }
    }

    /**
     * 모든 문제 삭제 (휴지통으로 이동)
     */
    async deleteAllQuestions() {
        const totalQuestions = this.questionBank.getAll().length;

        if (totalQuestions === 0) {
            this.toast.show('삭제할 문제가 없습니다.', 'info');
            return;
        }

        const confirmMessage = `정말로 모든 문제 ${totalQuestions}개를 삭제하시겠습니까?\n삭제된 문제는 "삭제된 문제" 탭에서 복원할 수 있습니다.`;

        if (confirm(confirmMessage)) {
            const success = await this.questionBank.deleteAllQuestions();

            if (success) {
                this.toast.show(`모든 문제가 휴지통으로 이동되었습니다.`, 'success');

                // 삭제된 문제 페이지로 이동
                setTimeout(() => {
                    window.location.href = 'deleted.html';
                }, 1500);
            } else {
                this.toast.show('문제 삭제 중 오류가 발생했습니다.', 'error');
            }
        }
    }

    /**
     * 문제 필터링 및 표시
     * @param {string} type - 필터 타입
     */
    filterAndDisplayQuestions(type) {
        const allFilterButtons = document.querySelectorAll('#list-section .subject-filters .filter-btn');
        const typeOrder = ['all', 'multiple', 'subjective', 'sequence'];
        const idx = typeOrder.indexOf(type);
        const selectedBtn = idx >= 0 ? allFilterButtons[idx] : null;

        if (!selectedBtn) return;

        // 모든 버튼 비활성화
        allFilterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });

        // 선택된 버튼 활성화
        selectedBtn.classList.add('active');
        selectedBtn.style.backgroundColor = '#4CAF50';
        selectedBtn.style.color = 'white';
        selectedBtn.style.transform = 'translateY(-1px)';
        selectedBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

        // 문제 필터링
        const searchInput = document.getElementById('questionSearchInput');
        const textFilter = searchInput ? searchInput.value.trim() : '';
        this.updateQuestionList(type === 'all' ? 'all' : type, '', textFilter);
    }

    /**
     * 통계 업데이트
     */
    updateStats() {
        const stats = this.questionBank.getStats();

        const statAll = document.getElementById('statAll');
        const statMultiple = document.getElementById('statMultiple');
        const statSubjective = document.getElementById('statSubjective');
        const statSequence = document.getElementById('statSequence');

        if (statAll) statAll.textContent = stats.total;
        if (statMultiple) statMultiple.textContent = stats.multiple;
        if (statSubjective) statSubjective.textContent = stats.subjective;
        if (statSequence) statSequence.textContent = stats.sequence;
    }

    /**
     * 문제 유형 전환
     * @param {string} type - 문제 유형
     */
    switchQuestionType(type) {
        // 모든 폼 숨기기
        document.querySelectorAll('.form-toggle').forEach(form => form.classList.remove('active'));

        // 모든 버튼의 active 클래스 제거 및 inline style 제거
        document.querySelectorAll('.question-type-select .tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
            btn.style.color = '';
        });

        // 선택된 버튼에 active 클래스 추가 (inline style 제거)
        const selectedBtn = document.querySelector(`[onclick="toggleQuestionType('${type}')"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            selectedBtn.style.backgroundColor = '';
            selectedBtn.style.color = '';
        }

        // 해당하는 폼 표시
        if (type === 'multiple') {
            document.getElementById('multipleChoiceForm')?.classList.add('active');
        } else if (type === 'subjective') {
            document.getElementById('subjectiveForm')?.classList.add('active');
        } else {
            document.getElementById('sequenceForm')?.classList.add('active');
        }
    }
}
