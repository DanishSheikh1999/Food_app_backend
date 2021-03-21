import 'mocha'
import chai,{assert, expect} from 'chai'
import SignInUseCase from '../../../src/auth/usecases/signin_usecase'
import IAuthRepo from '../../../src/auth/domain/IAuthrepo'
import IpasswordService from '../../../src/auth/services/IpassWordService'
import FakeRepo from '../helpers/fakeRepo'
import FakePService from '../helpers/fakePs'
import User from '../../../src/auth/domain/user'
import charAsPromised from 'chai-as-promised'

chai.use(charAsPromised)

describe("SignInUseCase",()=>{
    let sut: SignInUseCase
    let iauth:IAuthRepo
    let passWordService:IpasswordService

    const user = {
        name:"Danish",
        email:"danishindia1999@gmail.com",
        password:"snfuffds4s5fs4s2a2424d242@42_2",
        id:"11234",
        type:"email"
    }

    beforeEach(()=>{
        iauth=new FakeRepo()
        passWordService = new FakePService()
        sut = new SignInUseCase(iauth,passWordService)
    })

    it("should throw an error when the user is not found",async()=>{
        const user ={
            email:"email@email",
            password:"deagss55",
            type:"email",
            name:"Danish",
        }
        await expect(sut.execute(user.email,user.name,user.type,user.password)).to.be.rejectedWith("User not found")
    })




})