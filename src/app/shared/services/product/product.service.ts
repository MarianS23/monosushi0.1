import { Injectable } from '@angular/core';
import { IProductRequest, IProductResponce } from '../../interface/common.interface';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService{
  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}/products` }

  public products: Array<IProductResponce> = []
  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<IProductResponce[]> {
    return this.http.get<IProductResponce[]>(this.api.products)
  }

  getOne(id: number): Observable<IProductResponce> {
    return this.http.get<IProductResponce>(`${this.api.products}/${id}`)
  }

  getAllByCategory(category: string): Observable<IProductResponce[]> {
    return this.http.get<IProductResponce[]>(`${this.api.products}?category.path=${category}`)
  }

  create(product: IProductRequest): Observable<IProductResponce> {
    return this.http.post<IProductResponce>(this.api.products, product)
  }

  update(product: IProductRequest, id: number): Observable<IProductResponce> {
    return this.http.patch<IProductResponce>(`${this.api.products}/${id}`, product)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.products}/${id}`)
  }

  // resolve(route:ActivatedRouteSnapshot):Observable<IProductResponce>{
  //   return this.http.get<IProductResponce>(`${this.api.products}/${route.paramMap.get('id')}`)
  // }
}
