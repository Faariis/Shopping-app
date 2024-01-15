import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShoppingItem } from '../proizvodi';

@Injectable({
  providedIn: 'root',
})
export class ProizvodiService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getProizvodi(): Observable<ShoppingItem[]> {
    return this.httpClient.get<ShoppingItem[]>(
      `${this.url}/shopping_items/get`
    );
  }
}
