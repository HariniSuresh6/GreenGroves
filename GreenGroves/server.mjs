import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the CORS middleware
import path from 'path'; 
import bodyParser from 'body-parser'; 
import mongoose from 'mongoose';
import multer from 'multer';
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();
const mongoURI = process.env.MONGO_URI;

// Use CORS middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(express.json()); // Middleware to parse JSON request bodies

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log('MongoDB connection error:', err));


// Serve home.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reghome.html'));
});

// Load environment variables
console.log("Loaded GITHUB_TOKEN:", process.env.GITHUB_TOKEN);


const token = process.env["GITHUB_TOKEN"];
if (!token) {
    console.error("Error: GITHUB_TOKEN is not defined. Please check your .env file.");
    throw new Error("Azure key is missing or invalid. Please check your .env file.");
}
app.post('/api/query', async (req, res) => {
    const userInput = req.body.question; // Get user input from request body

    const client = new ModelClient(
        "https://models.inference.ai.azure.com",
        new AzureKeyCredential(token)
    );

    try {
        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role: "system", content: "You are a chatbot for a web application that allow students to apply for volunteering, internships and events and sustainable organisations to display such events hosted by them. If student is a new user, they have to first register and then login. To apply for an event login then select event or internship or volunteering from respective page and enroll. SStudents can search based on location or their interests. Organisations can register themselves by viewing option in home page. They can register, create their own profile and upload available volunteering opportunities, internships and events upcoming in their organisation from which students or other users can enroll." },
                    { role: "user", content: userInput }
                ],
                model: "gpt-4o",
                temperature: 0.34,
                max_tokens: 4096,
                top_p: 1
            }
        });

        if (response.status !== "200") {
            throw response.body.error;
        }
        
        res.json({ answer: response.body.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// Define Mongoose schemas and models
const registrationSchema = new mongoose.Schema({
    name: String,
    role: String,
    orgname: String,
    email: String,
    password: String
});
const Registration = mongoose.model('Registration', registrationSchema);

const organizationSchema = new mongoose.Schema({
    name: String,
    logo: String,
    description: String,
    startDate: Date,
    email: String,
    password: String,
    location: String
});
const Organization = mongoose.model('Organization', organizationSchema);

const serviceSchema = new mongoose.Schema({
    title: String,
    organizationName: String,
    date: String,
    description: String
});
const Service = mongoose.model('Service', serviceSchema);

const applicationSchema = new mongoose.Schema({
    fname: String,
    purpose: String,
    purposeName: String,
    email: String,
    phone: String,
    address: String
});
const Application = mongoose.model('Application', applicationSchema);

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    organizationName: { type: String, required: true }, // Use organizationName instead of organizationId
    logo: { type: String } // For storing logo filename
});

const Event = mongoose.model('Event', eventSchema);

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    salary: { type: Number, required: true },
    organizationName: { type: String, required: true } // Use organizationName instead of organizationId
});

const Internship = mongoose.model('Internship', internshipSchema);


// Multer configuration for file uploads (logo)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API Endpoints

// Registration API
app.get('/api/register', async (req, res) => {
    try {
        const users = await Registration.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users: ' + err.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const newUser = new Registration(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error registering user: ' + err.message });
    }
});

app.put('/api/register/:id', async (req, res) => {
    try {
        const updatedUser = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user: ' + err.message });
    }
});

app.delete('/api/register/:id', async (req, res) => {
    try {
        const result = await Registration.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user: ' + err.message });
    }
});

// Service API
app.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching services: ' + err.message });
    }
});

app.post('/services', async (req, res) => {
    try {
        const newService = new Service(req.body);
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (err) {
        res.status(500).json({ message: 'Error creating service: ' + err.message });
    }
});

app.delete('/services/:id', async (req, res) => {
    try {
        const result = await Service.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service: ' + err.message });
    }
});

// Application API
app.get('/api/applications', async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applications: ' + err.message });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (err) {
        res.status(500).json({ message: 'Error submitting application: ' + err.message });
    }
});

app.put('/api/applications/:id', async (req, res) => {
    try {
        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedApplication) return res.status(404).json({ message: 'Application not found' });
        res.status(200).json(updatedApplication);
    } catch (err) {
        res.status(500).json({ message: 'Error updating application: ' + err.message });
    }
});

app.delete('/api/applications/:id', async (req, res) => {
    try {
        const result = await Application.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Application not found' });
        res.status(200).json({ message: 'Application removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing application: ' + err.message });
    }
});

// Organization API
app.get('/api/organisations', async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching organizations: ' + err.message });
    }
});

app.post('/api/organisations', upload.single('logo'), async (req, res) => {
    try {
        const logo = req.file ? req.file.filename : null;
        const newOrganization = new Organization({
            name: req.body.orgName,
            logo: req.file.filename,
            description: req.body.description,
            startDate: req.body.startDate,
            location: req.body.location,
            email: req.body.email,
            password: req.body.password
        });
        const savedOrganization = await newOrganization.save();
        res.status(201).json({ message: 'Organization registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed: ' + err.message });
    }
});

// Login API
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user = null;
        if (role === 'Organisation') {
            user = await Organization.findOne({ name: username, password });
        } else if (role === 'User') {
            user = await Registration.findOne({ name: username, password });
        } else {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Respond with the organisation/user name after successful login
        res.status(200).json({
            message: 'Login successful',
            name: user.name  // Send organisation or user name
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});


// Event API
// Backend code for uploading events
app.post('/api/events', upload.single('logo'), (req, res) => {
    const { title, date, description, organizationName } = req.body; // Get organizationName from the request
    const logo = req.file ? req.file.filename : null;

    // Save the event in the database using organizationName
    const newEvent = new Event({
        title,
        date,
        description,
        organizationName, // Store organizationName instead of organizationId
        logo
    });

    newEvent.save()
        .then(event => res.status(201).json(event))
        .catch(error => res.status(500).json({ message: 'Error saving event', error }));
});

// Events API
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        // Assuming that the logo filename is stored in each event
        const eventsWithLogo = events.map(event => ({
            ...event.toObject(),
            logo: `uploads/${event.logo}` // Prepend the uploads folder to the logo path
        }));
        res.status(200).json(eventsWithLogo);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events: ' + err.message });
    }
});

app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        // Assuming that the logo filename is stored in each event
        const eventsWithLogo = events.map(event => ({
            ...event.toObject(),
            logo: `uploads/${event.logo}` // Prepend the uploads folder to the logo path
        }));
        res.status(200).json(eventsWithLogo);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events: ' + err.message });
    }
});

app.post('/api/events', upload.single('logo'), async (req, res) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            logo: req.file.filename,
            description: req.body.description,
            date: req.body.date,
            organizationName: req.body.organizationName
        });
        const savedEvent = await newEvent.save();
        res.status(201).json({ message: 'Event created successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Event creation failed: ' + err.message });
    }
});

// Internships API
app.get('/api/internships', async (req, res) => {
    try {
        const internships = await Internship.find();
        // Map the internships data to include the required fields
        const internshipsData = internships.map(internship => ({
            id: internship._id,
            title: internship.title,
            organizationName: internship.organizationName,
            startDate: internship.startDate,
            endDate: internship.endDate,
            salary: internship.salary
        }));
        res.status(200).json(internshipsData);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching internships: ' + err.message });
    }
});



app.post('/api/internships', upload.single('logo'), async (req, res) => {
    try {
        const newInternship = new Internship({
            title: req.body.title,
            organizationName: req.body.organizationName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            salary: req.body.salary,
            logo: req.file ? req.file.filename : null // Handle file upload
        });
        
        const savedInternship = await newInternship.save();
        res.status(201).json({ message: 'Internship created successfully!', internship: savedInternship });
    } catch (err) {
        res.status(500).json({ message: 'Internship creation failed: ' + err.message });
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
