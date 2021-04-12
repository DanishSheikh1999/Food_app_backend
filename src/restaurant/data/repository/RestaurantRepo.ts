import Menu, { MenuItems } from "../../domain/Menu";
import Pageable from "../../domain/Pageable";
import Restaurant, { Location } from "../../domain/Restaurant";
import IRestaurantRepo from "./IRestaurantRepi";
import moongose, { PaginateResult } from 'mongoose';
import RestaurantSchema, { RestaurantDoc, RestaurantModel } from "../metadata/RestaurantModel";
import { MenuDocument, MenuSchema, MenuModel, MenuItemDocument, MenuItemSchema, MenuItemModel } from "../metadata/MenuModel";
export default class RestaurantRepo implements IRestaurantRepo{
    constructor(public client:moongose.Mongoose){}
    async findAll(page: number, pageSize: number) : Promise<Pageable<Restaurant>> {
        const model = this.client.model<RestaurantDoc>("Restaurant",
                RestaurantSchema
            ) as RestaurantModel

        const pageOption = {page:page,limit:pageSize}
        const pageResult  = await model.paginate({},pageOption).catch((_)=>null)
        return this.restaurantsFromPageResults(pageResult);
    }
    async findOne(id: string): Promise<Restaurant> {
        const model = this.client.model<RestaurantDoc>("Restaurant",
        RestaurantSchema
    ) 
    return await model.findById(id);
    }
    async findbyLocation(page: number, pageSize: number, location: Location): Promise<Pageable<Restaurant>> {
        const model = this.client.model<RestaurantDoc>("Restaurant",
        RestaurantSchema
    ) as RestaurantModel

    const pageOptions = { page: page, limit: pageSize, forceCountFn: true }

    const geoQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          $maxDistance: 2,
        },
      },
    }

    const pageResults = await model
      .paginate(geoQuery, pageOptions)
      .catch((_) => null)

    return this.restaurantsFromPageResults(pageResults)    
    }

    async search(page: number, pageSize: number, query: string): Promise<Pageable<Restaurant>> {
        const model = this.client.model<RestaurantDoc>("Restaurant",
        RestaurantSchema
    ) as RestaurantModel

    const pageOptions = { page: page, limit: pageSize, forceCountFn: true }
    const textQuery = { $text: { $search: query } }

    const pageResults = await model
      .paginate(textQuery, pageOptions)
      .catch((_) => null)

    return this.restaurantsFromPageResults(pageResults)

    }
    async getMenu(restaurant_id: string): Promise<Menu[]> {
        const menuModel = this.client.model<MenuDocument>(
            'Menu',
            MenuSchema
          ) as MenuModel
      
          const menuItemModel = this.client.model<MenuItemDocument>(
            'MenuItem',
            MenuItemSchema
          ) as MenuItemModel
      
          const menus = await menuModel.find({ restaurantId: restaurant_id })
          if (menus === null) return Promise.reject('No menus found')
          const menuIds = menus.map((m:MenuDocument) => m.id)
      
          const items = await menuItemModel.find({ menuId: { $in: menuIds } })
      
          return this.menusWithItems(menus, items)
    }

    private restaurantsFromPageResults(
        pageResults: PaginateResult<RestaurantDoc> | null
      ) {
        if (pageResults === null || pageResults.docs.length === 0)
          return Promise.reject('Restaurants not found')
    
        const results = pageResults.docs.map<Restaurant>(
          (model) =>
            new Restaurant(
              model.id,
              model.name,
              model.type,
              model.rating,
              model.display_img_url,
              model.location.coordinates,
              model.address
            )
        )
    
        return new Pageable<Restaurant>(
          pageResults.page ?? 0,
          pageResults.limit,
          pageResults.totalPages,
          results
        )
      }

      private menusWithItems(
        menus: MenuDocument[],
        items: MenuItemDocument[]
      ): Menu[] {
        return menus.map(
          (menu) =>
            new Menu(
             menu.id,
              menu.restaurantId,
              menu.name,
              menu.description,
              menu.image_url,
              items
                .filter((item) => item.menuId === menu.id)
                .map(
                  (menuItem) =>
                    new MenuItems(
                    menuItem.id,
                      menuItem.menuId,
                      menuItem.name,
                      menuItem.description,
                      menuItem.image_urls,
                      menuItem.unit_price
                    )
                )
            )
        )
      }
}