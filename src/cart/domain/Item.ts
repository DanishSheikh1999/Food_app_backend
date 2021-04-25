export default class Item{
    constructor(

        public readonly userId:string,
        public readonly menuItemId:string,
        public readonly quantity:number
    ){}
}

export class Location{
    constructor(public readonly longitude:number,public readonly latitude:number){}
}


