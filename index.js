import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();


const app = express();
const PORT= process.env.PORT;
app.use(express.json());
app.use(cors());

// const MONGO_URL="mongodb://127.0.0.1"

const MONGO_URL=process.env.MONGO_URL;

async function createConnection(){
    const client=new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected ")
    return client;
}

export const client=await createConnection();

app.get('/', function (req, res) {
    res.send('Hello, Welcome to the APP')
  })


app.listen(PORT,()=>console.log("Server started in port number:",PORT))