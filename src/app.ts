import express from "express"
import dotenv from "dotenv"
import CompositionRoot from "../src/CompositionRoot"
var cors = require("cors")

dotenv.config()
CompositionRoot.configure()
const port = process.env.PORT
console.log(port)
const app = express()
app.use(cors({
    origin: ["http://localhost:8200", "http://127.0.0.1:8200"],
    credentials: true,
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/auth",CompositionRoot.authRouter())
app.listen(port,()=>console.log('listening to port '+ port))