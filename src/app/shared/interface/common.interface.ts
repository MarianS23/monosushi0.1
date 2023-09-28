export interface IdiscountRequest{
    date:any,
    name:string,
    title:string,
    description:string,
    imagePath:string,
}
export interface IDiscountResponce extends IdiscountRequest{
    id:number
}

export interface ICategoryRequest{
    name:string,
    path:string,
    imagePath:string
}
export interface ICategoryResponce extends ICategoryRequest{
    id:number
}

export interface IProductRequest{
    name:string,
    category:ICategoryRequest,
    path:string,
    ingredients:string,
    weight:string,
    price:number,
    imagePath:string,
    count: number
}
export interface IProductResponce extends IProductRequest{
    id:number
}

export interface ILogin{
    email:string,
    password:string
}