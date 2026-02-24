/**
 * AnimationController 클래스
 * 애니메이션 중앙 관리
 */

export class AnimationController {
    /**
     * 애니메이션 활성화 여부
     * @returns {boolean} 애니메이션 활성화 상태
     */
    static isEnabled() {
        return true; // 기본값: 활성화
    }

    /**
     * 요소 페이드 인
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static fadeIn(element, duration = 300, callback = null) {
        if (!this.isEnabled()) {
            element.style.opacity = '1';
            element.style.display = '';
            if (callback) callback();
            return;
        }

        element.style.opacity = '0';
        element.style.display = '';
        element.style.transition = `opacity ${duration}ms ease-in-out`;

        // Force reflow
        element.offsetHeight;

        element.style.opacity = '1';

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * 요소 페이드 아웃
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static fadeOut(element, duration = 300, callback = null) {
        if (!this.isEnabled()) {
            element.style.opacity = '0';
            element.style.display = 'none';
            if (callback) callback();
            return;
        }

        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.display = 'none';
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * 슬라이드 다운
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static slideDown(element, duration = 300, callback = null) {
        if (!this.isEnabled()) {
            element.style.display = '';
            element.style.maxHeight = '';
            if (callback) callback();
            return;
        }

        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.maxHeight = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease-in-out`;

        // Force reflow
        element.offsetHeight;

        element.style.maxHeight = height + 'px';

        setTimeout(() => {
            element.style.maxHeight = '';
            element.style.overflow = '';
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * 슬라이드 업
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static slideUp(element, duration = 300, callback = null) {
        if (!this.isEnabled()) {
            element.style.display = 'none';
            element.style.maxHeight = '0';
            if (callback) callback();
            return;
        }

        const height = element.scrollHeight;
        element.style.maxHeight = height + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease-in-out`;

        // Force reflow
        element.offsetHeight;

        element.style.maxHeight = '0';

        setTimeout(() => {
            element.style.display = 'none';
            element.style.overflow = '';
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * 흔들기 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} intensity - 강도 (px)
     * @param {number} duration - 지속 시간 (ms)
     */
    static shake(element, intensity = 10, duration = 500) {
        if (!this.isEnabled()) return;

        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: 'translateX(0)' }
        ];

        element.animate(keyframes, {
            duration,
            easing: 'ease-in-out'
        });
    }

    /**
     * 펄스 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} scale - 확대 비율
     * @param {number} duration - 지속 시간 (ms)
     */
    static pulse(element, scale = 1.1, duration = 300) {
        if (!this.isEnabled()) return;

        const keyframes = [
            { transform: 'scale(1)' },
            { transform: `scale(${scale})` },
            { transform: 'scale(1)' }
        ];

        element.animate(keyframes, {
            duration,
            easing: 'ease-in-out'
        });
    }

    /**
     * 바운스 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} height - 바운스 높이 (px)
     * @param {number} duration - 지속 시간 (ms)
     */
    static bounce(element, height = 20, duration = 600) {
        if (!this.isEnabled()) return;

        const keyframes = [
            { transform: 'translateY(0)' },
            { transform: `translateY(-${height}px)`, offset: 0.4 },
            { transform: 'translateY(0)', offset: 0.6 },
            { transform: `translateY(-${height / 2}px)`, offset: 0.8 },
            { transform: 'translateY(0)' }
        ];

        element.animate(keyframes, {
            duration,
            easing: 'ease-out'
        });
    }

    /**
     * 회전 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} degrees - 회전 각도
     * @param {number} duration - 지속 시간 (ms)
     */
    static rotate(element, degrees = 360, duration = 500) {
        if (!this.isEnabled()) return;

        const keyframes = [
            { transform: 'rotate(0deg)' },
            { transform: `rotate(${degrees}deg)` }
        ];

        element.animate(keyframes, {
            duration,
            easing: 'ease-in-out'
        });
    }

    /**
     * 깜빡임 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} times - 깜빡임 횟수
     * @param {number} duration - 지속 시간 (ms)
     */
    static blink(element, times = 3, duration = 600) {
        if (!this.isEnabled()) return;

        const keyframes = [];
        for (let i = 0; i <= times * 2; i++) {
            keyframes.push({ opacity: i % 2 === 0 ? 1 : 0 });
        }

        element.animate(keyframes, {
            duration,
            easing: 'step-end'
        });
    }

    /**
     * 확대/축소 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} fromScale - 시작 스케일
     * @param {number} toScale - 종료 스케일
     * @param {number} duration - 지속 시간 (ms)
     * @param {Function} callback - 완료 콜백
     */
    static scale(element, fromScale = 0, toScale = 1, duration = 300, callback = null) {
        if (!this.isEnabled()) {
            element.style.transform = `scale(${toScale})`;
            if (callback) callback();
            return;
        }

        const keyframes = [
            { transform: `scale(${fromScale})` },
            { transform: `scale(${toScale})` }
        ];

        const animation = element.animate(keyframes, {
            duration,
            easing: 'ease-out',
            fill: 'forwards'
        });

        if (callback) {
            animation.onfinish = callback;
        }
    }

    /**
     * 버튼 클릭 효과
     * @param {HTMLElement} button - 버튼 요소
     */
    static buttonClick(button) {
        if (!this.isEnabled()) return;

        this.pulse(button, 0.95, 150);
    }

    /**
     * 성공 애니메이션
     * @param {HTMLElement} element - 대상 요소
     */
    static success(element) {
        if (!this.isEnabled()) return;

        const keyframes = [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.2)', opacity: 1, offset: 0.5 },
            { transform: 'scale(1)', opacity: 1 }
        ];

        element.animate(keyframes, {
            duration: 600,
            easing: 'ease-in-out'
        });
    }

    /**
     * 에러 애니메이션
     * @param {HTMLElement} element - 대상 요소
     */
    static error(element) {
        if (!this.isEnabled()) return;

        this.shake(element, 10, 500);
    }

    /**
     * 컨페티 생성 (축하 효과)
     * @param {HTMLElement} container - 컨테이너 요소
     * @param {number} count - 컨페티 개수
     * @param {number} duration - 지속 시간 (ms)
     */
    static confetti(container, count = 50, duration = 3000) {
        if (!this.isEnabled()) return;

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
        const confettiElements = [];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${Math.random() * 0.5 + 0.5};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
            `;

            container.appendChild(confetti);
            confettiElements.push(confetti);

            // 애니메이션
            const keyframes = [
                {
                    transform: 'translate(0, 0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ];

            confetti.animate(keyframes, {
                duration: duration + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
        }

        // 정리
        setTimeout(() => {
            confettiElements.forEach(confetti => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            });
        }, duration + 1000);
    }

    /**
     * 프로그레스 바 애니메이션
     * @param {HTMLElement} progressBar - 프로그레스 바 요소
     * @param {number} fromPercent - 시작 퍼센트
     * @param {number} toPercent - 종료 퍼센트
     * @param {number} duration - 지속 시간 (ms)
     */
    static progressBar(progressBar, fromPercent, toPercent, duration = 500) {
        if (!this.isEnabled()) {
            progressBar.style.width = `${toPercent}%`;
            return;
        }

        progressBar.style.width = `${fromPercent}%`;
        progressBar.style.transition = `width ${duration}ms ease-out`;

        // Force reflow
        progressBar.offsetHeight;

        progressBar.style.width = `${toPercent}%`;

        setTimeout(() => {
            progressBar.style.transition = '';
        }, duration);
    }

    /**
     * 리플 효과 (머티리얼 디자인)
     * @param {HTMLElement} element - 대상 요소
     * @param {Event} event - 이벤트 객체
     */
    static ripple(element, event) {
        if (!this.isEnabled()) return;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            width: 0;
            height: 0;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: translate(-50%, -50%);
        `;

        element.style.position = element.style.position || 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        const size = Math.max(rect.width, rect.height) * 2;
        const keyframes = [
            { width: '0', height: '0', opacity: 1 },
            { width: `${size}px`, height: `${size}px`, opacity: 0 }
        ];

        const animation = ripple.animate(keyframes, {
            duration: 600,
            easing: 'ease-out'
        });

        animation.onfinish = () => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        };
    }

    /**
     * 스무스 스크롤
     * @param {HTMLElement} element - 대상 요소
     * @param {number} duration - 지속 시간 (ms)
     */
    static smoothScrollTo(element, duration = 500) {
        if (!this.isEnabled()) {
            element.scrollIntoView();
            return;
        }

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    /**
     * 카운트업 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {number} start - 시작 숫자
     * @param {number} end - 종료 숫자
     * @param {number} duration - 지속 시간 (ms)
     */
    static countUp(element, start, end, duration = 1000) {
        if (!this.isEnabled()) {
            element.textContent = end;
            return;
        }

        const range = end - start;
        const increment = range / (duration / 16); // 60fps 기준
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    /**
     * 타이핑 애니메이션
     * @param {HTMLElement} element - 대상 요소
     * @param {string} text - 표시할 텍스트
     * @param {number} speed - 타이핑 속도 (ms/char)
     * @param {Function} callback - 완료 콜백
     */
    static typeWriter(element, text, speed = 50, callback = null) {
        if (!this.isEnabled()) {
            element.textContent = text;
            if (callback) callback();
            return;
        }

        element.textContent = '';
        let index = 0;

        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(timer);
                if (callback) callback();
            }
        }, speed);
    }
}
