import { ProductModelServer } from './product.model';







//models for server

export interface CartModelServer{

  total:number;

  data:[{

      product: ProductModelServer,
      numInCart: number
  }];
  


}


//models for client
export interface CartModelPublic{

 

    total: number;


    prodData: [

       {

           id: number,
           incart: number
       } 
    ];

}