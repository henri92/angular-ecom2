import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderService } from './order.service';
import { ProductService } from './product.service';


import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ProductModelServer } from '../models/product.model';



@Injectable({
  providedIn: 'root'
})
export class CartService {



  private serverURL = environment.SERVER_URL;



  //data variable to store the cart information on the client's local storage(web browser)
  private cartDataClient: CartModelPublic = {
    //initialisation
    total: 0,
    prodData: [{

      incart: 0,
      id: 0
    }]

  };


  //data variable to store cart information on the server

  private cartDataServer: CartModelServer = {


    //initialisation
    total: 0,
    data: [
      {

        numInCart: 0,
        product: undefined
      }
    ]

  };


  //observables for the components to subscribe
  cartTotal$ = new BehaviorSubject<number>(0);


  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);
















  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router) {

    this.cartTotal$.next(this.cartDataServer.total);

    this.cartData$.next(this.cartDataServer);



    //get the informations from local storage (if any)

    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));


    //check if the info variable is null or has some data in it

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      //local storage is not empty and has some information

      this.cartDataClient = info;





      //loop through each entry and put  it in the cartDataServer object

      this.cartDataClient.prodData.forEach(p => {

        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {

          if (this.cartDataServer.data[0].numInCart == 0) {

            this.cartDataServer.data[0].numInCart = p.incart;

            this.cartDataServer.data[0].product = actualProductInfo;




            //todo create calculateTotal function and replace it here

            this.cartDataClient.total = this.cartDataServer.total;

            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));




          } else {

            //cartDataServer already has some entry in it
            this.cartDataServer.data.push({

              numInCart: p.incart,
              product: actualProductInfo
            });



            //todo create calculateTotal function and replace it here
            this.cartDataClient.total = this.cartDataServer.total;


            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));



          }


          this.cartData$.next({ ...this.cartDataServer });



        });


      });





    }


  }








  AddProductToCart(id: number, quantity?: number) {


    this.productService.getSingleProduct(id).subscribe(prod => {

      //1. if the cart is empty

      if (this.cartDataServer.data[0].product == undefined) {

        this.cartDataServer.data[0].product = prod;

        //use 1 as a default quantity
        this.cartDataServer.data[0].numInCart = quantity != undefined ? quantity : 1;


        //TODO CALCULATE TOTAL AMOUNT
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;


        //mettre à jour les informations dans le localStorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));



        this.cartData$.next({ ...this.cartDataServer });

        //TODO DISPLAY A TOAST NOTIFICATION


      }






      //2.if the cart has some items(cart is not empty)

      else {


        let index = this.cartDataServer.data.findIndex(p => p.product.id == prod.id);  //-1 or a positive value




        //a- if that item is already in the cart => index is positive value

        if (index != -1) {

          if (quantity != undefined && quantity <= prod.quantity) {

            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;


          } else {

            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }




          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          //TODO DISPLAY A TOAST NOTIFICATION



        }//--end of if

        //b- if that item is not in  the cart

        else {


          //add it in the cart
          this.cartDataServer.data.push({

            numInCart: 1,
            product: prod

          });



          this.cartDataClient.prodData.push({

            incart: 1,
            id: prod.id
          });




          //TODO DISPLAY A TOAST NOTIFICATION


          //TODO CALCULATE TOTAL AMOUNT
          this.cartDataClient.total = this.cartDataServer.total;


          //update localstorage
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));




          //emit a new value
          this.cartData$.next({ ...this.cartDataServer });


        }//end of else

      }

    });


  }





  updateCartItems(index: number, increase: boolean) {


    let data = this.cartDataServer.data[index];


    if (increase) {


      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;

      this.cartDataClient.prodData[index].incart = data.numInCart;



      //TODO CALCULATE TOTAL AMOUNT
      this.cartDataClient.total = this.cartDataServer.total;

      //update localstorage
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      //emit a new value
      this.cartData$.next({ ...this.cartDataServer });


    } else {



      data.numInCart--;



      if (data.numInCart < 1) {

        //TODO DELETE THE PRODUCT FROM CART
        this.cartData$.next({ ...this.cartDataServer });

      } else {

        //TODO DELETE THE PRODUCT FROM CART
        this.cartData$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;


        //TODO CALCULATE TOTAL AMOUNT

        //emit a new value
        this.cartDataClient.total = this.cartDataServer.total;

        //update localstorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));


      }

    }

  }



  DeleteProductFromCart(index: number) {

    if (window.confirm('Are you sure you want to remove the item ?')) {

      this.cartDataServer.data.splice(index, 1);


      this.cartDataClient.prodData.splice(index, 1);



      //TODO CALCULATE TOTAL AMOUNT

      //emit a new value
      this.cartData$.next({ ...this.cartDataServer });


      if (this.cartDataClient.total == 0) {

        this.cartDataClient = { total: 0, prodData: [{ incart: 0, id: 0 }] };


        //update localstorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      } else {


        //update localstorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      }


      //20 :00 rest



      if (this.cartDataServer.total == 0) {
        this.cartDataServer = { total: 0, data: [{ numInCart: 0, product: undefined }] };


        this.cartData$.next({ ...this.cartDataServer });


      } else {

        this.cartData$.next({ ...this.cartDataServer });
      }


    } else {

      //if the user clicks the cancel button
      return;
    }

  }










  private CalculateTotal() {



    let Total = 0;


    this.cartDataServer.data.forEach(p => {

      const { numInCart } = p;

      const { price } = p.product;


      Total += numInCart * price;


    });


    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);




  }






  CheckoutFromCart(userId: number) {

    this.http.post(`${this.serverURL}/orders/payment`, null).subscribe((res: { success: boolean }) => {

      if (res.success) {

        this.resetServerData();

        this.http.post(`${this.serverURL}/orders/new`, {

          userId: userId,
          products: this.cartDataClient.prodData

        }).subscribe((data: OrderResponse) => {

          this.orderService.getSingleOrder(data.order_id).then(prods => {

            if (data.success) {

              const NavigationExtras: NavigationExtras = {

                state: {


                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };



              //TODO HIDE SPINNER
              this.router.navigate(['/thankyou'], NavigationExtras).then(p => {

                this.cartDataClient = { total: 0, prodData: [{ incart: 0, id: 0 }] };


                this.cartTotal$.next(0);

                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));



              });


            }

          });
        });
      }

    });
  }



  private resetServerData() {


    this.cartDataServer = {

      total: 0,
      data: [{
        numInCart: 0,
        product: undefined
      }]
    };




    this.cartData$.next({ ...this.cartDataServer });

  }





  interface OrderResponse {


  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }];


}


}
