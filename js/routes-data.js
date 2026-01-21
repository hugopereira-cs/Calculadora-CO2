/**
 * RoutesDB - Global database for Brazilian routes and distances
 * Contains popular intercity routes with distances in kilometers
 * Provides methods to retrieve cities and calculate distances between them
 */

const RoutesDB = {
  /**
   * Array of route objects
   * Each route contains origin city, destination city, and distance in km
   */
  routes: [
    // ========== SOUTHEAST REGION ==========
    // São Paulo connections
    {
      origin: 'São Paulo, SP',
      destination: 'Rio de Janeiro, RJ',
      distanceKm: 430,
    },
    { origin: 'São Paulo, SP', destination: 'Campinas, SP', distanceKm: 95 },
    { origin: 'São Paulo, SP', destination: 'Santos, SP', distanceKm: 71 },
    { origin: 'São Paulo, SP', destination: 'Sorocaba, SP', distanceKm: 108 },
    { origin: 'São Paulo, SP', destination: 'Brasília, DF', distanceKm: 1015 },
    {
      origin: 'São Paulo, SP',
      destination: 'Belo Horizonte, MG',
      distanceKm: 586,
    },

    // Rio de Janeiro connections
    {
      origin: 'Rio de Janeiro, RJ',
      destination: 'Niterói, RJ',
      distanceKm: 13,
    },
    {
      origin: 'Rio de Janeiro, RJ',
      destination: 'Brasília, DF',
      distanceKm: 1148,
    },
    {
      origin: 'Rio de Janeiro, RJ',
      destination: 'Belo Horizonte, MG',
      distanceKm: 569,
    },
    {
      origin: 'Rio de Janeiro, RJ',
      destination: 'Angra dos Reis, RJ',
      distanceKm: 165,
    },

    // Minas Gerais connections
    {
      origin: 'Belo Horizonte, MG',
      destination: 'Ouro Preto, MG',
      distanceKm: 100,
    },
    {
      origin: 'Belo Horizonte, MG',
      destination: 'Brasília, DF',
      distanceKm: 738,
    },
    {
      origin: 'Belo Horizonte, MG',
      destination: 'Juiz de Fora, MG',
      distanceKm: 262,
    },
    {
      origin: 'Belo Horizonte, MG',
      destination: 'Uberlândia, MG',
      distanceKm: 559,
    },

    // ========== NORTHEAST REGION ==========
    { origin: 'Salvador, BA', destination: 'Recife, PE', distanceKm: 840 },
    {
      origin: 'Salvador, BA',
      destination: 'Feira de Santana, BA',
      distanceKm: 116,
    },
    { origin: 'Recife, PE', destination: 'Olinda, PE', distanceKm: 8 },
    { origin: 'Recife, PE', destination: 'Fortaleza, CE', distanceKm: 784 },
    {
      origin: 'Fortaleza, CE',
      destination: 'Juazeiro do Norte, CE',
      distanceKm: 495,
    },
    { origin: 'Natal, RN', destination: 'João Pessoa, PB', distanceKm: 185 },

    // ========== NORTH REGION ==========
    { origin: 'Belém, PA', destination: 'Marabá, PA', distanceKm: 355 },
    { origin: 'Manaus, AM', destination: 'Boa Vista, RR', distanceKm: 689 },
    { origin: 'Palmas, TO', destination: 'Brasília, DF', distanceKm: 960 },

    // ========== SOUTH REGION ==========
    { origin: 'Curitiba, PR', destination: 'São Paulo, SP', distanceKm: 408 },
    { origin: 'Curitiba, PR', destination: 'Londrina, PR', distanceKm: 367 },
    {
      origin: 'Curitiba, PR',
      destination: 'Porto Alegre, RS',
      distanceKm: 1102,
    },
    {
      origin: 'Porto Alegre, RS',
      destination: 'Caxias do Sul, RS',
      distanceKm: 181,
    },
    { origin: 'Porto Alegre, RS', destination: 'Pelotas, RS', distanceKm: 270 },
    {
      origin: 'Florianópolis, SC',
      destination: 'Blumenau, SC',
      distanceKm: 165,
    },
    {
      origin: 'Florianópolis, SC',
      destination: 'Curitiba, PR',
      distanceKm: 300,
    },

    // ========== CENTER-WEST REGION ==========
    { origin: 'Brasília, DF', destination: 'Goiânia, GO', distanceKm: 209 },
    { origin: 'Brasília, DF', destination: 'Cuiabá, MT', distanceKm: 928 },
    { origin: 'Goiânia, GO', destination: 'Anápolis, GO', distanceKm: 54 },
    {
      origin: 'Campo Grande, MS',
      destination: 'Dourados, MS',
      distanceKm: 225,
    },
    { origin: 'Campo Grande, MS', destination: 'Cuiabá, MT', distanceKm: 698 },

    // ========== ADDITIONAL MAJOR ROUTES ==========
    {
      origin: 'Campinas, SP',
      destination: 'Ribeirão Preto, SP',
      distanceKm: 263,
    },
    { origin: 'Piracicaba, SP', destination: 'Araçatuba, SP', distanceKm: 456 },
    { origin: 'Jundiaí, SP', destination: 'São Paulo, SP', distanceKm: 60 },
    { origin: 'Guarulhos, SP', destination: 'São Paulo, SP', distanceKm: 24 },
  ],

  /**
   * Get all unique cities from the routes database
   * @returns {Array<string>} Sorted array of unique city names
   */
  getAllCities: function () {
    const cities = new Set();

    // Extract all cities from both origin and destination
    this.routes.forEach((route) => {
      cities.add(route.origin);
      cities.add(route.destination);
    });

    // Convert Set to Array and sort alphabetically
    return Array.from(cities).sort((a, b) => {
      return a.localeCompare(b, 'pt-BR');
    });
  },

  /**
   * Find distance between two cities
   * Searches routes in both directions and normalizes input for comparison
   * @param {string} origin - Starting city
   * @param {string} destination - Ending city
   * @returns {number|null} Distance in kilometers or null if route not found
   */
  findDistance: function (origin, destination) {
    // Normalize input: trim whitespace and convert to lowercase
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();

    // Search for route in both directions
    for (let route of this.routes) {
      const routeOrigin = route.origin.toLowerCase();
      const routeDestination = route.destination.toLowerCase();

      // Check forward direction
      if (
        routeOrigin === normalizedOrigin &&
        routeDestination === normalizedDestination
      ) {
        return route.distanceKm;
      }

      // Check reverse direction (same distance)
      if (
        routeOrigin === normalizedDestination &&
        routeDestination === normalizedOrigin
      ) {
        return route.distanceKm;
      }
    }

    // Route not found
    return null;
  },
};
