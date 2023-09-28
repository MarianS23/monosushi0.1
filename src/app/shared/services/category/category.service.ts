import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoryRequest,ICategoryResponce } from '../../interface/common.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.BACKEND_URL;
  private api = {categories:`${this.url}/categories`}
  public categories:Array<ICategoryResponce> = []
  constructor(
    private http:HttpClient
  ) { }

  getAll():Observable<ICategoryResponce[]>{
    return this.http.get<ICategoryResponce[]>(this.api.categories)
  }
  getOne(path:string):Observable<ICategoryResponce[]>{
    return this.http.get<ICategoryResponce[]>(this.api.categories[0])
  }
  create(category:ICategoryRequest):Observable<ICategoryResponce>{
    return this.http.post<ICategoryResponce>(this.api.categories,category)
  }
  update(category:ICategoryRequest,id:number):Observable<ICategoryResponce>{
    return this.http.patch<ICategoryResponce>(`${this.api.categories}/${id}`,category)
  }
  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.api.categories}/${id}`)
  }
}
