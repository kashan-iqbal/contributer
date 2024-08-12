import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connections: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connections.isConnected) {
    console.log(`db already connected`);
    return;
  }

  try {
    const db = await mongoose.connect("mongodb://localhost:27017");
    console.log(db.connections);

    const res = db.connections[0].readyState;
    console.log( `db connect successfully`);
  } catch (error) {
    console.log(`db is not connected ${error}`);
    process.exit();
  }
}

export default dbConnect;
