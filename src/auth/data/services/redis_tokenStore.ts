import { RedisClient } from "redis"
import ITokenStore from "../../services/ITokenStore"
import {promisify} from 'util'

export default class RedisTokenStore implements ITokenStore{
    constructor(private readonly client:RedisClient){}
    save(token: string): void {
        this.client.set(token,token)
    }
    async get(token: string): Promise<string> {
        const getAsync =  promisify(this.client.get).bind(this.client)
        const result  = await getAsync(token)
        return result??''
    }

}