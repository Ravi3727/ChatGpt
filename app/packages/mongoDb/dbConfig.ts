import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: number
}

const connection: ConnectObject = {}

export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database")
        return
    }

    try {
        const DB = await mongoose.connect(process.env.DATABASE_URL || "", {})

        connection.isConnected = DB.connections[0].readyState

        console.log("DB connection established");
        
    } catch (error) {
        console.log("databse connection failed ",error);

        process.exit(1);
    }
}