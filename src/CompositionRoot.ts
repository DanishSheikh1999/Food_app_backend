import mongoose from "mongoose"
import AuthRepository from "./auth/data/Repository/authrepository"
import BcryptPasswordService from "./auth/data/services/bcrypt_passwordservice"
import JwtTokenService from "./auth/data/services/jwt_tokenservice"
import dotenv from "dotenv"
import AuthRouter from "./auth/entrypoint/AuthRouter"
import redis  from "redis"
import RedisTokenStore from "./auth/data/services/redis_tokenStore"
import TokenValidator from "./auth/helper/TokenValidator"
dotenv.config()
export default class CompositionRoot{
    public static client :mongoose.Mongoose
    public static redisClient:redis.RedisClient
    public static configure(){
        this.client = new mongoose.Mongoose()
        this.redisClient =  redis.createClient()
        const connectionString = encodeURI(process.env.TEST_DB as string)
        this.client.connect(connectionString,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
    }
    public static authRouter(){
        const authRepository = new AuthRepository(this.client)
        const passwordSerive = new BcryptPasswordService()
        const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string)
        const tokenStore = new RedisTokenStore(this.redisClient)
        const tokenValidator = new TokenValidator(tokenService,tokenStore)

        return AuthRouter.configure(authRepository,passwordSerive,tokenService,tokenStore,tokenValidator)
    }
}