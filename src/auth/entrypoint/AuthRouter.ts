import IAuthRepo from "../domain/IAuthrepo";
import * as express from "express"
import IpasswordService from "../services/IpassWordService";
import ITokenServive from "../services/ITokenService";
import { transformAsserterArgs } from "chai-as-promised";
import AuthController from "./AuthController";
import SignInUseCase from "../usecases/signin_usecase";
import SignUpUseCase from "../usecases/signup_usercase";
import {  signinValidationRules,signupValidationRules, validate } from "../helper/validators";
import ITokenStore from "../services/ITokenStore";
import SignOutUseCase from "../usecases/signout_usecase";
import TokenValidator from "../helper/TokenValidator";
export default class AuthRouter{
    public static configure(
        authRepository:IAuthRepo,
        passwordService:IpasswordService,
        tokenService:ITokenServive,
        tokenStore:ITokenStore,
        tokenValidator:TokenValidator
    ):express.Router{
        const router = express.Router()
        let controller = AuthRouter.composeController(
            authRepository,passwordService,tokenService,tokenStore
        )
        router.post("/signin",signinValidationRules(),validate,(req:express.Request,res:express.Response)=>{
            controller.signin(req,res)
        })
        router.post("/signup",signupValidationRules(),validate,(req:express.Request,res:express.Response)=>{
            controller.signup(req,res)
        })
        router.post("/signout",(req,res,next)=>tokenValidator.validate(req,res,next),(req:express.Request,res:express.Response)=>{
            controller.signout(req,res)
        })
        return router
    }
    public  static composeController(authRepository: IAuthRepo, passwordService: IpasswordService, tokenService: ITokenServive,tokenStore:ITokenStore) 
    :AuthController{
        let signInUseCase = new SignInUseCase(authRepository,passwordService)
        let signUpUseCase = new SignUpUseCase(authRepository,passwordService)
        let signOutUseCase = new SignOutUseCase(tokenStore)
        let controller = new AuthController(signInUseCase,signUpUseCase,signOutUseCase,tokenService)
        return controller
    }

    
}