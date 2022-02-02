import { jkl } from 'jinkela';

class Button extends HTMLElement {
  static formAssociated = true;
  private internals = this.attachInternals() as any;

  get loading() {
    return this.classList.contains('loading');
  }
  set loading(v) {
    const iconSlot = this.shadowRoot?.querySelector('slot[name=icon]');
    if (iconSlot instanceof HTMLSlotElement) {
      this.dataset.iconSlotLength = String(iconSlot.assignedNodes().length);
    }
    if (v) {
      this.classList.add('loading');
    } else {
      this.classList.remove('loading');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(v) {
    if (v) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get type() {
    return this.getAttribute('type');
  }
  set type(v) {
    if (v === null) {
      this.removeAttribute('type');
    } else {
      this.setAttribute('type', v);
    }
  }

  constructor() {
    super();

    let waveTimer: null | number = null;
    this.addEventListener('click', (e) => {
      if (this.loading || this.disabled) {
        e.stopImmediatePropagation();
        return;
      }
      if (waveTimer) {
        clearTimeout(waveTimer);
        this.classList.remove('wave');
        // Trigger manually the style recalculate.
        this.getAnimations({ subtree: true });
      }
      this.classList.add('wave');
      waveTimer = window.setTimeout(() => {
        this.classList.remove('wave');
        waveTimer = null;
      }, 1000);

      if (this.getAttribute('role') === 'submit') {
        const { form } = this.internals;
        const e = new SubmitEvent('submit', { bubbles: true });
        form.dispatchEvent(e);
        if (e.defaultPrevented) return;
        form.submit();
      }
    });

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(jkl`
      <style>
      :host > button {
        display: inline-flex;
        align-items: center;
        position: relative;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        user-select: none;
        height: 32px;
        padding: 0 15px;
        font-size: 14px;
        line-height: 14px;
        border-radius: 2px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all .3s;
        color: #000000d9;
        border: 1px solid;
        border-color: #d9d9d9;
        background: #fff;
      }
      :host > button:focus {
        color: var(--jkl-primary-color-hover);
        border-color: var(--jkl-primary-color-hover);
        outline: 0;
      }
      :host(:not([type]):hover) > button {
        color: var(--jkl-primary-color-hover);
        border-color: var(--jkl-primary-color-hover);
        background: #fff;
      }
      :host([type=primary]) > button {
        color: #fff;
        border-color: var(--jkl-primary-color);
        background: var(--jkl-primary-color);
      }
      :host([type=primary]:hover) > button {
        border-color: var(--jkl-primary-color-hover);
        background: var(--jkl-primary-color-hover);
      }
      :host(.wave) > button::after {
        position: absolute;
        inset: 0;
        display: block;
        border-radius: inherit;
        opacity: .2;
        animation: fadeEffect 2s cubic-bezier(.08,.82,.17,1), waveEffect .4s cubic-bezier(.08,.82,.17,1);
        animation-fill-mode: forwards;
        content: "";
        pointer-events: none;
      }
      :host(.loading) > button {
        cursor: default;
      }
      :host(.loading) > button::before {
        content: '';
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        z-index: 1;
        opacity: .35;
        background: #fff;
      }
      :host(.loading) .icon {
        display: block;
        visibility: visible;
        animation: rotateEffect 1s linear infinite;
        margin-right: 1ch;
        width: 1em;
      }
      :host(.loading) [name=icon] {
        display: none;
      }
      :host(:not([data-icon-slot-length="0"])) .icon {
        transition: none;
      }
      :host([size=large]) > button {
        height: 40px;
        padding: 6.4px 15px;
        font-size: 16px;
        border-radius: 2px;
      }
      :host([size=small]) > button {
        height: 24px;
        padding: 0 7px;
        font-size: 14px;
        border-radius: 2px;
      }
      :host([danger]) > button {
        color: var(--jkl-error-color);
        border-color: var(--jkl-error-color);
        background: #fff;
      }
      :host([danger]:hover) > button {
        color: var(--jkl-error-color-hover);
        border-color: var(--jkl-error-color-hover);
        background: #fff;
      }
      :host([danger][type=primary]) > button {
        color: #fff;
        border-color: var(--jkl-error-color);
        background: var(--jkl-error-color);
        text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
        box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
      }
      :host([danger][type=primary]:hover) > button {
        border-color: var(--jkl-error-color-hover);
        background: var(--jkl-error-color-hover);
      }
      :host([shape=round]) > button {
        border-radius: 50px;
      }
      :host([disabled]:hover) > button,
      :host([disabled]) > button {
        color: #00000040;
        border-color: #d9d9d9;
        background: #f5f5f5;
        text-shadow: none;
        box-shadow: none;
        cursor: not-allowed;
      }
      :host .icon {
        height: 1em;
        overflow: hidden;
        stroke: currentColor;
        position: relative;
        visibility: hidden;
        width: 0;
        transition: width 200ms ease;
      }
      :host .icon svg {
        position: absolute;
        width: 100%;
        height: 100%;
        display: block;
      }
      @keyframes rotateEffect { to { transform: rotate(360deg); } }
      @keyframes fadeEffect { to { opacity: 0 } }
      @keyframes waveEffect {
        to {
            box-shadow: 0 0 0 6px var(--jkl-primary-color);
        }
      }
      </style>
      <button>
        <slot name="icon"></slot>
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 112 112">
            <path
              d="M 50 0 A 50 50 90 0 1 100 50"
              fill="none"
              stroke-width="12"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <slot></slot>
      </button>
    `);
  }
}

customElements.define('jkl-button', Button);
