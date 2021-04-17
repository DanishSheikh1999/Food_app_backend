import ITokenServive from "../services/ITokenService";
import SignInUseCase from "../usecases/signin_usecase";
import * as express from "express";
import SignUpUseCase from "../usecases/signup_usercase";
import SignOutUseCase from "../usecases/signout_usecase";
import User from "../domain/user";
export default class AuthController {
  _header = { "Content-Type":"application/json","Access-Control-Allow-Origin": "*"}
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private signUpUseCase: SignUpUseCase,
    private signOutUseCase:SignOutUseCase,
    private tokenService: ITokenServive

  ) {}
  public async signin(req: express.Request, res: express.Response) {
    try {
      const { email, password, name, auth_type } = req.body;
      console.log(req.body);
      return await this.signInUseCase
        .execute(email, name, auth_type, password)
        .then((user:User) =>
          res.status(200).header(this._header).json({ authToken: this.tokenService.encode(user.id),name:user.name,email:user.email })
        )
        .catch((err: Error) => res.status(404).header(this._header).json({ error: err }));
    } catch (err) {
      return res.status(404).header(this._header).json({ error: err });
    }
  }
  public async signup(req: express.Request, res: express.Response) {
    try {
      const { email, password, auth_type, name } = req.body;
      
      return await this.signUpUseCase
        .execute(email, password, auth_type, name)
        .then((user:User) =>
          res.status(200).header(this._header).json({ authToken: this.tokenService.encode(user.id),name:user.name,email:user.email })
        )
        .catch((err: Error) => res.status(404).header(this._header).json({ error: err}));
    } catch (err) {
      return res.status(404).header(this._header).json({ error: err });
    }
  }
  public async signout(req: express.Request, res: express.Response) {
    try {
        const token  =req.headers.authorization!
      return await this.signOutUseCase
        .execute(token)
        .then((result: string) =>
          res.status(200).header(this._header).json({ message: result })
        )
        .catch((err: Error) => res.status(404).header(this._header).json({ error: err }));
    } catch (err) {
      return res.status(404).header(this._header).json({ error: err });
    }
  }
}
