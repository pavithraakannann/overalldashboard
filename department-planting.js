const departmentYearFilter = document.getElementById('departmentYearFilter');
const departmentTypeFilter = document.getElementById('departmentTypeFilter');
const departmentCircleFilter = document.getElementById('departmentCircleFilter');
const departmentDistrictFilter = document.getElementById('departmentDistrictFilter');
let departmentRecords = [];

document.addEventListener('DOMContentLoaded', loadDepartmentData);
[
    departmentYearFilter,
    document.getElementById('departmentStartDate'),
    document.getElementById('departmentEndDate'),
    departmentTypeFilter,
    departmentDistrictFilter
].forEach(filter => filter.addEventListener('change', renderDepartmentTable));
departmentCircleFilter.addEventListener('change', () => {
    updateDepartmentDistrictOptions();
    renderDepartmentTable();
});

function normalizeDepartmentLocation(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseDepartmentDate(value) {
    if (value === null || value === undefined || value === '') return '';
    const date = typeof value === 'number'
        ? new Date(Date.UTC(1899, 11, 30) + value * 86400000)
        : new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function parseDepartmentSeedlings(value) {
    const count = Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(count) ? count : 0;
}

function getDepartmentCircle(district) {
    const normalizedDistrict = normalizeDepartmentLocation(district);
    const circles = new Set((window.dashboardDivisionMappings || [])
        .filter(([, , mappedDistrict]) => normalizeDepartmentLocation(mappedDistrict) === normalizedDistrict)
        .map(([, circle]) => circle));
    return circles.size === 1 ? [...circles][0] : 'Unassigned / Multiple';
}

async function fetchDepartmentData(filename) {
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

async function loadDepartmentData() {
    const status = document.getElementById('departmentLoadStatus');
    try {
        const records = await fetchDepartmentData('data_other_dept.json');
        if (!Array.isArray(records)) throw new Error('Department planting data is not a record list.');

        departmentRecords = records.map(record => {
            const departmentType = String(record['Department Type'] || '').trim() || 'Unspecified';
            const governmentDepartment = String(record['Gov Department Type'] || '').trim();
            return {
                departmentType,
                department: governmentDepartment || 'Unspecified',
                district: String(record.District || '').trim().toUpperCase() || 'UNKNOWN',
                circle: getDepartmentCircle(record.District),
                year: String(record.Year || '').trim(),
                date: parseDepartmentDate(record.Date),
                seedlings: parseDepartmentSeedlings(record.Seedlings)
            };
        });

        populateDepartmentFilters();
        status.textContent = `${departmentRecords.length.toLocaleString()} planting records loaded from the Other Department data. Districts without a single mapped circle are grouped as Unassigned / Multiple.`;
        renderDepartmentTable();
    } catch (error) {
        console.error('Unable to load department planting data:', error);
        status.textContent = `Unable to load department planting data: ${error.message}`;
        document.getElementById('departmentTableBody').replaceChildren();
        document.getElementById('departmentTableFoot').replaceChildren();
    }
}

function populateDepartmentFilters() {
    const years = [...new Set(departmentRecords.map(record => record.year).filter(Boolean))]
        .sort((a, b) => b.localeCompare(a));
    years.forEach(year => departmentYearFilter.add(new Option(year, year)));

    const types = [...new Set(departmentRecords.map(record => record.departmentType))]
        .sort((a, b) => a.localeCompare(b));
    types.forEach(type => departmentTypeFilter.add(new Option(type, type)));

    const circles = [...new Set(departmentRecords.map(record => record.circle))]
        .sort((a, b) => a.localeCompare(b));
    circles.forEach(circle => departmentCircleFilter.add(new Option(circle, circle)));
    updateDepartmentDistrictOptions();
}

function updateDepartmentDistrictOptions() {
    const selectedDistrict = departmentDistrictFilter.value;
    const districts = [...new Set(departmentRecords
        .filter(record => departmentCircleFilter.value === 'all' || record.circle === departmentCircleFilter.value)
        .map(record => record.district))]
        .sort((a, b) => a.localeCompare(b));

    departmentDistrictFilter.replaceChildren(new Option('All Districts', 'all'));
    districts.forEach(district => departmentDistrictFilter.add(new Option(district, district)));
    departmentDistrictFilter.value = districts.includes(selectedDistrict) ? selectedDistrict : 'all';
}

function renderDepartmentTable() {
    const body = document.getElementById('departmentTableBody');
    const foot = document.getElementById('departmentTableFoot');
    const startDate = document.getElementById('departmentStartDate').value;
    const endDate = document.getElementById('departmentEndDate').value;
    body.replaceChildren();
    foot.replaceChildren();

    if (startDate && endDate && startDate > endDate) {
        document.getElementById('departmentLoadStatus').textContent = 'Start date must be on or before end date.';
        return;
    }

    const filteredRecords = departmentRecords.filter(record =>
        (departmentYearFilter.value === 'all' || record.year === departmentYearFilter.value) &&
        (!startDate || (record.date && record.date >= startDate)) &&
        (!endDate || (record.date && record.date <= endDate)) &&
        (departmentTypeFilter.value === 'all' || record.departmentType === departmentTypeFilter.value) &&
        (departmentCircleFilter.value === 'all' || record.circle === departmentCircleFilter.value) &&
        (departmentDistrictFilter.value === 'all' || record.district === departmentDistrictFilter.value)
    );

    const aggregates = new Map();
    filteredRecords.forEach(record => {
        const key = `${record.departmentType}\u0000${record.department}`;
        const aggregate = aggregates.get(key) || {
            departmentType: record.departmentType,
            department: record.department,
            records: 0,
            seedlings: 0
        };
        aggregate.records++;
        aggregate.seedlings += record.seedlings;
        aggregates.set(key, aggregate);
    });

    const rows = [...aggregates.values()].sort((a, b) =>
        b.seedlings - a.seedlings ||
        a.departmentType.localeCompare(b.departmentType) ||
        a.department.localeCompare(b.department)
    );
    const totals = rows.reduce((result, row) => ({
        records: result.records + row.records,
        seedlings: result.seedlings + row.seedlings
    }), { records: 0, seedlings: 0 });

    rows.forEach((row, index) => {
        const tableRow = document.createElement('tr');
        [
            String(index + 1),
            row.departmentType,
            row.department,
            row.records.toLocaleString(),
            row.seedlings.toLocaleString()
        ].forEach((value, cellIndex) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            if (cellIndex === 2) cell.className = 'department-name';
            tableRow.appendChild(cell);
        });
        body.appendChild(tableRow);
    });

    const totalRow = document.createElement('tr');
    ['Total', '', '', totals.records.toLocaleString(), totals.seedlings.toLocaleString()].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        totalRow.appendChild(cell);
    });
    foot.appendChild(totalRow);

    document.getElementById('departmentLoadStatus').textContent =
        `${filteredRecords.length.toLocaleString()} matching records · ${totals.seedlings.toLocaleString()} seedlings planted.`;
}
