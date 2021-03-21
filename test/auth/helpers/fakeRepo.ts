import IAuthRepo from "../../../src/auth/domain/IAuthrepo";
import User from "../../../src/auth/domain/user";

export default class FakeRepo implements IAuthRepo{

    public users:User[] = [
        {
            name:"Danish",
            email:"danishindia@gmail.com",
            password:"pass",
            id:"1123",
            type:"email"
        },
        {
            email:"email@email",
            password:"deagss55",
            type:"email",
            name:"Danish",
            id:"1124",
     

        }
    ]

    public async find(email: string): Promise<User> {
        const user= this.users.find((x)=> x.email == email)
        if(!user) return Promise.reject("User not found")
        return new User(
            user?.id,
            user?.email,
            user?.name,
            user?.password,
            user?.type
        )
    }
    public async add(email: string, passwordHash: string, name: string, type: string): Promise<string> {
       let max=9999
       let min=1000
        let  id=(Math.floor(Math.random()*(+max - +min)+ +min)).toString()
        this.users.push(
            {
                email:email,
                password:passwordHash,
                id:id,
                type:email,
                name:name
            }
        )

        return id;
    }
   

};