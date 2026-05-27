export interface Product{
    id:number,
    name:string,
    description:string,
    price:number,
    color:string,
    qty:number,
    categoryId:number,
    is_active:boolean
    category:
    {
        id:number,
        name:string
    }
    productImages?: IProductImage[]
}

export interface IProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  fileName: string;
}