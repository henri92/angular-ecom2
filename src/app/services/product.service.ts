import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModelServer, ServerResponse } from '../models/product.model';




@Injectable({
  providedIn: 'root'
})
export class ProductService {


  //variable dans environment
  //private SERVER_URL ="http://localhost:3000/api";
  // private SERVER_URL =environment.SERVER_URL;
  //private SERVER_URL =environment.SERVER_URL;

  private SERVER_URL = environment.SERVER_URL;





  constructor(private http: HttpClient) { }


  /* this is  to fetch all products from the backend server   
  getAllProducts(numberOfResults:number =10 ): Observable<ServerResponse>{
             

    // return   this.http.get(this.SERVER_URL + '/products', {
   return   this.http.get<ServerResponse>(this.SERVER_URL + '/products', {

      params: {

        limit: numberOfResults.toString()
      }
    });


  }

  */



  /*
  getAllProducts(numberOfResults:number  =10){
        return this.http.get(this.SERVER_URL + '/products',{


          params: {

            limit: numberOfResults.toString(),
          }
        } );


  }
  */







  //this is to fetch all products from the backend server
  getAllProducts(numberOfResults: Number = 10) {

    return this.http.get(this.SERVER_URL + '/products', {

      params: {

        limit: numberOfResults.toString(),

      }

    });

  }











  /*get single product from server*/

  getSingleProduct(id: number): Observable<ProductModelServer> {



    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);



  }





  //get PRODUCTS from one CATEGORY
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {



    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/' + catName);




  }







}
