const componentDivisions = [
    ['AAZP, Vandalur', 'AAZP', 'CHENGALPATTU'],
    ['Agro Forestry Research, Madurai', 'RESEARCH, CHENNAI', 'MADURAI'],
    ['AIWC', 'AIWC,Vandalur', 'CHENGALPATTU'],
    ['Ariyalur', 'Trichy', 'ARIYALUR'],
    ['ATR,Coimbatore', 'ATR, Coimbatore', 'COIMBATORE'],
    ['Attur Forest Division', 'Salem', 'SALEM'],
    ['Chengalpet (2021-25)', 'Chennai', 'CHENGALPATTU'],
    ['Chengalpet 2025', 'Chennai', 'CHENGALPATTU'],
    ['Chennai', 'Chennai', 'CHENNAI'],
    ['Coimbatore', 'ATR, Coimbatore', 'COIMBATORE'],
    ['Cuddalore', 'Villupuram', 'CUDDALORE'],
    ['Deputy Director, MTR, Masinagudi (Buffer)', 'MTR, Ooty', 'THE NILGIRIS'],
    ['Deputy Director, MTR, Ooty (Core)', 'MTR, Ooty', 'THE NILGIRIS'],
    ['Dharmapuri', 'Dharmapuri', 'DHARMAPURI'],
    ['Dindigul', 'Dindigul', 'DINDIGUL'],
    ['ECO', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['Erode', 'STR, Erode', 'ERODE'],
    ['FE,Chengalpet', 'Chennai', 'CHENNAI'],
    ['Forest Engineering Division, Harur', 'Dharmapuri', 'DHARMAPURI'],
    ['Forest Engineering Division, Trichy', 'Trichy', 'TIRUCHIRAPPALLI'],
    ['Forest Protection Squad, Dindigul', 'Dindigul', 'DINDIGUL'],
    ['Forest Protection Squad, Erode', 'STR, Erode', 'ERODE'],
    ['Forest Protection Squad, Vellore', 'Vellore', 'VELLORE'],
    ['Forest Station', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['FPS, Tirunelveli', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['FPS, Villupuram', 'Villupuram', 'VILLUPURAM'],
    ['Genetics, Coimbatore', 'RESEARCH, CHENNAI', 'COIMBATORE'],
    ['Gudalur', 'MTR, Ooty', 'THE NILGIRIS'],
    ['Hassanur', 'STR, Erode', 'ERODE'],
    ['Hosur', 'Dharmapuri', 'KRISHNAGIRI'],
    ['Industrial Wood Research Division', 'Trichy', 'TIRUCHIRAPPALLI'],
    ['IWRD, Trichy', 'RESEARCH, CHENNAI', 'TIRUCHIRAPPALLI'],
    ['Kalakad', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['KALLAKURICHI', 'Villupuram', 'KALLAKURICHI'],
    ['Kallakurichi Forest Division', 'Villupuram', 'KALLAKURICHI'],
    ['Kancheepuram', 'Chennai', 'KANCHEEPURAM'],
    ['Kanniyakumari', 'KMTR, Tirunelveli', 'KANYAKUMARI'],
    ['Karur', 'Dindigul', 'KARUR'],
    ['Kodaikanal', 'Dindigul', 'DINDIGUL'],
    ['Madurai', 'SMTR, Madurai', 'MADURAI'],
    ['MAYILADUTHURAI', 'Trichy', 'MAYILADUTHURAI'],
    ['Modern Nursery, Dharmapuri', 'RESEARCH, CHENNAI', 'DHARMAPURI'],
    ['Nagapattinam', 'Trichy', 'NAGAPATTINAM'],
    ['Namakkal', 'Salem', 'NAMAKKAL'],
    ['Nilgiris', 'MTR, Ooty', 'THE NILGIRIS'],
    ['Perambalur', 'Trichy', 'PERAMBALUR'],
    ['Pollachi', 'ATR, Coimbatore', 'COIMBATORE'],
    ['PT, Ambasamudram', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['Pudukkottai', 'Trichy', 'PUDUKKOTTAI'],
    ['Ramnad (Ter)', 'SMTR, Madurai', 'RAMANATHAPURAM'],
    ['Ranipet', 'Vellore', 'RANIPET'],
    ['Salem', 'Salem', 'SALEM'],
    ['Sathyamangalam', 'STR, Erode', 'ERODE'],
    ['SF and Extn, Dharmapuri', 'Dharmapuri', 'DHARMAPURI'],
    ['SF, Chengalpet', 'Chennai', 'CHENGALPATTU'],
    ['SF, Dindigul', 'Dindigul', 'DINDIGUL'],
    ['SF, Krishnagiri', 'Dharmapuri', 'KRISHNAGIRI'],
    ['SF, Virudhunagar', 'SMTR, Madurai', 'VIRUDHUNAGAR'],
    ['SFRI, Kolapakkam', 'RESEARCH, CHENNAI', 'KANCHEEPURAM'],
    ['Sivagangai', 'SMTR, Madurai', 'SIVAGANGA'],
    ['State Forest Research Division', 'Chennai', 'CHENNAI'],
    ['Tenkasi', 'KMTR, Tirunelveli', 'TENKASI'],
    ['Thanjavur', 'Trichy', 'THANJAVUR'],
    ['Theni', 'SMTR, Madurai', 'THENI'],
    ['Thiruppathur', 'Vellore', 'TIRUPATTUR'],
    ['Thiruvarur', 'Trichy', 'THIRUVARUR'],
    ['Thoothukudi', 'KMTR, Tirunelveli', 'TUTICORIN'],
    ['Tirunelveli 2021-25', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['Tirunelveli 2025', 'KMTR, Tirunelveli', 'THIRUNELVELI'],
    ['Tiruppur', 'ATR, Coimbatore', 'TIRUPPUR'],
    ['Tiruvallur', 'Chennai', 'THIRUVALLUR'],
    ['Tiruvannamalai', 'Vellore', 'TIRUVANNAMALAI'],
    ['TNFA,CBE', 'TNFA, Coimbatore', 'COIMBATORE'],
    ['TNFTC, Vaigai Dam', 'TNFA, Coimbatore', 'COIMBATORE'],
    ['Trichy', 'Trichy', 'TIRUCHIRAPPALLI'],
    ['Vellore', 'Vellore', 'VELLORE'],
    ['Villupuram', 'Villupuram', 'VILLUPURAM'],
    ['WL Ramnad', 'SMTR, Madurai', 'RAMANATHAPURAM'],
    ['WL, Megamalai', 'SMTR, Madurai', 'THENI'],
    ['WL, Nagapattinam', 'Trichy', 'NAGAPATTINAM'],
    ['WL, Srivilliputhur', 'SMTR, Madurai', 'VIRUDHUNAGAR'],
    ['WLW, Chennai', 'AAZP', 'CHENNAI'],
    ['WP, Coimbatore', 'WP, Coimbatore', 'COIMBATORE'],
    ['WP, Trichy', 'WP, Trichy', 'TIRUCHIRAPPALLI'],
    ['WP, Vellore', 'WP, Vellore', 'VELLORE']
];

const componentNames = ['Forest', 'Agroforestry', 'Urban Greening', 'Institutional', 'Coastal Greening'];
const componentByLandType = new Map([
    ['degraded forest', 'Forest'],
    ['farm land', 'Agroforestry'],
    ['govt. land', 'Urban Greening'],
    ['tank foreshore', 'Urban Greening'],
    ['institutional land', 'Institutional'],
    ['coastal forest', 'Coastal Greening']
]);
const divisionLookup = new Map(
    componentDivisions.map(([division, circle, district]) => [normalizeLocation(division), { division, circle, district }])
);
const divisionDistricts = new Map();
let plantingRecords = [];
let tableRows = [];

document.addEventListener('DOMContentLoaded', loadComponentData);
document.getElementById('yearFilter').addEventListener('change', renderComponentTable);
document.getElementById('startDateFilter').addEventListener('change', renderComponentTable);
document.getElementById('endDateFilter').addEventListener('change', renderComponentTable);
document.getElementById('circleFilter').addEventListener('change', () => {
    updateDistrictOptions();
    renderComponentTable();
});
document.getElementById('districtFilter').addEventListener('change', renderComponentTable);

function normalizeLocation(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function createTableCell(tagName, text, className = '') {
    const cell = document.createElement(tagName);
    cell.textContent = text;
    if (className) cell.className = className;
    return cell;
}

function parseSeedlingCount(value) {
    const count = Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(count) ? count : 0;
}

function toDateInputValue(value) {
    if (value === null || value === undefined || value === '') return '';
    let date;
    if (typeof value === 'number' && Number.isFinite(value)) {
        date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    } else {
        date = new Date(value);
    }
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function getCircleForDistrict(district) {
    const circles = new Set(
        componentDivisions
            .filter(([, , mappedDistrict]) => normalizeLocation(mappedDistrict) === normalizeLocation(district))
            .map(([, circle]) => circle)
    );
    return circles.size === 1 ? [...circles][0] : 'Unassigned';
}

async function fetchData(filename) {
    const useR2 = typeof R2_CONFIG !== 'undefined' && R2_CONFIG.accountId !== 'YOUR_ACCOUNT_ID';
    if (useR2) {
        try {
            const response = await fetch(`${R2_CONFIG.publicUrl}/${filename}`);
            if (!response.ok) throw new Error(`Cloud request for ${filename} failed (${response.status})`);
            return response.json();
        } catch (error) {
            console.warn(`Could not load ${filename} from cloud; trying the local data file.`, error);
        }
    }

    const response = await fetch(filename);
    if (!response.ok) throw new Error(`Local request for ${filename} failed (${response.status})`);
    return response.json();
}

async function loadComponentData() {
    const status = document.getElementById('componentLoadStatus');
    try {
        const [forestRecords, otherDeptRecords] = await Promise.all([
            fetchData('data_forest.json'),
            fetchData('data_other_dept.json')
        ]);
        if (!Array.isArray(forestRecords) || !Array.isArray(otherDeptRecords)) {
            throw new Error('A planting data file does not contain a record list.');
        }

        plantingRecords = [
            ...forestRecords.map(record => ({
                ...record,
                source: 'forest',
                component: componentByLandType.get(normalizeLocation(record['Land Type'])),
                date: toDateInputValue(record.Date)
            })),
            ...otherDeptRecords.map(record => ({
                ...record,
                source: 'other',
                component: componentByLandType.get(normalizeLocation(record['Land Type'])),
                date: toDateInputValue(record.Date)
            }))
        ].filter(record => record.component);

        tableRows = componentDivisions.map(([division, circle, district]) => ({
            division,
            circle,
            district,
            key: `division\u0000${normalizeLocation(division)}\u0000${normalizeLocation(district)}`
        }));

        const otherDistricts = [...new Set(
            plantingRecords
                .filter(record => record.source === 'other')
                .map(record => String(record.District || '').trim().toUpperCase())
                .filter(Boolean)
        )];
        otherDistricts.forEach(district => {
            const circle = getCircleForDistrict(district);
            tableRows.push({
                division: 'Other Department (division unavailable)',
                circle,
                district,
                key: `other\u0000${normalizeLocation(district)}`
            });
        });

        const years = [...new Set(plantingRecords.map(record => String(record.Year || '').trim()).filter(Boolean))]
            .sort((a, b) => b.localeCompare(a));
        years.forEach(year => document.getElementById('yearFilter').add(new Option(year, year)));

        const circles = [...new Set(tableRows.map(row => row.circle))].sort((a, b) => a.localeCompare(b));
        circles.forEach(circle => document.getElementById('circleFilter').add(new Option(circle, circle)));
        updateDistrictOptions();

        status.textContent = `${plantingRecords.length.toLocaleString()} records loaded. Achievement is the sum of seedlings; target values are not available in the source data.`;
        renderComponentTable();
    } catch (error) {
        console.error('Unable to load component geotag data:', error);
        status.textContent = `Unable to load component geotag data: ${error.message}`;
        document.getElementById('componentTableHead').replaceChildren();
        document.getElementById('componentTableBody').replaceChildren();
        document.getElementById('componentTableFoot').replaceChildren();
    }
}

function updateDistrictOptions() {
    const circleFilter = document.getElementById('circleFilter');
    const districtFilter = document.getElementById('districtFilter');
    const selectedDistrict = districtFilter.value;
    const selectedCircle = circleFilter.value;
    const districts = [...new Set(tableRows
        .filter(row => selectedCircle === 'all' || row.circle === selectedCircle)
        .map(row => row.district)
    )].sort((a, b) => a.localeCompare(b));

    districtFilter.replaceChildren(new Option('All Districts', 'all'));
    districts.forEach(district => districtFilter.add(new Option(district, district)));
    districtFilter.value = districts.includes(selectedDistrict) ? selectedDistrict : 'all';
}

function recordMatchesFilters(record) {
    const year = document.getElementById('yearFilter').value;
    const startDate = document.getElementById('startDateFilter').value;
    const endDate = document.getElementById('endDateFilter').value;
    if (year !== 'all' && String(record.Year || '').trim() !== year) return false;
    if (startDate && (!record.date || record.date < startDate)) return false;
    if (endDate && (!record.date || record.date > endDate)) return false;
    return true;
}

function getRecordRow(record) {
    if (record.source === 'other') {
        const district = String(record.District || '').trim().toUpperCase();
        return tableRows.find(row => row.key === `other\u0000${normalizeLocation(district)}`);
    }

    const division = String(record.Division || '').trim();
    const mapping = divisionLookup.get(normalizeLocation(division));
    if (mapping) {
        return tableRows.find(row =>
            row.key === `division\u0000${normalizeLocation(mapping.division)}\u0000${normalizeLocation(mapping.district)}`
        );
    }

    const district = String(record.District || '').trim().toUpperCase() || 'UNKNOWN';
    const key = `unknown\u0000${normalizeLocation(division)}\u0000${normalizeLocation(district)}`;
    let row = tableRows.find(item => item.key === key);
    if (!row) {
        row = { division: division || 'Unassigned', circle: 'Unassigned', district, key };
        tableRows.push(row);
    }
    return row;
}

function renderComponentTable() {
    const tableHead = document.getElementById('componentTableHead');
    const tableBody = document.getElementById('componentTableBody');
    const tableFoot = document.getElementById('componentTableFoot');
    const selectedCircle = document.getElementById('circleFilter').value;
    const selectedDistrict = document.getElementById('districtFilter').value;
    const aggregates = new Map();
    let filteredRecordCount = 0;

    plantingRecords.forEach(record => {
        if (!recordMatchesFilters(record)) return;
        const row = getRecordRow(record);
        if (!row ||
            (selectedCircle !== 'all' && row.circle !== selectedCircle) ||
            (selectedDistrict !== 'all' && row.district !== selectedDistrict)) return;

        const aggregate = aggregates.get(row.key) || Object.fromEntries(componentNames.map(name => [name, 0]));
        aggregate[record.component] += parseSeedlingCount(record.Seedlings);
        aggregates.set(row.key, aggregate);
        filteredRecordCount++;
    });

    const rows = tableRows
        .filter(row =>
            (selectedCircle === 'all' || row.circle === selectedCircle) &&
            (selectedDistrict === 'all' || row.district === selectedDistrict)
        )
        .map(row => ({ ...row, counts: aggregates.get(row.key) || Object.fromEntries(componentNames.map(name => [name, 0])) }))
        .sort((a, b) =>
            a.circle.localeCompare(b.circle) ||
            a.district.localeCompare(b.district) ||
            a.division.localeCompare(b.division)
        );

    tableHead.replaceChildren();
    tableBody.replaceChildren();
    tableFoot.replaceChildren();
    const titleRow = document.createElement('tr');
    const titleCell = createTableCell('th', 'Component wise geotags', 'report-title');
    titleCell.colSpan = 15;
    titleRow.appendChild(titleCell);
    tableHead.appendChild(titleRow);

    const mainHeader = document.createElement('tr');
    ['Sl. No', 'Circle', 'District', 'Division'].forEach(label => {
        const cell = createTableCell('th', label);
        cell.rowSpan = 2;
        mainHeader.appendChild(cell);
    });
    componentNames.forEach(component => {
        const cell = createTableCell('th', component);
        cell.colSpan = 2;
        mainHeader.appendChild(cell);
    });
    const totalHeader = createTableCell('th', 'Total');
    totalHeader.rowSpan = 2;
    mainHeader.appendChild(totalHeader);
    tableHead.appendChild(mainHeader);

    const subHeader = document.createElement('tr');
    componentNames.forEach(() => {
        subHeader.appendChild(createTableCell('th', 'Target'));
        subHeader.appendChild(createTableCell('th', 'Achievement'));
    });
    tableHead.appendChild(subHeader);

    const circleSizes = new Map();
    const districtSizes = new Map();
    rows.forEach(row => {
        circleSizes.set(row.circle, (circleSizes.get(row.circle) || 0) + 1);
        const districtKey = `${normalizeLocation(row.circle)}\u0000${normalizeLocation(row.district)}`;
        districtSizes.set(districtKey, (districtSizes.get(districtKey) || 0) + 1);
    });

    const totals = Object.fromEntries(componentNames.map(name => [name, 0]));
    const circleRendered = new Set();
    const districtRendered = new Set();
    rows.forEach((row, index) => {
        const tableRow = document.createElement('tr');
        tableRow.appendChild(createTableCell('td', String(index + 1)));
        if (!circleRendered.has(row.circle)) {
            const circleCell = createTableCell('td', row.circle, 'circle-cell');
            circleCell.rowSpan = circleSizes.get(row.circle);
            tableRow.appendChild(circleCell);
            circleRendered.add(row.circle);
        }

        const districtKey = `${normalizeLocation(row.circle)}\u0000${normalizeLocation(row.district)}`;
        if (!districtRendered.has(districtKey)) {
            const districtCell = createTableCell('td', row.district, 'district-cell');
            districtCell.rowSpan = districtSizes.get(districtKey);
            tableRow.appendChild(districtCell);
            districtRendered.add(districtKey);
        }

        tableRow.appendChild(createTableCell('td', row.division));
        let rowTotal = 0;
        componentNames.forEach(component => {
            tableRow.appendChild(createTableCell('td', ''));
            const achievement = row.counts[component];
            tableRow.appendChild(createTableCell('td', achievement ? achievement.toLocaleString() : '0'));
            totals[component] += achievement;
            rowTotal += achievement;
        });
        tableRow.appendChild(createTableCell('td', rowTotal.toLocaleString()));
        tableBody.appendChild(tableRow);
    });

    const totalRow = document.createElement('tr');
    const totalLabel = createTableCell('td', 'Total');
    totalLabel.colSpan = 4;
    totalRow.appendChild(totalLabel);
    let grandTotal = 0;
    componentNames.forEach(component => {
        totalRow.appendChild(createTableCell('td', ''));
        totalRow.appendChild(createTableCell('td', totals[component].toLocaleString()));
        grandTotal += totals[component];
    });
    totalRow.appendChild(createTableCell('td', grandTotal.toLocaleString()));
    tableFoot.appendChild(totalRow);

    const status = document.getElementById('componentLoadStatus');
    if (plantingRecords.length) {
        status.textContent = `${filteredRecordCount.toLocaleString()} matching records · ${grandTotal.toLocaleString()} seedlings. Target values are not available in the source data.`;
    }
}
