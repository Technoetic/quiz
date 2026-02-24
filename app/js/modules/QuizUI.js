/**
 * QuizUI 클래스
 * 퀴즈 화면 UI를 관리
 */

import { MultipleChoiceRenderer } from './renderers/MultipleChoiceRenderer.js';
import { SubjectiveRenderer } from './renderers/SubjectiveRenderer.js';
import { SequenceRenderer } from './renderers/SequenceRenderer.js';
import { ProgressTracker } from './ProgressTracker.js';
import { CompletionCelebration } from './CompletionCelebration.js';
import { AnimationController } from './utils/AnimationController.js';
import { AppConstants } from './constants/AppConstants.js';
import { domCache } from './utils/DOMCache.js';

export class QuizUI {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {FeedbackUI} feedbackUI - 피드백 UI 관리자
     * @param {ToastNotification} toast - Toast 알림 관리자
     */
    constructor(questionBank, feedbackUI, toast) {
        this.questionBank = questionBank;
        this.feedbackUI = feedbackUI;
        this.toast = toast;

        this.currentQuestion = null;
        this.currentSubject = '';
        this.lastAnsweredTime = 0;

        this.questionElement = domCache.get('question');
        this.questionContentElement = domCache.get('questionContent');

        // 렌더러 초기화
        this.renderers = {
            [AppConstants.QUESTION_TYPES.MULTIPLE]: new MultipleChoiceRenderer(),
            [AppConstants.QUESTION_TYPES.SUBJECTIVE]: new SubjectiveRenderer(),
            [AppConstants.QUESTION_TYPES.SEQUENCE]: new SequenceRenderer()
        };

        // 진행률 추적기 초기화
        const progressFill = domCache.get('progressFill');
        const progressText = domCache.get('progressText');
        this.progressTracker = new ProgressTracker(progressFill, progressText);

        // 완료 축하 핸들러 초기화
        this.completionCelebration = new CompletionCelebration(
            this.questionElement,
            this.questionContentElement
        );

        this.answeredQuestions = this.progressTracker.answeredQuestions;
    }

    /**
     * 과목 필터 적용
     * @param {string} subject - 과목명
     */
    filterBySubject(subject) {
        this.currentSubject = subject;
        this.updateProgress();
    }

    /**
     * 랜덤 문제 생성
     */
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

    /**
     * 문제 표시
     */
    displayQuestion() {
        if (!this.currentQuestion) return;

        this.questionElement.textContent = this.currentQuestion.question;
        this.questionContentElement.innerHTML = '';

        // 애니메이션 적용
        AnimationController.fadeIn(this.questionContentElement, AppConstants.ANIMATION_DURATIONS.FAST);

        // 렌더러를 사용하여 문제 표시
        const renderer = this.renderers[this.currentQuestion.type];
        if (renderer) {
            renderer.render(
                this.currentQuestion,
                this.questionContentElement,
                (isCorrect) => this.handleAnswer(isCorrect)
            );
        }
    }

    /**
     * 답변 처리 (렌더러 콜백)
     * @param {boolean} isCorrect - 정답 여부
     */
    handleAnswer(isCorrect) {
        // 주관식의 경우 빈 답변 체크
        if (this.currentQuestion.type === AppConstants.QUESTION_TYPES.SUBJECTIVE && isCorrect === null) {
            this.toast.show('답을 입력해주세요.', AppConstants.NOTIFICATION_TYPES.ERROR);
            return;
        }

        this.checkAnswer(isCorrect);
    }

    /**
     * 답변 확인
     * @param {boolean} isCorrect - 정답 여부
     */
    checkAnswer(isCorrect) {
        const currentTime = Date.now();

        if (isCorrect && currentTime - this.lastAnsweredTime > 1000) {
            // 정답 피드백
            this.feedbackUI.show(true);
            AnimationController.success(this.questionContentElement);
            this.lastAnsweredTime = currentTime;

            // 진행률 업데이트
            this.answeredQuestions.add(this.currentQuestion.index);
            this.progressTracker.saveToStorage();
            this.updateProgress();

            const questions = this.currentSubject
                ? this.questionBank.getBySubject(this.currentSubject)
                : this.questionBank.getAll();

            const answeredCount = this.progressTracker.getAnsweredCount(
                this.questionBank.questions,
                this.currentSubject
            );

            if (answeredCount >= questions.length) {
                setTimeout(() => {
                    this.showCompletionCelebration();
                }, AppConstants.ANIMATION_DURATIONS.MEDIUM);
            } else {
                setTimeout(() => {
                    this.currentQuestion = null;
                    this.generateQuestion();
                }, AppConstants.ANIMATION_DURATIONS.MEDIUM);
            }
        } else if (!isCorrect) {
            // 오답 피드백
            this.feedbackUI.show(false);
            AnimationController.error(this.questionContentElement);

            if (this.currentQuestion.type === AppConstants.QUESTION_TYPES.MULTIPLE) {
                const correctIndex = this.currentQuestion.correctAnswer;
                const correctAnswer = this.currentQuestion.options[correctIndex];
                this.feedbackUI.highlightCorrectOption(correctIndex);

                setTimeout(() => {
                    this.feedbackUI.showHint(`정답: ${correctAnswer}`);
                }, AppConstants.ANIMATION_DURATIONS.SLOW);
            } else if (this.currentQuestion.type === AppConstants.QUESTION_TYPES.SEQUENCE) {
                setTimeout(() => {
                    this.feedbackUI.showHint(`정답 순서: ${this.currentQuestion.correctOrder.join(' → ')}`);
                }, AppConstants.ANIMATION_DURATIONS.SLOW);
            }

            setTimeout(() => {
                this.feedbackUI.hide();
                this.feedbackUI.resetOptions();
            }, AppConstants.ANIMATION_DURATIONS.VERY_SLOW);
        }
    }

    /**
     * 진행 상황 업데이트
     */
    updateProgress() {
        const questions = this.currentSubject
            ? this.questionBank.getBySubject(this.currentSubject)
            : this.questionBank.getAll();

        this.progressTracker.updateProgress(
            questions,
            this.questionBank,
            this.currentSubject
        );
    }

    /**
     * 문제 없음 메시지 표시
     */
    showNoQuestionsMessage() {
        const questionElement = document.getElementById('question');
        const contentElement = document.getElementById('question-content');

        if (questionElement) {
            questionElement.textContent = '등록된 문제가 없습니다.';
        }

        if (contentElement) {
            contentElement.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="font-size: 18px; margin-bottom: 20px; color: #666;">문제를 등록해주세요.</p>
                    <a href="admin.html" style="display: inline-block; padding: 12px 24px; font-size: 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        문제 등록하러 가기
                    </a>
                </div>
            `;
        }
    }

    /**
     * 완료 축하 화면 표시
     */
    showCompletionCelebration() {
        this.completionCelebration.show(() => this.restartQuiz());
    }

    /**
     * 퀴즈 재시작
     */
    restartQuiz() {
        this.answeredQuestions.clear();
        this.progressTracker.saveToStorage();
        this.currentQuestion = null;
        this.updateProgress();
        this.generateQuestion();
        this.toast.show('문제를 다시 시작합니다!', AppConstants.NOTIFICATION_TYPES.SUCCESS);
    }
}
