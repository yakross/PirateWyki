class WikiHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const basePath = this.getAttribute("basepath") || "";

    this.innerHTML = `

        `;
  }
}

customElements.define("wiki-header", WikiHeader);
