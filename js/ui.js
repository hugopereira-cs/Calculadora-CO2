/**
 * UI - Global object for rendering and DOM manipulation
 * Handles formatting, element visibility, and HTML rendering for all UI components
 * Depends on CONFIG and Calculator objects
 */

const UI = {
  /**
   * Format number with specified decimal places and thousand separators
   * Uses Brazilian locale for thousands and decimal formatting
   *
   * @param {number} number - Number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number string (e.g., "1.234,56")
   */
  formatNumber: function (number, decimals = 2) {
    // Use toLocaleString with pt-BR locale for automatic formatting
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  /**
   * Format value as Brazilian currency (R$)
   * Uses pt-BR locale for proper formatting
   *
   * @param {number} value - Value to format
   * @returns {string} Formatted currency string (e.g., "R$ 1.234,56")
   */
  formatCurrency: function (value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },

  /**
   * Show element by removing 'hidden' class
   *
   * @param {string} elementId - ID of element to show
   */
  showElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('hidden');
    } else {
      console.warn(`Element with id "${elementId}" not found`);
    }
  },

  /**
   * Hide element by adding 'hidden' class
   *
   * @param {string} elementId - ID of element to hide
   */
  hideElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('hidden');
    } else {
      console.warn(`Element with id "${elementId}" not found`);
    }
  },

  /**
   * Scroll to element with smooth behavior
   *
   * @param {string} elementId - ID of element to scroll to
   */
  scrollToElement: function (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Element with id "${elementId}" not found`);
    }
  },

  /**
   * Render results card with route, distance, emission, and transport info
   * Displays main calculation results in an organized card layout
   *
   * @param {Object} data - Results data object
   *        {
   *          origin: string,
   *          destination: string,
   *          distance: number,
   *          emission: number,
   *          mode: string,
   *          savings: { savedKg: number, percentage: number } | null
   *        }
   * @returns {string} HTML string for results section
   */
  renderResults: function (data) {
    // Get transport mode metadata from CONFIG
    const modeInfo = CONFIG.TRANSPORT_MODES[data.mode] || {};

    // Build HTML string with cards for each metric
    return `
      <h2 class="results__title">Resultados da Emissão</h2>
      <!-- Route Card -->
      <div class="results__card results__card--route">
        <h3 class="results__card-title">Rota</h3>
        <p class="results__card-content">
          <span class="results__route-origin">${data.origin}</span>
          <span class="results__route-arrow">→</span>
          <span class="results__route-destination">${data.destination}</span>
        </p>
      </div>

      <!-- Distance Card -->
      <div class="results__card results__card--distance">
        <h3 class="results__card-title">Distância</h3>
        <p class="results__card-value">${this.formatNumber(data.distance, 2)} km</p>
      </div>

      <!-- Emission Card -->
      <div class="results__card results__card--emission">
        <h3 class="results__card-title">Emissão de CO₂</h3>
        <div class="results__emission-content">
          <span class="results__emission-icon">🌱</span>
          <span class="results__emission-value">${this.formatNumber(data.emission, 2)} kg</span>
        </div>
      </div>

      <!-- Transport Mode Card -->
      <div class="results__card results__card--transport">
        <h3 class="results__card-title">Modo de Transporte</h3>
        <p class="results__transport-content">
          <span class="results__transport-icon">${modeInfo.icon || '🚗'}</span>
          <span class="results__transport-label">${modeInfo.label || data.mode}</span>
        </p>
      </div>

      ${
        data.savings && data.mode !== 'car'
          ? `
      <!-- Savings Card -->
      <div class="results__card results__card--savings">
        <h3 class="results__card-title">Economia de CO₂</h3>
        <div class="results__savings-content">
          <p class="results__savings-kg">
            <strong>${this.formatNumber(data.savings.savedKg, 2)} kg</strong> economizados
          </p>
          <p class="results__savings-percentage">
            <strong>${this.formatNumber(data.savings.percentage, 1)}%</strong> menos que carro
          </p>
        </div>
      </div>
      `
          : ''
      }
    `;
  },

  /**
   * Render comparison cards for all transport modes
   * Shows emissions for each mode with color-coded progress bars
   *
   * @param {Array} modesArray - Array of mode objects from Calculator.calculateAllModes()
   * @param {string} selectedMode - Selected transport mode
   * @returns {string} HTML string for comparation section
   */
  renderComparations: function (modesArray, selectedMode) {
    // Find max emission for scaling progress bars
    const maxEmission = Math.max(...modesArray.map((m) => m.emission), 1);

    // Helper function to determine bar color based on percentage
    const getBarColor = (percentage) => {
      if (percentage <= 25) return '#10b981'; // green
      if (percentage <= 75) return '#f59e0b'; // yellow
      if (percentage <= 100) return '#f97316'; // orange
      return '#ef4444'; // red
    };

    // Render each mode as a comparison item
    const modesHTML = modesArray
      .map((mode) => {
        const modeInfo = CONFIG.TRANSPORT_MODES[mode.mode] || {};
        const isSelected = mode.mode === selectedMode;
        const barColor = getBarColor(mode.percentageVsCar);
        const barWidth = (mode.emission / maxEmission) * 100;

        return `
      <div class="comparation__item ${isSelected ? 'comparation__item--selected' : ''}">
        <!-- Mode Header -->
        <div class="comparation__header">
          <span class="comparation__icon">${modeInfo.icon || '🚗'}</span>
          <h3 class="comparation__label">${modeInfo.label || mode.mode}</h3>
          ${isSelected ? '<span class="comparation__badge">Selecionado</span>' : ''}
        </div>

        <!-- Emission Stats -->
        <div class="comparation__stats">
          <span class="comparation__emission">${this.formatNumber(mode.emission, 2)} kg CO₂</span>
          <span class="comparation__percentage">${this.formatNumber(mode.percentageVsCar, 1)}% vs carro</span>
        </div>

        <!-- Progress Bar -->
        <div class="comparation__progress-container">
          <div
            class="comparation__progress-bar"
            style="width: ${barWidth}%; background-color: ${barColor};"
          ></div>
        </div>
      </div>
      `;
      })
      .join('');

    // Combine all modes with helpful tip
    return `
      <h2 class="comparation__title">Comparação entre Meios de Transporte</h2>
      <div class="comparation__list">
        ${modesHTML}
      </div>

      <!-- Helpful Tip -->
      <div class="comparation__tip">
        <p class="comparation__tip-title">💡 Dica</p>
        <p class="comparation__tip-text">
          Escolha modos de transporte com menor emissão para reduzir seu impacto ambiental.
          Bicicleta e transporte público são as opções mais sustentáveis!
        </p>
      </div>
    `;
  },

  /**
   * Render carbon credits information and pricing
   * Shows credits earned and estimated compensation costs
   *
   * @param {Object} creditsData - Credits data object
   *        {
   *          credits: number,
   *          price: { min: number, max: number, average: number }
   *        }
   * @returns {string} HTML string for carbon credits section
   */
  renderCarbonCredits: function (creditsData) {
    const { credits, price } = creditsData;

    return `
      <h2 class="carbon-credits__title">Créditos de Carbono</h2>
      <!-- Credits Grid -->
      <div class="carbon-credits__grid">
        <!-- Card 1: Credits Amount -->
        <div class="carbon-credits__card">
          <h3 class="carbon-credits__card-title">Créditos de Carbono</h3>
          <p class="carbon-credits__card-value">${this.formatNumber(credits, 4)}</p>
          <p class="carbon-credits__card-helper">1 crédito = 1.000 kg CO₂</p>
        </div>

        <!-- Card 2: Estimated Price -->
        <div class="carbon-credits__card">
          <h3 class="carbon-credits__card-title">Preço Estimado</h3>
          <p class="carbon-credits__card-value">${this.formatCurrency(price.average)}</p>
          <p class="carbon-credits__card-range">
            ${this.formatCurrency(price.min)} - ${this.formatCurrency(price.max)}
          </p>
        </div>
      </div>

      <!-- Info Box -->
      <div class="carbon-credits__info">
        <h4 class="carbon-credits__info-title">O que são Créditos de Carbono?</h4>
        <p class="carbon-credits__info-text">
          Créditos de carbono representam uma tonelada métrica de dióxido de carbono equivalente
          removida ou reduzida da atmosfera. Eles são usados em programas de compensação ambiental
          para mitigar os efeitos das emissões de gases de efeito estufa.
        </p>
      </div>

      <!-- Action Button -->
      <button class="carbon-credits__button" type="button">
        💚 Compensar Emissões
      </button>
    `;
  },

  /**
   * Show loading state on button
   * Disables button and shows spinner with loading text
   *
   * @param {HTMLElement} buttonElement - Button element to show loading state
   */
  showLoading: function (buttonElement) {
    if (!buttonElement) return;

    // Save original text for later restoration
    buttonElement.dataset.originalText = buttonElement.innerHTML;

    // Disable button
    buttonElement.disabled = true;

    // Show spinner and loading text
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * Hide loading state on button
   * Enables button and restores original text
   *
   * @param {HTMLElement} buttonElement - Button element to hide loading state
   */
  hideLoading: function (buttonElement) {
    if (!buttonElement) return;

    // Enable button
    buttonElement.disabled = false;

    // Restore original text from data attribute
    buttonElement.innerHTML =
      buttonElement.dataset.originalText || 'Calcular Emissão';
  },
};
