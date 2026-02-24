/**
 * 랜덤 문제 출제 프로그램 - Class 기반 리팩토링
 */

// ==================== 유틸리티 클래스 ====================
class Utils {
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static getTextWidth(text, font) {
        const canvas = Utils.getTextWidth.canvas || (Utils.getTextWidth.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }
}

// ==================== Question 클래스 ====================
class Question {
    constructor(data) {
        this.type = data.type; // 'multiple', 'subjective', 'sequence'
        this.subject = data.subject;
        this.question = data.question;
        this.index = data.index;

        // 타입별 속성
        if (this.type === 'multiple') {
            this.options = data.options;
            this.correctAnswer = data.correctAnswer;
        } else if (this.type === 'subjective') {
            this.correctAnswer = data.correctAnswer;
            this.alternativeAnswers = data.alternativeAnswers || [];
        } else if (this.type === 'sequence') {
            this.correctOrder = data.correctOrder;
        }

        this.deleted = data.deleted || false;
    }

    toJSON() {
        const base = {
            type: this.type,
            subject: this.subject,
            question: this.question
        };

        if (this.type === 'multiple') {
            return { ...base, options: this.options, correctAnswer: this.correctAnswer };
        } else if (this.type === 'subjective') {
            return { ...base, correctAnswer: this.correctAnswer, alternativeAnswers: this.alternativeAnswers };
        } else if (this.type === 'sequence') {
            return { ...base, correctOrder: this.correctOrder };
        }

        return base;
    }

    checkAnswer(userAnswer) {
        if (this.type === 'multiple') {
            return userAnswer === this.correctAnswer;
        } else if (this.type === 'subjective') {
            const normalized = userAnswer.trim().toLowerCase();
            return normalized === this.correctAnswer.trim().toLowerCase() ||
                   this.alternativeAnswers.some(alt => normalized === alt.trim().toLowerCase());
        } else if (this.type === 'sequence') {
            return JSON.stringify(userAnswer) === JSON.stringify(this.correctOrder);
        }
        return false;
    }
}

// ==================== QuestionBank 클래스 ====================
class QuestionBank {
    constructor() {
        this.questions = [];
        this.load();
    }

    add(questionData) {
        const question = new Question({ ...questionData, index: this.questions.length });
        this.questions.push(question);
        this.save();
        return question;
    }

    update(index, questionData) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index] = new Question({ ...questionData, index });
            this.save();
            return true;
        }
        return false;
    }

    delete(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index].deleted = true;
            this.save();
            return true;
        }
        return false;
    }

    restore(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index].deleted = false;
            this.save();
            return true;
        }
        return false;
    }

    getAll() {
        return this.questions.filter(q => !q.deleted);
    }

    getDeleted() {
        return this.questions.filter(q => q.deleted);
    }

    getBySubject(subject) {
        return this.questions.filter(q => !q.deleted && q.subject === subject);
    }

    getByType(type) {
        return this.questions.filter(q => !q.deleted && q.type === type);
    }

    save() {
        localStorage.setItem('questionBank', JSON.stringify(this.questions.map(q => q.toJSON())));
    }

    load() {
        const saved = localStorage.getItem('questionBank');
        if (saved) {
            const data = JSON.parse(saved);
            this.questions = data.map((q, index) => new Question({ ...q, index }));
        } else {
            // 기본 샘플 문제
            this.loadDefaultQuestions();
        }
    }

    loadDefaultQuestions() {
        const defaultQuestions = [
            {
                type: 'multiple',
                subject: '소프트웨어 설계 | 요구사항 확인',
                question: '요구사항 확인 과정에서 수행하는 작업은?',
                options: ['요구사항 도출', '요구사항 분석', '요구사항 명세', '요구사항 검증'],
                correctAnswer: 0
            },
            {
                type: 'multiple',
                subject: '소프트웨어 설계 | 화면 설계',
                question: '화면 설계 시 고려해야 할 사항은?',
                options: ['사용자 경험', '접근성', '반응형 디자인', '모든 항목'],
                correctAnswer: 3
            }
        ];

        defaultQuestions.forEach(q => this.add(q));
    }

    getStats() {
        const all = this.getAll();
        return {
            total: all.length,
            multiple: all.filter(q => q.type === 'multiple').length,
            subjective: all.filter(q => q.type === 'subjective').length,
            sequence: all.filter(q => q.type === 'sequence').length,
            deleted: this.getDeleted().length
        };
    }
}

// ==================== FeedbackUI 클래스 ====================
class FeedbackUI {
    constructor(resultElement) {
        this.resultElement = resultElement;
        this.iconElement = resultElement.querySelector('.result-icon');
        this.textElement = resultElement.querySelector('.result-text');
    }

    show(isCorrect, message = null) {
        this.resultElement.className = `result ${isCorrect ? 'result-correct' : 'result-wrong'} show`;

        if (this.iconElement) {
            this.iconElement.innerHTML = isCorrect
                ? '<i class="fas fa-check-circle"></i>'
                : '<i class="fas fa-times-circle"></i>';
        }

        if (this.textElement) {
            this.textElement.textContent = message || (isCorrect ? '정답입니다!' : '오답입니다');
        }
    }

    showHint(hintText) {
        if (this.iconElement) {
            this.iconElement.innerHTML = '<i class="fas fa-lightbulb"></i>';
        }
        if (this.textElement) {
            this.textElement.textContent = hintText;
        }
    }

    hide() {
        this.resultElement.className = 'result';
        if (this.iconElement) this.iconElement.innerHTML = '';
        if (this.textElement) this.textElement.textContent = '';
    }

    highlightCorrectOption(correctIndex) {
        const optionButtons = document.querySelectorAll('#question-content button');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === correctIndex) {
                btn.style.border = '3px solid #20B2AA';
                btn.style.backgroundColor = '#E0F7F5';
            }
        });
    }

    resetOptions() {
        const optionButtons = document.querySelectorAll('#question-content button');
        optionButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.border = '';
            btn.style.backgroundColor = '';
        });
    }
}

// ==================== Toast 알림 클래스 ====================
class ToastNotification {
    constructor(containerId = 'toast-container') {
        this.container = document.getElementById(containerId);
    }

    show(message, type = 'info', duration = 3000) {
        this.container.textContent = message;
        this.container.className = `toast show ${type}`;

        setTimeout(() => {
            this.container.classList.remove('show');
        }, duration);
    }
}

// ==================== Loading 표시 클래스 ====================
class LoadingIndicator {
    constructor(spinnerId = 'loading-spinner') {
        this.spinner = document.getElementById(spinnerId);
    }

    show() {
        if (this.spinner) this.spinner.style.display = 'flex';
    }

    hide() {
        if (this.spinner) this.spinner.style.display = 'none';
    }
}

// ==================== QuizUI 클래스 ====================
class QuizUI {
    constructor(questionBank, feedbackUI, toast) {
        this.questionBank = questionBank;
        this.feedbackUI = feedbackUI;
        this.toast = toast;

        this.currentQuestion = null;
        this.answeredQuestions = new Set();
        this.currentSubject = '';
        this.lastAnsweredTime = 0;

        this.questionElement = document.getElementById('question');
        this.questionContentElement = document.getElementById('question-content');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressText = document.querySelector('.progress-text');

        this.loadAnsweredQuestions();
    }

    loadAnsweredQuestions() {
        const saved = localStorage.getItem('answeredQuestions');
        if (saved) {
            this.answeredQuestions = new Set(JSON.parse(saved));
        }
    }

    saveAnsweredQuestions() {
        localStorage.setItem('answeredQuestions', JSON.stringify(Array.from(this.answeredQuestions)));
    }

    filterBySubject(subject) {
        this.currentSubject = subject;
        this.updateProgress();
    }

    generateQuestion() {
        const questions = this.currentSubject
            ? this.questionBank.getBySubject(this.currentSubject)
            : this.questionBank.getAll();

        const unanswered = questions.filter(q => !this.answeredQuestions.has(q.index));

        if (unanswered.length === 0) {
            // 문제가 아예 없는 경우
            if (questions.length === 0) {
                this.showNoQuestionsMessage();
            } else {
                // 모든 문제를 다 푼 경우
                this.showCompletionCelebration();
            }
            return;
        }

        const randomIndex = Math.floor(Math.random() * unanswered.length);
        this.currentQuestion = unanswered[randomIndex];

        this.displayQuestion();
        this.feedbackUI.hide();
    }

    displayQuestion() {
        if (!this.currentQuestion) return;

        this.questionElement.textContent = this.currentQuestion.question;
        this.questionContentElement.innerHTML = '';

        if (this.currentQuestion.type === 'multiple') {
            this.displayMultipleChoiceQuestion();
        } else if (this.currentQuestion.type === 'subjective') {
            this.displaySubjectiveQuestion();
        } else if (this.currentQuestion.type === 'sequence') {
            this.displaySequenceQuestion();
        }
    }

    displayMultipleChoiceQuestion() {
        const numberCircles = ['①', '②', '③', '④'];
        const shuffledOptions = Utils.shuffleArray(
            this.currentQuestion.options.map((text, index) => ({
                text,
                isCorrect: index === this.currentQuestion.correctAnswer
            }))
        );

        shuffledOptions.forEach((option, index) => {
            const button = document.createElement('button');
            const textSpan = document.createElement('span');
            textSpan.style.width = '100%';
            textSpan.style.textAlign = 'left';
            textSpan.textContent = `${numberCircles[index]} ${Utils.escapeHtml(option.text)}`;
            button.appendChild(textSpan);

            button.onclick = () => {
                if (!button.disabled) {
                    button.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        button.style.backgroundColor = '#f8f9fa';
                        this.checkAnswer(option.isCorrect);
                    }, 300);
                }
            };

            this.questionContentElement.appendChild(button);
        });
    }

    displaySubjectiveQuestion() {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'subjective-input';
        input.placeholder = '답을 입력하세요';

        const submitButton = document.createElement('button');
        submitButton.textContent = '정답 제출';
        submitButton.className = 'submit-button';

        const checkSubjectiveAnswer = () => {
            const userAnswer = input.value.trim();
            if (!userAnswer) {
                this.toast.show('답을 입력해주세요.', 'error');
                return;
            }
            this.checkAnswer(this.currentQuestion.checkAnswer(userAnswer));
        };

        submitButton.onclick = checkSubjectiveAnswer;
        input.onkeypress = (e) => {
            if (e.key === 'Enter') checkSubjectiveAnswer();
        };

        this.questionContentElement.appendChild(input);
        this.questionContentElement.appendChild(submitButton);
        input.focus();
    }

    displaySequenceQuestion() {
        const container = document.createElement('div');
        container.className = 'sequence-container';
        container.ondragover = (e) => e.preventDefault();
        container.ondrop = (e) => this.handleDrop(e, container);

        this.currentQuestion.correctOrder.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'sequence-item';
            div.draggable = true;
            div.textContent = item;
            div.ondragstart = (e) => e.dataTransfer.setData('text/plain', index);
            container.appendChild(div);
        });

        // 섞기
        const items = Array.from(container.children);
        Utils.shuffleArray(items).forEach(item => container.appendChild(item));

        const submitButton = document.createElement('button');
        submitButton.textContent = '정답 제출';
        submitButton.className = 'submit-button';
        submitButton.onclick = () => {
            const currentOrder = Array.from(container.children).map(item => item.textContent);
            this.checkAnswer(this.currentQuestion.checkAnswer(currentOrder));
        };

        this.questionContentElement.appendChild(container);
        this.questionContentElement.appendChild(submitButton);
    }

    handleDrop(e, container) {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const items = Array.from(container.children);
        const draggedItem = items[draggedIndex];

        const afterElement = this.getDragAfterElement(container, e.clientY);
        if (afterElement) {
            container.insertBefore(draggedItem, afterElement);
        } else {
            container.appendChild(draggedItem);
        }
    }

    getDragAfterElement(container, y) {
        const items = [...container.querySelectorAll('.sequence-item:not(.dragging)')];
        return items.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    checkAnswer(isCorrect) {
        const currentTime = Date.now();

        if (isCorrect && currentTime - this.lastAnsweredTime > 1000) {
            this.feedbackUI.show(true);
            this.lastAnsweredTime = currentTime;

            this.answeredQuestions.add(this.currentQuestion.index);
            this.saveAnsweredQuestions();
            this.updateProgress();

            const questions = this.currentSubject
                ? this.questionBank.getBySubject(this.currentSubject)
                : this.questionBank.getAll();

            const answeredCount = Array.from(this.answeredQuestions)
                .filter(index => {
                    const q = this.questionBank.questions[index];
                    return q && !q.deleted && (!this.currentSubject || q.subject === this.currentSubject);
                }).length;

            if (answeredCount >= questions.length) {
                setTimeout(() => {
                    this.showCompletionCelebration();
                }, 1000);
            } else {
                setTimeout(() => {
                    this.currentQuestion = null;
                    this.generateQuestion();
                }, 1000);
            }
        } else if (!isCorrect) {
            this.feedbackUI.show(false);

            if (this.currentQuestion.type === 'multiple') {
                const correctIndex = this.currentQuestion.correctAnswer;
                this.feedbackUI.highlightCorrectOption(correctIndex);

                setTimeout(() => {
                    this.feedbackUI.showHint(`정답: ${correctIndex + 1}번`);
                }, 1500);
            } else if (this.currentQuestion.type === 'sequence') {
                setTimeout(() => {
                    this.feedbackUI.showHint(`정답 순서: ${this.currentQuestion.correctOrder.join(' → ')}`);
                }, 1500);
            }

            setTimeout(() => {
                this.feedbackUI.hide();
                this.feedbackUI.resetOptions();
            }, 3000);
        }
    }

    updateProgress() {
        const questions = this.currentSubject
            ? this.questionBank.getBySubject(this.currentSubject)
            : this.questionBank.getAll();

        const answeredCount = Array.from(this.answeredQuestions)
            .filter(index => {
                const q = this.questionBank.questions[index];
                return q && !q.deleted && (!this.currentSubject || q.subject === this.currentSubject);
            }).length;

        const percentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }

        if (this.progressText) {
            this.progressText.textContent = `진행 상황: ${answeredCount}/${questions.length}`;
        }
    }

    showNoQuestionsMessage() {
        this.questionElement.textContent = '등록된 문제가 없습니다.';
        this.questionContentElement.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 18px; margin-bottom: 20px; color: #666;">문제를 등록해주세요.</p>
                <a href="admin.html" style="display: inline-block; padding: 12px 24px; font-size: 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    문제 등록하러 가기
                </a>
            </div>
        `;
    }

    showCompletionCelebration() {
        this.questionElement.textContent = '축하합니다! 🎉';
        this.questionContentElement.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 20px; margin-bottom: 20px;">모든 문제를 완료하셨습니다!</p>
                <p style="margin-bottom: 30px;">훌륭한 성취를 이루어냈어요!</p>
                <button onclick="app.quizUI.restartQuiz()" style="padding: 12px 24px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    다시 시작하기
                </button>
            </div>
        `;

        // 축하 애니메이션
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                document.body.appendChild(confetti);

                const animation = confetti.animate([
                    { transform: 'translateY(0px)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: 3000 + Math.random() * 2000,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                });

                animation.onfinish = () => confetti.remove();
            }, i * 30);
        }
    }

    restartQuiz() {
        this.answeredQuestions.clear();
        this.saveAnsweredQuestions();
        this.currentQuestion = null;
        this.updateProgress();
        this.generateQuestion();
        this.toast.show('문제를 다시 시작합니다!', 'success');
    }
}

// ==================== AdminUI 클래스 ====================
class AdminUI {
    constructor(questionBank, toast) {
        this.questionBank = questionBank;
        this.toast = toast;
        this.editingIndex = null;

        this.initializeEventListeners();
        this.updateQuestionList();
    }

    initializeEventListeners() {
        // 객관식 문제 등록
        document.getElementById('multipleChoiceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMultipleChoiceQuestion();
        });

        // 주관식 문제 등록
        document.getElementById('subjectiveForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubjectiveQuestion();
        });

        // 순서 나열 문제 등록
        document.getElementById('sequenceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSequenceQuestion();
        });

        // 문제 목록 필터
        document.querySelectorAll('[data-filter-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.filterType;
                this.filterQuestions(type);
            });
        });
    }

    addMultipleChoiceQuestion() {
        const subject = document.getElementById('mcSubject').value.trim();
        const question = document.getElementById('mcQuestion').value;
        const options = [
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
            document.getElementById('option4').value
        ];
        const correctAnswer = parseInt(document.getElementById('mcCorrectAnswer').value) - 1;

        if (!subject || !question || options.some(opt => !opt) || isNaN(correctAnswer)) {
            this.toast.show('모든 필드를 입력해주세요.', 'error');
            return;
        }

        this.questionBank.add({
            type: 'multiple',
            subject,
            question,
            options,
            correctAnswer
        });

        document.getElementById('multipleChoiceForm').reset();
        this.toast.show('객관식 문제가 등록되었습니다!', 'success');
        this.updateQuestionList();
    }

    addSubjectiveQuestion() {
        const subject = document.getElementById('sjSubject').value.trim();
        const question = document.getElementById('sjQuestion').value;
        const correctAnswer = document.getElementById('sjCorrectAnswer').value.trim();
        const altAnswers = Array.from(document.querySelectorAll('.alternative-answer'))
            .map(input => input.value.trim())
            .filter(v => v);

        if (!subject || !question || !correctAnswer) {
            this.toast.show('필수 필드를 입력해주세요.', 'error');
            return;
        }

        this.questionBank.add({
            type: 'subjective',
            subject,
            question,
            correctAnswer,
            alternativeAnswers: altAnswers
        });

        document.getElementById('subjectiveForm').reset();
        this.toast.show('주관식 문제가 등록되었습니다!', 'success');
        this.updateQuestionList();
    }

    addSequenceQuestion() {
        const subject = document.getElementById('seqSubject').value.trim();
        const question = document.getElementById('seqQuestion').value;
        const items = Array.from(document.querySelectorAll('.sequence-form-item input'))
            .map(input => input.value.trim())
            .filter(v => v);

        if (!subject || !question || items.length < 2) {
            this.toast.show('최소 2개 이상의 항목이 필요합니다.', 'error');
            return;
        }

        this.questionBank.add({
            type: 'sequence',
            subject,
            question,
            correctOrder: items
        });

        document.getElementById('sequenceForm').reset();
        this.toast.show('순서 나열 문제가 등록되었습니다!', 'success');
        this.updateQuestionList();
    }

    updateQuestionList(filterType = 'all', subjectFilter = '') {
        let questions = this.questionBank.getAll();

        if (filterType !== 'all') {
            questions = questions.filter(q => q.type === filterType);
        }

        if (subjectFilter) {
            questions = questions.filter(q => q.subject.includes(subjectFilter));
        }

        const listElement = document.getElementById('question-list');
        if (!listElement) return;

        listElement.innerHTML = '';

        questions.forEach((question, index) => {
            const div = document.createElement('div');
            div.className = 'question-item';
            div.innerHTML = `
                <div>
                    <strong>[${question.type === 'multiple' ? '객관식' : question.type === 'subjective' ? '주관식' : '순서나열'}]</strong>
                    ${question.subject} - ${question.question.substring(0, 50)}${question.question.length > 50 ? '...' : ''}
                </div>
                <div>
                    <button onclick="app.adminUI.editQuestion(${question.index})">수정</button>
                    <button onclick="app.adminUI.deleteQuestion(${question.index})" style="background-color: #f44336;">삭제</button>
                </div>
            `;
            listElement.appendChild(div);
        });

        this.updateStats();
    }

    editQuestion(index) {
        // 수정 기능 (기존 코드 참조)
        this.toast.show('수정 기능은 구현 예정입니다.', 'info');
    }

    deleteQuestion(index) {
        if (confirm('정말로 이 문제를 삭제하시겠습니까?')) {
            this.questionBank.delete(index);
            this.toast.show('문제가 삭제되었습니다.', 'success');
            this.updateQuestionList();
        }
    }

    filterQuestions(type) {
        this.updateQuestionList(type);
    }

    updateStats() {
        const stats = this.questionBank.getStats();
        const statsElement = document.getElementById('question-stats');
        if (statsElement) {
            statsElement.innerHTML = `
                전체: ${stats.total} |
                객관식: ${stats.multiple} |
                주관식: ${stats.subjective} |
                순서: ${stats.sequence}
            `;
        }
    }

    switchQuestionType(type) {
        // 모든 폼 숨기기
        document.querySelectorAll('.form-toggle').forEach(form => form.classList.remove('active'));

        // 모든 버튼의 active 클래스 제거
        document.querySelectorAll('.question-type-select .tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '#e9ecef';
            btn.style.color = '#333';
        });

        // 선택된 버튼에 active 클래스 추가 및 스타일 적용
        const selectedBtn = document.querySelector(`[onclick="toggleQuestionType('${type}')"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            selectedBtn.style.backgroundColor = '#007bff';
            selectedBtn.style.color = 'white';
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

    filterAndDisplayQuestions(type) {
        console.log('filterAndDisplayQuestions called with type:', type);

        const allFilterButtons = document.querySelectorAll('#list-section .subject-filters .filter-btn');
        const selectedBtn = document.querySelector(`#list-section .subject-filters .filter-btn[onclick="filterQuestions('${type}')"]`);

        if (!selectedBtn) {
            console.log('Selected button not found for type:', type);
            return;
        }

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
        selectedBtn.style.display = 'inline-block';
        selectedBtn.style.visibility = 'visible';
        selectedBtn.style.opacity = '1';
        selectedBtn.style.backgroundColor = '#4CAF50';
        selectedBtn.style.color = 'white';
        selectedBtn.style.transform = 'translateY(-1px)';
        selectedBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

        // 문제 필터링
        let filteredQuestions = this.questionBank.getAll();

        if (type === 'multiple' || type === 'subjective' || type === 'sequence') {
            filteredQuestions = filteredQuestions.filter(q => q.type === type);
        }

        // 문제 목록 표시
        const listElement = document.getElementById('question-list');
        if (!listElement) return;

        listElement.innerHTML = '';

        if (filteredQuestions.length === 0) {
            listElement.innerHTML = '<div class="no-questions">등록된 문제가 없습니다.</div>';
            return;
        }

        filteredQuestions.forEach((question, index) => {
            const div = document.createElement('div');
            div.className = 'question-item';
            div.innerHTML = `
                <div>
                    <strong>[${question.type === 'multiple' ? '객관식' : question.type === 'subjective' ? '주관식' : '순서나열'}]</strong>
                    ${question.subject} - ${question.question.substring(0, 50)}${question.question.length > 50 ? '...' : ''}
                </div>
                <div>
                    <button onclick="app.adminUI.editQuestion(${question.index})">수정</button>
                    <button onclick="app.adminUI.deleteQuestion(${question.index})" style="background-color: #f44336;">삭제</button>
                </div>
            `;
            listElement.appendChild(div);
        });
    }
}

// ==================== TabManager 클래스 ====================
class TabManager {
    constructor() {
        this.currentTab = 'solve';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);
            });
        });
    }

    showTab(tabName) {
        this.switchTab(tabName);
    }

    switchTab(tabName) {
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 선택된 탭 버튼 활성화
        const selectedTabBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        if (selectedTabBtn) {
            selectedTabBtn.classList.add('active');
        }

        // ARIA 속성 업데이트
        document.querySelectorAll('.tab-buttons .tab-btn').forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
        });
        const activeTabBtn = document.getElementById('tab-' + tabName);
        if (activeTabBtn) {
            activeTabBtn.setAttribute('aria-selected', 'true');
        }

        // 모든 섹션 숨기기
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'none';
        document.getElementById('edit-section').style.display = 'none';
        document.getElementById('list-section').style.display = 'none';
        const settingsSection = document.getElementById('settings-section');
        if (settingsSection) {
            settingsSection.style.display = 'none';
        }

        // 선택된 섹션 표시
        if (tabName === 'quiz') {
            const quizSection = document.getElementById('quiz-section');
            quizSection.style.display = 'flex';
        } else if (tabName === 'admin') {
            document.getElementById('admin-section').style.display = 'block';
            if (app && app.adminUI) {
                app.adminUI.switchQuestionType('multiple');
            }
        } else if (tabName === 'edit') {
            document.getElementById('edit-section').style.display = 'block';
        } else if (tabName === 'list') {
            document.getElementById('list-section').style.display = 'block';
            if (app && app.adminUI) {
                app.adminUI.filterAndDisplayQuestions('all');
            }
        } else if (tabName === 'settings') {
            if (settingsSection) {
                settingsSection.style.display = 'block';
            }
        }

        this.currentTab = tabName;
    }
}

// ==================== App 클래스 (진입점) ====================
class App {
    constructor() {
        this.questionBank = new QuestionBank();
        this.toast = new ToastNotification();
        this.loading = new LoadingIndicator();
        this.feedbackUI = new FeedbackUI(document.getElementById('result'));
        this.quizUI = new QuizUI(this.questionBank, this.feedbackUI, this.toast);
        this.adminUI = new AdminUI(this.questionBank, this.toast);
        this.tabManager = new TabManager();

        this.init();
    }

    init() {
        // 과목 드롭다운 동적 업데이트
        this.updateSubjectDropdown();

        // 과목 필터 설정
        const subjectFilter = document.getElementById('subjectDropdown');
        if (subjectFilter) {
            subjectFilter.addEventListener('change', (e) => {
                const subject = e.target.value;
                this.quizUI.filterBySubject(subject);
                this.quizUI.generateQuestion();
            });
        }

        console.log('Quiz App 초기화 완료');

        // Rev1과 동일하게 초기에는 문제를 표시하지 않음
        // "문제가 여기에 표시됩니다." 메시지만 표시
    }

    updateSubjectDropdown() {
        const dropdown = document.getElementById('subjectDropdown');
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
}

// ==================== 전역 함수 (HTML onclick과의 호환성) ====================
function showTab(tabName) {
    if (app && app.tabManager) {
        app.tabManager.switchTab(tabName);
    }
}

function toggleQuestionType(type) {
    if (app && app.adminUI) {
        app.adminUI.switchQuestionType(type);
    }
}

function addSequenceItem() {
    const container = document.getElementById('sequenceItems');
    if (!container) return;

    const itemCount = container.children.length;
    const newItem = document.createElement('div');
    newItem.className = 'sequence-item';
    newItem.innerHTML = `
        <input type="text" class="sequence-input" name="sequence-item-${itemCount + 1}" placeholder="순서 ${itemCount + 1}" required>
        ${itemCount >= 2 ? '<button type="button" class="delete-btn" onclick="removeSequenceItem(this)"><i class="fas fa-times"></i></button>' : ''}
    `;
    container.appendChild(newItem);
}

function removeSequenceItem(button) {
    const item = button.parentElement;
    const container = item.parentElement;

    if (container.children.length <= 3) {
        if (app && app.toast) {
            app.toast.show('최소 3개의 항목이 필요합니다.', 'error');
        }
        return;
    }

    container.removeChild(item);
}

function addEditSequenceItem() {
    const container = document.getElementById('editSequenceItems');
    if (!container) return;

    const itemCount = container.children.length;
    const newItem = document.createElement('div');
    newItem.className = 'sequence-item';
    newItem.innerHTML = `
        <input type="text" class="sequence-input" name="edit-sequence-item-${itemCount + 1}" placeholder="순서 ${itemCount + 1}" required>
        ${itemCount >= 2 ? '<button type="button" class="delete-btn" onclick="removeEditSequenceItem(this)"><i class="fas fa-times"></i></button>' : ''}
    `;
    container.appendChild(newItem);
}

function removeEditSequenceItem(button) {
    const item = button.parentElement;
    const container = item.parentElement;

    if (container.children.length <= 3) {
        if (app && app.toast) {
            app.toast.show('최소 3개의 항목이 필요합니다.', 'error');
        }
        return;
    }

    container.removeChild(item);
}

function filterQuestions(type) {
    if (app && app.adminUI) {
        app.adminUI.filterAndDisplayQuestions(type);
    }
}

function deleteAllQuestions() {
    if (!confirm('정말로 모든 문제를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        return;
    }

    if (app && app.questionBank) {
        localStorage.removeItem('questionBank');
        localStorage.removeItem('answeredQuestions');
        app.questionBank.questions = [];
        if (app.toast) {
            app.toast.show('모든 문제가 삭제되었습니다.', 'success');
        }
        if (app.adminUI) {
            app.adminUI.filterAndDisplayQuestions('all');
        }
    }
}

function saveSettings() {
    if (app && app.toast) {
        app.toast.show('설정이 저장되었습니다.', 'success');
    }
}

function showToast(message, type = 'info', duration = 3000) {
    if (app && app.toast) {
        app.toast.show(message, type);
    }
}

function filterQuizBySubject(subject) {
    if (app && app.quizUI) {
        app.quizUI.filterBySubject(subject);
        app.quizUI.generateQuestion();
    }
}

// ==================== 앱 시작 ====================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});

