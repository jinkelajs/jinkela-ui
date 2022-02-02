import { jkl } from 'jinkela';

class Input extends HTMLElement {
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

  get placeholder() {
    return this.getAttribute('placeholder');
  }
  set placeholder(v) {
    if (v === null) {
      this.removeAttribute('placeholder');
    } else {
      this.setAttribute('placeholder', v);
    }
  }

  get value() {
    return this.getAttribute('value') || '';
  }
  set value(v) {
    this.internals.setFormValue(v);
    this.setAttribute('value', v || '');
  }

  inputHandler(e?: Event) {
    const { currentTarget } = e || {};
    if (currentTarget instanceof HTMLInputElement) {
      e?.stopImmediatePropagation();
      this.value = currentTarget.value;
      this.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
  }

  static observedAttributes = ['placeholder', 'value', 'disabled'];
  attributeChangedCallback(name: string, ov: string, nv: string) {
    const { input } = this;
    if (name === 'placeholder') input.placeholder = nv;
    if (name === 'value') input.value = nv;
    if (name === 'disabled') {
      if (nv === null) {
        input.removeAttribute('disabled');
      } else {
        input.setAttribute('disabled', nv);
      }
    }
  }

  private input: HTMLInputElement;
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const content = jkl`
      <style>
      :host {
        box-sizing: border-box;
        margin: 0;
        font-variant: tabular-nums;
        list-style: none;
        font-feature-settings: "tnum";
        position: relative;
        display: inline-block;
        min-width: 0;
        padding: 4px 11px;
        color: #000000d9;
        font-size: 14px;
        line-height: 1.5715;
        background-color: #fff;
        background-image: none;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        transition: all .3s;
      }
      :host input {
        outline: 0;
        border: 0;
        width: 100%;
        background: transparent;
      }
      :host(:hover) {
        border-color: var(--jkl-primary-color-hover);
      }
      :host(.focused) {
        border-color: var(--jkl-primary-color-hover);
        box-shadow: 0 0 0 2px var(--jkl-primary-color-outline);
        border-right-width: 1px!important;
        outline: 0;
      }
      :host input::placeholder {
        color: #bfbfbf;
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
      :host([size=large]) {
        height: 40px;
        padding: 6.4px 15px;
        font-size: 16px;
        border-radius: 2px;
      }
      :host([size=small]) {
        height: 24px;
        padding: 0 7px;
        font-size: 14px;
        border-radius: 2px;
      }
      :host([shape=round]) {
        border-radius: 50px;
      }
      :host([disabled]:hover),
      :host([disabled]) input,
      :host([disabled]) {
        color: #00000040;
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        box-shadow: none;
        cursor: not-allowed;
        opacity: 1;
      }
      </style>
      <input
        @input="${(e) => this.inputHandler(e)}"
        @focus="${() => this.classList.add('focused')}"
        @blur="${() => this.classList.remove('focused')}"
      />
    `;
    this.input = content.querySelector('input') as HTMLInputElement;
    shadow.appendChild(content);
  }
}

customElements.define('jkl-input', Input);
