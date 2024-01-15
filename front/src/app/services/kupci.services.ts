import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shoppers } from '../kupci';

@Injectable({
  providedIn: 'root',
})
export class KupciService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getKupci(): Observable<Shoppers[]> {
    return this.httpClient.get<Shoppers[]>(`${this.url}/shoppers/get`);
  }

  public createShoppingList(shoppingListData: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/shopping_lists/createShoppingList`,
      shoppingListData
    );
  }
}
