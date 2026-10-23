/*
 * Le Parfum Simplifié — small progressive enhancements for `lps-*` sections.
 * Everything works without this file; it only adds:
 *  - click a screenshot ([data-lps-zoom-src]) to view it full size in a <dialog>
 *  - <lps-modules>: an "Expand all / Collapse all" control for the curriculum
 *  - <lps-stepper>: shows a long questionnaire one step at a time, checking each step before moving on
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

class LpsStepper extends HTMLElement {
  connectedCallback() {
    this.steps = [...this.querySelectorAll('[data-step]')];
    if (!this.hasAttribute('data-steps') || this.steps.length < 2) return;
    this.index = 0;
    this.progress = this.querySelector('[data-progress]');
    this.backButton = this.querySelector('[data-back]');
    this.nextButton = this.querySelector('[data-next]');
    this.submitButton = this.querySelector('[data-submit]');
    this.backButton.addEventListener('click', () => this.#go(this.index - 1));
    this.nextButton.addEventListener('click', () => {
      if (this.#stepIsValid()) this.#go(this.index + 1);
    });
    this.#render(false);
  }

  #stepIsValid() {
    const fields = [...this.steps[this.index].querySelectorAll('input, select, textarea')];
    return fields.every((field) => field.reportValidity());
  }

  #go(index) {
    this.index = Math.max(0, Math.min(index, this.steps.length - 1));
    this.#render(true);
  }

  #render(moveFocus) {
    const last = this.index === this.steps.length - 1;
    this.steps.forEach((step, i) => (step.hidden = i !== this.index));
    this.backButton.hidden = this.index === 0;
    this.nextButton.hidden = last;
    this.submitButton.hidden = !last;
    const legend = this.steps[this.index].querySelector('legend');
    this.progress.hidden = false;
    this.progress.textContent = `Step ${this.index + 1} of ${this.steps.length}${legend ? ` — ${legend.textContent.trim()}` : ''}`;
    if (moveFocus) {
      this.progress.setAttribute('tabindex', '-1');
      this.progress.focus({ preventScroll: true });
      this.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

if (!customElements.get('lps-stepper')) customElements.define('lps-stepper', LpsStepper);
