const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

mongoose.connect(`mongodb://localhost:27017/rigistrationFormDB`, {
    
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const registrationSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    confirm_password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        const registrationData = new Registration({
            username,
            email,
            password,
            confirm_password
        });
        await registrationData.save();
        res.redirect("success");
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
