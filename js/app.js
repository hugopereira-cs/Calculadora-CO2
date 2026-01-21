/**
 * App - Main application controller
 * Handles initialization and form submission logic
 * Orchestrates calculations and UI updates
 */

// ============================================================
// INITIALIZATION - Runs when DOM is fully loaded
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM carregado, inicializando calculadora...');

  try {
    // Step 1: Populate cities datalist for autocomplete
    CONFIG.populateDatalist();

    // Step 2: Set up automatic distance filling
    CONFIG.setUpDistanceAutofill();

    // Step 3: Get calculator form element
    const calculatorForm = document.getElementById('calculator-form');

    if (!calculatorForm) {
      console.error('Form element with id "calculator-form" not found');
      return;
    }

    // Step 4: Add submit event listener to form
    calculatorForm.addEventListener('submit', handleFormSubmit);

    // Step 5: Log successful initialization
    console.log('✅ Calculadora inicializada com sucesso!');
  } catch (error) {
    console.error('Erro durante inicialização:', error);
    alert('Erro ao inicializar a calculadora. Tente recarregar a página.');
  }
});

/**
 * Handle form submission
 * Collects form data, validates, and triggers calculations
 *
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  // Step 1: Prevent default form submission
  event.preventDefault();

  // Step 2: Get all form values
  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');
  const distanceInput = document.getElementById('distance');
  const transportRadios = document.querySelectorAll('input[name="transport"]');
  const submitButton = event.target.querySelector('button[type="submit"]');

  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();
  const distance = parseFloat(distanceInput.value);
  let selectedMode = '';

  // Get selected transport mode
  for (const radio of transportRadios) {
    if (radio.checked) {
      selectedMode = radio.value;
      break;
    }
  }

  // Step 3: Validate inputs
  if (!origin) {
    alert('❌ Por favor, informe a cidade de origem');
    return;
  }

  if (!destination) {
    alert('❌ Por favor, informe a cidade de destino');
    return;
  }

  if (!distance || distance <= 0) {
    alert('❌ Por favor, informe uma distância válida (maior que 0)');
    return;
  }

  if (!selectedMode) {
    alert('❌ Por favor, selecione um modo de transporte');
    return;
  }

  console.log('Dados validados:', {
    origin,
    destination,
    distance,
    selectedMode,
  });

  // Step 4: Get submit button element (already done above)
  // Step 5: Show loading state
  UI.showLoading(submitButton);

  // Step 6: Hide previous results sections
  UI.hideElement('results');
  UI.hideElement('comparation');
  UI.hideElement('carbon-credits');

  // Step 7: Simulate processing with 1500ms delay
  setTimeout(() => {
    try {
      // ========== CALCULATIONS ==========

      // Calculate emission for selected transport mode
      const selectedModeEmission = Calculator.calculateEmission(
        distance,
        selectedMode
      );

      // Calculate car emission as baseline for comparison
      const carEmission = Calculator.calculateEmission(distance, 'car');

      // Calculate savings compared to car
      const savings = Calculator.calculateSavings(
        selectedModeEmission,
        carEmission
      );

      // Calculate emissions for all transport modes
      const allModesComparation = Calculator.calculateAllModes(distance);

      // Calculate carbon credits equivalent
      const carbonCredits =
        Calculator.calculateCarbonCredits(selectedModeEmission);

      // Estimate carbon credit pricing
      const creditPricing = Calculator.estimateCreditPrice(carbonCredits);

      console.log('Cálculos concluídos:', {
        selectedModeEmission,
        carEmission,
        savings,
        carbonCredits,
        creditPricing,
      });

      // ========== BUILD DATA OBJECTS ==========

      // Data for results section
      const resultsData = {
        origin: origin,
        destination: destination,
        distance: distance,
        emission: selectedModeEmission,
        mode: selectedMode,
        savings: selectedMode !== 'car' ? savings : null,
      };

      // Data for carbon credits section
      const creditsData = {
        credits: carbonCredits,
        price: creditPricing,
      };

      // ========== RENDER SECTIONS ==========

      // Render results section
      const resultsContent = document.getElementById('results-content');
      if (resultsContent) {
        resultsContent.innerHTML = UI.renderResults(resultsData);
      }

      // Render comparation section
      const comparationContent = document.getElementById('comparation-content');
      if (comparationContent) {
        comparationContent.innerHTML = UI.renderComparations(
          allModesComparation,
          selectedMode
        );
      }

      // Render carbon credits section
      const creditsContent = document.getElementById('carbon-credits-content');
      if (creditsContent) {
        creditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
      }

      // ========== SHOW SECTIONS AND SCROLL ==========

      // Show all result sections
      UI.showElement('results');
      UI.showElement('comparation');
      UI.showElement('carbon-credits');

      // Scroll to results section
      UI.scrollToElement('results');

      console.log('✅ Resultados renderizados com sucesso');
    } catch (error) {
      // ========== ERROR HANDLING ==========

      console.error('Erro durante cálculos:', error);
      alert(
        '❌ Ocorreu um erro ao calcular as emissões. Verifique os dados e tente novamente.'
      );

      // Hide result sections in case of error
      UI.hideElement('results');
      UI.hideElement('comparation');
      UI.hideElement('carbon-credits');
    } finally {
      // ========== ALWAYS HIDE LOADING ==========

      // Hide loading state regardless of success or error
      UI.hideLoading(submitButton);
    }
  }, 1500);
}
