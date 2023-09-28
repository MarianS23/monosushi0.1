import { Injectable } from '@angular/core';
import { IdiscountRequest,IDiscountResponce } from '../interface/common.interface';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = environment.BACKEND_URL;
  private api = {discounts:`${this.url}/discounts`}
  public discounts:Array<IDiscountResponce> = []
  constructor(
    private http:HttpClient
  ) { }

  getAll():Observable<IDiscountResponce[]>{
    return this.http.get<IDiscountResponce[]>(this.api.discounts)
  }

  getOne(id:number):Observable<IDiscountResponce>{
    return this.http.get<IDiscountResponce>(`${this.api.discounts}/${id}`)
  }

  create(discount:IdiscountRequest):Observable<IDiscountResponce>{
    return this.http.post<IDiscountResponce>(this.api.discounts,discount)
  }

  update(discount:IdiscountRequest, id:number):Observable<IDiscountResponce>{
    return this.http.patch<IDiscountResponce>(`${this.api.discounts}/${id}`,discount)
  }

  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.api.discounts}/${id}`)
  }

  
}
