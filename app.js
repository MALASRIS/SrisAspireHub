const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const routes = require("./routes"); // ✅ Import Routes

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// ✅ MongoDB Connection (Improved)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // ✅ Ensures app stops if DB connection fails
});

// ✅ Use Routes
app.use("/", routes);

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views/assets"))); // Ensure `assets` exists inside `views`

// ✅ 404 Page Handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
