/**
 * Main application logic for rendering the countries table
 */

/**
 * Format a number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Create a table row for a country
 * @param {Object} country - Normalized country object
 * @returns {HTMLTableRowElement} Table row element
 */
function createCountryRow(country) {
    const row = document.createElement('tr');
    
    // Flag cell
    const flagCell = document.createElement('td');
    if (country.flagEmoji) {
        flagCell.innerHTML = `<span class="flag-emoji">${country.flagEmoji}</span>`;
    } else {
        flagCell.innerHTML = '<span class="no-data">—</span>';
    }
    row.appendChild(flagCell);
    
    // Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = country.name;
    row.appendChild(nameCell);
    
    // Code cell
    const codeCell = document.createElement('td');
    codeCell.textContent = country.code;
    row.appendChild(codeCell);
    
    // Capital cell
    const capitalCell = document.createElement('td');
    capitalCell.textContent = country.capital;
    row.appendChild(capitalCell);
    
    // Region cell
    const regionCell = document.createElement('td');
    regionCell.textContent = country.region;
    row.appendChild(regionCell);
    
    // Population cell
    const populationCell = document.createElement('td');
    populationCell.className = 'population';
    populationCell.textContent = formatNumber(country.population);
    row.appendChild(populationCell);
    
    // Coordinates cell
    const coordsCell = document.createElement('td');
    coordsCell.className = 'coordinates';
    if (country.lat !== null && country.lng !== null) {
        coordsCell.textContent = `${country.lat.toFixed(2)}, ${country.lng.toFixed(2)}`;
    } else {
        coordsCell.innerHTML = '<span class="no-data">N/A</span>';
    }
    row.appendChild(coordsCell);
    
    // Languages cell
    const languagesCell = document.createElement('td');
    languagesCell.textContent = country.languages;
    row.appendChild(languagesCell);
    
    // Currencies cell
    const currenciesCell = document.createElement('td');
    currenciesCell.textContent = country.currencies;
    row.appendChild(currenciesCell);
    
    return row;
}

/**
 * Render the countries table
 * @param {Array} countries - Array of normalized country objects
 */
function renderCountriesTable(countries) {
    const tbody = document.getElementById('countries-tbody');
    
    // Clear existing content
    tbody.innerHTML = '';
    
    if (!countries || countries.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 9;
        emptyCell.className = 'loading';
        emptyCell.textContent = 'No countries data available';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
    }
    
    // Create and append rows for each country
    countries.forEach(country => {
        const row = createCountryRow(country);
        tbody.appendChild(row);
    });
    
    // Update total count
    const totalCountElement = document.getElementById('total-countries');
    if (totalCountElement) {
        totalCountElement.textContent = countries.length;
    }
}

/**
 * Show error message in the table
 * @param {string} message - Error message to display
 */
function showError(message) {
    const tbody = document.getElementById('countries-tbody');
    tbody.innerHTML = '';
    
    const errorRow = document.createElement('tr');
    const errorCell = document.createElement('td');
    errorCell.colSpan = 9;
    errorCell.className = 'loading';
    errorCell.style.color = '#e74c3c';
    errorCell.textContent = `Error: ${message}`;
    errorRow.appendChild(errorCell);
    tbody.appendChild(errorRow);
}

/**
 * Initialize the application
 */
async function initApp() {
    try {
        console.log('Loading countries data...');
        const countries = await loadCountries();
        console.log(`Loaded ${countries.length} countries`);
        
        renderCountriesTable(countries);
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load countries data. Please check the console for details.');
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
