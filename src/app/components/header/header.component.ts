import { Component, OnInit, HostListener } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { IProductResponce } from 'src/app/shared/interface/common.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { Role } from 'src/app/shared/constants/role.constants';
import { Router } from '@angular/router';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private basket: Array<IProductResponce> = [];
  public clickBasket: boolean = false;
  public clickBurger: boolean = false;
  public clickSignIn: boolean = false;
  public isGuest:boolean = false;
  public isAdmin:boolean = false;
  public userUrl = '';
  public userName = '';
  public totalPrice = 0;
  public totalCount = 0;
  public orders: Array<IProductResponce> = [];
  public authForm!: FormGroup;



  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private accauntService:AccountService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
    this.initAuthForm();
    this.checkUserLogin();
    this.checkUpdateUserLogin();
  }
  login():void{
    this.accauntService.login(this.authForm.value).subscribe(data=>{
      if(data && data.length>0){
        const user = data[0];
        localStorage.setItem('currentUser',JSON.stringify(user));
        this.accauntService.checkUserLogin$.next(true);
      }
    },(e)=>{
      console.log(e)
    })
    this.authForm.reset();
    this.closeSignInModal();
  }

  checkUserLogin():void{
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string)
    if(currentUser && currentUser.role === Role.ADMIN){
      this.isAdmin = true;
      this.userUrl = 'admin';
      this.userName = 'Admin';
      this.router.navigate(['/'+this.userUrl])
      console.log(currentUser)
    }else if(currentUser && currentUser.role === Role.USER){
      this.isGuest = true;
      this.userUrl = 'cabinet';
      this.userName = currentUser.fullName;
      this.router.navigate(['/'+this.userUrl])
    }else{
      this.isGuest = false;
      this.isAdmin = false;
      this.userUrl = '/';
      this.userName = '';
      this.router.navigate(['/'+this.userUrl])
    }
  }
  checkUpdateUserLogin():void{
    this.accauntService.checkUserLogin$.subscribe(()=>{
      this.checkUserLogin();
    })
  }


  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }


  loadBasket() {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
      this.orders = this.basket;
    }
    this.getTotalPrice();
    this.getTotalCount();
  }
  getTotalPrice(): void {
    this.totalPrice = this.basket
      .reduce((total: number, prod: IProductResponce) => total + prod.count * prod.price, 0)
  }
  getTotalCount(): void {
    this.totalCount = this.basket
      .reduce((total: number, prod: IProductResponce) => total + prod.count, 0)
  }
  updateBasket(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    })
  }
  updateProductCount(order: IProductResponce, value: boolean, i: number) {
    this.basket = JSON.parse(localStorage.getItem('basket') as string);
    if (value) {
      ++this.basket[i].count
    } else if (!value && order.count > 1) {
      --this.basket[i].count
    }
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.orderService.changeBasket.next(true);
  }

  deleteCurrentItem(item: number): void {
    this.basket.splice(item, 1);
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.loadBasket();
  }
  toggleBasket() {
    this.clickBasket = !this.clickBasket
    if (this.clickBasket) {
      document.body.style.overflow = 'hidden';
      this.close = function (event: Event): void {
        const target = event.target as Element;
        if (!target.closest('.header-basket') && target.className === 'modal-container' && !target.closest('.item-card-busket')) {
          this.clickBasket = false;
          document.body.style.overflow = 'auto';
        }
      }
    } else {
      this.close = function (): void { };
    }
  }



  //---------------sign in modal-------------------------
  openSignInModal() {
    this.clickSignIn = true;
    document.body.style.overflow = 'hidden';
    this.close = function (event: Event): void {
      if ((event.target as Element).className === 'modal-sign-in-container') {
        this.closeSignInModal();
      }
    }
  }
  closeSignInModal() {
    this.clickSignIn = false;
    document.body.style.overflow = 'auto';
    this.close = function (): void { };
  }

  @HostListener('document:click', ['$event'])
  close(event: Event): void { };






  toggleBurgerMenu() {
    this.clickBurger = !this.clickBurger;
  };







}
