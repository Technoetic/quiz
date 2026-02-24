/**
 * DOMHelper 클래스
 * DOM 조작 및 요소 생성 헬퍼
 */

export class DOMHelper {
    /**
     * 요소 생성
     * @param {string} tag - 태그 이름
     * @param {Object} attributes - 속성 객체
     * @param {string|HTMLElement|HTMLElement[]} children - 자식 요소
     * @returns {HTMLElement} 생성된 요소
     */
    static createElement(tag, attributes = {}, children = null) {
        const element = document.createElement(tag);

        // 속성 설정
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else if (key === 'dataset' && typeof value === 'object') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        // 자식 요소 추가
        if (children) {
            this.appendChildren(element, children);
        }

        return element;
    }

    /**
     * 자식 요소 추가
     * @param {HTMLElement} parent - 부모 요소
     * @param {string|HTMLElement|HTMLElement[]} children - 자식 요소
     */
    static appendChildren(parent, children) {
        if (typeof children === 'string') {
            parent.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof HTMLElement) {
                    parent.appendChild(child);
                } else if (typeof child === 'string') {
                    parent.appendChild(document.createTextNode(child));
                }
            });
        } else if (children instanceof HTMLElement) {
            parent.appendChild(children);
        }
    }

    /**
     * 요소 제거
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     */
    static remove(elementOrSelector) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * 요소 비우기
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     */
    static empty(elementOrSelector) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.innerHTML = '';
        }
    }

    /**
     * 클래스 토글
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {string} className - 클래스명
     * @param {boolean} force - 강제 설정
     */
    static toggleClass(elementOrSelector, className, force = undefined) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.classList.toggle(className, force);
        }
    }

    /**
     * 여러 클래스 추가
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {...string} classNames - 클래스명들
     */
    static addClass(elementOrSelector, ...classNames) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.classList.add(...classNames);
        }
    }

    /**
     * 여러 클래스 제거
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {...string} classNames - 클래스명들
     */
    static removeClass(elementOrSelector, ...classNames) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.classList.remove(...classNames);
        }
    }

    /**
     * 요소 표시/숨김
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {boolean} show - 표시 여부
     */
    static setVisible(elementOrSelector, show) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.style.display = show ? '' : 'none';
        }
    }

    /**
     * 요소 활성화/비활성화
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {boolean} enabled - 활성화 여부
     */
    static setEnabled(elementOrSelector, enabled) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.disabled = !enabled;
        }
    }

    /**
     * 데이터 속성 가져오기
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {string} key - 데이터 키
     * @returns {string|null} 데이터 값
     */
    static getData(elementOrSelector, key) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        return element ? element.dataset[key] : null;
    }

    /**
     * 데이터 속성 설정
     * @param {HTMLElement|string} elementOrSelector - 요소 또는 선택자
     * @param {string} key - 데이터 키
     * @param {string} value - 데이터 값
     */
    static setData(elementOrSelector, key, value) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.dataset[key] = value;
        }
    }

    /**
     * 이벤트 위임
     * @param {HTMLElement|string} parentSelector - 부모 선택자
     * @param {string} childSelector - 자식 선택자
     * @param {string} eventName - 이벤트 이름
     * @param {Function} handler - 핸들러 함수
     */
    static delegate(parentSelector, childSelector, eventName, handler) {
        const parent = typeof parentSelector === 'string'
            ? document.querySelector(parentSelector)
            : parentSelector;

        if (parent) {
            parent.addEventListener(eventName, (e) => {
                const target = e.target.closest(childSelector);
                if (target) {
                    handler.call(target, e);
                }
            });
        }
    }

    /**
     * 폼 데이터 객체로 변환
     * @param {HTMLFormElement|string} formOrSelector - 폼 또는 선택자
     * @returns {Object} 폼 데이터 객체
     */
    static getFormData(formOrSelector) {
        const form = typeof formOrSelector === 'string'
            ? document.querySelector(formOrSelector)
            : formOrSelector;

        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    /**
     * 폼 초기화
     * @param {HTMLFormElement|string} formOrSelector - 폼 또는 선택자
     */
    static resetForm(formOrSelector) {
        const form = typeof formOrSelector === 'string'
            ? document.querySelector(formOrSelector)
            : formOrSelector;

        if (form && form instanceof HTMLFormElement) {
            form.reset();
        }
    }
}
