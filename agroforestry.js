const yearFilter = document.getElementById('yearFilter');
const circleFilter = document.getElementById('circleFilter');
let agroforestryRecords = [];

const divisionMappings = [
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

const uniqueDistrictDivisions = {
    ARIYALUR: 'Ariyalur',
    CUDDALORE: 'Cuddalore',
    KANYAKUMARI: 'Kanniyakumari',
    KARUR: 'Karur',
    MAYILADUTHURAI: 'MAYILADUTHURAI',
    NAMAKKAL: 'Namakkal',
    PERAMBALUR: 'Perambalur',
    PUDUKKOTTAI: 'Pudukkottai',
    RANIPET: 'Ranipet',
    SIVAGANGA: 'Sivagangai',
    TENKASI: 'Tenkasi',
    THANJAVUR: 'Thanjavur',
    TIRUPATTUR: 'Thiruppathur',
    THIRUVARUR: 'Thiruvarur',
    TUTICORIN: 'Thoothukudi',
    TIRUPPUR: 'Tiruppur',
    THIRUVALLUR: 'Tiruvallur',
    TIRUVANNAMALAI: 'Tiruvannamalai'
};

document.addEventListener('DOMContentLoaded', loadAgroforestryData);
yearFilter.addEventListener('change', renderAgroforestryTable);
circleFilter.addEventListener('change', renderAgroforestryTable);

async function loadAgroforestryData() {
    const status = document.getElementById('loadStatus');

    try {
        const useR2 = typeof R2_CONFIG !== 'undefined' && R2_CONFIG.accountId !== 'YOUR_ACCOUNT_ID';
        const fetchData = async filename => {
            if (useR2) {
                try {
                    const response = await fetch(`${R2_CONFIG.publicUrl}/${filename}`);
                    if (!response.ok) {
                        throw new Error(`Cloud request for ${filename} failed (${response.status})`);
                    }
                    return response.json();
                } catch (error) {
                    console.warn(`Could not load ${filename} from cloud; trying the local data file.`, error);
                }
            }

            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Local request for ${filename} failed (${response.status})`);
            }
            return response.json();
        };

        const [forestRecords, otherDeptRecords] = await Promise.all([
            fetchData('data_forest.json'),
            fetchData('data_other_dept.json')
        ]);
        if (!Array.isArray(forestRecords) || !Array.isArray(otherDeptRecords)) {
            throw new Error('A planting data file does not contain a record list.');
        }

        agroforestryRecords = [
            ...forestRecords
                .filter(record => String(record['Land Type'] || '').trim().toLowerCase() === 'farm land')
                .map(record => ({
                    division: String(record.Division || '').trim(),
                    district: String(record.District || '').trim().toUpperCase(),
                    species: String(record.Species || '').trim() || 'Unspecified',
                    year: String(record.Year || '').trim(),
                    seedlings: parseSeedlingCount(record.Seedlings),
                    source: 'forest'
                })),
            ...otherDeptRecords
                .filter(record => String(record['Land Type'] || '').trim().toLowerCase() === 'farm land')
                .map(record => ({
                    division: '',
                    district: String(record.District || '').trim().toUpperCase(),
                    species: String(record.Species || '').trim() || 'Unspecified',
                    year: String(record.Year || '').trim(),
                    seedlings: parseSeedlingCount(record.Seedlings),
                    source: 'other'
                }))
        ];

        const years = [...new Set(agroforestryRecords.map(record => record.year).filter(Boolean))]
            .sort((a, b) => b.localeCompare(a));
        years.forEach(year => yearFilter.add(new Option(year, year)));
        const circles = [...new Set(divisionMappings.map(([, circle]) => circle))]
            .sort((a, b) => a.localeCompare(b));
        circles.push('Unassigned');
        circles.forEach(circle => circleFilter.add(new Option(circle, circle)));
        status.textContent = '';
        renderAgroforestryTable();
    } catch (error) {
        console.error('Unable to load agroforestry data:', error);
        status.textContent = `Unable to load agroforestry data: ${error.message}`;
        document.getElementById('agroforestryTableHead').replaceChildren();
        document.getElementById('agroforestryTableBody').replaceChildren();
        document.getElementById('agroforestryTableFoot').replaceChildren();
    }
}

function parseSeedlingCount(value) {
    const count = Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(count) ? count : 0;
}

function normalizeDivision(value) {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getCircle(division) {
    const normalized = normalizeDivision(division);
    const entry = divisionMappings.find(([name]) => normalizeDivision(name) === normalized);
    return entry ? entry[1] : 'Unassigned';
}

function createCell(tagName, text, className = '') {
    const cell = document.createElement(tagName);
    cell.textContent = text;
    if (className) cell.className = className;
    return cell;
}

function renderAgroforestryTable() {
    const selectedYear = yearFilter.value;
    const selectedCircle = circleFilter.value;
    const rowsByDivision = new Map();
    const speciesNames = [...new Set(agroforestryRecords.map(record => record.species))]
        .sort((a, b) => a.localeCompare(b));

    divisionMappings.forEach(([division, circle, district]) => {
        if (selectedCircle !== 'all' && circle !== selectedCircle) return;
        rowsByDivision.set(`${normalizeDivision(division)}\u0000${normalizeDivision(district)}`, {
            division,
            circle,
            district,
            counts: new Map()
        });
    });

    const addSeedlings = (division, circle, district, record) => {
        if (selectedCircle !== 'all' && circle !== selectedCircle) return;
        const divisionKey = `${normalizeDivision(division)}\u0000${normalizeDivision(district || 'Unknown')}`;
        const divisionRow = rowsByDivision.get(divisionKey) || {
            division,
            circle,
            district: district || 'Unknown',
            counts: new Map()
        };
        const speciesCounts = divisionRow.counts.get(record.species) || { forest: 0, other: 0 };
        speciesCounts[record.source] += record.seedlings;
        divisionRow.counts.set(record.species, speciesCounts);
        rowsByDivision.set(divisionKey, divisionRow);
    };

    agroforestryRecords.forEach(record => {
        if (selectedYear !== 'all' && record.year !== selectedYear) return;

        if (record.source === 'forest') {
            const mapping = divisionMappings.find(([division]) =>
                normalizeDivision(division) === normalizeDivision(record.division)
            );
            addSeedlings(record.division, getCircle(record.division), mapping?.[2] || record.district, record);
            return;
        }

        const mappedDivision = uniqueDistrictDivisions[record.district];
        if (mappedDivision) {
            addSeedlings(mappedDivision, getCircle(mappedDivision), record.district, record);
        } else {
            addSeedlings('Unassigned', 'Unassigned', record.district || 'Unknown', record);
        }
    });

    const rows = [...rowsByDivision.values()]
        .map(row => ({
            ...row,
            total: speciesNames.reduce((sum, species) => {
                const counts = row.counts.get(species) || { forest: 0, other: 0 };
                return sum + counts.forest + counts.other;
            }, 0)
        }))
        .sort((a, b) =>
            a.circle.localeCompare(b.circle) ||
            a.district.localeCompare(b.district) ||
            a.division.localeCompare(b.division)
        );

    const tableHead = document.getElementById('agroforestryTableHead');
    const tableBody = document.getElementById('agroforestryTableBody');
    const tableFoot = document.getElementById('agroforestryTableFoot');
    const table = tableHead.closest('table');
    const columnGroup = document.createElement('colgroup');
    [42, 105, 110, 185, ...Array(speciesNames.length * 2).fill(64), 90].forEach(width => {
        const column = document.createElement('col');
        column.style.width = `${width}px`;
        columnGroup.appendChild(column);
    });
    table.querySelector('colgroup')?.remove();
    table.insertBefore(columnGroup, tableHead);
    tableHead.replaceChildren();
    tableBody.replaceChildren();
    tableFoot.replaceChildren();

    if (rows.length === 0) {
        document.getElementById('loadStatus').textContent = 'No farm land records were found.';
        return;
    }

    document.getElementById('loadStatus').textContent = '';
    const titleRow = document.createElement('tr');
    const titleCell = createCell('th', 'Agroforestry Planting Progress', 'table-title');
    titleCell.colSpan = speciesNames.length * 2 + 5;
    titleRow.appendChild(titleCell);
    tableHead.appendChild(titleRow);

    const groupedHeader = document.createElement('tr');
    ['Sl. No', 'Circle', 'District', 'Division'].forEach(header => {
        const cell = createCell('th', header);
        cell.rowSpan = 2;
        groupedHeader.appendChild(cell);
    });
    speciesNames.forEach(species => {
        const cell = createCell('th', species);
        cell.colSpan = 2;
        groupedHeader.appendChild(cell);
    });
    const totalHeader = createCell('th', 'Total');
    totalHeader.rowSpan = 2;
    groupedHeader.appendChild(totalHeader);
    tableHead.appendChild(groupedHeader);

    const sourceHeader = document.createElement('tr');
    speciesNames.forEach(() => {
        sourceHeader.appendChild(createCell('th', 'Forest'));
        sourceHeader.appendChild(createCell('th', 'Other Dept'));
    });
    tableHead.appendChild(sourceHeader);

    const circleSizes = new Map();
    rows.forEach(row => circleSizes.set(row.circle, (circleSizes.get(row.circle) || 0) + 1));
    const circleRendered = new Set();
    const totals = new Map(speciesNames.map(species => [species, { forest: 0, other: 0 }]));
    let grandTotal = 0;

    rows.forEach((row, index) => {
        const tableRow = document.createElement('tr');
        tableRow.appendChild(createCell('td', String(index + 1)));

        if (!circleRendered.has(row.circle)) {
            const circleCell = createCell('td', row.circle, 'circle-cell');
            circleCell.rowSpan = circleSizes.get(row.circle);
            tableRow.appendChild(circleCell);
            circleRendered.add(row.circle);
        }

        const districtKey = `${normalizeDivision(row.circle)}\u0000${normalizeDivision(row.district)}`;
        const previousRow = rows[index - 1];
        const previousDistrictKey = previousRow
            ? `${normalizeDivision(previousRow.circle)}\u0000${normalizeDivision(previousRow.district)}`
            : '';
        if (districtKey !== previousDistrictKey) {
            const districtCell = createCell('td', row.district, 'district-cell');
            while (
                index + districtCell.rowSpan < rows.length &&
                `${normalizeDivision(rows[index + districtCell.rowSpan].circle)}\u0000${normalizeDivision(rows[index + districtCell.rowSpan].district)}` === districtKey
            ) {
                districtCell.rowSpan += 1;
            }
            tableRow.appendChild(districtCell);
        }
        tableRow.appendChild(createCell('td', row.division, 'division-cell'));
        speciesNames.forEach(species => {
            const counts = row.counts.get(species) || { forest: 0, other: 0 };
            const speciesTotal = totals.get(species);
            speciesTotal.forest += counts.forest;
            speciesTotal.other += counts.other;
            tableRow.appendChild(createCell('td', counts.forest ? counts.forest.toLocaleString() : ''));
            tableRow.appendChild(createCell('td', counts.other ? counts.other.toLocaleString() : ''));
        });
        grandTotal += row.total;
        tableRow.appendChild(createCell('td', row.total ? row.total.toLocaleString() : ''));
        tableBody.appendChild(tableRow);
    });

    const totalRow = document.createElement('tr');
    const totalLabel = createCell('td', 'Total');
    totalLabel.colSpan = 4;
    totalRow.appendChild(totalLabel);
    speciesNames.forEach(species => {
        const counts = totals.get(species);
        totalRow.appendChild(createCell('td', counts.forest.toLocaleString()));
        totalRow.appendChild(createCell('td', counts.other.toLocaleString()));
    });
    totalRow.appendChild(createCell('td', grandTotal.toLocaleString()));
    tableFoot.appendChild(totalRow);
}
