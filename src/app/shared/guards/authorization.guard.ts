import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot,UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../constants/role.constants';


@Injectable({
  providedIn:'root'
})

export class authorizationGuard implements CanActivate{
  constructor(
    private router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string)
    if(currentUser && (currentUser.role === Role.ADMIN || currentUser.role === Role.USER )){
      return true;
    }
    this.router.navigate([''])
    return false;
  }
}
