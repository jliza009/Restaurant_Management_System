const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session'); // Ensure express-session is imported
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is imported
const { v4: uuidv4 } = require('uuid'); // Import UUID package

const app = express();
const port1 = 5000;
const port2 = 3000;
const port3 = 5001;
const port4 = 5002;
const port5 = 5003;




// Middleware
app.use(cors()); // Use cors middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true })); // Define session middleware
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.static(__dirname)); // Serve static files from the root directory

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/Res', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));




// Mongoose Models
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    employeeId: { type: String, unique: true, required: true },
});

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    driverId: { type: String, unique: true, required: true },
});




const orderDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    cartItems: { type: Array, required: true },
});



const productSchema = new mongoose.Schema({
    productID: {
        type: Number,required: true
    },
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});


const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    cardNumber: String,
    expiryDate: String,
    cvv: String,
    email: String,
    cartItems: Array,
});

const orderStatusSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    status:  { type: String, required: true },
    driver:  { type: String},
    statusDate: { type: Date, default: Date.now }
});

const deliverySchema = new mongoose.Schema({
    address: String,
    street: String,
    city: String,
    phone: String,
    email: { type: String, unique: true, required: true }

});


const Customer = mongoose.model('Customer', customerSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Driver = mongoose.model('Driver', driverSchema);
const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);


        //login

// Serve login HTML directly from the route
app.get('/', (req, res) => {
    console.log('GET / route accessed'); // Debug log
    res.send(`
      
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
            <title>Login Page</title>
        </head>
        <body>
            <script src="/app.js"></script>
        
            <div class="hero">
                <div class="form-box">
                    <div class="button-box">
                        <div id="btn"></div>
                        <button type="button" class="toggle-btn" onclick="login()">Log In</button>
                        <button type="button" class="toggle-btn" onclick="signup()">Sign Up</button>
                    </div>
                    <div class="social-icons">
                        <img src="login-img/fb.png">
                        <img src="login-img/tw.png">
                        <img src="login-img/gp.png">
                    </div>
                    <!-- Log in form -->
                    <form id="login" class="input-group" onsubmit="handleLogin(event)">
                        <input type="text" class="input-field" placeholder="Email" required name="email">
                        <input type="password" class="input-field" placeholder="Enter Password" required name="password">
                        <input type="checkbox" class="check-box"><span>Remember Password</span>
                        <button type="submit" class="submit-btn">Log In</button>
                    </form>
                    <!-- Signup form -->
                    <form id="signup" class="input-group" onsubmit="handleSignup(event)">
                        <input type="text" class="input-field" placeholder="Name" required name="name">
                        <input type="email" class="input-field" placeholder="Email" required name="email">
                        <input type="password" class="input-field" placeholder="Enter Password" required name="password">
                        <input type="checkbox" class="check-box"><span>I agree to the terms & conditions</span>
                        <button type="submit" class="submit-btn">Sign Up</button>
                    </form>
                </div>
            </div>
        
            <script>
                var x = document.getElementById("login");
                var y = document.getElementById("signup");
                var z = document.getElementById("btn");
            
                function signup(){
                    x.style.left = "-400px";
                    y.style.left = "50px";
                    z.style.left = "110px";
                }
                function login(){
                    x.style.left = "50px";
                    y.style.left = "450px";
                    z.style.left = "0px";
                }
            </script>

            <script>
                async function handleLogin(event) {
                    event.preventDefault(); // Prevent the default form submission
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;

                    try {
                        const response = await fetch('/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ username, password })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            alert('Login successful: ' + data.message);
                            console.log('Login successful:', data);
                           
                        } else {
                            console.error('Login failed:', response.statusText);
                         alert('Login failed: ' + errorData.error)
                        }
                    } catch (error) {
                        console.error('Error during login:', error);
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Routes
app.post('/signup/customer', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({ name, email, password: hashedPassword });
        await newCustomer.save();
        res.status(201).json({ message: 'Customer created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating customer: ' + error.message });
    }
});

app.post('/signup/employee', async (req, res) => {
    const { name, email, password, employeeId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new Employee({ name, email, password: hashedPassword, employeeId });
        await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating employee: ' + error.message });
    }
});

app.post('/signup/driver', async (req, res) => {
    const { name, email, password, driverId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDriver = new Driver({ name, email, password: hashedPassword, driverId });
        await newDriver.save();
        res.status(201).json({ message: 'Driver created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating driver: ' + error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, employeeId, driverId, password } = req.body;
    try {
        let user;
        if (email) {
            user = await Customer.findOne({ email }) || await Employee.findOne({ email }) || await Driver.findOne({ email });
        } else {
            user = await Employee.findOne({ employeeId }) || await Driver.findOne({ driverId });
        }

        if (!user) {
            return res.status(401).json({ error: 'User  not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in: ' + error.message });
    }
});


app.listen(port1, () => {
    console.log(`Server running on http://localhost:${port1}`);
});


        //delivery

// POST endpoint to save delivery information
app.post('/api/delivery', async (req, res) => {
    const { address, street, city, phone, email } = req.body;

    const newDelivery = new Delivery({
        address,
        street,
        city,
        phone,
        email,
    });

    try {
        await newDelivery.save();
        res.status(201).send({ message: 'Delivery information saved successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving delivery information', error });
    }
});



// Start the server
app.listen(port5, () => {
    console.log(`Server is running on http://localhost:${port5}`);
});



        //orders

// Endpoint to save order information and cart items
app.post('/api/order', async (req, res) => {
    console.log('Received order data:', req.body); // Log incoming data
    try {
        const orderData = new Order({
            orderId: uuidv4(), // Generate unique orderId 
           ... req.body});
        await orderData.save();
        console.log('Order saved successfully!'); // Log success message
        res.status(201).send({ message: 'Order information saved successfully!' });
    } catch (error) {
        console.error('Error saving order information:', error); // Log error details
        res.status(500).send({ message: 'Error saving order information.', error });
    }
});

// Start the server
app.listen(port2, () => {
    console.log(`Server is running on http://localhost:${port2}`);
});




// GET endpoint to fetch all orders or a specific order by orderId
app.get('/api/order/:orderId?', async (req, res) => {
    try {
        const { orderId } = req.params;

        if (orderId) {
            // Fetch a specific order by orderId
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.json(order);
        }

        // Fetch all orders from the database
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// PUT endpoint to update an order's status by orderId
app.put('/api/order/id/:orderId', async (req, res) => {
    const { orderId } = req.params; // Get the order ID from URL parameters
    const { status, driver } = req.body;

    try {
        // Find the order by custom order ID (assuming it's a string)
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update fields only if they are provided
        if (status) {
            order.status = status;
        }
        if (driver) {
            order.driver = driver;
        }

        await order.save(); // Save the updated order

        // Check for existing status record
        let existingStatus = await OrderStatus.findOne({ orderId });

        if (existingStatus) {
            // If an existing status record is found, update it
            existingStatus.status = status || existingStatus.status; // Keep old status if no new one provided
            existingStatus.driver = driver || existingStatus.driver; // Keep old driver if no new one provided
            await existingStatus.save(); // Save the updated status record
            res.json({ updatedOrder: order, updatedStatus: existingStatus }); // Return updated data
        } else {
            // If no existing status record is found, create a new one
            const newStatus = new OrderStatus({
                orderId,
                status,
                driver
            });

            await newStatus.save(); // Save the new status record
            res.json({ updatedOrder: order, newStatus }); // Return updated order and newly created status record
        }
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET endpoint to fetch all statuses for a specific order ID
app.get('/api/order/status/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const statuses = await OrderStatus.find({ orderId });
        
        // Return empty array if no statuses found
        res.json(statuses); 
    } catch (error) {
        console.error("Error fetching order statuses:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Start the server

app.listen(port3, () => {
    console.log(`Server running at http://localhost:${port3}`);
});




/*
// Fetch orders from MongoDB
app.get('/api/order', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('Res'); // Replace with your database name
        const ordersCollection = database.collection('order'); // Replace with your collection name
        
        const orders = await ordersCollection.find({}).toArray();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching orders');
    } finally {
        await client.close();
    }
});
*/



/*
async function createOrderDetails(email) {
    try {
        // Fetch customer data
        const customer = await Customer.findOne({ email });
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Fetch delivery data
        const delivery = await Delivery.findOne({ email });
        if (!delivery) {
            throw new Error('Delivery information not found');
        }

        // Fetch order data (assuming you want to get cart items from orders)
        const order = await Order.findOne({ 'email': email });
        if (!order) {
            throw new Error('Order not found');
        }

        // Create a new order details entry
        const orderDetails = new OrderDetails({
            name: customer.name,
            email: customer.email,
            phone: delivery.phone,
            address: delivery.address,
            street: delivery.street,
            city: delivery.city,
            cartItems: order.cartItems 
        });

        // Save to order details collection
        await orderDetails.save();
        console.log('Order details created successfully:', orderDetails);
    } catch (error) {
        console.error('Error creating order details:', error.message);
    }
}

// Endpoint to trigger createOrderDetails function
app.post('/api/create-order-details', async (req, res) => {
    const { email } = req.body; // Expecting an email in the request body

    try {
        await createOrderDetails(email); // Call the function with the provided email
        res.status(200).send({ message: 'Order details created successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

*/


// Function to combine collections based on email
async function combineCollectionsAndStore(email) {
    try {
        // Fetch customer data
        const customer = await Customer.findOne({ email });
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Fetch delivery data
        const delivery = await Delivery.findOne({ email });
        if (!delivery) {
            throw new Error('Delivery information not found');
        }

        // Fetch order data
        const order = await Order.findOne({ email });
        if (!order) {
            throw new Error('Order not found');
        }

        // Create a new entry in OrderDetails
        const orderDetails = new OrderDetails({
            name: customer.name,
            email,
            phone: delivery.phone,
            address: delivery.address,
            street: delivery.street,
            city: delivery.city,
            cartItems: order.cartItems 
        });

        // Save to OrderDetails collection
        await orderDetails.save();
        console.log('Order details created successfully:', orderDetails);
        
        return { success: true, message: 'Order details created successfully' };
    } catch (error) {
        console.error('Error combining collections:', error.message);
        return { success: false, message: error.message };
    }
}

// API endpoint to trigger combination process
app.post('/api/combine-collections', async (req, res) => {
    const { email } = req.body; // Expecting an email in the request body

    const result = await combineCollectionsAndStore(email);
    
    if (result.success) {
        res.status(200).send({ message: result.message });
    } else {
        res.status(500).send({ message: result.message });
    }
});







// Start server
app.listen(port4, () => {
    console.log(`Server running at http://localhost:${port4}`);
});