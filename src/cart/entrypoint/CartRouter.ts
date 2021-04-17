import  * as express from "express";
import JwtTokenService from "../../auth/data/services/jwt_tokenservice";
import TokenValidator from "../../auth/helper/TokenValidator";
import ICartRepo from "../data/repository/ICartRepo";
import CartController from "./CartController";

export default class RestaurantRouter{
    public static configure(
        tokenValidator:TokenValidator,
        tokenService:JwtTokenService,
        repository:ICartRepo
    ):express.Router{
        const router = express.Router()
        let controller = new CartController(repository,tokenService)
        router.get('/find',
        (req,res,next)=>tokenValidator.validate(req,res,next),
        (req,res)=>controller.find(req,res))

        router.post('/add',
        (req,res,next)=>tokenValidator.validate(req,res,next),
        (req,res)=>controller.add(req,res))
        return router
    }
}