// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDates();
    initializeTable();
    // Auto-load data from JSON file
    loadDataFromJSON();
});

// Set default dates (blank initially)
function setDefaultDates() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}

function updateGroupAchievements() {
    const groups = [
        ['achievement-geotag', ['geotag-forest', 'geotag-other-dept', 'geotag-agriculture', 'geotag-plant-atree']],
        ['achievement-silver-oak', ['silver-oak-forest', 'silver-oak-other-dept']],
        ['achievement-sandle-wood', ['sandle-wood-forest', 'sandle-wood-other-dept']],
        ['achievement-palm', ['palm-forest', 'palm-other-dept']]
    ];

    document.querySelectorAll('#tableBody tr').forEach(row => {
        groups.forEach(([achievementClass, sourceClasses]) => {
            const achievement = sourceClasses.reduce((total, className) => {
                const text = row.querySelector(`.${className}`)?.textContent || '0';
                return total + (parseInt(text.replace(/,/g, ''), 10) || 0);
            }, 0);
            row.querySelector(`.${achievementClass}`).textContent = achievement.toLocaleString();
        });
    });
}

// Initialize table with all districts
function initializeTable() {
    const districts = [
        'ARIYALUR', 'CHENGALPATTU', 'CHENNAI', 'COIMBATORE', 'CUDDALORE',
        'DHARMAPURI', 'DINDIGUL', 'ERODE', 'KALLAKURICHI', 'KANCHEEPURAM',
        'KARUR', 'KRISHNAGIRI', 'KANYAKUMARI', 'MADURAI', 'MAYILADUTHURAI',
        'NAGAPATTINAM', 'NAMAKKAL', 'THE NILGIRIS', 'PERAMBALUR', 'PUDUKKOTTAI',
        'RAMANATHAPURAM', 'RANIPET', 'SALEM', 'SIVAGANGA', 'TENKASI',
        'THANJAVUR', 'THENI', 'THIRUNELVELI', 'THIRUVALLUR',
        'THIRUVARUR', 'TIRUVANNAMALAI', 'TIRUCHIRAPPALLI', 'TIRUPATTUR',
        'TIRUPPUR', 'TUTICORIN', 'VELLORE', 'VILLUPURAM', 'VIRUDHUNAGAR'
    ];

    const tableBody = document.getElementById('tableBody');
    tableBody.replaceChildren();
    summaryRows.length = 0;
    summaryRowElements.clear();
    summaryRowsByKey.clear();

    (window.dashboardDivisionMappings || []).forEach(([division, circle, district]) => {
        addSummaryRow({ division, circle, district, kind: 'division' });
    });

    districts.forEach(district => {
        const circles = new Set((window.dashboardDivisionMappings || [])
            .filter(([, , mappedDistrict]) => normalizeDistrict(mappedDistrict) === district)
            .map(([, circle]) => circle));
        addSummaryRow({
            division: 'District-level records (division unavailable)',
            circle: circles.size === 1 ? [...circles][0] : 'Unassigned',
            district,
            kind: 'district'
        });
    });

    renderSummaryRows();
    populateLocationFilters();
}

const summaryRows = [];
const summaryRowElements = new Map();
const summaryRowsByKey = new Map();

function createSummaryRowCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

function createSummaryRowKey(kind, division, district) {
    return `${kind}\u0000${normalizeDistrict(division)}\u0000${normalizeDistrict(district)}`;
}

function addSummaryRow({ division, circle, district, kind }) {
    const rowData = {
        division,
        circle,
        district: normalizeDistrict(district),
        kind,
        key: createSummaryRowKey(kind, division, district)
    };
    if (summaryRowsByKey.has(rowData.key)) return;
    summaryRows.push(rowData);
    summaryRowsByKey.set(rowData.key, rowData);
}

function renderSummaryRows() {
    const body = document.getElementById('tableBody');
    const valueClasses = [
        'target-geotag', 'geotag-forest', 'geotag-other-dept', 'geotag-agriculture', 'geotag-plant-atree', 'achievement-geotag',
        'target-silver-oak', 'silver-oak-forest', 'silver-oak-other-dept', 'achievement-silver-oak',
        'target-sandle-wood', 'sandle-wood-forest', 'sandle-wood-other-dept', 'achievement-sandle-wood',
        'target-palm', 'palm-forest', 'palm-other-dept', 'achievement-palm'
    ];

    summaryRows.sort((a, b) =>
        a.circle.localeCompare(b.circle) ||
        a.district.localeCompare(b.district) ||
        (a.kind === b.kind ? 0 : a.kind === 'division' ? -1 : 1) ||
        a.division.localeCompare(b.division)
    );

    summaryRows.forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.rowKey = item.key;
        row.dataset.circle = item.circle;
        row.dataset.district = item.district;
        row.appendChild(createSummaryRowCell(String(index + 1)));

        const circleCell = createSummaryRowCell(item.circle);
        circleCell.className = 'summary-circle-cell';
        row.appendChild(circleCell);

        const districtCell = createSummaryRowCell(item.district);
        districtCell.className = 'summary-district-cell';
        row.appendChild(districtCell);

        row.appendChild(createSummaryRowCell(item.division));
        valueClasses.forEach(className => {
            const cell = createSummaryRowCell('0');
            cell.className = className;
            cell.dataset.district = item.district;
            row.appendChild(cell);
        });
        body.appendChild(row);
        summaryRowElements.set(item.key, row);
    });
}

function populateLocationFilters() {
    const circleFilter = document.getElementById('circleFilter');
    const districtFilter = document.getElementById('districtFilter');
    [...new Set(summaryRows.map(row => row.circle))]
        .sort((a, b) => a.localeCompare(b))
        .forEach(circle => circleFilter.add(new Option(circle, circle)));
    updateDistrictFilterOptions();
}

function updateDistrictFilterOptions() {
    const circleFilter = document.getElementById('circleFilter');
    const districtFilter = document.getElementById('districtFilter');
    const selectedDistrict = districtFilter.value;
    const districts = [...new Set(summaryRows
        .filter(row => circleFilter.value === 'all' || row.circle === circleFilter.value)
        .map(row => row.district))]
        .sort((a, b) => a.localeCompare(b));
    districtFilter.replaceChildren(new Option('All Districts', 'all'));
    districts.forEach(district => districtFilter.add(new Option(district, district)));
    districtFilter.value = districts.includes(selectedDistrict) ? selectedDistrict : 'all';
}

function getSummaryDataCell(className, category, row) {
    const district = normalizeDistrict(row.district);
    let summaryRow;
    if ((category === 'forest' || category === 'palmForest') && row.division) {
        const mapping = (window.dashboardDivisionMappings || []).find(([division]) =>
            normalizeLocation(division) === normalizeLocation(row.division)
        );
        if (mapping) {
            summaryRow = summaryRowsByKey.get(createSummaryRowKey('division', mapping[0], mapping[2]));
        }
    }

    if (!summaryRow) {
        summaryRow = summaryRowsByKey.get(createSummaryRowKey(
            'district',
            'District-level records (division unavailable)',
            district
        ));
    }
    return summaryRowElements.get(summaryRow?.key)?.querySelector(`.${className}`) || null;
}

function applyLocationFilters() {
    const selectedCircle = document.getElementById('circleFilter').value;
    const selectedDistrict = document.getElementById('districtFilter').value;
    const rows = [...document.querySelectorAll('#tableBody tr')];

    rows.forEach(row => {
        row.hidden = (selectedCircle !== 'all' && row.dataset.circle !== selectedCircle) ||
            (selectedDistrict !== 'all' && row.dataset.district !== selectedDistrict);
        const circleCell = row.querySelector('.summary-circle-cell');
        const districtCell = row.querySelector('.summary-district-cell');
        circleCell.rowSpan = 1;
        districtCell.rowSpan = 1;
        circleCell.hidden = row.hidden;
        districtCell.hidden = row.hidden;
    });

    const visibleRows = rows.filter(row => !row.hidden);
    const mergeCells = (className, keyForRow) => {
        let start = 0;
        while (start < visibleRows.length) {
            const key = keyForRow(visibleRows[start]);
            let end = start + 1;
            while (end < visibleRows.length && keyForRow(visibleRows[end]) === key) end++;

            const firstCell = visibleRows[start].querySelector(className);
            firstCell.rowSpan = end - start;
            for (let index = start + 1; index < end; index++) {
                visibleRows[index].querySelector(className).hidden = true;
            }
            start = end;
        }
    };
    mergeCells('.summary-circle-cell', row => row.dataset.circle);
    mergeCells('.summary-district-cell', row => `${row.dataset.circle}\u0000${row.dataset.district}`);
}

function normalizeLocation(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
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
    console.log('=== Starting table update ===');
    console.log('Uploaded data:', {
        forest: uploadedData.forest.length,
        otherDept: uploadedData.otherDept.length,
        agriculture: uploadedData.agriculture.length,
        plantATree: uploadedData.plantATree.length
    });
    
    // Reset all cells to 0
    document.querySelectorAll('#tableBody td[data-district]').forEach(cell => {
        cell.textContent = '0';
    });

    // Process geotag categories
    console.log('Processing forest...');
    processCategory('forest', 'geotag-forest');
    
    console.log('Processing other dept...');
    processCategory('otherDept', 'geotag-other-dept');
    
    console.log('Processing agriculture...');
    processCategory('agriculture', 'geotag-agriculture');
    
    console.log('Processing plant a tree...');
    processCategory('plantATree', 'geotag-plant-atree');

    // Extract Silver Oak from forest and otherDept based on species
    console.log('Extracting Silver Oak...');
    extractSpeciesFromCategory('forest', 'silver-oak-forest', silverOakSpecies);
    extractSpeciesFromCategory('otherDept', 'silver-oak-other-dept', silverOakSpecies);

    // Extract Sandle Wood from forest and otherDept based on species
    console.log('Extracting Sandle Wood...');
    extractSpeciesFromCategory('forest', 'sandle-wood-forest', sandleWoodSpecies);
    extractSpeciesFromCategory('otherDept', 'sandle-wood-other-dept', sandleWoodSpecies);

    // Process palm categories
    console.log('Processing palm...');
    processCategory('palmForest', 'palm-forest');
    processCategory('palmOtherDept', 'palm-other-dept');

    updateGroupAchievements();
    applyLocationFilters();
    // Update totals
    console.log('Updating totals...');
    updateTotals();
    
    console.log('=== Table update complete ===');
}

// Process category data
function processCategory(category, cellClass) {
    const data = uploadedData[category];
    if (!data || data.length === 0) {
        console.log(`  - ${category}: No data available`);
        return;
    }

    const selectedYear = document.getElementById('yearFilter').value;

    console.log(`  - ${category}: Processing ${data.length} rows`);
    console.log('  - Sample row:', data[0]);
    console.log('  - Available columns:', Object.keys(data[0]));

    let matchedCount = 0;
    let totalSeedlings = 0;
    const unmatchedDistricts = new Set();

    data.forEach((row, index) => {
        const rawDistrict = row.district || row.District;
        const district = normalizeDistrict(rawDistrict);
        const year = row.year || row.Year;
        
        // Log first few districts for debugging
        if (index < 5) {
            console.log(`    Row ${index}: "${rawDistrict}" -> "${district}"`);
        }
        
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

        const cell = getSummaryDataCell(cellClass, category, row);
        if (cell) {
            const currentValue = parseInt(cell.textContent.replace(/,/g, '')) || 0;
            cell.textContent = (currentValue + seedlings).toLocaleString();
            matchedCount++;
            totalSeedlings += seedlings;
        } else {
            if (seedlings > 0) {
                unmatchedDistricts.add(`${rawDistrict} -> ${district}`);
            }
        }
    });

    console.log(`  - ${category}: Matched ${matchedCount} districts, Total seedlings: ${totalSeedlings.toLocaleString()}`);
    if (unmatchedDistricts.size > 0) {
        console.log(`  - Unmatched districts:`, Array.from(unmatchedDistricts).slice(0, 10));
    }
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
            const cell = getSummaryDataCell(cellClass, category, row);
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
    let normalized = district.toUpperCase().trim().replace(/\s+/g, ' ');
    
    // Handle common district name variations - map to table district names
    const variations = {
        'NILGIRIS': 'THE NILGIRIS',
        'THE NILGIRIS': 'THE NILGIRIS',
        'TIRUVANNAMALAI': 'TIRUVANNAMALAI',
        'THIRUVANNAMALAI': 'TIRUVANNAMALAI',
        'TIRUNELVELI': 'THIRUNELVELI',
        'THIRUNELVELI': 'THIRUNELVELI',
        'TIRUVARUR': 'THIRUVARUR',
        'THIRUVARUR': 'THIRUVARUR',
        'TIRUVALLUR': 'THIRUVALLUR',
        'THIRUVALLUR': 'THIRUVALLUR',
        'TIRUCHIRAPPALLI': 'TIRUCHIRAPPALLI',
        'THIRUCHIRAPPALLI': 'TIRUCHIRAPPALLI',
        'TIRUPATTUR': 'TIRUPATTUR',
        'TIRUPATTUR': 'TIRUPATTUR',
        'TIRUPPUR': 'TIRUPPUR',
        'TIRUPPUR': 'TIRUPPUR',
        'TUTICORIN': 'TUTICORIN',
        'TUTICORIN': 'TUTICORIN'
    };
    
    // Return the standardized version if it exists in variations
    if (variations[normalized]) {
        return variations[normalized];
    }
    
    return normalized;
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
        'totalPalmOtherDept': 'palm-other-dept',
        'totalGeotagAchievement': 'achievement-geotag',
        'totalSilverOakAchievement': 'achievement-silver-oak',
        'totalSandleWoodAchievement': 'achievement-sandle-wood',
        'totalPalmAchievement': 'achievement-palm'
    };

    Object.keys(totals).forEach(totalId => {
        const cellClass = totals[totalId];
        const cells = document.querySelectorAll(`.${cellClass}`);
        let total = 0;
        cells.forEach(cell => {
            if (cell.closest('tr').hidden) return;
            const value = parseInt(cell.textContent.replace(/,/g, '')) || 0;
            total += value;
        });
        document.getElementById(totalId).textContent = total.toLocaleString();
    });
}

// Apply year filter
function applyFilters() {
    updateDistrictFilterOptions();
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

    updateGroupAchievements();
    applyLocationFilters();
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

    updateGroupAchievements();
    applyLocationFilters();
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

        const cell = getSummaryDataCell(cellClass, category, row);
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
            const cell = getSummaryDataCell(cellClass, category, row);
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
    if (typeof XLSX === 'undefined') {
        throw new Error('Excel export is unavailable because the spreadsheet library did not load.');
    }

    const columnDefinitions = [
        { header: 'S.No', className: null },
        { header: 'Circle', className: null },
        { header: 'District', className: null },
        { header: 'Division', className: null },
        { header: 'Target', className: 'target-geotag' },
        { header: 'Forest', className: 'geotag-forest' },
        { header: 'Other Dept', className: 'geotag-other-dept' },
        { header: 'Agriculture', className: 'geotag-agriculture' },
        { header: 'Plant aTree', className: 'geotag-plant-atree' },
        { header: 'Achievement', className: 'achievement-geotag' },
        { header: 'Target', className: 'target-silver-oak' },
        { header: 'Forest', className: 'silver-oak-forest' },
        { header: 'Other Dept', className: 'silver-oak-other-dept' },
        { header: 'Achievement', className: 'achievement-silver-oak' },
        { header: 'Target', className: 'target-sandle-wood' },
        { header: 'Forest', className: 'sandle-wood-forest' },
        { header: 'Other Dept', className: 'sandle-wood-other-dept' },
        { header: 'Achievement', className: 'achievement-sandle-wood' },
        { header: 'Target', className: 'target-palm' },
        { header: 'Forest', className: 'palm-forest' },
        { header: 'Other Dept', className: 'palm-other-dept' },
        { header: 'Achievement', className: 'achievement-palm' }
    ];
    const groupHeaders = [
        'S.No', 'Circle', 'District', 'Division',
        'Geotag', '', '', '', '', '',
        'Silver Oak', '', '', '',
        'Sandle Wood', '', '', '',
        'Palm', '', '', ''
    ];
    const detailHeaders = [
        '', '', '', '',
        ...columnDefinitions.slice(4).map(column => column.header)
    ];
    const visibleRows = [...document.querySelectorAll('#tableBody tr')]
        .filter(row => !row.hidden);
    const totals = Array(columnDefinitions.length - 4).fill(0);
    const dataRows = visibleRows.map((row, index) => columnDefinitions.map((column, columnIndex) => {
        if (columnIndex === 0) return index + 1;
        if (columnIndex === 1) return row.dataset.circle || '';
        if (columnIndex === 2) return row.dataset.district || '';
        if (columnIndex === 3) return row.cells[3]?.textContent.trim() || '';

        const text = row.querySelector(`.${column.className}`)?.textContent.trim() || '0';
        const value = Number(text.replace(/,/g, ''));
        const numericValue = Number.isFinite(value) ? value : 0;
        totals[columnIndex - 4] += numericValue;
        return numericValue;
    }));

    const totalRow = ['Total', '', '', '', ...totals];
    const worksheet = XLSX.utils.aoa_to_sheet([
        ['Comprehensive Summary Table'],
        groupHeaders,
        detailHeaders,
        ...dataRows,
        totalRow
    ]);

    worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: columnDefinitions.length - 1 } },
        ...[0, 1, 2, 3].map(column => ({ s: { r: 1, c: column }, e: { r: 2, c: column } })),
        { s: { r: 1, c: 4 }, e: { r: 1, c: 9 } },
        { s: { r: 1, c: 10 }, e: { r: 1, c: 13 } },
        { s: { r: 1, c: 14 }, e: { r: 1, c: 17 } },
        { s: { r: 1, c: 18 }, e: { r: 1, c: 21 } }
    ];
    worksheet['!autofilter'] = {
        ref: `A3:V${2 + dataRows.length}`
    };
    worksheet['!cols'] = [
        { wch: 7 }, { wch: 22 }, { wch: 20 }, { wch: 38 },
        ...Array(18).fill({ wch: 15 })
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary');
    XLSX.writeFile(workbook, 'comprehensive_summary.xlsx');
}

// Load data from JSON file
async function loadDataFromJSON() {
    console.log('Attempting to load data from JSON files...');

    try {
        // Try to load from R2 first, fallback to local files
        const useR2 = typeof R2_CONFIG !== 'undefined' && R2_CONFIG.accountId !== 'YOUR_ACCOUNT_ID';

        const baseUrl = useR2 ? R2_CONFIG.publicUrl : '';

        console.log('Using baseUrl:', baseUrl);
        console.log('useR2:', useR2);

        // Load each data file separately with fallback to local
        const fetchWithFallback = async (filename) => {
            if (useR2) {
                try {
                    const r = await fetch(`${baseUrl}/${filename}`);
                    console.log(`${filename} fetch from R2:`, r.status, r.ok);
                    if (r.ok) {
                        return await r.json();
                    }
                    console.log(`R2 failed for ${filename}, trying local...`);
                } catch (e) {
                    console.log(`R2 error for ${filename}:`, e.message, 'trying local...');
                }
            }
            // Fallback to local file
            try {
                const r = await fetch(filename);
                console.log(`${filename} fetch from local:`, r.status, r.ok);
                if (r.ok) {
                    return await r.json();
                }
                console.error(`Local fetch failed for ${filename}`);
                return [];
            } catch (e) {
                console.error(`Local fetch error for ${filename}:`, e);
                return [];
            }
        };

        const [forestData, otherDeptData, agricultureData, plantATreeData, palmForestData, palmOtherDeptData] = await Promise.all([
            fetchWithFallback('data_forest.json'),
            fetchWithFallback('data_other_dept.json'),
            fetchWithFallback('data_agriculture.json'),
            fetchWithFallback('data_plant_atree.json'),
            fetchWithFallback('data_palm_forest.json'),
            fetchWithFallback('data_palm_other_dept.json')
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
        // Don't show alert - just log error
    }
}
