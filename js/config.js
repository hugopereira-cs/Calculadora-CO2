/**
 * CONFIG - Global configuration for CO2 emissions calculator
 * Contains emission factors, transport mode metadata, and initialization methods
 */

const CONFIG = {
  /**
   * Emission factors in kg CO₂ per kilometer
   * Based on average data for each transport mode in Brazil
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  /**
   * Transport modes metadata
   * Contains display labels, icons, and UI colors for each mode
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: 'Bicicleta',
      icon: '🚴',
      color: '#3b82f6',
    },
    car: {
      label: 'Carro',
      icon: '🚗',
      color: '#ef4444',
    },
    bus: {
      label: 'Ônibus',
      icon: '🚌',
      color: '#f59e0b',
    },
    truck: {
      label: 'Caminhão',
      icon: '🚚',
      color: '#8b5cf6',
    },
  },

  /**
   * Carbon credits configuration
   * Used for calculating equivalent carbon offsets
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150,
  },

  /**
   * Populate the cities datalist with all available cities from RoutesDB
   * Creates option elements for autocomplete functionality
   */
  populateDatalist: function () {
    // Check if RoutesDB is available
    if (typeof RoutesDB === 'undefined') {
      console.error(
        'RoutesDB is not loaded. Make sure routes-data.js is loaded first.'
      );
      return;
    }

    // Get the datalist element
    const datalist = document.getElementById('cities-list');
    if (!datalist) {
      console.error('Datalist element with id "cities-list" not found.');
      return;
    }

    // Get all unique cities from RoutesDB
    const cities = RoutesDB.getAllCities();

    // Clear existing options
    datalist.innerHTML = '';

    // Create and append option elements for each city
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      datalist.appendChild(option);
    });

    console.log(`Datalist populated with ${cities.length} cities`);
  },

  /**
   * Set up automatic distance filling based on origin and destination
   * Listens to changes in origin/destination inputs and populates distance
   * Allows manual distance entry when checkbox is checked
   */
  setUpDistanceAutofill: function () {
    // Check if RoutesDB is available
    if (typeof RoutesDB === 'undefined') {
      console.error(
        'RoutesDB is not loaded. Make sure routes-data.js is loaded first.'
      );
      return;
    }

    // Get form elements
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const manualCheckbox = document.getElementById('manual-distance');
    const helperText = distanceInput.nextElementSibling;

    // Validate all elements exist
    if (
      !originInput ||
      !destinationInput ||
      !distanceInput ||
      !manualCheckbox ||
      !helperText
    ) {
      console.error('Required form elements not found');
      return;
    }

    /**
     * Helper function to attempt auto-filling distance
     * Called when origin or destination changes
     */
    const tryAutoFillDistance = () => {
      // Don't auto-fill if manual entry is enabled
      if (manualCheckbox.checked) {
        return;
      }

      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      // Only proceed if both fields are filled
      if (!origin || !destination) {
        distanceInput.value = '';
        helperText.textContent = 'A distância será preenchida automaticamente';
        helperText.style.color = '#6b7280'; // text-light color
        return;
      }

      // Find distance using RoutesDB
      const distance = RoutesDB.findDistance(origin, destination);

      if (distance !== null) {
        // Distance found - fill input and make readonly
        distanceInput.value = distance;
        distanceInput.readOnly = true;
        helperText.textContent = '✓ Distância encontrada automaticamente';
        helperText.style.color = '#10b981'; // primary color (success)
        console.log(
          `Distance found: ${origin} → ${destination} = ${distance}km`
        );
      } else {
        // Distance not found - clear and show message
        distanceInput.value = '';
        distanceInput.readOnly = true;
        helperText.textContent =
          '✗ Rota não encontrada. Marque "inserir distância manualmente" para entrar manualmente';
        helperText.style.color = '#ef4444'; // danger color
        console.log(`Distance not found for route: ${origin} → ${destination}`);
      }
    };

    // Add change event listeners to origin and destination inputs
    originInput.addEventListener('change', tryAutoFillDistance);
    destinationInput.addEventListener('change', tryAutoFillDistance);

    // Handle manual distance checkbox
    manualCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Manual entry enabled - allow editing
        distanceInput.readOnly = false;
        distanceInput.value = '';
        helperText.textContent = 'Digite a distância manualmente';
        helperText.style.color = '#6b7280';
        distanceInput.focus();
      } else {
        // Manual entry disabled - try auto-fill again
        distanceInput.readOnly = true;
        tryAutoFillDistance();
      }
    });

    console.log('Distance auto-fill setup completed');
  },
};
