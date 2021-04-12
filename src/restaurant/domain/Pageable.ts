export default class Pageable<T>{
    constructor(
   public readonly page:number,
   public readonly pageSize:number,
   public readonly totalPages:number,
   public readonly restaurants:Array<T>){}
}