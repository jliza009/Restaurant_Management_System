

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

const Customer = mongoose.model('Customer', customerSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Driver = mongoose.model('Driver', driverSchema);












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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




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
