# Static Data Demo - Countries Table

A simple, accessible web application that displays country data from `countries.json` in an interactive HTML table.

## Features

- **Accessible HTML table** with proper semantic markup (`<thead>`, `<tbody>`, `<caption>`, `scope` attributes)
- **Comprehensive data display** including:
  - Country name and 2-letter code
  - Capital city
  - Region
  - Population (formatted with thousand separators)
  - Geographic coordinates (latitude, longitude)
  - Flag emoji
  - Languages (comma-separated)
  - Currencies (comma-separated)
- **Responsive design** that works on desktop and mobile devices
- **Safe data handling** with fallbacks for missing or null fields
- **Clean, minimal styling** for easy readability

## Demo

View the live demo: [https://mkovacik.github.io/Static_data_demo/](https://mkovacik.github.io/Static_data_demo/)

## Local Development

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/MKovacik/Static_data_demo.git
   cd Static_data_demo
   ```

2. Serve the files using a local web server. You can use any of these methods:

   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Using Node.js (http-server):**
   ```bash
   npx http-server
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Project Structure

```
Static_data_demo/
├── index.html          # Main HTML page with table structure
├── styles.css          # Minimal, responsive CSS styling
├── countries.js        # Data loader utility for normalizing country data
├── app.js              # Main application logic for rendering the table
├── countries.json      # Source data file with country information
└── README.md           # This file
```

## Data Normalization

The `countries.js` module handles data normalization to ensure the table displays correctly even when fields are missing:

- **name**: Extracted from `name.common` (fallback: "N/A")
- **code**: Extracted from `cca2` (fallback: "N/A")
- **capital**: Joined from capital array (fallback: "N/A")
- **region**: Direct field (fallback: "N/A")
- **population**: Number value (fallback: 0)
- **coordinates**: Extracted from `latlng` array as `[lat, lng]` (fallback: null)
- **flagEmoji**: Unicode flag emoji (fallback: null)
- **languages**: Comma-separated list from languages object (fallback: "N/A")
- **currencies**: Comma-separated list from currencies object (fallback: "N/A")

## Technologies Used

- **HTML5** for semantic markup
- **CSS3** for styling and responsive design
- **Vanilla JavaScript** for data loading and table rendering
- **Fetch API** for loading JSON data

## Browser Support

This application works in all modern browsers that support:
- ES6+ JavaScript features (async/await, arrow functions, template literals)
- Fetch API
- CSS Flexbox and Grid (for responsive layout)

## GitHub Pages Deployment

This site is configured for GitHub Pages deployment:

1. The main page is served from `index.html` in the root directory
2. All assets (CSS, JS, JSON) are referenced using relative paths
3. No build process or bundling is required

To deploy your own instance:
1. Fork this repository
2. Go to repository Settings → Pages
3. Select the branch to deploy (e.g., `main`)
4. Save and wait for the deployment to complete
5. Your site will be available at `https://[username].github.io/Static_data_demo/`

## License

This project is provided as-is for demonstration purposes.

## Data Source

Country data is sourced from [REST Countries](https://restcountries.com/), a free API providing comprehensive country information.
