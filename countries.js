/**
 * Data loader utility for countries.json
 * Loads and normalizes country data for display
 */

/**
 * Normalize a single country entry
 * @param {Object} country - Raw country data from countries.json
 * @returns {Object} Normalized country object
 */
function normalizeCountry(country) {
    try {
        // Extract name
        const name = country?.name?.common || 'N/A';
        
        // Extract country code
        const code = country?.cca2 || 'N/A';
        
        // Extract and join capital (it's an array)
        const capital = Array.isArray(country?.capital) && country.capital.length > 0
            ? country.capital.join(', ')
            : 'N/A';
        
        // Extract region
        const region = country?.region || 'N/A';
        
        // Extract population
        const population = typeof country?.population === 'number' 
            ? country.population 
            : 0;
        
        // Extract coordinates (latlng is an array [lat, lng])
        let lat = null;
        let lng = null;
        if (Array.isArray(country?.latlng) && country.latlng.length >= 2) {
            lat = country.latlng[0];
            lng = country.latlng[1];
        }
        
        // Extract flag emoji
        const flagEmoji = country?.flag || null;
        
        // Extract and join languages
        let languages = 'N/A';
        if (country?.languages && typeof country.languages === 'object') {
            const langValues = Object.values(country.languages);
            languages = langValues.length > 0 ? langValues.join(', ') : 'N/A';
        }
        
        // Extract and join currencies
        let currencies = 'N/A';
        if (country?.currencies && typeof country.currencies === 'object') {
            const currencyNames = Object.entries(country.currencies)
                .map(([code, data]) => `${data?.name || code}`)
                .filter(Boolean);
            currencies = currencyNames.length > 0 ? currencyNames.join(', ') : 'N/A';
        }
        
        return {
            name,
            code,
            capital,
            region,
            population,
            lat,
            lng,
            flagEmoji,
            languages,
            currencies
        };
    } catch (error) {
        console.error('Error normalizing country:', country, error);
        // Return a safe default object if normalization fails
        return {
            name: 'Error',
            code: 'N/A',
            capital: 'N/A',
            region: 'N/A',
            population: 0,
            lat: null,
            lng: null,
            flagEmoji: null,
            languages: 'N/A',
            currencies: 'N/A'
        };
    }
}

/**
 * Load and normalize countries data
 * @returns {Promise<Array>} Array of normalized country objects
 */
async function loadCountries() {
    try {
        const response = await fetch('countries.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Countries data is not an array');
        }
        
        // Normalize all countries
        const normalizedCountries = data.map(normalizeCountry);
        
        return normalizedCountries;
    } catch (error) {
        console.error('Error loading countries:', error);
        throw error;
    }
}
