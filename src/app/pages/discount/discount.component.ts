import { Component,OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit{
constructor(
  private discountService:DataService
){}
ngOnInit(): void {
  this.getDiscounts()
}
public discounts = this.discountService.discounts;

getDiscounts(){
  return this.discountService.getAll().subscribe(data=>{
    this.discounts = data;
  })
}
}
