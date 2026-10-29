// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    setIndividualDefaultDates();
    addStaggeredAnimations();
    loadRealData();
    // Auto-load data from JSON files
    loadDataFromJSON();
});

// Load data from JSON files
async function loadDataFromJSON() {
    console.log('Loading data from JSON files...');
    
    try {
        // Try to load from R2 first, fallback to local files
        const useR2 = typeof R2_CONFIG !== 'undefined' && R2_CONFIG.accountId !== 'YOUR_ACCOUNT_ID';
        
        const baseUrl = useR2 ? R2_CONFIG.publicUrl : '';
        
        // Load each data file separately
        const [forestData, otherDeptData, agricultureData, plantATreeData, palmForestData, palmOtherDeptData] = await Promise.all([
            fetch(`${baseUrl}/data_forest.json`).then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch(`${baseUrl}/data_other_dept.json`).then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch(`${baseUrl}/data_agriculture.json`).then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch(`${baseUrl}/data_plant_atree.json`).then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch(`${baseUrl}/data_palm_forest.json`).then(r => r.ok ? r.json() : Promise.resolve([])),
            fetch(`${baseUrl}/data_palm_other_dept.json`).then(r => r.ok ? r.json() : Promise.resolve([]))
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

        const forest = normalizeData(forestData);
        const otherDept = normalizeData(otherDeptData);
        const agriculture = normalizeData(agricultureData);
        const plantATree = normalizeData(plantATreeData);
        const palmForest = normalizeData(palmForestData);
        const palmOtherDept = normalizeData(palmOtherDeptData);

        console.log('Data loaded:', {
            forest: forest.length,
            otherDept: otherDept.length,
            agriculture: agriculture.length,
            plantATree: plantATree.length
        });

        // Convert loaded data to the format expected by the dashboard
        convertLoadedDataToDashboardFormat(forest, otherDept, agriculture, plantATree, palmForest, palmOtherDept);
        
        console.log('Data loaded successfully!');
    } catch (error) {
        console.error('Error loading JSON data:', error);
        alert('Error loading data: ' + error.message + '\n\nPlease make sure data_*.json files are in the same folder.');
    }
}

// Convert loaded JSON data to dashboard format
function convertLoadedDataToDashboardFormat(forest, otherDept, agriculture, plantATree, palmForest, palmOtherDept) {
    // Process all data and build the district-wise structure
    const districtData = {};
    
    // Process forest data
    forest.forEach(row => {
        const district = normalizeDistrictName(row.district);
        const year = row.year;
        const seedlings = parseInt(row.seedlings || row['number of seedlings'] || 0) || 0;
        
        if (!districtData[district]) {
            districtData[district] = { total: 0, byYear: {} };
        }
        districtData[district].total += seedlings;
        if (year) {
            districtData[district].byYear[year] = (districtData[district].byYear[year] || 0) + seedlings;
        }
    });
    
    // Process other department data
    otherDept.forEach(row => {
        const district = normalizeDistrictName(row.district);
        const year = row.year;
        const seedlings = parseInt(row.seedlings || 0) || 0;
        
        if (!districtData[district]) {
            districtData[district] = { total: 0, byYear: {} };
        }
        districtData[district].total += seedlings;
        if (year) {
            districtData[district].byYear[year] = (districtData[district].byYear[year] || 0) + seedlings;
        }
    });
    
    // Process agriculture data
    agriculture.forEach(row => {
        const district = normalizeDistrictName(row.district);
        const year = row.year;
        const seedlings = parseInt(row['number of seedlings'] || 0) || 0;
        
        if (!districtData[district]) {
            districtData[district] = { total: 0, byYear: {} };
        }
        districtData[district].total += seedlings;
        if (year) {
            districtData[district].byYear[year] = (districtData[district].byYear[year] || 0) + seedlings;
        }
    });
    
    // Process plant a tree data
    plantATree.forEach(row => {
        const district = normalizeDistrictName(row.district);
        const seedlings = parseInt(row['number of seedlings'] || 0) || 0;
        
        if (!districtData[district]) {
            districtData[district] = { total: 0, byYear: {} };
        }
        districtData[district].total += seedlings;
    });
    
    // Replace realData with loaded data
    realData.overallGeotag = districtData;
    
    // Refresh dashboard components
    loadRealData();
}

// Normalize district name for dashboard
function normalizeDistrictName(district) {
    if (!district) return '';
    let normalized = district.toUpperCase().trim().replace(/\s+/g, ' ');
    
    const variations = {
        'NILGIRIS': 'THE NILGIRIS',
        'THE NILGIRIS': 'THE NILGIRIS',
        'TIRUVANNAMALAI': 'TIRUVANNAMALAI',
        'THIRUVANNAMALAI': 'TIRUVANNAMALAI',
        'TIRUNELVELI': 'THIRUNELVELI',
        'THIRUNELVELI': 'THIRUNELVELI',
        'TIRUVARUR': 'THIRUVARUR',
        'TIRUVARUR': 'THIRUVARUR',
        'TIRUVALLUR': 'THIRUVALLUR',
        'TIRUVALLUR': 'THIRUVALLUR',
        'TIRUCHIRAPPALLI': 'TIRUCHIRAPPALLI',
        'THIRUCHIRAPPALLI': 'TIRUCHIRAPPALLI',
        'TIRUPATTUR': 'TIRUPATTUR',
        'TIRUPATTUR': 'TIRUPATTUR',
        'TIRUPPUR': 'TIRUPPUR',
        'TIRUPPUR': 'TIRUPPUR',
        'TUTICORIN': 'TUTICORIN',
        'TUTICORIN': 'TUTICORIN'
    };
    
    if (variations[normalized]) {
        return variations[normalized];
    }
    
    return normalized;
}

// Add staggered animations to elements
function addStaggeredAnimations() {
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Set default dates for individual filters
function setIndividualDefaultDates() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);

    // Geotag filter dates
    document.getElementById('geotagStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('geotagEndDate').value = today.toISOString().split('T')[0];

    // Agroforest filter dates
    document.getElementById('agroStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('agroEndDate').value = today.toISOString().split('T')[0];

    // Sandalwood filter dates
    document.getElementById('sandalStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('sandalEndDate').value = today.toISOString().split('T')[0];

    // Department Palm filter dates
    document.getElementById('deptPalmStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('deptPalmEndDate').value = today.toISOString().split('T')[0];

    // Palm Tree filter dates
    document.getElementById('palmTreeStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('palmTreeEndDate').value = today.toISOString().split('T')[0];
}

// Real data extracted from CSV files with dynamic dates
// Extracted from planting_export_2026-10-26_12-54-32.csv and other_department_export_2026-10-26_12-57-20.csv
const realData = {
    overallGeotag: {
        "PERAMBALUR": {
            "total": 2600722,
            "byYear": {
                "2022-2023": 123995,
                "2023-2024": 491928,
                "2024-2025": 1041233,
                "2025-2026": 935131,
                "2026-2027": 8235,
                "2021-2022": 200
            }
        },
        "DINDIGUL": {
            "total": 6954820,
            "byYear": {
                "2022-2023": 2153148,
                "2023-2024": 2171002,
                "2024-2025": 1104039,
                "2025-2026": 1501966,
                "2026-2027": 24665
            }
        },
        "TIRUVANNAMALAI": {
            "total": 5055946,
            "byYear": {
                "2022-2023": 388370,
                "2023-2024": 1004744,
                "2024-2025": 1778262,
                "2025-2026": 1748241,
                "2026-2027": 133835,
                "2021-2022": 2494
            }
        },
        "TIRUPATTUR": {
            "total": 1501406,
            "byYear": {
                "2022-2023": 101440,
                "2023-2024": 514891,
                "2024-2025": 274857,
                "2025-2026": 582138,
                "2026-2027": 28080
            }
        },
        "THIRUNELVELI": {
            "total": 3056651,
            "byYear": {
                "2022-2023": 182492,
                "2023-2024": 688430,
                "2024-2025": 1146743,
                "2025-2026": 961158,
                "2021-2022": 1010,
                "2026-2027": 76817,
                "2027-2028": 1
            }
        },
        "THIRUVALLUR": {
            "total": 2004968,
            "byYear": {
                "2022-2023": 271470,
                "2023-2024": 376584,
                "2024-2025": 416792,
                "2025-2026": 883056,
                "2026-2027": 57066
            }
        },
        "KRISHNAGIRI": {
            "total": 3816624,
            "byYear": {
                "2022-2023": 991195,
                "2023-2024": 1330284,
                "2024-2025": 743243,
                "2025-2026": 741530,
                "2026-2027": 10372
            }
        },
        "DHARMAPURI": {
            "total": 3554589,
            "byYear": {
                "2022-2023": 459569,
                "2023-2024": 1429375,
                "2024-2025": 770910,
                "2025-2026": 728068,
                "2026-2027": 159843,
                "2021-2022": 6824
            }
        },
        "THENI": {
            "total": 1525217,
            "byYear": {
                "2022-2023": 222291,
                "2023-2024": 295356,
                "2024-2025": 429392,
                "2025-2026": 566533,
                "2026-2027": 11395,
                "2021-2022": 250
            }
        },
        "VELLORE": {
            "total": 2695654,
            "byYear": {
                "2022-2023": 74350,
                "2023-2024": 1072013,
                "2024-2025": 858382,
                "2025-2026": 674564,
                "2026-2027": 16345
            }
        },
        "CHENNAI": {
            "total": 1493789,
            "byYear": {
                "2022-2023": 105280,
                "2023-2024": 836000,
                "2025-2026": 255761,
                "2024-2025": 287991,
                "2026-2027": 8757
            }
        },
        "TIRUCHIRAPPALLI": {
            "total": 7465542,
            "byYear": {
                "2022-2023": 343127,
                "2023-2024": 1616204,
                "2024-2025": 2558693,
                "2025-2026": 2881398,
                "2026-2027": 43856,
                "2021-2022": 22264
            }
        },
        "TUTICORIN": {
            "total": 2909642,
            "byYear": {
                "2022-2023": 400019,
                "2023-2024": 651319,
                "2024-2025": 849702,
                "2025-2026": 823511,
                "2026-2027": 185091
            }
        },
        "MADURAI": {
            "total": 965902,
            "byYear": {
                "2022-2023": 99051,
                "2023-2024": 253987,
                "2024-2025": 352582,
                "2025-2026": 251420,
                "2026-2027": 5830,
                "2021-2022": 3032
            }
        },
        "ERODE": {
            "total": 2360899,
            "byYear": {
                "2022-2023": 99239,
                "2023-2024": 752457,
                "2024-2025": 791792,
                "2025-2026": 640423,
                "2026-2027": 76988
            }
        },
        "RAMANATHAPURAM": {
            "total": 1913342,
            "byYear": {
                "2022-2023": 204638,
                "2023-2024": 750416,
                "2024-2025": 455307,
                "2025-2026": 490456,
                "2026-2027": 12525
            }
        },
        "NAMAKKAL": {
            "total": 3474673,
            "byYear": {
                "2022-2023": 369450,
                "2023-2024": 799787,
                "2024-2025": 1039423,
                "2025-2026": 982226,
                "2026-2027": 283342,
                "2021-2022": 445
            }
        },
        "CHENGALPATTU": {
            "total": 2182124,
            "byYear": {
                "2022-2023": 232677,
                "2023-2024": 948253,
                "2024-2025": 451246,
                "2025-2026": 541296,
                "2026-2027": 8652
            }
        },
        "TIRUPPUR": {
            "total": 1837640,
            "byYear": {
                "2022-2023": 316180,
                "2023-2024": 251353,
                "2024-2025": 590979,
                "2025-2026": 671557,
                "2026-2027": 7571
            }
        },
        "KARUR": {
            "total": 2544761,
            "byYear": {
                "2022-2023": 619268,
                "2023-2024": 770349,
                "2024-2025": 468746,
                "2025-2026": 672982,
                "2026-2027": 13416
            }
        },
        "THIRUVARUR": {
            "total": 997099,
            "byYear": {
                "2022-2023": 80710,
                "2023-2024": 217136,
                "2024-2025": 188534,
                "2025-2026": 485516,
                "2021-2022": 534,
                "2026-2027": 24669
            }
        },
        "NAGAPATTINAM": {
            "total": 3196885,
            "byYear": {
                "2022-2023": 64435,
                "2023-2024": 888214,
                "2024-2025": 1409537,
                "2025-2026": 818846,
                "2026-2027": 15853
            }
        },
        "TENKASI": {
            "total": 1851994,
            "byYear": {
                "2022-2023": 47665,
                "2023-2024": 169345,
                "2024-2025": 669951,
                "2025-2026": 749340,
                "2026-2027": 215693
            }
        },
        "PUDUKKOTTAI": {
            "total": 4156897,
            "byYear": {
                "2022-2023": 137569,
                "2023-2024": 638622,
                "2024-2025": 1520080,
                "2025-2026": 1837870,
                "2021-2022": 2423,
                "2026-2027": 20333
            }
        },
        "SALEM": {
            "total": 4673374,
            "byYear": {
                "2022-2023": 876953,
                "2023-2024": 1457546,
                "2024-2025": 1076511,
                "2025-2026": 981942,
                "2026-2027": 280422
            }
        },
        "KALLAKURICHI": {
            "total": 3626602,
            "byYear": {
                "2022-2023": 304325,
                "2023-2024": 240951,
                "2024-2025": 377578,
                "2025-2026": 2611023,
                "2026-2027": 92725
            }
        },
        "VIRUDHUNAGAR": {
            "total": 4504213,
            "byYear": {
                "2022-2023": 454920,
                "2023-2024": 557341,
                "2024-2025": 1368689,
                "2025-2026": 2071243,
                "2026-2027": 47720,
                "2021-2022": 4300
            }
        },
        "SIVAGANGA": {
            "total": 2440126,
            "byYear": {
                "2022-2023": 334345,
                "2023-2024": 316223,
                "2024-2025": 299066,
                "2025-2026": 1459282,
                "2026-2027": 23946,
                "2021-2022": 7264
            }
        },
        "THANJAVUR": {
            "total": 2961911,
            "byYear": {
                "2022-2023": 129923,
                "2023-2024": 725350,
                "2024-2025": 973993,
                "2025-2026": 1105371,
                "2026-2027": 27274
            }
        },
        "KANYAKUMARI": {
            "total": 650709,
            "byYear": {
                "2022-2023": 35212,
                "2023-2024": 227876,
                "2024-2025": 133604,
                "2025-2026": 239110,
                "2026-2027": 14667,
                "2021-2022": 240
            }
        },
        "COIMBATORE": {
            "total": 2750107,
            "byYear": {
                "2022-2023": 127987,
                "2023-2024": 821843,
                "2024-2025": 915139,
                "2025-2026": 796848,
                "2026-2027": 88289,
                "2021-2022": 1
            }
        },
        "VILLUPURAM": {
            "total": 2286385,
            "byYear": {
                "2022-2023": 48830,
                "2023-2024": 897489,
                "2024-2025": 716962,
                "2025-2026": 617619,
                "2026-2027": 5485
            }
        },
        "CUDDALORE": {
            "total": 5000966,
            "byYear": {
                "2022-2023": 184537,
                "2023-2024": 1134433,
                "2024-2025": 1914381,
                "2025-2026": 1749101,
                "2026-2027": 18514
            }
        },
        "ARIYALUR": {
            "total": 942831,
            "byYear": {
                "2022-2023": 35824,
                "2023-2024": 228348,
                "2024-2025": 174717,
                "2025-2026": 487719,
                "2026-2027": 16223
            }
        },
        "THE NILGIRIS": {
            "total": 195346,
            "byYear": {
                "2022-2023": 6250,
                "2023-2024": 142794,
                "2024-2025": 31484,
                "2025-2026": 14818
            }
        },
        "KANCHEEPURAM": {
            "total": 1185915,
            "byYear": {
                "2024-2025": 451954,
                "2025-2026": 508298,
                "2026-2027": 30052,
                "2023-2024": 192708,
                "2021-2022": 3,
                "2022-2023": 2900
            }
        },
        "RANIPET": {
            "total": 384552,
            "byYear": {
                "2024-2025": 13121,
                "2025-2026": 347423,
                "2026-2027": 24008
            }
        },
        "MAYILADUTHURAI": {
            "total": 1292709,
            "byYear": {
                "2025-2026": 649822,
                "2026-2027": 37108,
                "2023-2024": 240801,
                "2024-2025": 364978
            }
        }
    },
    departmentPalm: {
        "PUDUKKOTTAI": {
            "total": 356429,
            "byYear": {
                "2026-2027": 163513,
                "2025-2026": 192916
            }
        },
        "THANJAVUR": {
            "total": 433791,
            "byYear": {
                "2026-2027": 286506,
                "2025-2026": 147285
            }
        },
        "VIRUDHUNAGAR": {
            "total": 376334,
            "byYear": {
                "2025-2026": 376084,
                "2026-2027": 250
            }
        },
        "ERODE": {
            "total": 79289,
            "byYear": {
                "2026-2027": 48799,
                "2025-2026": 30490
            }
        },
        "THENI": {
            "total": 84345,
            "byYear": {
                "2026-2027": 3715,
                "2025-2026": 80630
            }
        },
        "SALEM": {
            "total": 20458,
            "byYear": {
                "2026-2027": 12760,
                "2025-2026": 7698
            }
        },
        "NAMAKKAL": {
            "total": 66394,
            "byYear": {
                "2026-2027": 1129,
                "2025-2026": 65265
            }
        },
        "TENKASI": {
            "total": 100624,
            "byYear": {
                "2026-2027": 18907,
                "2025-2026": 81717
            }
        },
        "DINDIGUL": {
            "total": 44177,
            "byYear": {
                "2026-2027": 5040,
                "2025-2026": 39137
            }
        },
        "TIRUPPUR": {
            "total": 30679,
            "byYear": {
                "2026-2027": 25895,
                "2025-2026": 4784
            }
        },
        "KALLAKURICHI": {
            "total": 52938,
            "byYear": {
                "2026-2027": 17100,
                "2025-2026": 35838
            }
        },
        "THIRUNELVELI": {
            "total": 92657,
            "byYear": {
                "2026-2027": 31345,
                "2025-2026": 61312
            }
        },
        "TUTICORIN": {
            "total": 31044,
            "byYear": {
                "2026-2027": 19230,
                "2025-2026": 11814
            }
        },
        "THIRUVARUR": {
            "total": 11313,
            "byYear": {
                "2026-2027": 1390,
                "2025-2026": 9923
            }
        },
        "MAYILADUTHURAI": {
            "total": 205444,
            "byYear": {
                "2026-2027": 11505,
                "2025-2026": 193939
            }
        },
        "MADURAI": {
            "total": 101328,
            "byYear": {
                "2026-2027": 56160,
                "2025-2026": 45168
            }
        },
        "TIRUPATTUR": {
            "total": 170919,
            "byYear": {
                "2026-2027": 90780,
                "2025-2026": 80139
            }
        },
        "NAGAPATTINAM": {
            "total": 808137,
            "byYear": {
                "2026-2027": 37012,
                "2025-2026": 771125
            }
        },
        "THIRUVALLUR": {
            "total": 17696,
            "byYear": {
                "2026-2027": 6500,
                "2025-2026": 11196
            }
        },
        "PERAMBALUR": {
            "total": 1441318,
            "byYear": {
                "2026-2027": 10430,
                "2025-2026": 1430888
            }
        },
        "VILLUPURAM": {
            "total": 96050,
            "byYear": {
                "2026-2027": 24110,
                "2025-2026": 71940
            }
        },
        "DHARMAPURI": {
            "total": 19534,
            "byYear": {
                "2026-2027": 2500,
                "2025-2026": 17034
            }
        },
        "RANIPET": {
            "total": 2815,
            "byYear": {
                "2025-2026": 2715,
                "2026-2027": 100
            }
        },
        "KANCHEEPURAM": {
            "total": 28013,
            "byYear": {
                "2026-2027": 10190,
                "2025-2026": 17823
            }
        },
        "TIRUVANNAMALAI": {
            "total": 131486,
            "byYear": {
                "2026-2027": 187,
                "2025-2026": 131299
            }
        },
        "COIMBATORE": {
            "total": 3633,
            "byYear": {
                "2025-2026": 1823,
                "2026-2027": 1810
            }
        },
        "TIRUCHIRAPPALLI": {
            "total": 2014215,
            "byYear": {
                "2026-2027": 1113,
                "2025-2026": 2013102
            }
        },
        "THE NILGIRIS": {
            "total": 460,
            "byYear": {
                "2025-2026": 460
            }
        },
        "ARIYALUR": {
            "total": 2012,
            "byYear": {
                "2025-2026": 2012
            }
        },
        "CUDDALORE": {
            "total": 9270,
            "byYear": {
                "2026-2027": 1000,
                "2025-2026": 8270
            }
        },
        "KANYAKUMARI": {
            "total": 3610,
            "byYear": {
                "2025-2026": 3610
            }
        },
        "CHENNAI": {
            "total": 732,
            "byYear": {
                "2025-2026": 732
            }
        },
        "CHENGALPATTU": {
            "total": 1498,
            "byYear": {
                "2025-2026": 1498
            }
        },
        "KRISHNAGIRI": {
            "total": 14152,
            "byYear": {
                "2025-2026": 14152
            }
        },
        "RAMANATHAPURAM": {
            "total": 1043,
            "byYear": {
                "2025-2026": 1043
            }
        },
        "VELLORE": {
            "total": 41605,
            "byYear": {
                "2025-2026": 41605
            }
        },
        "KARUR": {
            "total": 1800,
            "byYear": {
                "2025-2026": 1800
            }
        },
        "SIVAGANGA": {
            "total": 3594,
            "byYear": {
                "2025-2026": 3594
            }
        }
    },
    palmTree: {
        "MADURAI": {
            "total": 37010,
            "byYear": {
                "2026-2027": 2000,
                "2025-2026": 35010
            }
        },
        "TIRUVANNAMALAI": {
            "total": 38420,
            "byYear": {
                "2026-2027": 26420,
                "2025-2026": 12000
            }
        },
        "PUDUKKOTTAI": {
            "total": 18100,
            "byYear": {
                "2026-2027": 18100
            }
        },
        "ERODE": {
            "total": 21781,
            "byYear": {
                "2026-2027": 21781
            }
        },
        "THIRUVALLUR": {
            "total": 80600,
            "byYear": {
                "2026-2027": 25800,
                "2025-2026": 54800
            }
        },
        "THIRUNELVELI": {
            "total": 41500,
            "byYear": {
                "2026-2027": 41500
            }
        },
        "KARUR": {
            "total": 46003,
            "byYear": {
                "2026-2027": 32003,
                "2025-2026": 14000
            }
        },
        "KRISHNAGIRI": {
            "total": 103950,
            "byYear": {
                "2026-2027": 76150,
                "2025-2026": 27800
            }
        },
        "TENKASI": {
            "total": 110790,
            "byYear": {
                "2026-2027": 52810,
                "2025-2026": 57980
            }
        },
        "NAGAPATTINAM": {
            "total": 120000,
            "byYear": {
                "2026-2027": 30000,
                "2025-2026": 90000
            }
        },
        "THIRUVARUR": {
            "total": 164008,
            "byYear": {
                "2026-2027": 37500,
                "2025-2026": 126508
            }
        },
        "MAYILADUTHURAI": {
            "total": 71250,
            "byYear": {
                "2026-2027": 31000,
                "2025-2026": 40250
            }
        },
        "THENI": {
            "total": 25000,
            "byYear": {
                "2026-2027": 25000
            }
        },
        "KALLAKURICHI": {
            "total": 46770,
            "byYear": {
                "2026-2027": 46770
            }
        },
        "DINDIGUL": {
            "total": 11700,
            "byYear": {
                "2026-2027": 11700
            }
        },
        "THANJAVUR": {
            "total": 75500,
            "byYear": {
                "2026-2027": 5000,
                "2025-2026": 70500
            }
        },
        "NAMAKKAL": {
            "total": 50000,
            "byYear": {
                "2026-2027": 50000
            }
        },
        "DHARMAPURI": {
            "total": 128684,
            "byYear": {
                "2026-2027": 62284,
                "2025-2026": 66400
            }
        },
        "CUDDALORE": {
            "total": 50000,
            "byYear": {
                "2026-2027": 20000,
                "2025-2026": 30000
            }
        },
        "PERAMBALUR": {
            "total": 69868,
            "byYear": {
                "2026-2027": 19458,
                "2025-2026": 50410
            }
        },
        "ARIYALUR": {
            "total": 32400,
            "byYear": {
                "2026-2027": 32400
            }
        },
        "SIVAGANGA": {
            "total": 51700,
            "byYear": {
                "2026-2027": 38600,
                "2025-2026": 13100
            }
        },
        "VIRUDHUNAGAR": {
            "total": 31950,
            "byYear": {
                "2026-2027": 31950
            }
        },
        "TIRUCHIRAPPALLI": {
            "total": 117000,
            "byYear": {
                "2026-2027": 42000,
                "2025-2026": 75000
            }
        },
        "RANIPET": {
            "total": 46000,
            "byYear": {
                "2026-2027": 46000
            }
        },
        "SALEM": {
            "total": 361687,
            "byYear": {
                "2026-2027": 43417,
                "2025-2026": 318270
            }
        },
        "TUTICORIN": {
            "total": 186200,
            "byYear": {
                "2026-2027": 42000,
                "2025-2026": 144200
            }
        },
        "CHENGALPATTU": {
            "total": 20000,
            "byYear": {
                "2026-2027": 20000
            }
        },
        "RAMANATHAPURAM": {
            "total": 40000,
            "byYear": {
                "2026-2027": 40000
            }
        },
        "KANYAKUMARI": {
            "total": 3000,
            "byYear": {
                "2026-2027": 3000
            }
        },
        "VELLORE": {
            "total": 36770,
            "byYear": {
                "2026-2027": 22650,
                "2025-2026": 14120
            }
        },
        "KANCHEEPURAM": {
            "total": 15000,
            "byYear": {
                "2026-2027": 15000
            }
        },
        "CHENNAI": {
            "total": 3500,
            "byYear": {
                "2026-2027": 3500
            }
        },
        "VILLUPURAM": {
            "total": 160500,
            "byYear": {
                "2026-2027": 30000,
                "2025-2026": 130500
            }
        },
        "TIRUPATTUR": {
            "total": 500,
            "byYear": {
                "2026-2027": 500
            }
        },
        "COIMBATORE": {
            "total": 28000,
            "byYear": {
                "2025-2026": 28000
            }
        }
    },
    agroforest: {
        "PERAMBALUR": {
            "total": 952377,
            "byYear": {
                "2022-2023": 61349,
                "2023-2024": 228621,
                "2024-2025": 266563,
                "2025-2026": 393180,
                "2026-2027": 2664
            }
        },
        "DINDIGUL": {
            "total": 4827895,
            "byYear": {
                "2022-2023": 1410719,
                "2023-2024": 1458307,
                "2024-2025": 880768,
                "2025-2026": 1063317,
                "2026-2027": 14784
            }
        },
        "TIRUVANNAMALAI": {
            "total": 2834928,
            "byYear": {
                "2022-2023": 270261,
                "2023-2024": 619911,
                "2024-2025": 967544,
                "2025-2026": 963500,
                "2026-2027": 12812,
                "2021-2022": 900
            }
        },
        "TIRUPATTUR": {
            "total": 958113,
            "byYear": {
                "2022-2023": 74835,
                "2023-2024": 269419,
                "2024-2025": 201321,
                "2025-2026": 406570,
                "2026-2027": 5968
            }
        },
        "THIRUNELVELI": {
            "total": 1423692,
            "byYear": {
                "2022-2023": 96883,
                "2023-2024": 204262,
                "2024-2025": 439837,
                "2025-2026": 632092,
                "2026-2027": 50618
            }
        },
        "THIRUVALLUR": {
            "total": 1270528,
            "byYear": {
                "2022-2023": 123605,
                "2023-2024": 197878,
                "2024-2025": 269708,
                "2025-2026": 647276,
                "2026-2027": 32061
            }
        },
        "KRISHNAGIRI": {
            "total": 2508920,
            "byYear": {
                "2022-2023": 567252,
                "2023-2024": 802905,
                "2024-2025": 524647,
                "2025-2026": 606120,
                "2026-2027": 7996
            }
        },
        "DHARMAPURI": {
            "total": 2241224,
            "byYear": {
                "2022-2023": 327949,
                "2023-2024": 886294,
                "2024-2025": 434864,
                "2025-2026": 506754,
                "2026-2027": 85363
            }
        },
        "THENI": {
            "total": 867695,
            "byYear": {
                "2022-2023": 193980,
                "2023-2024": 147753,
                "2024-2025": 171856,
                "2025-2026": 346195,
                "2026-2027": 7911
            }
        },
        "VELLORE": {
            "total": 1406666,
            "byYear": {
                "2022-2023": 55435,
                "2023-2024": 435043,
                "2024-2025": 444076,
                "2025-2026": 461847,
                "2026-2027": 10265
            }
        },
        "CHENNAI": {
            "total": 431821,
            "byYear": {
                "2022-2023": 51634,
                "2023-2024": 172917,
                "2025-2026": 95719,
                "2024-2025": 110074,
                "2026-2027": 1477
            }
        },
        "TIRUCHIRAPPALLI": {
            "total": 5737666,
            "byYear": {
                "2022-2023": 208914,
                "2023-2024": 1329491,
                "2024-2025": 1903386,
                "2025-2026": 2258225,
                "2026-2027": 26462,
                "2021-2022": 11188
            }
        },
        "TUTICORIN": {
            "total": 1048646,
            "byYear": {
                "2022-2023": 149466,
                "2023-2024": 85429,
                "2024-2025": 253494,
                "2025-2026": 415663,
                "2026-2027": 144594
            }
        },
        "MADURAI": {
            "total": 537967,
            "byYear": {
                "2022-2023": 77521,
                "2023-2024": 151222,
                "2024-2025": 144233,
                "2025-2026": 160775,
                "2026-2027": 4216
            }
        },
        "ERODE": {
            "total": 1435691,
            "byYear": {
                "2022-2023": 62277,
                "2023-2024": 365645,
                "2024-2025": 482986,
                "2025-2026": 465381,
                "2026-2027": 59402
            }
        },
        "RAMANATHAPURAM": {
            "total": 574422,
            "byYear": {
                "2022-2023": 114994,
                "2023-2024": 157034,
                "2024-2025": 108161,
                "2025-2026": 188103,
                "2026-2027": 6130
            }
        },
        "NAMAKKAL": {
            "total": 1359405,
            "byYear": {
                "2022-2023": 226668,
                "2023-2024": 242410,
                "2024-2025": 448746,
                "2025-2026": 379585,
                "2026-2027": 61566,
                "2021-2022": 430
            }
        },
        "CHENGALPATTU": {
            "total": 1328416,
            "byYear": {
                "2022-2023": 157935,
                "2023-2024": 575087,
                "2024-2025": 261809,
                "2025-2026": 328283,
                "2026-2027": 5302
            }
        },
        "TIRUPPUR": {
            "total": 801785,
            "byYear": {
                "2022-2023": 55311,
                "2023-2024": 112350,
                "2024-2025": 282305,
                "2025-2026": 346627,
                "2026-2027": 5192
            }
        },
        "KARUR": {
            "total": 1342354,
            "byYear": {
                "2022-2023": 349436,
                "2023-2024": 299927,
                "2024-2025": 308484,
                "2025-2026": 376902,
                "2026-2027": 7605
            }
        },
        "THIRUVARUR": {
            "total": 759503,
            "byYear": {
                "2022-2023": 74822,
                "2023-2024": 156577,
                "2024-2025": 136149,
                "2025-2026": 373497,
                "2026-2027": 18458
            }
        },
        "NAGAPATTINAM": {
            "total": 625153,
            "byYear": {
                "2022-2023": 30181,
                "2023-2024": 161003,
                "2024-2025": 242086,
                "2025-2026": 179085,
                "2026-2027": 12798
            }
        },
        "TENKASI": {
            "total": 952664,
            "byYear": {
                "2022-2023": 37749,
                "2023-2024": 112255,
                "2024-2025": 317656,
                "2025-2026": 393565,
                "2026-2027": 91439
            }
        },
        "PUDUKKOTTAI": {
            "total": 1664368,
            "byYear": {
                "2022-2023": 56282,
                "2023-2024": 229077,
                "2024-2025": 519063,
                "2025-2026": 849800,
                "2021-2022": 1422,
                "2026-2027": 8724
            }
        },
        "SALEM": {
            "total": 2863121,
            "byYear": {
                "2022-2023": 642996,
                "2023-2024": 801128,
                "2024-2025": 664361,
                "2025-2026": 680425,
                "2026-2027": 74211
            }
        },
        "KALLAKURICHI": {
            "total": 1538176,
            "byYear": {
                "2022-2023": 261546,
                "2023-2024": 211621,
                "2024-2025": 143017,
                "2025-2026": 887416,
                "2026-2027": 34576
            }
        },
        "VIRUDHUNAGAR": {
            "total": 2708433,
            "byYear": {
                "2022-2023": 258976,
                "2023-2024": 285596,
                "2024-2025": 812304,
                "2025-2026": 1323094,
                "2026-2027": 27843,
                "2021-2022": 620
            }
        },
        "SIVAGANGA": {
            "total": 961996,
            "byYear": {
                "2022-2023": 202634,
                "2023-2024": 154310,
                "2024-2025": 177738,
                "2025-2026": 409479,
                "2026-2027": 14604,
                "2021-2022": 3231
            }
        },
        "THANJAVUR": {
            "total": 1252810,
            "byYear": {
                "2022-2023": 70335,
                "2023-2024": 175171,
                "2024-2025": 304242,
                "2025-2026": 683043,
                "2026-2027": 20019
            }
        },
        "COIMBATORE": {
            "total": 1484029,
            "byYear": {
                "2022-2023": 70034,
                "2023-2024": 387318,
                "2024-2025": 466581,
                "2025-2026": 504630,
                "2026-2027": 55466
            }
        },
        "VILLUPURAM": {
            "total": 1515434,
            "byYear": {
                "2022-2023": 40015,
                "2023-2024": 581362,
                "2024-2025": 500762,
                "2025-2026": 389331,
                "2026-2027": 3964
            }
        },
        "CUDDALORE": {
            "total": 1862850,
            "byYear": {
                "2022-2023": 164887,
                "2023-2024": 654173,
                "2024-2025": 404902,
                "2025-2026": 622538,
                "2026-2027": 16350
            }
        },
        "ARIYALUR": {
            "total": 541920,
            "byYear": {
                "2022-2023": 23352,
                "2023-2024": 148829,
                "2024-2025": 131965,
                "2025-2026": 223556,
                "2026-2027": 14218
            }
        },
        "THE NILGIRIS": {
            "total": 78724,
            "byYear": {
                "2022-2023": 3750,
                "2023-2024": 70193,
                "2024-2025": 3078,
                "2025-2026": 1703
            }
        },
        "KANYAKUMARI": {
            "total": 321507,
            "byYear": {
                "2022-2023": 32684,
                "2023-2024": 83834,
                "2024-2025": 51205,
                "2025-2026": 153238,
                "2026-2027": 486,
                "2021-2022": 60
            }
        },
        "KANCHEEPURAM": {
            "total": 457240,
            "byYear": {
                "2024-2025": 88887,
                "2025-2026": 257716,
                "2026-2027": 17217,
                "2021-2022": 3,
                "2023-2024": 90517,
                "2022-2023": 2900
            }
        },
        "RANIPET": {
            "total": 207508,
            "byYear": {
                "2024-2025": 6247,
                "2025-2026": 190716,
                "2026-2027": 10545
            }
        },
        "MAYILADUTHURAI": {
            "total": 349588,
            "byYear": {
                "2025-2026": 247726,
                "2026-2027": 22806,
                "2024-2025": 74066,
                "2023-2024": 4990
            }
        }
    },
    sandalwood: {
        "DINDIGUL": {
            "total": 174774,
            "byYear": {
                "2022-2023": 49793,
                "2023-2024": 65265,
                "2024-2025": 22096,
                "2025-2026": 35670,
                "2026-2027": 1950
            }
        },
        "TIRUVANNAMALAI": {
            "total": 267310,
            "byYear": {
                "2022-2023": 56054,
                "2023-2024": 94203,
                "2024-2025": 57918,
                "2025-2026": 58985,
                "2026-2027": 150
            }
        },
        "THIRUNELVELI": {
            "total": 228394,
            "byYear": {
                "2022-2023": 56356,
                "2023-2024": 51074,
                "2024-2025": 50716,
                "2025-2026": 63848,
                "2026-2027": 6400
            }
        },
        "KRISHNAGIRI": {
            "total": 291492,
            "byYear": {
                "2022-2023": 105721,
                "2023-2024": 107410,
                "2024-2025": 61521,
                "2025-2026": 16840
            }
        },
        "DHARMAPURI": {
            "total": 228925,
            "byYear": {
                "2022-2023": 47749,
                "2023-2024": 98081,
                "2024-2025": 25690,
                "2025-2026": 41175,
                "2026-2027": 16230
            }
        },
        "THENI": {
            "total": 48691,
            "byYear": {
                "2022-2023": 18683,
                "2023-2024": 25600,
                "2024-2025": 863,
                "2025-2026": 3545
            }
        },
        "VELLORE": {
            "total": 166268,
            "byYear": {
                "2022-2023": 5813,
                "2023-2024": 80059,
                "2024-2025": 56685,
                "2025-2026": 22911,
                "2026-2027": 800
            }
        },
        "CHENNAI": {
            "total": 32323,
            "byYear": {
                "2022-2023": 6865,
                "2023-2024": 15777,
                "2024-2025": 9061,
                "2025-2026": 620
            }
        },
        "TIRUCHIRAPPALLI": {
            "total": 198390,
            "byYear": {
                "2022-2023": 65881,
                "2023-2024": 44511,
                "2024-2025": 45714,
                "2025-2026": 40224,
                "2026-2027": 2060
            }
        },
        "TUTICORIN": {
            "total": 167813,
            "byYear": {
                "2022-2023": 59257,
                "2023-2024": 16040,
                "2024-2025": 46467,
                "2025-2026": 45639,
                "2026-2027": 410
            }
        },
        "MADURAI": {
            "total": 41643,
            "byYear": {
                "2022-2023": 14296,
                "2023-2024": 15856,
                "2024-2025": 8458,
                "2025-2026": 2783,
                "2026-2027": 250
            }
        },
        "ERODE": {
            "total": 85033,
            "byYear": {
                "2022-2023": 6575,
                "2023-2024": 51914,
                "2024-2025": 21335,
                "2025-2026": 5209
            }
        },
        "RAMANATHAPURAM": {
            "total": 96989,
            "byYear": {
                "2022-2023": 30777,
                "2023-2024": 26316,
                "2024-2025": 27711,
                "2025-2026": 9505,
                "2026-2027": 2680
            }
        },
        "CHENGALPATTU": {
            "total": 143046,
            "byYear": {
                "2022-2023": 24571,
                "2023-2024": 76692,
                "2024-2025": 24827,
                "2025-2026": 14656,
                "2026-2027": 2300
            }
        },
        "TIRUPPUR": {
            "total": 90554,
            "byYear": {
                "2022-2023": 9895,
                "2023-2024": 15985,
                "2024-2025": 36965,
                "2025-2026": 27686,
                "2026-2027": 23
            }
        },
        "KARUR": {
            "total": 202903,
            "byYear": {
                "2022-2023": 88470,
                "2023-2024": 47595,
                "2024-2025": 35677,
                "2025-2026": 27726,
                "2026-2027": 3435
            }
        },
        "THIRUVARUR": {
            "total": 29298,
            "byYear": {
                "2022-2023": 2855,
                "2023-2024": 11935,
                "2024-2025": 11230,
                "2025-2026": 3278
            }
        },
        "TENKASI": {
            "total": 144849,
            "byYear": {
                "2022-2023": 9616,
                "2023-2024": 17625,
                "2024-2025": 59809,
                "2025-2026": 46933,
                "2026-2027": 10866
            }
        },
        "PUDUKKOTTAI": {
            "total": 92547,
            "byYear": {
                "2022-2023": 24883,
                "2023-2024": 35695,
                "2024-2025": 30891,
                "2025-2026": 1066,
                "2026-2027": 12
            }
        },
        "NAMAKKAL": {
            "total": 150923,
            "byYear": {
                "2022-2023": 47934,
                "2023-2024": 21275,
                "2024-2025": 10493,
                "2025-2026": 58716,
                "2026-2027": 12505
            }
        },
        "SALEM": {
            "total": 86882,
            "byYear": {
                "2022-2023": 31594,
                "2023-2024": 21177,
                "2024-2025": 1985,
                "2025-2026": 29261,
                "2026-2027": 2865
            }
        },
        "KALLAKURICHI": {
            "total": 84699,
            "byYear": {
                "2022-2023": 33001,
                "2023-2024": 8655,
                "2024-2025": 6070,
                "2025-2026": 35798,
                "2026-2027": 1175
            }
        },
        "SIVAGANGA": {
            "total": 261992,
            "byYear": {
                "2022-2023": 85432,
                "2023-2024": 81976,
                "2024-2025": 38400,
                "2025-2026": 50244,
                "2026-2027": 5940
            }
        },
        "THANJAVUR": {
            "total": 32948,
            "byYear": {
                "2022-2023": 3150,
                "2023-2024": 9505,
                "2024-2025": 10235,
                "2025-2026": 8873,
                "2026-2027": 1185
            }
        },
        "VIRUDHUNAGAR": {
            "total": 98167,
            "byYear": {
                "2022-2023": 48658,
                "2023-2024": 12176,
                "2024-2025": 19210,
                "2025-2026": 15933,
                "2026-2027": 2190
            }
        },
        "THIRUVALLUR": {
            "total": 195923,
            "byYear": {
                "2022-2023": 32694,
                "2023-2024": 61833,
                "2024-2025": 65380,
                "2025-2026": 28564,
                "2026-2027": 7452
            }
        },
        "COIMBATORE": {
            "total": 24743,
            "byYear": {
                "2022-2023": 4185,
                "2023-2024": 13418,
                "2024-2025": 6580,
                "2025-2026": 560
            }
        },
        "VILLUPURAM": {
            "total": 53851,
            "byYear": {
                "2022-2023": 3815,
                "2023-2024": 18566,
                "2024-2025": 25055,
                "2025-2026": 6415
            }
        },
        "CUDDALORE": {
            "total": 32627,
            "byYear": {
                "2022-2023": 2300,
                "2023-2024": 14185,
                "2024-2025": 10910,
                "2025-2026": 5207,
                "2026-2027": 25
            }
        },
        "TIRUPATTUR": {
            "total": 38478,
            "byYear": {
                "2022-2023": 11615,
                "2023-2024": 9966,
                "2024-2025": 11377,
                "2025-2026": 5520
            }
        },
        "PERAMBALUR": {
            "total": 40030,
            "byYear": {
                "2022-2023": 1709,
                "2023-2024": 12880,
                "2024-2025": 14962,
                "2025-2026": 10479
            }
        },
        "ARIYALUR": {
            "total": 20982,
            "byYear": {
                "2022-2023": 11447,
                "2023-2024": 6250,
                "2024-2025": 2235,
                "2025-2026": 1050
            }
        },
        "NAGAPATTINAM": {
            "total": 4934,
            "byYear": {
                "2022-2023": 400,
                "2023-2024": 977,
                "2024-2025": 2792,
                "2025-2026": 765
            }
        },
        "KANYAKUMARI": {
            "total": 19908,
            "byYear": {
                "2023-2024": 7250,
                "2024-2025": 5480,
                "2025-2026": 5225,
                "2022-2023": 1753,
                "2021-2022": 180,
                "2026-2027": 20
            }
        },
        "KANCHEEPURAM": {
            "total": 19056,
            "byYear": {
                "2024-2025": 3075,
                "2025-2026": 15940,
                "2023-2024": 40,
                "2026-2027": 1
            }
        },
        "RANIPET": {
            "total": 14571,
            "byYear": {
                "2024-2025": 2477,
                "2025-2026": 11114,
                "2026-2027": 980
            }
        },
        "MAYILADUTHURAI": {
            "total": 1190,
            "byYear": {
                "2025-2026": 170,
                "2026-2027": 1020
            }
        }
    }
};

// Load real data into dashboard
function loadRealData() {
    populateDistrictSelector();
    populateAgroDistrictSelector();
    populateSandalDistrictSelector();
    populateDeptPalmDistrictSelector();
    populatePalmTreeDistrictSelector();
    updateOverallGeotagStats();
    updateAgroforestDataWithRealData();
    updateSandalwoodDataWithRealData();
    updateDeptPalmDataWithRealData();
    updatePalmTreeDataWithRealData();
}

// Populate district selector dropdown
function populateDistrictSelector() {
    const districtSelect = document.getElementById('geotagDistrictSelect');
    const districts = Object.keys(realData.overallGeotag);

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Populate agroforest district selector dropdown
function populateAgroDistrictSelector() {
    const districtSelect = document.getElementById('agroDistrictSelect');
    const districts = Object.keys(realData.agroforest);

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Populate sandalwood district selector dropdown
function populateSandalDistrictSelector() {
    const districtSelect = document.getElementById('sandalDistrictSelect');
    const districts = Object.keys(realData.sandalwood);

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Populate department palm district selector dropdown
function populateDeptPalmDistrictSelector() {
    const districtSelect = document.getElementById('deptPalmDistrictSelect');
    const districts = Object.keys(realData.departmentPalm);

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Populate palm tree district selector dropdown
function populatePalmTreeDistrictSelector() {
    const districtSelect = document.getElementById('palmTreeDistrictSelect');
    const districts = Object.keys(realData.palmTree);

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Update overall geotag statistics
function updateOverallGeotagStats() {
    const data = realData.overallGeotag;
    const total = Object.values(data).reduce((sum, d) => sum + d.total, 0);
    const totalDistricts = Object.keys(data).length;

    // Update stat cards
    document.getElementById('allYearsCount').textContent = total.toLocaleString();

    // Current year (2026-2027)
    const currentYearTotal = Object.values(data).reduce((sum, d) => {
        return sum + (d.byYear['2026-2027'] || 0);
    }, 0);
    document.getElementById('currentYearCount').textContent = currentYearTotal.toLocaleString();

    // This month (October 2026) - approximate based on current year (since CSV doesn't have monthly data)
    const thisMonthTotal = Math.round(currentYearTotal * 0.1);
    document.getElementById('thisMonthCount').textContent = thisMonthTotal.toLocaleString();

    // Today - approximate (since CSV doesn't have daily data)
    const todayTotal = Math.round(thisMonthTotal * 0.05);
    document.getElementById('todayCount').textContent = todayTotal.toLocaleString();

    // Update progress bars and pie chart based on district data
    updateGeotagProgressBars(data);
    updateGeotagPieChart(data);
}

// Update geotag progress bars with real data
function updateGeotagProgressBars(data) {
    const container = document.getElementById('geotagProgress');
    const districts = Object.keys(data);

    // Sort by total count
    districts.sort((a, b) => data[b].total - data[a].total);

    // Show top 15 districts to avoid too long a list
    const topDistricts = districts.slice(0, 15);

    const maxCount = Math.max(...topDistricts.map(d => data[d].total));

    container.innerHTML = topDistricts.map(district => {
        const count = data[district].total;
        const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
        const progressBarClass = getProgressBarClass(percentage);

        return `
            <div class="progress-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>${district}</span>
                    <span>${count.toLocaleString()} (${percentage}%)</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Add note if more districts exist
    if (districts.length > 15) {
        container.innerHTML += `<p class="text-muted small mt-2">Showing top 15 of ${districts.length} districts</p>`;
    }
}

// Update geotag pie chart with district-wise data
function updateGeotagPieChart(data) {
    const districts = Object.keys(data);
    const values = districts.map(d => data[d].total);

    const ctx = document.getElementById('geotagPieChart').getContext('2d');

    if (window.geotagChart) {
        window.geotagChart.destroy();
    }

    // Generate colors for all districts
    const colors = [
        'rgba(17, 153, 142, 0.8)',
        'rgba(33, 147, 176, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(235, 51, 73, 0.8)',
        'rgba(102, 126, 234, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(217, 70, 239, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(22, 163, 74, 0.8)',
        'rgba(234, 88, 12, 0.8)',
        'rgba(220, 38, 38, 0.8)',
        'rgba(79, 70, 229, 0.8)',
        'rgba(13, 148, 136, 0.8)',
        'rgba(217, 119, 6, 0.8)',
        'rgba(185, 28, 28, 0.8)',
        'rgba(67, 56, 202, 0.8)',
        'rgba(21, 128, 61, 0.8)',
        'rgba(202, 138, 4, 0.8)',
        'rgba(153, 27, 27, 0.8)',
        'rgba(55, 48, 163, 0.8)',
        'rgba(5, 150, 105, 0.8)',
        'rgba(180, 83, 9, 0.8)',
        'rgba(127, 29, 29, 0.8)',
        'rgba(49, 46, 129, 0.8)',
        'rgba(6, 95, 70, 0.8)',
        'rgba(120, 53, 15, 0.8)'
    ];

    const borderColors = colors.map(c => c.replace('0.8', '1'));

    window.geotagChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: districts,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, districts.length),
                borderColor: borderColors.slice(0, districts.length),
                borderWidth: 3,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 10,
                            weight: '600'
                        },
                        color: '#e2e8f0',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8
                    }
                },
                title: {
                    display: true,
                    text: 'District-wise Distribution',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#e2e8f0',
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 27, 75, 0.9)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 2,
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: true
                }
            }
        }
    });
}

// Update geotag by year selection
function updateGeotagByYear() {
    const selectedYear = document.getElementById('geotagYearSelect').value;
    const selectedDistrict = document.getElementById('geotagDistrictSelect').value;

    let filteredData = { ...realData.overallGeotag };

    if (selectedYear !== 'all') {
        Object.keys(filteredData).forEach(district => {
            filteredData[district] = {
                total: filteredData[district].byYear[selectedYear] || 0,
                byYear: filteredData[district].byYear
            };
        });
    }

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: filteredData[selectedDistrict]
        };
    }

    updateGeotagProgressBars(filteredData);
    updateGeotagPieChart(filteredData);
}

// Update geotag by district selection
function updateGeotagByDistrict() {
    updateGeotagByYear();
}

// Apply geotag date filter
function applyGeotagDateFilter() {
    const startDate = document.getElementById('geotagStartDate').value;
    const endDate = document.getElementById('geotagEndDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    // Convert date range to financial years
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get financial years that fall within the date range
    const yearsToInclude = [];
    const startFY = getFinancialYear(start);
    const endFY = getFinancialYear(end);
    
    // Add all financial years between start and end
    const allYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'];
    const startIndex = allYears.indexOf(startFY);
    const endIndex = allYears.indexOf(endFY);
    
    if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
            yearsToInclude.push(allYears[i]);
        }
    }

    // Filter data by years
    let filteredData = {};
    Object.keys(realData.overallGeotag).forEach(district => {
        filteredData[district] = {
            total: 0,
            byYear: {}
        };
        
        Object.keys(realData.overallGeotag[district].byYear).forEach(year => {
            if (yearsToInclude.includes(year)) {
                filteredData[district].total += realData.overallGeotag[district].byYear[year];
                filteredData[district].byYear[year] = realData.overallGeotag[district].byYear[year];
            }
        });
    });

    // Also apply year and district filters if selected
    const selectedYear = document.getElementById('geotagYearSelect').value;
    const selectedDistrict = document.getElementById('geotagDistrictSelect').value;

    if (selectedYear !== 'all') {
        Object.keys(filteredData).forEach(district => {
            filteredData[district] = {
                total: filteredData[district].byYear[selectedYear] || 0,
                byYear: filteredData[district].byYear
            };
        });
    }

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: filteredData[selectedDistrict]
        };
    }

    updateGeotagProgressBars(filteredData);
    updateGeotagPieChart(filteredData);
}

// Helper function to get financial year from date
function getFinancialYear(date) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    // Financial year: April to March
    // If month is March or earlier (0-2), it's previous year to current year
    // If month is April or later (3-11), it's current year to next year
    if (month <= 2) {
        return `${year - 1}-${year}`;
    } else {
        return `${year}-${year + 1}`;
    }
}

// Apply agroforest date filter
function applyAgroDateFilter() {
    const startDate = document.getElementById('agroStartDate').value;
    const endDate = document.getElementById('agroEndDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const yearsToInclude = [];
    const startFY = getFinancialYear(start);
    const endFY = getFinancialYear(end);
    
    const allYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'];
    const startIndex = allYears.indexOf(startFY);
    const endIndex = allYears.indexOf(endFY);
    
    if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
            yearsToInclude.push(allYears[i]);
        }
    }

    let filteredData = {};
    Object.keys(realData.agroforest).forEach(district => {
        filteredData[district] = {
            total: 0,
            byYear: {}
        };
        
        Object.keys(realData.agroforest[district].byYear).forEach(year => {
            if (yearsToInclude.includes(year)) {
                filteredData[district].total += realData.agroforest[district].byYear[year];
                filteredData[district].byYear[year] = realData.agroforest[district].byYear[year];
            }
        });
    });

    const selectedYear = document.getElementById('agroYearSelect').value;
    const selectedDistrict = document.getElementById('agroDistrictSelect').value;

    if (selectedYear !== 'all') {
        Object.keys(filteredData).forEach(district => {
            filteredData[district] = {
                total: filteredData[district].byYear[selectedYear] || 0,
                byYear: filteredData[district].byYear
            };
        });
    }

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: filteredData[selectedDistrict]
        };
    }

    updateAgroforestDisplay(filteredData, selectedYear);
}

// Apply sandalwood date filter
function applySandalDateFilter() {
    const startDate = document.getElementById('sandalStartDate').value;
    const endDate = document.getElementById('sandalEndDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const yearsToInclude = [];
    const startFY = getFinancialYear(start);
    const endFY = getFinancialYear(end);
    
    const allYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'];
    const startIndex = allYears.indexOf(startFY);
    const endIndex = allYears.indexOf(endFY);
    
    if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
            yearsToInclude.push(allYears[i]);
        }
    }

    let filteredData = {};
    Object.keys(realData.sandalwood).forEach(district => {
        filteredData[district] = {
            total: 0,
            byYear: {}
        };
        
        Object.keys(realData.sandalwood[district].byYear).forEach(year => {
            if (yearsToInclude.includes(year)) {
                filteredData[district].total += realData.sandalwood[district].byYear[year];
                filteredData[district].byYear[year] = realData.sandalwood[district].byYear[year];
            }
        });
    });

    const selectedYear = document.getElementById('sandalYearSelect').value;
    const selectedDistrict = document.getElementById('sandalDistrictSelect').value;

    if (selectedYear !== 'all') {
        Object.keys(filteredData).forEach(district => {
            filteredData[district] = {
                total: filteredData[district].byYear[selectedYear] || 0,
                byYear: filteredData[district].byYear
            };
        });
    }

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: filteredData[selectedDistrict]
        };
    }

    updateSandalwoodDisplay(filteredData, selectedYear);
}

// Update department palm data with real data
function updateDeptPalmDataWithRealData() {
    const data = realData.departmentPalm;
    const selectedYear = document.getElementById('deptPalmYearSelect').value;
    const selectedDistrict = document.getElementById('deptPalmDistrictSelect').value;
    document.getElementById('selectedDeptPalmYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...data };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: data[selectedDistrict]
        };
    }

    updateDeptPalmDisplay(filteredData, selectedYear);
}

// Update department palm display
function updateDeptPalmDisplay(data, year) {
    const container = document.getElementById('deptPalmProgress');
    const districts = Object.keys(data);

    if (districts.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No department palm data available</p>';
        document.getElementById('deptPalmTotal').textContent = '0';
        document.getElementById('deptPalmPercentage').textContent = '0%';
        return;
    }

    districts.sort((a, b) => {
        const countA = year === 'all' ? data[a].total : (data[a].byYear[year] || 0);
        const countB = year === 'all' ? data[b].total : (data[b].byYear[year] || 0);
        return countB - countA;
    });

    const topDistricts = districts.slice(0, 10);

    const maxCount = Math.max(...topDistricts.map(d => year === 'all' ? data[d].total : (data[d].byYear[year] || 0)));

    container.innerHTML = topDistricts.map(district => {
        const count = year === 'all' ? data[district].total : (data[district].byYear[year] || 0);
        const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
        const progressBarClass = getProgressBarClass(percentage);

        return `
            <div class="progress-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>${district}</span>
                    <span>${count.toLocaleString()} (${percentage}%)</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    if (districts.length > 10) {
        container.innerHTML += `<p class="text-muted small mt-2">Showing top 10 of ${districts.length} districts</p>`;
    }

    const total = districts.reduce((sum, d) => sum + (year === 'all' ? data[d].total : (data[d].byYear[year] || 0)), 0);
    document.getElementById('deptPalmTotal').textContent = total.toLocaleString();
    document.getElementById('deptPalmPercentage').textContent = '100%';
}

// Update department palm data based on selection
function updateDeptPalmData() {
    const selectedYear = document.getElementById('deptPalmYearSelect').value;
    const selectedDistrict = document.getElementById('deptPalmDistrictSelect').value;
    document.getElementById('selectedDeptPalmYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...realData.departmentPalm };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: realData.departmentPalm[selectedDistrict]
        };
    }

    updateDeptPalmDisplay(filteredData, selectedYear);
}

// Apply department palm date filter
function applyDeptPalmDateFilter() {
    const startDate = document.getElementById('deptPalmStartDate').value;
    const endDate = document.getElementById('deptPalmEndDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const yearsToInclude = [];
    const startFY = getFinancialYear(start);
    const endFY = getFinancialYear(end);
    
    const allYears = ['2025-2026', '2026-2027'];
    const startIndex = allYears.indexOf(startFY);
    const endIndex = allYears.indexOf(endFY);
    
    if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
            yearsToInclude.push(allYears[i]);
        }
    }

    let filteredData = {};
    Object.keys(realData.departmentPalm).forEach(district => {
        filteredData[district] = {
            total: 0,
            byYear: {}
        };
        
        Object.keys(realData.departmentPalm[district].byYear).forEach(year => {
            if (yearsToInclude.includes(year)) {
                filteredData[district].total += realData.departmentPalm[district].byYear[year];
                filteredData[district].byYear[year] = realData.departmentPalm[district].byYear[year];
            }
        });
    });

    const selectedYear = document.getElementById('deptPalmYearSelect').value;
    const selectedDistrict = document.getElementById('deptPalmDistrictSelect').value;

    if (selectedYear !== 'all') {
        Object.keys(filteredData).forEach(district => {
            filteredData[district] = {
                total: filteredData[district].byYear[selectedYear] || 0,
                byYear: filteredData[district].byYear
            };
        });
    }

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: filteredData[selectedDistrict]
        };
    }

    updateDeptPalmDisplay(filteredData, selectedYear);
}

// Update palm tree data with real data
function updatePalmTreeDataWithRealData() {
    const data = realData.palmTree;
    const selectedYear = document.getElementById('palmTreeYearSelect').value;
    const selectedDistrict = document.getElementById('palmTreeDistrictSelect').value;
    document.getElementById('selectedPalmTreeYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...data };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: data[selectedDistrict]
        };
    }

    updatePalmTreeDisplay(filteredData, selectedYear);
}

// Update palm tree display
function updatePalmTreeDisplay(data, year) {
    const container = document.getElementById('palmTreeProgress');
    const districts = Object.keys(data);

    if (districts.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No palm tree data available</p>';
        document.getElementById('palmTreeTotal').textContent = '0';
        document.getElementById('palmTreePercentage').textContent = '0%';
        return;
    }

    districts.sort((a, b) => {
        const countA = year === 'all' ? data[a].total : (data[a].byYear[year] || 0);
        const countB = year === 'all' ? data[b].total : (data[b].byYear[year] || 0);
        return countB - countA;
    });

    const topDistricts = districts.slice(0, 10);

    const maxCount = Math.max(...topDistricts.map(d => year === 'all' ? data[d].total : (data[d].byYear[year] || 0)));

    container.innerHTML = topDistricts.map(district => {
        const count = year === 'all' ? data[district].total : (data[district].byYear[year] || 0);
        const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
        const progressBarClass = getProgressBarClass(percentage);

        return `
            <div class="progress-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>${district}</span>
                    <span>${count.toLocaleString()} (${percentage}%)</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    if (districts.length > 10) {
        container.innerHTML += `<p class="text-muted small mt-2">Showing top 10 of ${districts.length} districts</p>`;
    }

    const total = districts.reduce((sum, d) => sum + (year === 'all' ? data[d].total : (data[d].byYear[year] || 0)), 0);
    document.getElementById('palmTreeTotal').textContent = total.toLocaleString();
    document.getElementById('palmTreePercentage').textContent = '100%';
}

// Update palm tree data based on selection
function updatePalmTreeData() {
    const selectedYear = document.getElementById('palmTreeYearSelect').value;
    const selectedDistrict = document.getElementById('palmTreeDistrictSelect').value;
    document.getElementById('selectedPalmTreeYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...realData.palmTree };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: realData.palmTree[selectedDistrict]
        };
    }

    updatePalmTreeDisplay(filteredData, selectedYear);
}

// Apply palm tree date filter
function applyPalmTreeDateFilter() {
    const startDate = document.getElementById('palmTreeStartDate').value;
    const endDate = document.getElementById('palmTreeEndDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const yearsToInclude = [];
    const startFY = getFinancialYear(start);
    const endFY = getFinancialYear(end);
    
    const allYears = ['2025-2026', '2026-2027'];
    const startIndex = allYears.indexOf(startFY);
    const endIndex = allYears.indexOf(endFY);
    
    if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
            yearsToInclude.push(allYears[i]);
        }
    }

    let filteredData = {};
    Object.keys(realData.palmTree).forEach(district => {
        filteredData[district] = {
            total: 0,
            byYear: {}
        };
        
        Object.keys(realData.palmTree[district].byYear).forEach(year => {
            if (yearsToInclude.includes(year)) {
                filteredData[district].total += realData.palmTree[district].byYear[year];
                filteredData[district].byYear[year] = realData.palmTree[district].byYear[year];
            }
        });
    });

    const selectedYear = document.getElementById('palmTreeYearSelect').value;
    const selectedDistrict = document.getElementById('palmTreeDistrictSelect').value;

    if (selectedYear !== 'all') {
        Object.keys(filteredData).forEach(district => {
            filteredData[district] = {
                total: filteredData[district].byYear[selectedYear] || 0,
                byYear: filteredData[district].byYear
            };
        });
    }

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: filteredData[selectedDistrict]
        };
    }

    updatePalmTreeDisplay(filteredData, selectedYear);
}

// Update agroforest data with real data
function updateAgroforestDataWithRealData() {
    const data = realData.agroforest;
    const selectedYear = document.getElementById('agroYearSelect').value;
    const selectedDistrict = document.getElementById('agroDistrictSelect').value;
    document.getElementById('selectedAgroYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...data };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: data[selectedDistrict]
        };
    }

    updateAgroforestDisplay(filteredData, selectedYear);
}

// Update agroforest display
function updateAgroforestDisplay(data, year) {
    const container = document.getElementById('agroforestProgress');
    const districts = Object.keys(data);

    if (districts.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No agroforest data available</p>';
        document.getElementById('agroTotal').textContent = '0';
        document.getElementById('agroPercentage').textContent = '0%';
        return;
    }

    // Sort by total count for selected year
    districts.sort((a, b) => {
        const countA = year === 'all' ? data[a].total : (data[a].byYear[year] || 0);
        const countB = year === 'all' ? data[b].total : (data[b].byYear[year] || 0);
        return countB - countA;
    });

    // Show top 10 districts
    const topDistricts = districts.slice(0, 10);

    const maxCount = Math.max(...topDistricts.map(d => year === 'all' ? data[d].total : (data[d].byYear[year] || 0)));

    container.innerHTML = topDistricts.map(district => {
        const count = year === 'all' ? data[district].total : (data[district].byYear[year] || 0);
        const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
        const progressBarClass = getProgressBarClass(percentage);

        return `
            <div class="progress-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>${district}</span>
                    <span>${count.toLocaleString()} (${percentage}%)</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Add note if more districts exist
    if (districts.length > 10) {
        container.innerHTML += `<p class="text-muted small mt-2">Showing top 10 of ${districts.length} districts</p>`;
    }

    // Update summary
    const total = districts.reduce((sum, d) => sum + (year === 'all' ? data[d].total : (data[d].byYear[year] || 0)), 0);
    document.getElementById('agroTotal').textContent = total.toLocaleString();
    document.getElementById('agroPercentage').textContent = '100%';
}

// Update sandalwood data with real data
function updateSandalwoodDataWithRealData() {
    const data = realData.sandalwood;
    const selectedYear = document.getElementById('sandalYearSelect').value;
    const selectedDistrict = document.getElementById('sandalDistrictSelect').value;
    document.getElementById('selectedSandalYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...data };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: data[selectedDistrict]
        };
    }

    updateSandalwoodDisplay(filteredData, selectedYear);
}

// Update sandalwood display
function updateSandalwoodDisplay(data, year) {
    const container = document.getElementById('sandalwoodProgress');
    const districts = Object.keys(data);

    if (districts.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No sandalwood data available</p>';
        document.getElementById('sandalTotal').textContent = '0';
        document.getElementById('sandalPercentage').textContent = '0%';
        return;
    }

    // Sort by total count for selected year
    districts.sort((a, b) => {
        const countA = year === 'all' ? data[a].total : (data[a].byYear[year] || 0);
        const countB = year === 'all' ? data[b].total : (data[b].byYear[year] || 0);
        return countB - countA;
    });

    // Show top 10 districts
    const topDistricts = districts.slice(0, 10);

    const maxCount = Math.max(...topDistricts.map(d => year === 'all' ? data[d].total : (data[d].byYear[year] || 0)));

    container.innerHTML = topDistricts.map(district => {
        const count = year === 'all' ? data[district].total : (data[district].byYear[year] || 0);
        const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
        const progressBarClass = getProgressBarClass(percentage);

        return `
            <div class="progress-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>${district}</span>
                    <span>${count.toLocaleString()} (${percentage}%)</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Add note if more districts exist
    if (districts.length > 10) {
        container.innerHTML += `<p class="text-muted small mt-2">Showing top 10 of ${districts.length} districts</p>`;
    }

    // Update summary
    const total = districts.reduce((sum, d) => sum + (year === 'all' ? data[d].total : (data[d].byYear[year] || 0)), 0);
    document.getElementById('sandalTotal').textContent = total.toLocaleString();
    document.getElementById('sandalPercentage').textContent = '100%';
}

// Initialize Pie Chart
function initializePieChart() {
    const ctx = document.getElementById('geotagPieChart').getContext('2d');

    window.geotagChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'In Progress', 'Pending', 'Rejected'],
            datasets: [{
                data: [65, 20, 10, 5],
                backgroundColor: [
                    'rgba(17, 153, 142, 0.8)',
                    'rgba(33, 147, 176, 0.8)',
                    'rgba(240, 147, 251, 0.8)',
                    'rgba(235, 51, 73, 0.8)'
                ],
                borderColor: [
                    '#11998e',
                    '#2193b0',
                    '#f093fb',
                    '#eb3349'
                ],
                borderWidth: 3,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        color: '#e2e8f0',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                title: {
                    display: true,
                    text: 'Geotag Status Distribution',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#e2e8f0',
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 27, 75, 0.9)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 2,
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: true
                }
            }
        }
    });
}

// Update Agroforest data based on individual year selection
function updateAgroData() {
    const selectedYear = document.getElementById('agroYearSelect').value;
    const selectedDistrict = document.getElementById('agroDistrictSelect').value;
    document.getElementById('selectedAgroYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...realData.agroforest };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: realData.agroforest[selectedDistrict]
        };
    }

    updateAgroforestDisplay(filteredData, selectedYear);
}

// Update Sandalwood data based on individual year selection
function updateSandalData() {
    const selectedYear = document.getElementById('sandalYearSelect').value;
    const selectedDistrict = document.getElementById('sandalDistrictSelect').value;
    document.getElementById('selectedSandalYear').textContent = selectedYear === 'all' ? 'All Years' : selectedYear;

    let filteredData = { ...realData.sandalwood };

    if (selectedDistrict !== 'all') {
        filteredData = {
            [selectedDistrict]: realData.sandalwood[selectedDistrict]
        };
    }

    updateSandalwoodDisplay(filteredData, selectedYear);
}

// Initialize Pie Chart function (removed - now using updateGeotagPieChart)
function initializePieChart() {
    // This function is no longer needed
}

// Helper function to get progress bar class based on percentage
function getProgressBarClass(percentage) {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-info';
    if (percentage >= 40) return 'bg-warning';
    return 'bg-danger';
}
