import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import {createUser,getUserByName} from "./helper.js";
import{createQuestionlist,getAllQuestions,createUserlist,getUserlist,createQuestion} from "./helper.js";
dotenv.config();


const app = express();
//const PORT= process.env.PORT;
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

app.listen(process.env.PORT || 4000,()=>console.log("Server started in port number:"))

async function generateHashedPassword(password){
  const NO_OF_ROUNDS = 10 ; //Number of rounds of salting
  const salt=await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword=await bcrypt.hash(password,salt);
  return hashedPassword;
}
  // express.json() is a inbuilt middleware to convert data inside body to json format.


app.get('/', function (req, res) {
  res.send('Hello, Welcome to the APP')
})


app.post('/signup',async function (request, response) {
    const {UserName,Email,Password}=request.body;
    const userFromDB = await getUserByName(UserName);

    if(userFromDB){
      response.status(400).send({message:"Username already exists"});
    }
    else{
    const hashedPassword=await generateHashedPassword(Password)
    //db.users.insertOne(data);
    const result=await createUser({
      UserName:UserName,
      Email:Email,
      Password:hashedPassword,
    });
      response.send({message:"successful Signup"});
    } })

    app.post('/login',async function (request, response) {
      const {UserName,Password}=request.body;
      const userFromDB = await getUserByName(UserName);
  
      if(!userFromDB){
        response.status(400).send({message:"Invalid Credential"});
      }
      else{ 
        // check password
        const storedPassword = userFromDB.Password;
        const isPasswordMatch=await bcrypt.compare(Password,storedPassword);
        if(isPasswordMatch){
          response.send({message:"successful login"});
          localStorage.setItem("currentUser",UserName);
        }
        else{
          response.status(400).send({message:"Invalid Credential"});
        }
      }
  })
  app.post('/askQuestions',async function (request, response) {
    const data =request.body;
     const result=await createQuestionlist(data);
     response.send(result);
})
app.post('/askQuestion',async function (request, response) {
  const data =request.body;
   const result=await createQuestion(data);
   response.send(result);
})
app.post('/createAllUsers',async function (request, response) {
  const data =request.body;
   const result=await createUserlist(data);
   response.send(result);
})
app.get('/getAllUsers',async function (request, response) {
   const result=await getUserlist();
   response.send(result);
})

app.get('/questionsList',async function (request, response) {
  //db.movies.find({});
  
  const questions= await getAllQuestions();
  response.send(questions);
  })