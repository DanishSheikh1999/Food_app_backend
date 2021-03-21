import IAuthRepo from "../../../src/auth/domain/IAuthrepo"
import AuthController from "../../../src/auth/entrypoint/AuthController"
import express from "express"
import FakeRepo from "../helpers/fakeRepo"
import ITokenServive from "../../../src/auth/services/ITokenService"
import IpasswordService from "../../../src/auth/services/IpassWordService"
import AuthRouter from "../../../src/auth/entrypoint/AuthRouter"
import JwtTokenService from "../../../src/auth/data/services/jwt_tokenservice"
import BcryptPasswordService from "../../../src/auth/data/services/bcrypt_passwordservice"
import request from "supertest"
import chai,{expect} from "chai"
import charAsPromised from "chai-as-promised"

chai.use(charAsPromised)
describe("AuthRouter",()=>{
    let authRepository:IAuthRepo
    let app:express.Application
    let tokenService:ITokenServive
    let passwordService:IpasswordService
    // const user=  {
    //     name:"Danish",
    //     email:"danishindia1999@gmail.com",
    //     password:"pass",
    //     id:"1123",
    //     type:"email"
    // }

    beforeEach(()=>{
        authRepository= new FakeRepo()
        tokenService = new JwtTokenService("privateKey")
        passwordService = new BcryptPasswordService()

        app = express()
        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
        app.use("/auth",AuthRouter.configure(
            authRepository,passwordService,tokenService
        ))
    })

    it("should return 200 when the user is successfully added",async()=>{
        const user={
            email:"danishindia1999@gmail.com",
            password:"password1",
            auth_type:"email",
            name:"Danish"
        }
        await request(app).post("/auth/signup").send({email:user.email,password:user.password,auth_type:user.auth_type,name:user.name})
        .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
     
})
})