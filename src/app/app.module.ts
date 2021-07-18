import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';




//importer les nouveau modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { HttpClientModule } from '@angular/common/http';


//utiliser le httpClientModule



import { RouterModule, Routes } from '@angular/router';
//import { BrowserModule } from '@angular/platform-browser';
import { ProductService } from './services/product.service';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
//import { CartService } from './services/cart.service';
//import { OrderService } from './services/order.service';

//import { FormsModule,ReactiveFormsModule} from '@angular/Forms';










//declarer les routes du app-routing.ts

const routes: Routes = [
  {

    path: '', component: HomeComponent
  },

  {

    path: 'product/:id', component: ProductComponent
  },

  {

    path: 'cart', component: CartComponent
  },

  {

    path: 'checkout', component: CheckoutComponent
  },

  {

    path: 'thankyou', component: ThankyouComponent
  }

];







@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CheckoutComponent,
    HomeComponent,
    ProductComponent,
    ThankyouComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,//animation
    //AppRoutingModule//routes dans le fichier app-routing.module.ts
    //HttpClient
    //HttpClientModule
    //FormsModule sy ReactiveFormsModule 
    HttpClientModule,
    RouterModule.forRoot(routes),

    //il faut ajouter ceci apres installation de ngx-spinner ngx-toastr --save 
    //NgxSpinner,
    NgxSpinnerModule,
    ToastrModule.forRoot()

  ],
  //providers: [ProductService,CartService,OrderService],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
