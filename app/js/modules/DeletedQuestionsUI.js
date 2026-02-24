/**
 * DeletedQuestionsUI 클래스
 * 삭제된 문제 관리 UI
 */

export class DeletedQuestionsUI {
    /**
     * @param {QuestionBank} questionBank - 문제 저장소
     * @param {ToastNotification} toast - Toast 알림
     */
    constructor(questionBank, toast) {
        this.questionBank = questionBank;
        this.toast = toast;

        this.initializeEventListeners();
        this.updateDeletedQuestionList();
    }

    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
        // 전체 복원 버튼
        document.getElementById('btnRestoreAll')?.addEventListener('click', () => {
            this.handleRestoreAll();
        });

        // 영구 삭제 버튼
        document.getElementById('btnPermanentDeleteAll')?.addEventListener('click', () => {
            this.handlePermanentDeleteAll();
        });

        // 과목 필터
        document.getElementById('deletedSubjectFilter')?.addEventListener('change', (e) => {
            this.updateDeletedQuestionList(e.target.value);
        });

        // 탭 활성화 시 목록 갱신
        document.getElementById('tab-deleted')?.addEventListener('click', () => {
            this.updateDeletedQuestionList();
            this.updateSubjectFilter();
        });
    }

    /**
     * 삭제된 문제 목록 업데이트
     * @param {string} subjectFilter - 과목 필터
     */
    updateDeletedQuestionList(subjectFilter = '') {
        const listElement = document.getElementById('deletedQuestionList');
        if (!listElement) return;

        let deletedQuestions = this.questionBank.getDeleted();

        // 과목 필터 적용
        if (subjectFilter) {
            deletedQuestions = deletedQuestions.filter(q => q.subject === subjectFilter);
        }

        // 통계 업데이트
        const statsElement = document.getElementById('deletedCount');
        if (statsElement) {
            statsElement.textContent = `${deletedQuestions.length}개`;
        }

        if (deletedQuestions.length === 0) {
            listElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">삭제된 문제가 없습니다.</p>';
            return;
        }

        // 문제 목록 렌더링
        listElement.innerHTML = deletedQuestions.map((question, idx) => {
            const typeLabel = this.getTypeLabel(question.type);
            const previewText = this.getQuestionPreview(question);

            return `
                <div class="question-item" style="background: #fff3cd; border-left: 4px solid #ffc107;">
                    <div class="question-header">
                        <span class="question-number">#${question.index + 1}</span>
                        <span class="question-type" style="background: #ffc107;">${typeLabel}</span>
                        <span class="question-subject">${question.subject}</span>
                    </div>
                    <div class="question-content">
                        <strong>${question.question}</strong>
                        <p style="color: #666; margin-top: 5px;">${previewText}</p>
                    </div>
                    <div class="question-actions">
                        <button class="action-btn restore-btn" data-index="${question.index}" style="background: #28a745; color: white;">
                            복원
                        </button>
                        <button class="action-btn permanent-delete-btn" data-index="${question.index}" style="background: #dc3545; color: white;">
                            영구 삭제
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // 개별 버튼 이벤트 리스너
        listElement.querySelectorAll('.restore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.handleRestore(index);
            });
        });

        listElement.querySelectorAll('.permanent-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.handlePermanentDelete(index);
            });
        });
    }

    /**
     * 과목 필터 업데이트
     */
    updateSubjectFilter() {
        const filterElement = document.getElementById('deletedSubjectFilter');
        if (!filterElement) return;

        const deletedQuestions = this.questionBank.getDeleted();
        const subjects = [...new Set(deletedQuestions.map(q => q.subject))];

        // 기존 옵션 유지하고 새 옵션만 추가
        const currentOptions = Array.from(filterElement.options).map(opt => opt.value);
        subjects.forEach(subject => {
            if (!currentOptions.includes(subject)) {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                filterElement.appendChild(option);
            }
        });
    }

    /**
     * 문제 유형 레이블 반환
     */
    getTypeLabel(type) {
        const labels = {
            'multiple': '객관식',
            'subjective': '주관식',
            'sequence': '순서나열'
        };
        return labels[type] || type;
    }

    /**
     * 문제 미리보기 텍스트
     */
    getQuestionPreview(question) {
        if (question.type === 'multiple') {
            return `정답: ${question.options[question.correctAnswer]}`;
        } else if (question.type === 'subjective') {
            return `정답: ${question.correctAnswer}`;
        } else if (question.type === 'sequence') {
            return `순서: ${question.correctOrder.join(' → ')}`;
        }
        return '';
    }

    /**
     * 개별 문제 복원
     */
    async handleRestore(index) {
        if (!confirm('이 문제를 복원하시겠습니까?')) {
            return;
        }

        const success = await this.questionBank.restore(index);
        if (success) {
            this.toast.show('문제가 복원되었습니다.', 'success');
            this.updateDeletedQuestionList();
            this.updateSubjectFilter();

            // 문제 목록 탭 갱신
            if (window.app && window.app.adminUI) {
                window.app.adminUI.updateQuestionList();
            }
        } else {
            this.toast.show('문제 복원에 실패했습니다', 'error');
        }
    }

    /**
     * 개별 문제 영구 삭제
     */
    async handlePermanentDelete(index) {
        if (!confirm('이 문제를 영구적으로 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다!')) {
            return;
        }

        const success = await this.questionBank.permanentDelete(index);
        if (success) {
            this.toast.show('문제가 영구 삭제되었습니다.', 'info');
            this.updateDeletedQuestionList();
        } else {
            this.toast.show('문제 삭제에 실패했습니다', 'error');
        }
    }

    /**
     * 전체 복원
     */
    async handleRestoreAll() {
        const deletedQuestions = this.questionBank.getDeleted();

        if (deletedQuestions.length === 0) {
            this.toast.show('복원할 문제가 없습니다', 'info');
            return;
        }

        if (!confirm(`${deletedQuestions.length}개의 문제를 모두 복원하시겠습니까?`)) {
            return;
        }

        for (const question of deletedQuestions) {
            await this.questionBank.restore(question.index);
        }

        this.toast.show(`${deletedQuestions.length}개 문제가 복원되었습니다.`, 'success');
        this.updateDeletedQuestionList();

        // 문제 목록 탭 갱신
        if (window.app && window.app.adminUI) {
            window.app.adminUI.updateQuestionList();
        }
    }

    /**
     * 전체 영구 삭제
     */
    async handlePermanentDeleteAll() {
        const deletedQuestions = this.questionBank.getDeleted();

        if (deletedQuestions.length === 0) {
            this.toast.show('삭제할 문제가 없습니다', 'info');
            return;
        }

        if (!confirm(`⚠️ ${deletedQuestions.length}개의 문제를 영구적으로 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다!`)) {
            return;
        }

        // 2차 확인
        if (!confirm('정말로 영구 삭제하시겠습니까? 마지막 확인입니다.')) {
            return;
        }

        // 역순으로 삭제 (인덱스 변경 방지)
        const indices = deletedQuestions.map(q => q.index).sort((a, b) => b - a);
        for (const index of indices) {
            await this.questionBank.permanentDelete(index);
        }

        this.toast.show(`${deletedQuestions.length}개 문제가 영구 삭제되었습니다.`, 'info');
        this.updateDeletedQuestionList();
    }
}
