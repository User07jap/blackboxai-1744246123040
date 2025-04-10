// Initialize localStorage with sample data if empty
if (!localStorage.getItem('inventoryItems')) {
    localStorage.setItem('inventoryItems', JSON.stringify([
        {barcode: '123456', name: 'Sample Product 1', quantity: 10},
        {barcode: '789012', name: 'Sample Product 2', quantity: 5},
        {barcode: '345678', name: 'Sample Product 3', quantity: 8}
    ]));
}

const itemsTableBody = document.getElementById('itemsTableBody');

async function loadItems() {
    try {
        const items = JSON.parse(localStorage.getItem('inventoryItems'));
        itemsTableBody.innerHTML = '';
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-50';
            row.innerHTML = `
                <td class="py-3 px-4">${item.barcode}</td>
                <td class="py-3 px-4">${item.name}</td>
                <td class="py-3 px-4">${item.quantity}</td>
                <td class="py-3 px-4">
                    <button onclick="deleteItem('${item.barcode}')" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            itemsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Failed to load items');
    }
}

async function deleteItem(barcode) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const items = JSON.parse(localStorage.getItem('inventoryItems'));
            const updatedItems = items.filter(item => item.barcode !== barcode);
            localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
            await loadItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    }
}

// Load items when page loads
document.addEventListener('DOMContentLoaded', loadItems);
