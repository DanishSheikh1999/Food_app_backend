export default interface IpasswordService{
        hash(password:string):Promise<string>
        compare(hashPassword:string,password:string):Promise<boolean>
}