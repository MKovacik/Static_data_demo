/**
 * Main application logic for rendering the countries table
 */

// Global state
let allCountries = [];
let filteredCountries = [];
let currentSort = { column: null, direction: null };

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
        emptyCell.textContent = 'No countries match the current filters';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        
        // Update total count
        const totalCountElement = document.getElementById('total-countries');
        if (totalCountElement) {
            totalCountElement.textContent = '0';
        }
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
 * Filter countries based on search term, region, and population
 * @returns {Array} Filtered array of countries
 */
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const regionFilter = document.getElementById('region-filter').value;
    const populationFilter = document.getElementById('population-filter').value;
    
    let filtered = allCountries;
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(country => 
            country.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply region filter
    if (regionFilter) {
        filtered = filtered.filter(country => country.region === regionFilter);
    }
    
    // Apply population filter
    if (populationFilter) {
        filtered = filtered.filter(country => {
            const pop = country.population;
            switch (populationFilter) {
                case 'small':
                    return pop < 1000000;
                case 'medium':
                    return pop >= 1000000 && pop < 10000000;
                case 'large':
                    return pop >= 10000000 && pop < 100000000;
                case 'very-large':
                    return pop >= 100000000;
                default:
                    return true;
            }
        });
    }
    
    return filtered;
}

/**
 * Sort countries by column
 * @param {Array} countries - Array of countries to sort
 * @param {string} column - Column name to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of countries
 */
function sortCountries(countries, column, direction) {
    if (!column || !direction) return countries;
    
    const sorted = [...countries].sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        // Handle null/undefined values
        if (aVal === null || aVal === undefined || aVal === 'N/A') aVal = '';
        if (bVal === null || bVal === undefined || bVal === 'N/A') bVal = '';
        
        // Handle numeric values
        if (column === 'population') {
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle string values
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        
        if (direction === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
    
    return sorted;
}

/**
 * Update the table display with current filters and sorting
 */
function updateTable() {
    filteredCountries = applyFilters();
    
    if (currentSort.column) {
        filteredCountries = sortCountries(filteredCountries, currentSort.column, currentSort.direction);
    }
    
    renderCountriesTable(filteredCountries);
}

/**
 * Handle sort header click
 * @param {string} column - Column name to sort by
 */
function handleSort(column) {
    // Toggle sort direction
    if (currentSort.column === column) {
        if (currentSort.direction === 'asc') {
            currentSort.direction = 'desc';
        } else if (currentSort.direction === 'desc') {
            // Reset sorting
            currentSort.column = null;
            currentSort.direction = null;
        } else {
            currentSort.direction = 'asc';
        }
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    // Update visual indicators
    document.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
    });
    
    if (currentSort.column) {
        const header = document.querySelector(`th[data-column="${currentSort.column}"]`);
        if (header) {
            header.classList.add(currentSort.direction);
        }
    }
    
    updateTable();
}

/**
 * Populate region filter with unique regions
 */
function populateRegionFilter() {
    const regionFilter = document.getElementById('region-filter');
    const regions = [...new Set(allCountries.map(c => c.region).filter(r => r !== 'N/A'))].sort();
    
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', updateTable);
    
    // Filter dropdowns
    const regionFilter = document.getElementById('region-filter');
    regionFilter.addEventListener('change', updateTable);
    
    const populationFilter = document.getElementById('population-filter');
    populationFilter.addEventListener('change', updateTable);
    
    // Sortable headers
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-column');
            handleSort(column);
        });
    });
}

/**
 * Initialize the application
 */
async function initApp() {
    try {
        console.log('Loading countries data...');
        const countries = await loadCountries();
        console.log(`Loaded ${countries.length} countries`);
        
        allCountries = countries;
        filteredCountries = countries;
        
        // Populate region filter
        populateRegionFilter();
        
        // Setup event listeners
        setupEventListeners();
        
        // Render initial table
        renderCountriesTable(filteredCountries);
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
