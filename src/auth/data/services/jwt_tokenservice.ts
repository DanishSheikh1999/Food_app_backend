import ITokenServive from "../../services/ITokenService";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export default class JwtTokenService implements ITokenServive{
    constructor(private readonly privateKey:string) { }
    getUserId(token: string) {
        try {
            var decoded = jwt.verify(token,this.privateKey)
            const {data,iat,exp,iss} = decoded as {data:string,iat:number,exp:number,iss:string}
            return data
            
            }
            catch(err){
                return err
            }
    }
    encode(payload: string | object): string | object {
     try{
        let token = jwt.sign({data:payload},this.privateKey,{
           issuer:"com.foodapp",
            expiresIn:"7d"
        })
      
        return token}
        catch(err){
            console.log(err)
            return this.privateKey;
        }
    }
    decode(token: string ): string | object {
        try{
            var decoded = jwt.verify(token,this.privateKey)
            
            return decoded
        }catch(err){
            return err
        }
    }

}