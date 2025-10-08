class IconButton extends HTMLElement {
  static observedAttributes = ['icon', 'text', 'variant', 'size', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._render();
  }

  connectedCallback() {
    this._addEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
      this._addEventListeners();
    }
  }

  _render() {
    const icon = this.getAttribute('icon') || 'fanhui';
    const text = this.getAttribute('text') || '';
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        .icon-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          outline: none;
          position: relative;
          overflow: hidden;
        }
        
        .icon-button:focus {
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        .icon-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        /* Variants */
        .icon-button.primary {
          background: #007bff;
          color: white;
        }
        
        .icon-button.primary:hover {
          background: #0056b3;
        }
        
        .icon-button.secondary {
          background: #6c757d;
          color: white;
        }
        
        .icon-button.secondary:hover {
          background: #545b62;
        }
        
        .icon-button.success {
          background: #28a745;
          color: white;
        }
        
        .icon-button.success:hover {
          background: #1e7e34;
        }
        
        .icon-button.danger {
          background: #dc3545;
          color: white;
        }
        
        .icon-button.danger:hover {
          background: #c82333;
        }
        
        .icon-button.warning {
          background: #ffc107;
          color: #212529;
        }
        
        .icon-button.warning:hover {
          background: #e0a800;
        }
        
        .icon-button.outline {
          background: transparent;
          border: 2px solid #007bff;
          color: #007bff;
        }
        
        .icon-button.outline:hover {
          background: #007bff;
          color: white;
        }
        
        /* Sizes */
        .icon-button.small {
          padding: 6px 12px;
          font-size: 12px;
        }
        
        .icon-button.medium {
          padding: 8px 16px;
          font-size: 14px;
        }
        
        .icon-button.large {
          padding: 12px 24px;
          font-size: 16px;
        }
        
        /* Loading state */
        .icon-button.loading {
          pointer-events: none;
        }
        
        .loading-spinner {
          display: none;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .icon-button.loading .loading-spinner {
          display: block;
        }
        
        .icon-button.loading .button-text,
        .icon-button.loading icon-font {
          opacity: 0;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      </style>
      
      <button class="icon-button ${variant} ${size}" ${disabled ? 'disabled' : ''}>
        <icon-font name="${icon}"></icon-font>
        <span class="button-text">${text}</span>
        <div class="loading-spinner"></div>
      </button>
    `;
  }

  _addEventListeners() {
    const button = this.shadowRoot.querySelector('.icon-button');
    
    if (button && !this.hasAttribute('disabled')) {
      // Ripple effect
      button.addEventListener('click', (e) => {
        this._createRipple(e);
        
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('icon-button-click', {
          detail: {
            icon: this.getAttribute('icon'),
            text: this.getAttribute('text'),
            variant: this.getAttribute('variant')
          },
          bubbles: true
        }));
      });
    }
  }

  _createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  }

  // Public methods
  setLoading(loading) {
    const button = this.shadowRoot.querySelector('.icon-button');
    if (loading) {
      button.classList.add('loading');
    } else {
      button.classList.remove('loading');
    }
  }

  setDisabled(disabled) {
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  setIcon(iconName) {
    this.setAttribute('icon', iconName);
  }

  setText(text) {
    this.setAttribute('text', text);
  }

  setVariant(variant) {
    this.setAttribute('variant', variant);
  }

  setSize(size) {
    this.setAttribute('size', size);
  }

  // Getters
  get icon() {
    return this.getAttribute('icon');
  }

  get text() {
    return this.getAttribute('text');
  }

  get variant() {
    return this.getAttribute('variant');
  }

  get size() {
    return this.getAttribute('size');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
}

// Register the component
customElements.define('icon-button', IconButton);
