// Authentication functions
async function login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    return await response.json();
}

async function register(username, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    return await response.json();
}

// Inventory array to store scanned items
let inventory = [];

// DOM elements
const startScannerBtn = document.getElementById('startScanner');
const stopScannerBtn = document.getElementById('stopScanner');
const manualBarcodeInput = document.getElementById('manualBarcode');
const addManualBtn = document.getElementById('addManual');
const inventoryList = document.getElementById('inventoryList');

// Initialize scanner
function initScanner() {
    document.body.classList.add('scanner-active');
    
    // Check camera permissions first
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#interactive'),
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment",
                        aspectRatio: { min: 1, max: 2 }
                    },
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true
                },
                numOfWorkers: 4,
                frequency: 10,
                decoder: {
                    readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader"],
                    debug: {
                        drawBoundingBox: true,
                        showFrequency: true,
                        drawScanline: true,
                        showPattern: true
                    }
                },
                locate: true
            }, function(err) {
                if (err) {
                    console.error('Scanner initialization error:', err);
                    alert('Failed to initialize scanner: ' + err.message);
                    return;
                }
                console.log('Scanner initialized successfully');
                Quagga.start();
            });

            Quagga.onProcessed(function(result) {
                if (result) {
                    if (result.boxes) {
                        const ctx = Quagga.canvas.ctx.overlay;
                        const canvas = Quagga.canvas.dom.overlay;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        result.boxes.filter(box => box !== result.box).forEach(box => {
                            Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, ctx, {color: "green", lineWidth: 2});
                        });
                    }
                }
            });

            Quagga.onDetected(function(result) {
                const code = result.codeResult.code;
                console.log('Barcode detected:', code);
                addToInventory(code);
                // Vibrate on successful scan (mobile)
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            });
        })
        .catch(err => {
            console.error('Camera access error:', err);
            alert('Camera access denied. Please enable camera permissions.');
        });
}

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    if (document.body.classList.contains('scanner-active')) {
        Quagga.stop();
        initScanner();
    }
});

let currentBarcode = null;

// Show description modal
function showDescriptionModal(barcode) {
    currentBarcode = barcode;
    document.getElementById('descriptionModal').classList.remove('hidden');
    document.getElementById('itemDescription').focus();
}

// Add item to inventory
async function addToInventory(barcode, description = null) {
    if (!barcode) return;
    
    // Check if item already exists
    const existingItem = inventory.find(item => item.barcode === barcode);
    
    if (existingItem) {
        existingItem.quantity += 1;
        await saveItem(existingItem);
    } else {
        const newItem = {
            barcode: barcode,
            name: description || `Item ${barcode}`,
            quantity: 1
        };
        await saveItem(newItem);
    }
    
    await loadInventory();
}

// Handle barcode detection
Quagga.onDetected(async (result) => {
    const barcode = result.codeResult.code;
    const existingItem = inventory.find(item => item.barcode === barcode);
    
    if (existingItem) {
        await addToInventory(barcode);
    } else {
        showDescriptionModal(barcode);
    }
});

// Modal event listeners
document.getElementById('saveDescription').addEventListener('click', async () => {
    const description = document.getElementById('itemDescription').value;
    if (description) {
        await addToInventory(currentBarcode, description);
        document.getElementById('descriptionModal').classList.add('hidden');
        document.getElementById('itemDescription').value = '';
    }
});

document.getElementById('cancelDescription').addEventListener('click', () => {
    document.getElementById('descriptionModal').classList.add('hidden');
    document.getElementById('itemDescription').value = '';
});

// Remove item from inventory
async function removeFromInventory(barcode) {
    await removeItem(barcode);
    await loadInventory();
}

// Update the inventory display
function updateInventoryDisplay() {
    inventoryList.innerHTML = '';
    
    if (inventory.length === 0) {
        inventoryList.innerHTML = '<p class="text-gray-500">No items in inventory</p>';
        return;
    }
    
    // Create a temporary array to sort items (newest first)
    const sortedInventory = [...inventory].reverse();
    
    sortedInventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <span>${item.name} (${item.barcode})</span>
            <div>
                <span class="quantity">Qty: ${item.quantity}</span>
                <span class="remove-item ml-4" data-barcode="${item.barcode}">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        `;
        inventoryList.appendChild(itemElement);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const barcode = e.currentTarget.getAttribute('data-barcode');
            removeFromInventory(barcode);
        });
    });
}

const API_URL = 'http://127.0.0.1:10000/api';

// Fetch inventory from backend
async function loadInventory() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        const response = await fetch(`${API_URL}/inventory?user_id=${user.id}`);
        inventory = await response.json();
        updateInventoryDisplay();
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

// Save item to backend
async function saveItem(item) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        const response = await fetch(`${API_URL}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                barcode: item.barcode,
                name: item.name,
                quantity: item.quantity
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving item:', error);
    }
}

// Remove item from backend
async function removeItem(barcode) {
    try {
        await fetch(`${API_URL}/${barcode}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

// View database contents
async function viewDatabase() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const dbContents = document.getElementById('databaseContents');
        dbContents.textContent = JSON.stringify(data, null, 2);
        dbContents.classList.toggle('hidden');
    } catch (error) {
        console.error('Error viewing database:', error);
        alert('Failed to load database contents');
    }
}

// Event listeners
startScannerBtn.addEventListener('click', () => {
    initScanner();
    startScannerBtn.disabled = true;
    stopScannerBtn.disabled = false;
});

document.getElementById('viewDatabase').addEventListener('click', viewDatabase);

stopScannerBtn.addEventListener('click', () => {
    Quagga.stop();
    document.body.classList.remove('scanner-active');
    startScannerBtn.disabled = false;
    stopScannerBtn.disabled = true;
});

addManualBtn.addEventListener('click', () => {
    const barcode = manualBarcodeInput.value.trim();
    if (barcode) {
        addToInventory(barcode);
        manualBarcodeInput.value = '';
    }
});

// Allow Enter key to add manual barcode
manualBarcodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addManualBtn.click();
    }
});

// Initialize
loadInventory();
stopScannerBtn.disabled = true;
