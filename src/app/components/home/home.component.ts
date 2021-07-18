import { Component, OnInit } from '@angular/core';

//utiliser le service product dans home
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';




//import { Router } from '@angular/router';


import { ProductModelServer, ServerResponse } from '../../models/product.model';
import { Router } from '@angular/router';








@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  products: any[] = [];
  //  products: ProductModelServer[] = [];





  //constructor(private productService: ProductService, private router: Router) { }
  constructor(private productService: ProductService, private router: Router, private cartService: CartService) { }


  /*
  ngOnInit(): void {
    //maka donne @alalan'ny subscribe
   // this.productService.getAllProducts().subscribe( (prods: {count: number, products: any[] }) =>{
    this.productService.getAllProducts().subscribe( (prods: ServerResponse) =>{

               this.products = prods.products;


               //console.log(this.products);

    });

  }
  */


  ngOnInit(): void {

    //utiliser  subscribe:pour obtenir de l'information
    this.productService.getAllProducts(3).subscribe((prods: { count: number, products: any[] }) => {


      this.products = prods.products;

      console.log(this.products);

    });



  }






  selectProduct(id: number) {

    this.router.navigate(['/product', id]).then();



  }



  AddToCart(id: number) {


    this.cartService.AddProductToCart(id);

  }


}
