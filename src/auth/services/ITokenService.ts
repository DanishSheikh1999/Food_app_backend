export default interface ITokenServive{
    encode(payload:string|object):string|object
    decode(token:string|object):string|object
    getUserId(token:string):any
}