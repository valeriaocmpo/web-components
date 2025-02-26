export class CappedInput extends HTMLElement {
  #charTyped = 0;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
<style> 
:host {
display: block;
margin-bottom: 1rem;
}

input{
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


.warning-input{
border-color: var(--amber-color);
background-color: var(--amber-light);}

.danger-input {
border-color: var(--red-color));
background-color:var(--red-light);}
}
</style>
  <div>
  <input/>
  <span class="count"></span>
  </div>`;

    const clone = template.content.cloneNode(true);
    shadowRoot.appendChild(clone);

    this.input = shadowRoot.querySelector("input");
    this.count = shadowRoot.querySelector("span.count");
  }

  #getInput() {
    const limit = parseInt(this.getAttribute("limit")) || 60;
    this.#charTyped = this.input.value.length;
    this.count.textContent = `${this.#charTyped} / ${limit}`;
    this.#updateCounter(limit);
  }

  #updateCounter(limit) {
    this.count.textContent = `${this.#charTyped} / ${limit}`;

    const percentage = this.#charTyped / limit;

    if (percentage >= 0.9) {
      this.input.className = "danger-input";
      this.count.className = "danger";
    } else if (percentage >= 0.75) {
      this.input.className = "warning-input";
      this.count.className = "warning";
    } else if (percentage < 0.75) {
      this.input.classList.remove("warning-input");
      this.count.classList.remove("warning");
    }
  }
  connectedCallback() {
    const limit = parseInt(this.getAttribute("limit")) || 60;
    this.input.maxLength = limit;
    this.count.textContent = `${this.#charTyped} / ${limit}`;
    this.input.addEventListener("input", this.#getInput.bind(this));
  }
  disconnectedCallback() {
    this.input.removeEventListener("input", this.#getInput.bind(this));
  }
}

window.customElements.define("capped-input", CappedInput);
