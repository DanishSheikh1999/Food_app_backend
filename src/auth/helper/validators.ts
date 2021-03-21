import { Response,Request,NextFunction } from "express"
import {validationResult,body} from "express-validator"

export const signupValidationRules = ()=>{
    return [
    body("email","Invalid Email").notEmpty().isEmail().normalizeEmail(),
    body("name","Name is required").notEmpty(),
    body("auth_type","AuthType is required").notEmpty(),
    body("password","Password is required with length greater than 8")
    .if(body("auth_type").equals("email"))
    .notEmpty()
    .isLength({min:8})
]

}

export const signinValidationRules = ()=>{
    return [
    body("email","Invalid Email").notEmpty().isEmail().normalizeEmail(),
   // body("name","Name is required").notEmpty().if(body("auth_type").not().equals("email")),
    body("auth_type","AuthType is required").notEmpty(),
    body("password","Password is required with length greater than 8")
    .if(body("auth_type").equals("email")).notEmpty()
    .isLength({min:8})
]

}
export const validate =(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body)
    const errors = validationResult(req)
    if(errors.isEmpty())
        return next()
    const extractedErrors:any=[]
    errors.array({onlyFirstError:true})
    .map((err)=>extractedErrors.push({[err.param]:err.msg}))
    console.log(extractedErrors)
    return res.status(422).json({errors:extractedErrors})

}