
import IAuthRepo from "../domain/IAuthrepo"
import User from "../domain/user"
import IpasswordService from "../services/IpassWordService"

export default class SignUpUseCase{
    constructor(private iauth:IAuthRepo,private passwordService:IpasswordService){}
    public async execute(email:string,password:string,auth_type:string,name:string): Promise<User>{
        const user = await this.iauth.find(email).catch((_)=>null)
        if(user)
            return Promise.reject("User already exists")
        
        let passwordHash
        if(password) passwordHash = await this.passwordService.hash(password)
        else passwordHash = undefined
        const new_user = await this.iauth.add(email,name,auth_type,passwordHash)
        return await this.iauth.find(email)
    }
}