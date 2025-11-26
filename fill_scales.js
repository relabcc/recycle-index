const fs = require('fs');
const path = require('path');

const SCALE_FILE = path.join(__dirname, 'static/data/scale.json');
const CFG_FILE = path.join(__dirname, 'static/data/cfg.json');
const DATA_FILE = path.join(__dirname, 'static/data/data.json');

// Target visual heights (in pixels) for different contexts
const TARGET_HEIGHTS = {
    scale: 350,            // Desktop default
    mobileScale: 300,      // Mobile default
    homeScale: 200,        // Home page default
    shareScale: 250,       // Share image default
    mobileShareScale: 280  // Mobile share image default
};

// Helper to check if a value is "empty"
const isEmpty = (val) => val === "" || val === null || val === undefined;

function loadJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function calculateItemDimensions(layers) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    layers.forEach(layer => {
        const x = parseFloat(layer['圖層X位置']);
        const y = parseFloat(layer['圖層Y位置']);
        const w = parseFloat(layer['圖層W寬度']);
        const h = parseFloat(layer['圖層H高度']);

        if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
        }
    });

    if (minX === Infinity) return null;

    return {
        width: maxX - minX,
        height: maxY - minY
    };
}

function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0) return null; // No filter, process all

    const ids = new Set();
    const argString = args.join(','); // Handle space separated args as well

    argString.split(',').forEach(part => {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) ids.add(i);
            }
        } else {
            const num = Number(part);
            if (!isNaN(num)) ids.add(num);
        }
    });

    return ids;
}

function main() {
    console.log('Loading files...');
    const scaleData = loadJSON(SCALE_FILE);
    const cfgData = loadJSON(CFG_FILE);
    const dataInfo = loadJSON(DATA_FILE);

    // Create ID to Name mapping
    const idToName = {};
    dataInfo.forEach(item => {
        idToName[parseInt(item['最終序號'])] = item['品項'];
    });

    // Parse arguments for ID filtering
    const targetIds = parseArgs();
    let targetNames = null;

    if (targetIds) {
        targetNames = new Set();
        targetIds.forEach(id => {
            if (idToName[id]) {
                targetNames.add(idToName[id]);
            } else {
                console.warn(`Warning: ID ${id} not found in data.json`);
            }
        });
        console.log(`Targeting IDs: ${Array.from(targetIds).join(', ')}`);
        console.log(`Targeting Items: ${Array.from(targetNames).join(', ')}`);
    } else {
        console.log('Targeting ALL items.');
    }

    // Group cfg layers by item name
    const cfgMap = {};
    cfgData.forEach(item => {
        const name = item['垃圾名稱'];
        if (!cfgMap[name]) cfgMap[name] = [];
        cfgMap[name].push(item);
    });

    let updatedCount = 0;

    scaleData.forEach(item => {
        const name = item.name;

        // Filter check
        if (targetNames && !targetNames.has(name)) {
            return;
        }

        const layers = cfgMap[name];

        if (!layers) {
            console.warn(`Warning: No config found for item "${name}"`);
            return;
        }

        const dimensions = calculateItemDimensions(layers);
        if (!dimensions) {
            console.warn(`Warning: Could not calculate dimensions for "${name}"`);
            return;
        }

        const originalHeight = dimensions.height;
        
        // Fields to check and update
        const fields = ['scale', 'mobileScale', 'homeScale', 'shareScale', 'mobileShareScale'];

        fields.forEach(field => {
            if (isEmpty(item[field])) {
                const targetHeight = TARGET_HEIGHTS[field];
                // Calculate scale: (Target / Original) * 100
                let calculatedScale = Math.round((targetHeight / originalHeight) * 100);
                
                console.log(`Updating "${name}" ${field}: ${calculatedScale} (Original Height: ${Math.round(originalHeight)})`);
                item[field] = calculatedScale.toString();
                updatedCount++;
            }
        });
    });

    if (updatedCount > 0) {
        console.log(`Saving ${updatedCount} updates to scale.json...`);
        saveJSON(SCALE_FILE, scaleData);
        console.log('Done.');
    } else {
        console.log('No missing values found for selected items. No changes made.');
    }
}

main();
