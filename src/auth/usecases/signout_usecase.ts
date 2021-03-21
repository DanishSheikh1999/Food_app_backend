import ITokenStore from "../services/ITokenStore";

export default class SignOutUseCase{
    constructor(private readonly store:ITokenStore){}
    
    public async execute(token:string):Promise<string>{
        this.store.save(token)
        return Promise.resolve("Successfully signed out")
    }
}