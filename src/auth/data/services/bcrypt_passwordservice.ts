import IpasswordService from "../../services/IpassWordService";
import * as bcrypt from 'bcrypt'

export default class BcryptPasswordService implements IpasswordService{
    constructor(private readonly saltRounds:number =10){}
    async hash(password: string): Promise<string> {
        let passwordHash = bcrypt.hash(password,this.saltRounds)
        return passwordHash
    }
    async compare(hashPassword: string, password: string): Promise<boolean> {
       
       // return await bcrypt.compare(password,await this.hash(hashPassword)) //Used only for testing
        return await bcrypt.compare(hashPassword,password) //Actual thing
    }

}