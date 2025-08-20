/*


// script.js
const orderList = document.getElementById('order-list');
const acceptOrderButton = document.getElementById('accept-order');
let currentOrder = null;

// Function to fetch orders from the server
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5002/api/order');
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Function to display incoming orders
function displayOrders(orders) {
    orderList.innerHTML = '';

    orders.forEach(order => {
        const li = document.createElement('li');
        li.className = 'order-item';

        // Ensure items is defined and is an array
        const itemsList = Array.isArray(order.items) ? order.items.join(', ') : 'No items available';

        li.innerHTML = `
            <strong>Order #${order._id}</strong><br>
            Customer: ${order.customerName}<br>
            Address: ${order.address}<br>
            Items: ${itemsList}
        `;
        li.onclick = () => selectOrder(order);
        orderList.appendChild(li);
    });
}

// Function to select an order
function selectOrder(order) {
    currentOrder = order;
    acceptOrderButton.disabled = false; // Enable the accept button
}

// Function to accept the order
acceptOrderButton.onclick = () => {
    if (currentOrder) {
        alert(`You have accepted Order #${currentOrder._id} for ${currentOrder.customerName}.`);
        currentOrder = null; // Reset current order
        acceptOrderButton.disabled = true; // Disable the button again
        fetchOrders(); // Refresh the order list
    }
};

// Initial fetch of orders
fetchOrders();

*/

/*
// app.js

document.addEventListener('DOMContentLoaded', async function() {
    const orderList = document.getElementById('order-list');

    // Function to fetch and display order details
    async function fetchOrderDetails() {
        try {
            const response = await fetch('http://localhost:5002/api/order-details'); // Adjust port as needed
            const orders = await response.json();

            // Clear existing orders in the list
            orderList.innerHTML = '';

            // Render each order detail in the list
            orders.forEach(order => {
                const listItem = document.createElement('li');
                listItem.textContent = `
                    Name: ${order.name}, 
                    Email: ${order.email}, 
                    Phone: ${order.phone}, 
                    Address: ${order.address}, 
                    Street: ${order.street}, 
                    City: ${order.city}, 
                    Cart Items: ${JSON.stringify(order.cartItems)}
                `;
                orderList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }

    // Call the function to fetch and display order details when the page loads
    await fetchOrderDetails();
});
*/


/*

// app.js

document.addEventListener('DOMContentLoaded', async function() {
    const orderList = document.getElementById('order-list');

    // Function to fetch and display order details
    async function fetchOrderDetails() {
        try {
            const response = await fetch('http://localhost:5002/api/combine-collections'); // Adjust port as needed
            const orders = await response.json();

            // Clear existing orders in the list
            orderList.innerHTML = '';

            // Render each order detail in the list
            orders.forEach(order => {
                const listItem = document.createElement('li');
                listItem.textContent = `
                    Name: ${order.name}, 
                    Email: ${order.email}, 
                    Phone: ${order.phone}, 
                    Address: ${order.address}, 
                    Street: ${order.street}, 
                    City: ${order.city}, 
                    Cart Items: ${JSON.stringify(order.cartItems)}
                `;
                orderList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }

    // Call the function to fetch and display order details when the page loads
    await fetchOrderDetails();
});

*/