import * as express from "express";
import IRestaurantRepo from "../data/repository/IRestaurantRepi";
import Pageable from "../domain/Pageable";
import {Location} from '../domain/Restaurant'
export default class RestaurantController {
  constructor(private readonly repository: IRestaurantRepo) {}

  public async findAll(req: express.Request, res: express.Response) {
    const { page, limit } = { ...req.query } as { page: any; limit: any };
    console.log(page);
    try {
      await this.repository
        .findAll(parseInt(page), parseInt(limit))
        .then((data) =>
          res.status(200).json({
            metadata: {
              page: data.page,
              pageSize: data.pageSize,
              totalPages: data.totalPages,
            },
            restaurants: data.restaurants,
          })
        )
        .catch((err) => res.status(404).json({ error: err }));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  public async findOne(req: express.Request, res: express.Response) {
    const { id } = req.params;
    console.log(id);
    try {
      await this.repository
        .findOne(id)
        .then((data) =>
          res.status(200).json({
            restaurant: data,
          })
        )
        .catch((err) => res.status(404).json({ error: err }));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
  public async findbyLocation(req: express.Request, res: express.Response) {
    const { page, limit, longitude, latitude } = req.query  as {
      page: string;
      limit: string;
      longitude: string;
      latitude: string;
    };

    try {
    const location  = new Location(parseFloat(longitude),parseFloat(latitude));
      await this.repository
        .findbyLocation(parseInt(page),parseInt(limit),location)
        .then((data) =>
          res.status(200).json({
            metadata: {
                page: data.page,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
              },
              restaurants: data.restaurants,
          })
        )
        .catch((err) => res.status(404).json({ error: err }));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  public async search(req: express.Request, res: express.Response) {
    const { page, limit, query } = req.query  as {
      page: string;
      limit: string;
        query:string
    };

    try {
      await this.repository
        .search(parseInt(page),parseInt(limit),query)
        .then((data) =>
          res.status(200).json({
            metadata: {
                page: data.page,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
              },
              restaurants: data.restaurants,
          })
        )
        .catch((err) => res.status(404).json({ error: err }));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

   public async findMenu(req: express.Request, res: express.Response) {
    const { id } =  req.params

    try {
      await this.repository
        .getMenu(id)
        .then((data) =>
          res.status(200).json({
            menu:data
          })
        )
        .catch((err) => res.status(404).json({ error: err }));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
}
