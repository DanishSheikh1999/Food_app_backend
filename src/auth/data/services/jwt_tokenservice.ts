import ITokenServive from "../../services/ITokenService";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export default class JwtTokenService implements ITokenServive{
    constructor(private readonly privateKey:string) { }
    encode(payload: string | object): string | object {
     try{
        let token = jwt.sign({data:payload},this.privateKey,{
           issuer:"com.foodapp",
            expiresIn:60
        })
      
        return token}
        catch(err){
            console.log(err)
            return this.privateKey;
        }
    }
    decode(token: string ): string | object {
        try{
            const decoded = jwt.verify(token,this.privateKey)
            return decoded
        }catch(err){
            return ""
        }
    }

}