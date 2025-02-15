const express = require("express");
const bcrypt = require('bcryptjs');
const connectDB = require("./config");  // Importing the DB connection
const collection = require("./models/config");
const path = require("path");

const app = express();

require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View Engine Setup
app.set("view engine", "ejs");

// Routes
app.get("/ejshome", (req, res) => {
    res.render("containers/ejshome", { title: "Home" });
});

app.get("/contact", (req, res) => {
    res.render("containers/contact", { title: "Contact" });
});

app.get("/about", (req, res) => {
    res.render("containers/about", { title: "About" });
});

app.get("/hscGuidance", (req, res) => {
    res.render("containers/hscGuidance", { title: "CareerGuidance" });
});

app.get("/sslcGuidance", (req, res) => {
    res.render("containers/sslcGuidance", { title: "CareerGuidance" });
});

app.get("/resource", (req, res) => {
    res.render("containers/resource", { title: "Resources" });
});

app.get("/", (req, res) => {
    res.render("containers/login", { title: "Login" });
});

app.get("/login", (req, res) => {
    res.redirect('/');
});

app.get("/signup", (req, res) => {
    res.render("containers/signup", { title: "Signup" });
});

// Signup route
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        return res.send("<script>alert('Username already exists'); window.location.href='/signup'</script>");
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRound);
    data.password = hashedPassword;

    try {
        const userData = await collection.create(data);
        console.log(userData);
        res.send("<script>alert('Signed up successfully'); window.location.href='/login'</script>");
    } catch (error) {
        console.error(error);
        res.send("<script>alert('Error signing up'); window.location.href='/signup'</script>");
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("<script>alert('Username not found'); window.location.href='/'</script>");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            return res.redirect("/ejshome");
        } else {
            return res.send("<script>alert('Wrong password'); window.location.href='/'</script>");
        }
    } catch (error) {
        console.error(error);
        return res.send("<script>alert('Error logging in'); window.location.href='/'</script>");
    }
});

// Static files setup
app.use(express.static("public"));
app.use(express.static('views/assets'));

// 404 Route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "views", "404.html"));
});

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
