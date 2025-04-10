const API_URL = 'http://localhost:8080/api/items';
const itemsTableBody = document.getElementById('itemsTableBody');

async function loadItems() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        
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
            await fetch(`${API_URL}/${barcode}`, {
                method: 'DELETE'
            });
            await loadItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    }
}

// Load items when page loads
document.addEventListener('DOMContentLoaded', loadItems);
