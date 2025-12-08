const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");
const path = require("path")

const app = express();
app.use(express.json());

app.use(express.json({ limit: "25kb" }));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))

routes.forEach(({ path, route }) => {
    app.use(path, route);
});

module.exports = { app };