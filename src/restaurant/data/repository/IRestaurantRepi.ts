import Menu from "../../domain/Menu";
import Pageable from "../../domain/Pageable";
import Restaurant,{Location} from "../../domain/Restaurant";

export default interface IRestaurantRepo{
    findAll(page:number,pageSize:number):Promise<Pageable<Restaurant>>
    findOne(id:string):Promise<Restaurant>
    findbyLocation(page:number,pageSize:number,location:Location):Promise<Pageable<Restaurant>>
    search(page:number,pageSize:number,query:string):Promise<Pageable<Restaurant>>
    getMenu(restaurant_id:string):Promise<Menu[]>

}