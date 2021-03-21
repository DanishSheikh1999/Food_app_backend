import { Request, Response, NextFunction } from "express";
import ITokenService from "../services/ITokenService";
import ITokenStore from "../services/ITokenStore";

export default class TokenValidator {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly tokenStore: ITokenStore
  ) {}

  public async validate(req: Request, res: Response, next: NextFunction) {
    const auth_header = req.headers.authorization;
   
    if (!auth_header)
      return res.status(401).json({ error: "Authorization header required" });
    if (
      this.tokenService.decode(auth_header) == "" ||
      (await this.tokenStore.get(auth_header)) != ""
    )
      return res.status(403).json({ error: "Invalid Token" });
      
    next();
  }
}
