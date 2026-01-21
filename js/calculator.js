/**
 * Calculator - Global object for CO2 emissions calculations
 * Contains methods for calculating emissions, savings, and carbon credits
 * Depends on CONFIG object being loaded first
 */

const Calculator = {
  /**
   * Calculate CO2 emissions for a specific transport mode
   * Formula: distance (km) × emission factor (kg CO₂/km)
   *
   * @param {number} distanceKm - Distance traveled in kilometers
   * @param {string} transportMode - Transport mode key (bicycle, car, bus, truck)
   * @returns {number} Total CO2 emission in kg, rounded to 2 decimal places
   */
  calculateEmission: function (distanceKm, transportMode) {
    // Validate inputs
    if (distanceKm <= 0 || typeof distanceKm !== 'number') {
      console.warn(
        'Invalid distance provided to calculateEmission:',
        distanceKm
      );
      return 0;
    }

    // Get emission factor from CONFIG
    if (!CONFIG.EMISSION_FACTORS.hasOwnProperty(transportMode)) {
      console.warn(`Transport mode "${transportMode}" not found in CONFIG`);
      return 0;
    }

    const emissionFactor = CONFIG.EMISSION_FACTORS[transportMode];

    // Calculate emission: distance × factor
    const emission = distanceKm * emissionFactor;

    // Round to 2 decimal places
    return Math.round(emission * 100) / 100;
  },

  /**
   * Calculate emissions for all transport modes and compare to car (baseline)
   * Sorts results from lowest to highest emission
   *
   * @param {number} distanceKm - Distance traveled in kilometers
   * @returns {Array} Array of objects with mode, emission, and percentage vs car
   *          Example: [
   *            { mode: 'bicycle', emission: 0, percentageVsCar: 0 },
   *            { mode: 'bus', emission: 8.9, percentageVsCar: 74.17 },
   *            { mode: 'car', emission: 12, percentageVsCar: 100 }
   *          ]
   */
  calculateAllModes: function (distanceKm) {
    const results = [];

    // Calculate car emission first to use as baseline
    const carEmission = this.calculateEmission(distanceKm, 'car');

    // Avoid division by zero
    if (carEmission === 0) {
      console.warn('Car emission is 0, cannot calculate percentage comparison');
    }

    // Calculate emission for each transport mode
    for (const mode in CONFIG.EMISSION_FACTORS) {
      if (CONFIG.EMISSION_FACTORS.hasOwnProperty(mode)) {
        const emission = this.calculateEmission(distanceKm, mode);

        // Calculate percentage vs car
        let percentageVsCar = 0;
        if (carEmission > 0) {
          percentageVsCar =
            Math.round((emission / carEmission) * 100 * 100) / 100;
        }

        results.push({
          mode: mode,
          emission: emission,
          percentageVsCar: percentageVsCar,
        });
      }
    }

    // Sort by emission (lowest first)
    results.sort((a, b) => a.emission - b.emission);

    return results;
  },

  /**
   * Calculate CO2 savings between baseline and alternative mode
   * Formula: Saved = (Baseline - Alternative) / Baseline × 100%
   *
   * @param {number} emission - Emission of chosen mode in kg CO₂
   * @param {number} baselineEmission - Emission of baseline mode (usually car) in kg CO₂
   * @returns {Object} Object with savedKg and percentage properties
   *          Example: { savedKg: 5.5, percentage: 45.83 }
   */
  calculateSavings: function (emission, baselineEmission) {
    // Validate inputs
    if (baselineEmission === 0) {
      console.warn('Baseline emission is 0, cannot calculate savings');
      return { savedKg: 0, percentage: 0 };
    }

    // Calculate saved kg
    const savedKg = Math.round((baselineEmission - emission) * 100) / 100;

    // Calculate percentage saved
    const percentage =
      Math.round((savedKg / baselineEmission) * 100 * 100) / 100;

    return {
      savedKg: savedKg,
      percentage: percentage,
    };
  },

  /**
   * Convert kg of CO2 to carbon credits
   * Formula: Credits = Emission (kg) / KG_PER_CREDIT
   *
   * @param {number} emissionKg - Total emission in kilograms
   * @returns {number} Number of carbon credits, rounded to 4 decimal places
   */
  calculateCarbonCredits: function (emissionKg) {
    // Validate input
    if (emissionKg < 0 || typeof emissionKg !== 'number') {
      console.warn(
        'Invalid emission provided to calculateCarbonCredits:',
        emissionKg
      );
      return 0;
    }

    // Calculate credits
    const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

    // Round to 4 decimal places for precision
    return Math.round(credits * 10000) / 10000;
  },

  /**
   * Estimate carbon credit price range in BRL
   * Calculates minimum, maximum, and average prices based on market range
   *
   * @param {number} credits - Number of carbon credits
   * @returns {Object} Object with min, max, and average prices in BRL
   *          Example: { min: 50.5, max: 150.5, average: 100.5 }
   */
  estimateCreditPrice: function (credits) {
    // Validate input
    if (credits < 0 || typeof credits !== 'number') {
      console.warn('Invalid credits provided to estimateCreditPrice:', credits);
      return { min: 0, max: 0, average: 0 };
    }

    // Get price range from CONFIG
    const minPrice = CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
    const maxPrice = CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;

    // Calculate prices
    const minTotal = Math.round(credits * minPrice * 100) / 100;
    const maxTotal = Math.round(credits * maxPrice * 100) / 100;
    const average = Math.round(((minTotal + maxTotal) / 2) * 100) / 100;

    return {
      min: minTotal,
      max: maxTotal,
      average: average,
    };
  },
};
