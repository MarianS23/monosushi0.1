import { Component, OnInit } from '@angular/core';
import { IProductResponce } from 'src/app/shared/interface/common.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order/order.service';



@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent implements OnInit {
  public product!:IProductResponce;
  public products:Array<IProductResponce> = [];
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private orderService:OrderService
  ) { }

  ngOnInit(): void {
    this.getRolls();
  }
  
  getRolls(){
    return this.productService.getAllByCategory('roll').subscribe(data => {
      this.products = data;
    })
  }

  productCount(product:IProductResponce, value:boolean){
    if(value){
      ++product.count;
    }else if(!value && product.count>1){
      --product.count;
    }
  }
  addToBasket(product: IProductResponce): void {
    let basket: Array<IProductResponce> = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some(prod => prod.id === product.id)) {
        const index = basket.findIndex(prod => prod.id === product.id);
        basket[index].count += product.count;
      } else {
        basket.push(product);
      }
    } else {
      basket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    product.count = 1;
    this.orderService.changeBasket.next(true);
    
  }
}
