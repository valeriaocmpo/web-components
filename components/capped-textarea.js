export class CappedTextArea extends HTMLElement {
  #charTyped = 0;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
      :host {
      display: block;
      margin-bottom:1rem;
      }
  
      textarea{
      padding: 0.5rem;
  border: 0.125rem, solid var(--base-color);
  border-radius: 0.25rem;
      }
  
      .count {
      margin-block-start: 0.5rem;
      margin-inline-start:0.2rem;
  }
      .warning{
  color: var(--amber-color); 
  }
  
  .danger{
  color:var(--red-color);
  }
  
  
  .warning-txtarea{
  border-color: var(--amber-color);
  background-color: var(--amber-light);}
  
  .danger-txtarea {
  border-color: var(--red-color));
  background-color:var(--red-light);}
  }
  </style>
  <div>
  <textarea></textarea>
  <span class="count"></span>
  </div>`;

    const clone = template.content.cloneNode(true);
    shadowRoot.appendChild(clone);

    this.textarea = shadowRoot.querySelector("textarea");
    this.count = shadowRoot.querySelector("span.count");
  }

  #getText() {
    const limit = parseInt(this.getAttribute("limit")) || 60;
    this.#charTyped = this.textarea.value.length;
    this.count.textContent = `${this.#charTyped} / ${limit}`;
    this.#updateCounter(limit);
  }

  #updateCounter(limit) {
    this.count.textContent = `${this.#charTyped} / ${limit}`;

    const percentage = this.#charTyped / limit;

    if (percentage >= 0.9) {
      this.textarea.className = "danger-txtarea";
      this.count.className = "danger";
    } else if (percentage >= 0.75) {
      this.textarea.className = "warning-txtarea";
      this.count.className = "warning";
    } else if (percentage < 0.75) {
      this.textarea.classList.remove("warning-txtarea");
      this.count.classList.remove("warning");
    }
  }

  connectedCallback() {
    const limit = parseInt(this.getAttribute("limit")) || 60;
    this.textarea.maxLength = limit;
    this.count.textContent = `${this.#charTyped} / ${limit}`;
    this.textarea.addEventListener("input", this.#getText.bind(this));
  }

  disconnectedCallback() {
    this.textarea.removeEventListener("input", this.#getText.bind(this));
  }
}

window.customElements.define("capped-textarea", CappedTextArea);
