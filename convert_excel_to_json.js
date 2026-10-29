const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// File mappings
const files = {
    forest: 'c:\\Users\\LENOVO\\Downloads\\planting_export_2026-10-29_13-25-37.csv',
    coastal: 'c:\\Users\\LENOVO\\Downloads\\coastal_habitat_export_2026-10-29_13-28-00.csv',
    otherDept: 'c:\\Users\\LENOVO\\Downloads\\other_department_export_2026-10-29_13-27-12.csv',
    plantATree: 'c:\\Users\\LENOVO\\Downloads\\plant_a_tree_export_2026-10-29_13-28-09.csv',
    agriculture: 'c:\\Users\\LENOVO\\Downloads\\agriculture_dept_export_2026-10-29_13-28-27.csv'
};

// Initialize data structure
const summaryData = {
    forest: [],
    otherDept: [],
    agriculture: [],
    plantATree: [],
    palmForest: [],
    palmOtherDept: []
};

// Function to read CSV/Excel file
function readFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return [];
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return jsonData;
}

// Process each file
console.log('Processing exported files...\n');

// Forest Department (planting_export)
console.log('1. Processing Forest Department...');
summaryData.forest = readFile(files.forest);
console.log(`   Rows: ${summaryData.forest.length}`);
if (summaryData.forest.length > 0) {
    console.log(`   Sample row:`, Object.keys(summaryData.forest[0]));
}

// Coastal Habitat
console.log('\n2. Processing Coastal Habitat...');
const coastalData = readFile(files.coastal);
console.log(`   Rows: ${coastalData.length}`);
// Add coastal data to forest (or keep separate if needed)
summaryData.forest = [...summaryData.forest, ...coastalData];
console.log(`   Combined with Forest: ${summaryData.forest.length} rows`);

// Other Department
console.log('\n3. Processing Other Department...');
summaryData.otherDept = readFile(files.otherDept);
console.log(`   Rows: ${summaryData.otherDept.length}`);
if (summaryData.otherDept.length > 0) {
    console.log(`   Sample row:`, Object.keys(summaryData.otherDept[0]));
}

// Plant a Tree
console.log('\n4. Processing Plant a Tree...');
summaryData.plantATree = readFile(files.plantATree);
console.log(`   Rows: ${summaryData.plantATree.length}`);
if (summaryData.plantATree.length > 0) {
    console.log(`   Sample row:`, Object.keys(summaryData.plantATree[0]));
}

// Agriculture Department
console.log('\n5. Processing Agriculture Department...');
summaryData.agriculture = readFile(files.agriculture);
console.log(`   Rows: ${summaryData.agriculture.length}`);
if (summaryData.agriculture.length > 0) {
    console.log(`   Sample row:`, Object.keys(summaryData.agriculture[0]));
}

// Save to JSON (split into smaller files for better browser loading)
const forestPath = path.join(__dirname, 'data_forest.json');
const otherDeptPath = path.join(__dirname, 'data_other_dept.json');
const agriculturePath = path.join(__dirname, 'data_agriculture.json');
const plantATreePath = path.join(__dirname, 'data_plant_atree.json');
const palmForestPath = path.join(__dirname, 'data_palm_forest.json');
const palmOtherDeptPath = path.join(__dirname, 'data_palm_other_dept.json');

fs.writeFileSync(forestPath, JSON.stringify(summaryData.forest, null, 2));
fs.writeFileSync(otherDeptPath, JSON.stringify(summaryData.otherDept, null, 2));
fs.writeFileSync(agriculturePath, JSON.stringify(summaryData.agriculture, null, 2));
fs.writeFileSync(plantATreePath, JSON.stringify(summaryData.plantATree, null, 2));
fs.writeFileSync(palmForestPath, JSON.stringify(summaryData.palmForest, null, 2));
fs.writeFileSync(palmOtherDeptPath, JSON.stringify(summaryData.palmOtherDept, null, 2));

console.log('\n✓ Data converted and saved to separate JSON files');
console.log('\nSummary:');
console.log(`Forest (incl. Coastal): ${summaryData.forest.length} rows → data_forest.json`);
console.log(`Other Dept: ${summaryData.otherDept.length} rows → data_other_dept.json`);
console.log(`Agriculture: ${summaryData.agriculture.length} rows → data_agriculture.json`);
console.log(`Plant aTree: ${summaryData.plantATree.length} rows → data_plant_atree.json`);
console.log(`Palm Forest: ${summaryData.palmForest.length} rows → data_palm_forest.json`);
console.log(`Palm Other Dept: ${summaryData.palmOtherDept.length} rows → data_palm_other_dept.json`);
