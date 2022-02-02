import { jkl } from 'jinkela';

class Radio extends HTMLElement {
  static formAssociated = true;
  private internals = this.attachInternals() as any;

  get form() {
    return this.internals.form as HTMLFormElement | null;
  }

  get checked() {
    return this.hasAttribute('checked');
  }
  set checked(v) {
    if (v) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
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

  get value() {
    return this.getAttribute('value') || '';
  }
  set value(v) {
    this.setAttribute('value', v || '');
  }

  get name() {
    return this.getAttribute('name') || '';
  }
  set name(v) {
    this.setAttribute('name', v || '');
    this.radio.name = v;
  }

  static observedAttributes = ['name', 'value', 'disabled', 'checked'];
  attributeChangedCallback(name: string, ov: string, nv: string) {
    const { radio } = this;
    if (name === 'name') radio.name = nv;
    if (name === 'value') radio.value = nv;
    if (name === 'disabled') {
      if (nv === null) {
        radio.removeAttribute('disabled');
      } else {
        radio.setAttribute('disabled', nv);
      }
    }
    if (name === 'checked') {
      if (nv === null) {
        radio.removeAttribute('checked');
        this.internals.setFormValue(null);
      } else {
        radio.setAttribute('checked', nv);
        this.internals.setFormValue(this.value);
        (this.form || document).querySelectorAll(`[name=${this.name}]`).forEach((i) => {
          if (i !== this && i instanceof Radio && i.form === this.form) i.checked = false;
        });
      }
    }
  }

  select() {
    if (this.disabled) return;
    if (this.checked) return;
    this.checked = true;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private radio = jkl`<input type="radio" />`.firstElementChild as HTMLInputElement;

  constructor() {
    super();
    this.addEventListener('click', () => {
      this.select();
    });

    this.addEventListener('change', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLInputElement)) return;
      e.stopPropagation();
      this.value = target.value || '';
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    });

    this.addEventListener(
      'keydown',
      (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          this.select();
        }
      },
      { capture: true },
    );

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(jkl`
      <style>
      :host {
        box-sizing: border-box;
        white-space: nowrap;
        margin: 0;
        padding: 0;
        color: #000000d9;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
        position: relative;
        top: 0.2em;
        display: inline-flex;
        align-items: center;
        outline: none;
        cursor: pointer;
      }
      .radio-inner {
        box-sizing: border-box;
        margin-right: 1ch;
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        background-color: #fff;
        border-color: #d9d9d9;
        border-style: solid;
        border-width: 1px;
        border-radius: 50%;
        transition: all .3s;
      }
      .radio-inner::after {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        margin-left: -8px;
        background-color: var(--jkl-primary-color);
        border-top: 0;
        border-left: 0;
        border-radius: 16px;
        transform: scale(0);
        opacity: 0;
        transition: all .3s cubic-bezier(.78,.14,.15,.86);
        content: "";
      }
      .radio-inner:focus {
        outline: none;
        box-shadow: 0 0 0 3px var(--jkl-primary-color-outline);
        border-color: var(--jkl-primary-color);
      }
      input[type=radio]:checked + span {
        border-color: var(--jkl-primary-color);
      }
      input[type=radio]:checked + span::before {
        position: absolute;
        top: -1px;
        left: -1px;
        bottom: -1px;
        right: -1px;
        border: 1px solid var(--jkl-primary-color);
        border-radius: 50%;
        transform-origin: center;
        animation: radioEffect .36s ease-in-out;
        animation-fill-mode: both;
        box-sizing: border-box;
        content: "";
      }
      input[type=radio]:checked + span::after {
        transform: scale(.5);
        opacity: 1;
        transition: all .3s cubic-bezier(.78,.14,.15,.86);
      }
      input[type=radio]:checked + span {
        // outline: 1px solid red;
      }
      :host([disabled]) {
        cursor: not-allowed;
        color: #00000040;
      }
      :host([disabled]) .radio-inner {
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        cursor: not-allowed;
      }
      input[type=radio] {
        outline: 1px solid red;
        opacity: 0;
        position: absolute;
        z-index: 1;
      }
      @keyframes radioEffect {
        from {
          transform: scale(1);
          opacity: .5;
        }
        to {
          transform: scale(1.6);
          opacity: 0;
        }
      }
      </style>
      ${this.radio}
      <span class="radio-inner"></span>
      <slot></slot>
    `);
  }
}

customElements.define('jkl-radio', Radio);
