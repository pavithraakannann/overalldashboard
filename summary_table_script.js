// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDates();
    initializeTable();
    // Don't auto-load data - wait for user to click button to avoid large file loading issues
    console.log('Dashboard initialized. Click "Load Data from JSON" to load the exported data.');
});

// Set default dates (blank initially)
function setDefaultDates() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}

// Initialize table with all districts
function initializeTable() {
    const districts = [
        'ARIYALUR', 'CHENGALPATTU', 'CHENNAI', 'COIMBATORE', 'CUDDALORE',
        'DHARMAPURI', 'DINDIGUL', 'ERODE', 'KALLAKURICHI', 'KANCHEEPURAM',
        'KARUR', 'KRISHNAGIRI', 'KANYAKUMARI', 'MADURAI', 'MAYILADUTHURAI',
        'NAGAPATTINAM', 'NAMAKKAL', 'NILGIRIS', 'PERAMBALUR', 'PUDUKKOTTAI',
        'Ramanathapuram', 'RANIPET', 'SALEM', 'SIVAGANGA', 'TENKASI',
        'THANJAVUR', 'THE NILGIRIS', 'THENI', 'THIRUNELVELI', 'THIRUVALLUR',
        'THIRUVARUR', 'THIRUVANNAMALAI', 'TIRUCHIRAPPALLI', 'TIRUPATTUR',
        'TIRUPPUR', 'TUTICORIN', 'VELLORE', 'VILLUPURAM', 'VIRUDHUNAGAR'
    ];

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    districts.forEach((district, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${district}</td>
            <td class="geotag-forest" data-district="${district}">0</td>
            <td class="geotag-other-dept" data-district="${district}">0</td>
            <td class="geotag-agriculture" data-district="${district}">0</td>
            <td class="geotag-plant-atree" data-district="${district}">0</td>
            <td class="silver-oak-forest" data-district="${district}">0</td>
            <td class="silver-oak-other-dept" data-district="${district}">0</td>
            <td class="sandle-wood-forest" data-district="${district}">0</td>
            <td class="sandle-wood-other-dept" data-district="${district}">0</td>
            <td class="palm-forest" data-district="${district}">0</td>
            <td class="palm-other-dept" data-district="${district}">0</td>
        `;
        tableBody.appendChild(row);
    });
}

// Store all uploaded data
const uploadedData = {
    forest: [],
    otherDept: [],
    agriculture: [],
    plantATree: [],
    palmForest: [],
    palmOtherDept: []
};

// Species classification
const silverOakSpecies = [
    'silver oak', 'silveroak', 'grevillea robusta', 'silver oak tree', 
    'silver oak', 'silveroak', 'grevillea', 'silver-oak'
];
const sandleWoodSpecies = [
    'sandal wood', 'sandalwood', 'red sanders', 'red sandal', 
    'pterocarpus marsupium', 'santalum album', 'sandal', 
    'sandal wood tree', 'red sanders wood'
];

// Update table with uploaded data
function updateTable() {
    // Reset all cells to 0
    document.querySelectorAll('#tableBody td[data-district]').forEach(cell => {
        cell.textContent = '0';
    });

    // Process geotag categories
    processCategory('forest', 'geotag-forest');
    processCategory('otherDept', 'geotag-other-dept');
    processCategory('agriculture', 'geotag-agriculture');
    processCategory('plantATree', 'geotag-plant-atree');

    // Extract Silver Oak from forest and otherDept based on species
    extractSpeciesFromCategory('forest', 'silver-oak-forest', silverOakSpecies);
    extractSpeciesFromCategory('otherDept', 'silver-oak-other-dept', silverOakSpecies);

    // Extract Sandle Wood from forest and otherDept based on species
    extractSpeciesFromCategory('forest', 'sandle-wood-forest', sandleWoodSpecies);
    extractSpeciesFromCategory('otherDept', 'sandle-wood-other-dept', sandleWoodSpecies);

    // Process palm categories
    processCategory('palmForest', 'palm-forest');
    processCategory('palmOtherDept', 'palm-other-dept');

    // Update totals
    updateTotals();
}

// Process category data
function processCategory(category, cellClass) {
    const data = uploadedData[category];
    if (!data || data.length === 0) return;

    const selectedYear = document.getElementById('yearFilter').value;

    console.log(`Processing ${category} with ${data.length} rows`);
    console.log('Sample row:', data[0]);

    data.forEach(row => {
        const district = normalizeDistrict(row.district || row.District);
        const year = row.year || row.Year;
        
        // Try multiple possible column names for seedlings
        let seedlings = 0;
        if (row.seedlings !== undefined) seedlings = parseInt(row.seedlings);
        else if (row.seedling !== undefined) seedlings = parseInt(row.seedling);
        else if (row.seedlingscount !== undefined) seedlings = parseInt(row.seedlingscount);
        else if (row['number of seedlings'] !== undefined) seedlings = parseInt(row['number of seedlings']);
        else if (row.count !== undefined) seedlings = parseInt(row.count);
        else if (row.quantity !== undefined) seedlings = parseInt(row.quantity);
        else if (row.plantingcount !== undefined) seedlings = parseInt(row.plantingcount);
        else if (row.number !== undefined) seedlings = parseInt(row.number);
        else if (row.numbers !== undefined) seedlings = parseInt(row.numbers);
        else if (row.plants !== undefined) seedlings = parseInt(row.plants);
        else if (row.total !== undefined) seedlings = parseInt(row.total);
        else if (row.amount !== undefined) seedlings = parseInt(row.amount);

        if (isNaN(seedlings)) seedlings = 0;

        if (selectedYear !== 'all' && year !== selectedYear) return;

        const cell = document.querySelector(`.${cellClass}[data-district="${district}"]`);
        if (cell) {
            const currentValue = parseInt(cell.textContent.replace(/,/g, '')) || 0;
            cell.textContent = (currentValue + seedlings).toLocaleString();
        }
    });
}

// Extract specific species from category
function extractSpeciesFromCategory(category, cellClass, speciesList) {
    const data = uploadedData[category];
    if (!data || data.length === 0) return;

    const selectedYear = document.getElementById('yearFilter').value;

    data.forEach(row => {
        const district = normalizeDistrict(row.district || row.District);
        const year = row.year || row.Year;
        const species = (row.species || row.Species || '').toString().toLowerCase().trim();
        
        // Try multiple possible column names for seedlings
        let seedlings = 0;
        if (row.seedlings !== undefined) seedlings = parseInt(row.seedlings);
        else if (row.seedling !== undefined) seedlings = parseInt(row.seedling);
        else if (row.seedlingscount !== undefined) seedlings = parseInt(row.seedlingscount);
        else if (row['number of seedlings'] !== undefined) seedlings = parseInt(row['number of seedlings']);
        else if (row.count !== undefined) seedlings = parseInt(row.count);
        else if (row.quantity !== undefined) seedlings = parseInt(row.quantity);
        else if (row.plantingcount !== undefined) seedlings = parseInt(row.plantingcount);
        else if (row.number !== undefined) seedlings = parseInt(row.number);
        else if (row.numbers !== undefined) seedlings = parseInt(row.numbers);
        else if (row.plants !== undefined) seedlings = parseInt(row.plants);
        else if (row.total !== undefined) seedlings = parseInt(row.total);
        else if (row.amount !== undefined) seedlings = parseInt(row.amount);

        if (isNaN(seedlings)) seedlings = 0;

        if (selectedYear !== 'all' && year !== selectedYear) return;

        // Check if species matches any in the list (exact match or contains)
        const isMatch = speciesList.some(s => {
            const speciesLower = s.toLowerCase();
            return species === speciesLower || species.includes(speciesLower) || speciesLower.includes(species);
        });
        
        if (isMatch) {
            const cell = document.querySelector(`.${cellClass}[data-district="${district}"]`);
            if (cell) {
                const currentValue = parseInt(cell.textContent.replace(/,/g, '')) || 0;
                cell.textContent = (currentValue + seedlings).toLocaleString();
            }
        }
    });
}

// Normalize district name
function normalizeDistrict(district) {
    if (!district) return '';
    return district.toUpperCase().trim().replace(/\s+/g, ' ');
}

// Update totals
function updateTotals() {
    const totals = {
        'totalGeotagForest': 'geotag-forest',
        'totalGeotagOtherDept': 'geotag-other-dept',
        'totalGeotagAgriculture': 'geotag-agriculture',
        'totalGeotagPlantATree': 'geotag-plant-atree',
        'totalSilverOakForest': 'silver-oak-forest',
        'totalSilverOakOtherDept': 'silver-oak-other-dept',
        'totalSandleWoodForest': 'sandle-wood-forest',
        'totalSandleWoodOtherDept': 'sandle-wood-other-dept',
        'totalPalmForest': 'palm-forest',
        'totalPalmOtherDept': 'palm-other-dept'
    };

    Object.keys(totals).forEach(totalId => {
        const cellClass = totals[totalId];
        const cells = document.querySelectorAll(`.${cellClass}`);
        let total = 0;
        cells.forEach(cell => {
            const value = parseInt(cell.textContent.replace(/,/g, '')) || 0;
            total += value;
        });
        document.getElementById(totalId).textContent = total.toLocaleString();
    });
}

// Apply year filter
function applyFilters() {
    const selectedYear = document.getElementById('yearFilter').value;
    
    // Reset table first
    document.querySelectorAll('#tableBody td[data-district]').forEach(cell => {
        cell.textContent = '0';
    });

    // Process geotag categories
    processCategory('forest', 'geotag-forest');
    processCategory('otherDept', 'geotag-other-dept');
    processCategory('agriculture', 'geotag-agriculture');
    processCategory('plantATree', 'geotag-plant-atree');

    // Extract Silver Oak from forest and otherDept based on species
    extractSpeciesFromCategory('forest', 'silver-oak-forest', silverOakSpecies);
    extractSpeciesFromCategory('otherDept', 'silver-oak-other-dept', silverOakSpecies);

    // Extract Sandle Wood from forest and otherDept based on species
    extractSpeciesFromCategory('forest', 'sandle-wood-forest', sandleWoodSpecies);
    extractSpeciesFromCategory('otherDept', 'sandle-wood-other-dept', sandleWoodSpecies);

    // Process palm categories
    processCategory('palmForest', 'palm-forest');
    processCategory('palmOtherDept', 'palm-other-dept');

    updateTotals();
}

// Apply date filter
function applyDateFilter() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        // If dates are blank, just apply year filter
        applyFilters();
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    // Convert date range to financial years
    const start = new Date(startDate);
    const end = new Date(endDate);
    const yearsToInclude = getFinancialYearsInRange(start, end);

    // Reset table
    document.querySelectorAll('#tableBody td[data-district]').forEach(cell => {
        cell.textContent = '0';
    });

    // Process geotag categories with date filter
    processCategoryWithDateFilter('forest', 'geotag-forest', yearsToInclude);
    processCategoryWithDateFilter('otherDept', 'geotag-other-dept', yearsToInclude);
    processCategoryWithDateFilter('agriculture', 'geotag-agriculture', yearsToInclude);
    processCategoryWithDateFilter('plantATree', 'geotag-plant-atree', yearsToInclude);

    // Extract Silver Oak from forest and otherDept based on species with date filter
    extractSpeciesFromCategoryWithDateFilter('forest', 'silver-oak-forest', silverOakSpecies, yearsToInclude);
    extractSpeciesFromCategoryWithDateFilter('otherDept', 'silver-oak-other-dept', silverOakSpecies, yearsToInclude);

    // Extract Sandle Wood from forest and otherDept based on species with date filter
    extractSpeciesFromCategoryWithDateFilter('forest', 'sandle-wood-forest', sandleWoodSpecies, yearsToInclude);
    extractSpeciesFromCategoryWithDateFilter('otherDept', 'sandle-wood-other-dept', sandleWoodSpecies, yearsToInclude);

    // Process palm categories with date filter
    processCategoryWithDateFilter('palmForest', 'palm-forest', yearsToInclude);
    processCategoryWithDateFilter('palmOtherDept', 'palm-other-dept', yearsToInclude);

    updateTotals();
}

// Clear date filter
function clearDateFilter() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    applyFilters();
}

// Process category with date filter
function processCategoryWithDateFilter(category, cellClass, yearsToInclude) {
    const data = uploadedData[category];
    if (!data || data.length === 0) return;

    data.forEach(row => {
        const district = normalizeDistrict(row.district || row.District);
        const year = row.year || row.Year;
        
        // Try multiple possible column names for seedlings
        let seedlings = 0;
        if (row.seedlings !== undefined) seedlings = parseInt(row.seedlings);
        else if (row.seedling !== undefined) seedlings = parseInt(row.seedling);
        else if (row.seedlingscount !== undefined) seedlings = parseInt(row.seedlingscount);
        else if (row['number of seedlings'] !== undefined) seedlings = parseInt(row['number of seedlings']);
        else if (row.count !== undefined) seedlings = parseInt(row.count);
        else if (row.quantity !== undefined) seedlings = parseInt(row.quantity);
        else if (row.plantingcount !== undefined) seedlings = parseInt(row.plantingcount);
        else if (row.number !== undefined) seedlings = parseInt(row.number);
        else if (row.numbers !== undefined) seedlings = parseInt(row.numbers);
        else if (row.plants !== undefined) seedlings = parseInt(row.plants);
        else if (row.total !== undefined) seedlings = parseInt(row.total);
        else if (row.amount !== undefined) seedlings = parseInt(row.amount);

        if (isNaN(seedlings)) seedlings = 0;

        if (!yearsToInclude.includes(year)) return;

        const cell = document.querySelector(`.${cellClass}[data-district="${district}"]`);
        if (cell) {
            const currentValue = parseInt(cell.textContent.replace(/,/g, '')) || 0;
            cell.textContent = (currentValue + seedlings).toLocaleString();
        }
    });
}

// Extract specific species from category with date filter
function extractSpeciesFromCategoryWithDateFilter(category, cellClass, speciesList, yearsToInclude) {
    const data = uploadedData[category];
    if (!data || data.length === 0) return;

    data.forEach(row => {
        const district = normalizeDistrict(row.district || row.District);
        const year = row.year || row.Year;
        const species = (row.species || row.Species || '').toString().toLowerCase().trim();
        
        // Try multiple possible column names for seedlings
        let seedlings = 0;
        if (row.seedlings !== undefined) seedlings = parseInt(row.seedlings);
        else if (row.seedling !== undefined) seedlings = parseInt(row.seedling);
        else if (row.seedlingscount !== undefined) seedlings = parseInt(row.seedlingscount);
        else if (row['number of seedlings'] !== undefined) seedlings = parseInt(row['number of seedlings']);
        else if (row.count !== undefined) seedlings = parseInt(row.count);
        else if (row.quantity !== undefined) seedlings = parseInt(row.quantity);
        else if (row.plantingcount !== undefined) seedlings = parseInt(row.plantingcount);
        else if (row.number !== undefined) seedlings = parseInt(row.number);
        else if (row.numbers !== undefined) seedlings = parseInt(row.numbers);
        else if (row.plants !== undefined) seedlings = parseInt(row.plants);
        else if (row.total !== undefined) seedlings = parseInt(row.total);
        else if (row.amount !== undefined) seedlings = parseInt(row.amount);

        if (isNaN(seedlings)) seedlings = 0;

        if (!yearsToInclude.includes(year)) return;

        // Check if species matches any in the list (exact match or contains)
        const isMatch = speciesList.some(s => {
            const speciesLower = s.toLowerCase();
            return species === speciesLower || species.includes(speciesLower) || speciesLower.includes(species);
        });
        
        if (isMatch) {
            const cell = document.querySelector(`.${cellClass}[data-district="${district}"]`);
            if (cell) {
                const currentValue = parseInt(cell.textContent.replace(/,/g, '')) || 0;
                cell.textContent = (currentValue + seedlings).toLocaleString();
            }
        }
    });
}

// Get financial years in date range
function getFinancialYearsInRange(start, end) {
    const years = [];
    const startFY = getFinancialYear(start);
    const endFY = getFinancialYear(end);
    
    const allYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'];
    const startIndex = allYears.indexOf(startFY);
    const endIndex = allYears.indexOf(endFY);
    
    if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
            years.push(allYears[i]);
        }
    }
    
    return years;
}

// Get financial year from date
function getFinancialYear(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (month <= 2) {
        return `${year - 1}-${year}`;
    } else {
        return `${year}-${year + 1}`;
    }
}

// Export to Excel
function exportToExcel() {
    const table = document.getElementById('summaryTable');
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, 'comprehensive_summary.xlsx');
}

// Load data from JSON file
async function loadDataFromJSON() {
    console.log('Attempting to load data from JSON files...');
    
    try {
        // Load each data file separately
        const [forestData, otherDeptData, agricultureData, plantATreeData, palmForestData, palmOtherDeptData] = await Promise.all([
            fetch('data_forest.json').then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch('data_other_dept.json').then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch('data_agriculture.json').then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch('data_plant_atree.json').then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch('data_palm_forest.json').then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch('data_palm_other_dept.json').then(r => r.ok ? r.json() : Promise.resolve([]))
        ]);

        // Normalize data (convert column names to lowercase)
        const normalizeData = (dataArray) => {
            if (!dataArray || !Array.isArray(dataArray)) return [];
            return dataArray.map(row => {
                const normalizedRow = {};
                Object.keys(row).forEach(key => {
                    const normalizedKey = key.toLowerCase().trim();
                    normalizedRow[normalizedKey] = row[key];
                });
                return normalizedRow;
            });
        };

        // Load and normalize data into uploadedData structure
        uploadedData.forest = normalizeData(forestData);
        uploadedData.otherDept = normalizeData(otherDeptData);
        uploadedData.agriculture = normalizeData(agricultureData);
        uploadedData.plantATree = normalizeData(plantATreeData);
        uploadedData.palmForest = normalizeData(palmForestData);
        uploadedData.palmOtherDept = normalizeData(palmOtherDeptData);

        console.log('Data loaded from JSON:', {
            forest: uploadedData.forest.length,
            otherDept: uploadedData.otherDept.length,
            agriculture: uploadedData.agriculture.length,
            plantATree: uploadedData.plantATree.length
        });
        
        updateTable();
        console.log('Data loaded successfully!');
    } catch (error) {
        console.error('Error loading JSON data:', error);
        alert('Error loading data: ' + error.message + '\n\nPlease make sure data_*.json files are in the same folder as summary_table.html');
    }
}
