
// Sidebar
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}


// Food Cart
    //Display
function toggleDiv() {
    const cartDiv = document.getElementById('cart');
    if (cartDiv.classList.contains('hidden')) {
        cartDiv.classList.remove('hidden');
        cartDiv.classList.add('carttab');
    } else {
        cartDiv.classList.remove('carttab');
        cartDiv.classList.add('hidden');
    }
}

    //Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get all the cart icons on menu items
    const cartIcons = document.querySelectorAll('.menu-items .cart');

    // Add click event listeners to all cart icons
    cartIcons.forEach(icon => {
        icon.addEventListener('click', function (event) {
            event.preventDefault();
            addToCart(this);
        });
    });

    function addToCart(icon) {
        const menuItem = icon.closest('.menu-items');
        const itemName = menuItem.querySelector('.des h3').textContent;
        const itemPrice = parseFloat(menuItem.querySelector('.des h5').textContent.replace('KSH ', ''));
        const itemImageSrc = menuItem.querySelector('img').src;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingCartItem = cart.find(item => item.name === itemName);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1,
                imageSrc: itemImageSrc
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotalPrice();
    }

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const listCart = document.querySelector('.listcart');
        listCart.innerHTML = '';

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-items');
            cartItem.innerHTML = `
                <div class="cart-img">
                    <img src="${item.imageSrc}" alt="item">
                </div>
                <div class="name">${item.name}</div>
                <div class="total-price">KSH ${(item.price * item.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span><i class="fa-solid fa-minus minus" style="color: #cca105;"></i></span>
                    <span>${item.quantity}</span>
                    <span><i class="fa-solid fa-plus plus" style="color: #cca105;"></i></span>
                </div>
            `;
            listCart.appendChild(cartItem);

            cartItem.querySelector('.plus').addEventListener('click', function () {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateTotalPrice();
            });

            cartItem.querySelector('.minus').addEventListener('click', function () {
                item.quantity -= 1;
                if (item.quantity < 1) {
                    cart.splice(cart.indexOf(item), 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateTotalPrice();
            });
        });
    }

    function updateTotalPrice() {
        const cartItems = document.querySelectorAll('.cart-items');
        let subtotal = 0;
        const deliveryFee = 200;
        console.log('Calculating subtotal...');
    
        // Calculate the subtotal by iterating over each cart item
        cartItems.forEach(item => {
            const priceText = item.querySelector('.total-price').textContent;
            console.log('Item price text:', priceText);
    
            // If price text is empty, assume price is 0
            let price = 0;
            if (priceText.trim() !== "") {
                price = parseFloat(priceText.replace('KSH ', ''));
            }
            console.log('Parsed price:', price);
            subtotal += price;
        });
    
        const total = subtotal + deliveryFee;
        console.log('Subtotal:', subtotal);
        console.log('Total:', total);
    
        // Select the span elements using IDs
        const subtotalSpan = document.querySelector('#subtotal-span');
        const deliveryFeeSpan = document.querySelector('#delivery-fee-span');
        const totalSpan = document.querySelector('#total-span');
    
        // Update the subtotal, delivery fee, and total in their respective span elements if they exist
        if (subtotalSpan) {
            subtotalSpan.textContent = `KSH ${subtotal.toFixed(2)}`;
        } else {
            console.error('Subtotal span not found');
        }
    
        if (deliveryFeeSpan) {
            deliveryFeeSpan.textContent = `KSH ${deliveryFee.toFixed(2)}`;
        } else {
            console.error('Delivery Fee span not found');
        }
    
        if (totalSpan) {
            totalSpan.textContent = `KSH ${total.toFixed(2)}`;
        } else {
            console.error('Total span not found');
        }


        // Update the total and delivery fee in localStorage
       
        localStorage.setItem('subtotal', subtotal);
        localStorage.setItem('totalAmount', total);
        localStorage.setItem('deliveryFee', deliveryFee);
    }

    document.getElementById('checkout-button').addEventListener('click', () => {
        updateTotalPrice(); // Ensure the latest totals are calculated
        window.location.href = 'checkout.html'; // Redirect to payment page
    });

    renderCart();
    updateTotalPrice();
});



/* Checkout*/
document.addEventListener('DOMContentLoaded', () => {
    const subtotal = localStorage.getItem('subtotal');
    const totalAmount = localStorage.getItem('totalAmount');
    const deliveryFee = localStorage.getItem('deliveryFee');
   

    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('total-amount').textContent = totalAmount;
    document.getElementById('delivery-fee').textContent = deliveryFee;

   
});


// Address delivery


document.addEventListener('DOMContentLoaded', function() {
   
    const form = document.getElementById('delivery-form');

    // Add an event listener for the form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve values from the input fields
        const address = document.getElementById('address').value;
        const street = document.getElementById('street').value;
        const city = document.getElementById('city').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;


        // Make a POST request to save the delivery information
        try {
            const response = await fetch('http://localhost:5003/api/delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address, street, city, phone, email }),
            });

            // Parse the response
            const data = await response.json();

            // Check if the request was successful
            if (response.ok) {
                alert(data.message); // Show success message
                form.reset(); // Reset form fields
            } else {
                alert(`Error: ${data.message}`); // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving your information. Please try again.');
        }
    });
});

// Payment
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('pay-btn').addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect payment details
        const cardNumber = document.getElementById('card-no').value;
        const expiryDate = document.getElementById('ex-date').value;
        const cvv = document.getElementById('cvv').value;
        const email = document.getElementById('email').value;

        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Prepare data to send to the server
        const orderData = {
            cardNumber,
            expiryDate,
            cvv,
            email,
            cartItems,
        };

        console.log('Sending order data:', orderData); // Log the order data being sent

        try {
            const response = await fetch('http://localhost:3000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message); // Notify user of success
                console.log('Order processed successfully:', result); // Log success response
                localStorage.removeItem('cart'); // Clear cart after successful payment
                window.location.href = 'index.html'; // Redirect to thank you page or similar
            } else {
                const errorResult = await response.json();
                alert(`Error: ${errorResult.message}`); // Alert user of error
                console.error('Error response from server:', errorResult); // Log error response
            }
        } catch (error) {
            console.error('Error during fetch operation:', error); // Log fetch error details
            alert('There was an error processing your payment. Please try again.'); // Alert user of fetch error
        }
    });
});


// Login/Signup

function go() {
    window.location.href = '../index.html'; // Redirects to index.html
}

async function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Login successful: ' + result.message);
           
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
}

async function handleSignup(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://localhost:5000/signup/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Sign up successful: ' + result.message);
            
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup.');
    }
}