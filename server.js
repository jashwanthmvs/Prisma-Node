import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// middleware for handling CORS
import cors from "cors";
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

import routes from "./routes/index.js";
app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});