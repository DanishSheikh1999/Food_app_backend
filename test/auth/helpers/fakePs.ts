import IpasswordService from "../../../src/auth/services/IpassWordService";

export default class FakePService implements IpasswordService{
    public async hash(password: string): Promise<string> {
        return password
    }

    public async compare(hashPassword: string, password: string): Promise<boolean> {
        console.log(password==hashPassword)
        return hashPassword==password
    }

}