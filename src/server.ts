import { log } from "console";
import express, { Request, Response } from "express";
import { routes } from "./routes";


const PORT = 3333;
const app = express();
app.use(express.json());
app.use(routes);


app.get("/", async (req:Request, res:Response)=>{
    console.log("teste get");   
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    
})