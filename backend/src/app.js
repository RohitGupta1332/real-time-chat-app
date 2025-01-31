import express from "express";
import dotenv from "dotenv";
import databaseConn from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
const app = express();
dotenv.config();

databaseConn();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})