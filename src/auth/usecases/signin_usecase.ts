
import IAuthRepo from "../domain/IAuthrepo"
import IpasswordService from "../services/IpassWordService"

export default class SignInUseCase{
    constructor(private iauth:IAuthRepo,private passwordService:IpasswordService){}
    public async execute(email:string,name:string,auth_type:string,password?:string): Promise<string>{
        if(auth_type=="email")
            return await this.emailLogin(email,password??"")
        return await this.oauthLogin(email,name,auth_type)
    }

    private async emailLogin(email:string,password:string){
    
        const user = await this.iauth.find(email).catch((_)=>null)
        console.log(user)
        if(!user || !(await this.passwordService.compare(password,user.password)))
            return Promise.reject("Invalid email or password")
        return user.id


    }
    private async oauthLogin(email:string,name:string,auth_type:string){
        const user = await this.iauth.find(email).catch((_)=>null)
        if(user&&user.type=="email")
            return Promise.reject("Please try to login with password")
        if(user)
            return user.id
        const new_user_id =await this.iauth.add(email,name,auth_type)
        return new_user_id
    }

}