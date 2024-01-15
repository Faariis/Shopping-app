import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListeService {
  private apiUrl = `${environment.apiUrl}/shopping_lists`;

  constructor(private httpClient: HttpClient) {}

  getAllShoppingLists(): Observable<any[]> {
    const url = `${this.apiUrl}/getAllShoppingLists`;
    return this.httpClient.get<any[]>(url);
  }


  addItemToShoppingList(shoppingListId: number, itemId: number): Observable<any> {
    const url = `${this.apiUrl}/addProductToList`;
    const body = { shoppingListId, itemId };
    return this.httpClient.patch<any>(url, body);
  }

  deleteWholeShoppingList(shoppingListId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteShoppingList/${shoppingListId}`;
    return this.httpClient.delete(url);
  }

  deleteItemFromShoppingList(shoppingListId: number, itemId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteProductFromList?shoppingListId=${shoppingListId}&itemId=${itemId}`;
    return this.httpClient.patch(url, {});
  }

  deleteAllShoppingLists(): Observable<any> {
    const url = `${this.apiUrl}/deleteAllShoppingLists`;
    return this.httpClient.delete(url);
  }
}