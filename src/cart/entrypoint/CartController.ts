import * as express from "express";
import ITokenServive from "../../auth/services/ITokenService";
import ICartRepo from "../data/repository/ICartRepo";
import Item from "../domain/Item";

export default class CartController {
  constructor(
    private readonly repository: ICartRepo,
    private readonly tokenSerice: ITokenServive
  ) {}

  public async find(req: express.Request, res: express.Response) {
    const tokenId = req.headers.authorization!;
    const userId = this.tokenSerice.getUserId(tokenId)
    try {
      await this.repository
        .find(userId)
        .then((data) => res.status(200).json({ cart: data }))
        .catch((err)=>res.status(404).json({error:err}))
    } catch (err) {
        res.status(400).json({error: err})
    }
  }

  public async add(req: express.Request,res: express.Response){
      const tokenId = req.headers.authorization!
      const {menuItemId,quantity}  =req.body as {menuItemId:string,quantity:number}
      console.log(menuItemId);
      const userId = this.tokenSerice.getUserId(tokenId)
      try{
            await this.repository.add(new Item(userId,menuItemId,quantity))
            .then((data)=>res.status(200).json({message:data}))
            .catch((err)=>res.status(404).json({error: err}))
      }catch (err){
          res.status(400).json({error: err})
      }
  }
}
