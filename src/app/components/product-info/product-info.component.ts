import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { IProductResponce } from 'src/app/shared/interface/common.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';



@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit {
  public currentProduct!: IProductResponce;


  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private orderService:OrderService
  ) { }
  ngOnInit(): void {
    this.getCurrentProd();
  }

  getCurrentProd(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.productService.getOne(id).subscribe(data => {
      this.currentProduct = data;
    })
  }

  productCount(product: IProductResponce, value: boolean) {
    if (value) {
      ++this.currentProduct.count;
    } else if (!value && product.count > 1) {
      --this.currentProduct.count;
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
