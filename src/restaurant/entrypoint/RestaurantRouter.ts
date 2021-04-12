import * as express from "express";
import IRestaurantRepo from "../data/repository/IRestaurantRepi";
import TokenValidator from "../../auth/helper/TokenValidator";
import RestaurantController from "./RestaurantController";
export default class RestaurantRouter {
  public static configure(
    tokenValidator: TokenValidator,
    repository: IRestaurantRepo
  ): express.Router {
      console.log("In");
    const router = express.Router();
    let controller = new RestaurantController(repository);

    router.get(
      '/',
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req, res) => controller.findAll(req, res)
   );

   router.get(
    '/restaurant/:id',
    (req, res, next) => tokenValidator.validate(req, res, next),
    (req, res) => controller.findOne(req, res)
 );

    router.get(
        '/location/',
        (req, res, next) => tokenValidator.validate(req, res, next),
        (req, res) => controller.findbyLocation(req, res)
        )
        router.get(
            '/search/',
            (req, res, next) => tokenValidator.validate(req, res, next),
            (req, res) => controller.search(req, res)
            )
            router.get(
                '/restaurant/menu/:id',
                (req, res, next) => tokenValidator.validate(req, res, next),
                (req, res) => controller.findMenu(req, res)
                )
   return router
  }
}
