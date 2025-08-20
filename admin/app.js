
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

// Function to fetch orders from the API
async function loadOrders() {
    try {
        const response = await fetch('http://localhost:5001/api/order'); // Adjusted to your specified endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

// Function to display orders in the UI
function displayOrders(orders) {
    const ordersList = document.getElementById('orders');
    ordersList.innerHTML = ''; // Clear existing orders

    orders.forEach(order => {
        const listItem = document.createElement('li');

        const statusDropdown = document.getElementById('status'); // Get the dropdown element
    const selectedStatus = statusDropdown.value; // Get the currently selected value from the dropdown


        // Display email and current status of the specific order
        listItem.textContent = `Email: ${order.email} - Status: ${order.status || 'N/A'}`; // Default to 'Pending' if no status is set
        listItem.dataset.orderid = order.orderId; // Store unique order ID for later use
        listItem.dataset.email = order.email; // Store email for later use

        // Add click event to select the order
        listItem.addEventListener('click', () => {
            // Remove 'selected' class from all items
            const allItems = ordersList.querySelectorAll('li');
            allItems.forEach(item => item.classList.remove('selected'));

            // Add 'selected' class to clicked item
            listItem.classList.add('selected');
            showOrderDetails(order); // Show details of the selected order
        });

        ordersList.appendChild(listItem);
    });
}

// Function to show details of a selected order
function showOrderDetails(order) {
    const orderInfo = document.getElementById('order-info');

    const statusDropdown = document.getElementById('status'); // Get the dropdown element
    const selectedStatus = statusDropdown.value; // Get the currently selected value from the dropdown


    // Clear previous order details
    orderInfo.innerHTML = '';

    // Create a header for the order details
    const header = document.createElement('h3');
    header.textContent = `Order Details for ${order.email}`;
    orderInfo.appendChild(header);

    // Display status
    const statusParagraph = document.createElement('p');
    statusParagraph.textContent = `Status: ${order.status || selectedStatus}`;
    orderInfo.appendChild(statusParagraph);

    // Format cartItems for display
    if (order.cartItems && order.cartItems.length > 0) {
        const itemsHeader = document.createElement('h4');
        itemsHeader.textContent = 'Cart Items:';
        orderInfo.appendChild(itemsHeader);

        order.cartItems.forEach(item => {
            const itemDetail = document.createElement('p'); // Create a new paragraph for each item
            itemDetail.textContent = `${item.name} (Qty: ${item.quantity}, Price: Ksh${item.price.toFixed(2)})`;
            orderInfo.appendChild(itemDetail); // Append item detail to order info
        });
    } else {
        const noItemsParagraph = document.createElement('p');
        noItemsParagraph.textContent = 'No items in cart';
        orderInfo.appendChild(noItemsParagraph);
    }

    const orderDetailsDiv = document.getElementById('order-details');
    orderDetailsDiv.classList.remove('hidden'); // Show the order details section
}

// Update status functionality
document.getElementById('update-status').addEventListener('click', updateOrderStatus);

async function updateOrderStatus() {
    const selectedStatus = document.getElementById('status').value; // Get the selected status from dropdown
    const driverName = document.getElementById('driver').value;

    const selectedOrderElement = document.querySelector('#orders li.selected');
    const orderId = selectedOrderElement?.dataset.orderid; // Get selected order ID

    console.log("Updating order ID:", orderId);
    
    // Log the selected status and driver name
    console.log("Selected Status:", selectedStatus);
    console.log("Driver Name:", driverName);

    if (!orderId) {
        alert("Please select an order first.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5001/api/order/id/${orderId}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: selectedStatus, driver: driverName }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error updating order status: ${errorData.message}`);
            return;
        }

        alert("Order status updated successfully!");
        loadOrders(); // Refresh the order list
        document.getElementById('order-details').classList.add('hidden'); // Hide details after update
    } catch (error) {
        console.error("Error updating order status:", error);
    }
}
    

