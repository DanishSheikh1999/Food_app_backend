import mongoose from "mongoose"
import AuthRepository from "../../../../src/auth/data/Repository/authrepository"
import dotenv from "dotenv"

import chai,{assert, expect} from 'chai'
import charAsPromised from 'chai-as-promised'

chai.use(charAsPromised)
dotenv.config()
describe("AuthRepository",()=>{

    let client:mongoose.Mongoose
    let sut:AuthRepository
     beforeEach(()=>{
         client = new mongoose.Mongoose()
         const connectionString = encodeURI(process.env.TEST_DB as string)
         
         client.connect(connectionString,{
                useNewUrlParser:true,
                useUnifiedTopology:true
         })
         sut = new AuthRepository(client)
     })
        after(()=>
        {
            client.disconnect()
        })

        it("should return user when user is found",async()=>{
            const email ="email@email.com"
            const password="password"
            const result = await sut.find(email)
        
            expect(result).to.not.be.empty
        })

        
})