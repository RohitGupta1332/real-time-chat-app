import mongoose from "mongoose";

const databaseConn = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongodb connected")
    } catch (error) {
        console.log("Database connection failed: ", error)
    }
}

export default databaseConn;