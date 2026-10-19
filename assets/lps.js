/*
 * Le Parfum Simplifié — small progressive enhancements for `lps-*` sections.
 * Everything works without this file; it only adds:
 *  - click a screenshot ([data-lps-zoom-src]) to view it full size in a <dialog>
 *  - <lps-modules>: an "Expand all / Collapse all" control for the curriculum
 * Loaded as a module, so the browser executes it once however many sections include it.
 */

const LpsLightbox = {
  open(src, alt, returnFocusTo) {
    let dialog = document.getElementById('lps-lightbox');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'lps-lightbox';
      dialog.className = 'lps-lightbox';
      dialog.setAttribute('aria-label', 'Enlarged image');
      dialog.innerHTML =
        '<button type="button" class="lps-lightbox__close" aria-label="Close">&times;</button><img alt="" decoding="async">';
      dialog.querySelector('button').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
      document.body.append(dialog);
    }

    const img = dialog.querySelector('img');
    img.src = src;
    img.alt = alt;
    dialog.addEventListener('close', () => returnFocusTo?.focus(), { once: true });
    dialog.showModal();
  },
};

if (!window.lpsLightboxBound) {
  window.lpsLightboxBound = true;
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest?.('[data-lps-zoom-src]');
    if (!trigger) return;
    event.preventDefault();
    LpsLightbox.open(trigger.dataset.lpsZoomSrc, trigger.dataset.lpsZoomAlt || '', trigger);
  });
}

class LpsModules extends HTMLElement {
  connectedCallback() {
    this.toggle = this.querySelector('[data-lps-toggle-all]');
    if (!this.toggle) return;
    this.toggle.hidden = false;
    this.toggle.addEventListener('click', this.#onToggle);
    this.addEventListener('toggle', this.#sync, true);
    this.#sync();
  }

  get #items() {
    return [...this.querySelectorAll('details')];
  }

  #onToggle = () => {
    const open = !this.#items.every((item) => item.open);
    this.#items.forEach((item) => (item.open = open));
    this.#sync();
  };

  #sync = () => {
    const allOpen = this.#items.every((item) => item.open);
    this.toggle.textContent = allOpen ? this.toggle.dataset.labelCollapse : this.toggle.dataset.labelExpand;
    this.toggle.setAttribute('aria-expanded', String(allOpen));
  };
}

if (!customElements.get('lps-modules')) customElements.define('lps-modules', LpsModules);
