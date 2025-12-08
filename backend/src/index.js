const dotenv = require("dotenv");
const { app } = require("./app.js");
const connectDB = require("./config/db.js");

dotenv.config({
    path: './.env'
});

app.get("/", (req, res) => {
    res.send("Backend API is running");
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port :- http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed !!!", err);
    })