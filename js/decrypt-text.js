class SmokeTextElement extends HTMLElement {
  constructor() {
    super();
    this.radius = parseInt(this.getAttribute('radius')) || 80;
    this.duration = parseInt(this.getAttribute('duration')) || 800; // longer duration for smoke clearing
    
    this.chars = [];
    this.requestRef = null;
    this.mouse = { x: -1000, y: -1000, moved: false };
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.cachePositions = this.cachePositions.bind(this);
    this.animate = this.animate.bind(this);
  }

  connectedCallback() {
    if (this.reducedMotion) return;
    
    if (!this.querySelector('.smoke-text-visual')) {
      const originalHTML = this.innerHTML;
      const originalText = this.textContent;
      
      this.innerHTML = '';
      this.setAttribute('aria-label', originalText);
      
      const srOnly = document.createElement('span');
      srOnly.className = 'sr-only';
      srOnly.setAttribute('aria-hidden', 'false');
      srOnly.innerHTML = originalHTML;
      this.appendChild(srOnly);

      const visualContainer = document.createElement('span');
      visualContainer.className = 'smoke-text-visual';
      visualContainer.setAttribute('aria-hidden', 'true');
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = originalHTML;
      
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const words = text.split(/(\s+)/);
          const fragment = document.createDocumentFragment();
          
          words.forEach(word => {
            if (/\s/.test(word)) {
              fragment.appendChild(document.createTextNode(word));
            } else if (word.length > 0) {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'smoke-word';
              
              word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'smoke-char';
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
              });
              
              fragment.appendChild(wordSpan);
            }
          });
          return fragment;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const newEl = document.createElement(node.tagName);
          Array.from(node.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));
          Array.from(node.childNodes).forEach(child => newEl.appendChild(processNode(child)));
          return newEl;
        }
        return document.createTextNode('');
      };
      
      Array.from(tempDiv.childNodes).forEach(child => {
        visualContainer.appendChild(processNode(child));
      });
      
      this.appendChild(visualContainer);
    }
    
    setTimeout(() => {
      this.cachePositions();
      window.addEventListener('resize', this.cachePositions);
      
      this.addEventListener('mousemove', this.handleMouseMove);
      this.addEventListener('mouseleave', this.handleMouseLeave);
      
      this.requestRef = requestAnimationFrame(this.animate);
    }, 0);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.cachePositions);
    this.removeEventListener('mousemove', this.handleMouseMove);
    this.removeEventListener('mouseleave', this.handleMouseLeave);
    if (this.requestRef) cancelAnimationFrame(this.requestRef);
  }

  cachePositions() {
    const charElements = Array.from(this.querySelectorAll('.smoke-char'));
    this.chars = charElements.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        element: el,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        isSmoking: false,
        smokeEnd: 0
      };
    });
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.moved = true;
  }

  handleMouseLeave() {
    this.mouse.moved = false;
    this.chars.forEach(char => {
      if (char.isSmoking) {
        char.isSmoking = false;
        char.element.classList.remove('is-smoking');
      }
    });
  }

  animate(time) {
    if (this.mouse.moved) {
      for (let i = 0; i < this.chars.length; i++) {
        const char = this.chars[i];
        const dist = Math.hypot(char.x - this.mouse.x, char.y - this.mouse.y);
        
        if (dist < this.radius) {
          char.isSmoking = true;
          char.smokeEnd = time + this.duration;
          
          if (!char.element.classList.contains('is-smoking')) {
            const rx = (Math.random() - 0.5) * 1.5;
            const ry = (Math.random() - 0.5) * 1.5;
            char.element.style.setProperty('--rx', rx);
            char.element.style.setProperty('--ry', ry);
            char.element.classList.add('is-smoking');
          }
        }
      }
      this.mouse.moved = false;
    }

    for (let i = 0; i < this.chars.length; i++) {
      const char = this.chars[i];
      if (char.isSmoking && time > char.smokeEnd) {
        char.isSmoking = false;
        char.element.classList.remove('is-smoking');
      }
    }

    this.requestRef = requestAnimationFrame(this.animate);
  }
}

// Keep the tag name same as before to avoid rewriting HTML
customElements.define('decrypt-text', SmokeTextElement);
