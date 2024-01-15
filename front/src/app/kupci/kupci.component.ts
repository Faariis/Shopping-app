import { Component, OnInit } from '@angular/core';
import { Shoppers } from '../kupci';
import { NgForm } from '@angular/forms';
import { KupciService } from '../services/kupci.services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-kupci',
  templateUrl: './kupci.component.html',
  styleUrls: ['./kupci.component.css']
})
export class KupciComponent implements OnInit {
  public kupci: Shoppers[] = [];
  public updateKupci!: Shoppers;
  public deleteKupci!: Shoppers;
  public shopperId: string = '';
  public listName: string = '';
  public itemIds: string = '';
  title = 'front';

  constructor(private kupciService: KupciService) {}

  ngOnInit() {
    this.getKupci();
  }

  public getKupci(): void {
    this.kupciService.getKupci().subscribe({
      next: (response: Shoppers[]) => this.kupci = response,
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onSubmit(form: NgForm): void {
    if (form.valid) {
      this.createShoppingList();
    } else {
      alert('Morate ispuniti sva polja.');
    }
  }

  private createShoppingList(): void {

    const itemIdsArray = this.itemIds.split(',').map(id => id.trim());

    
    this.kupciService.createShoppingList({ shopperId: this.shopperId, listName: this.listName, itemIds: itemIdsArray }).subscribe(
      (response: any) => {
        console.log(response);
        this.getKupci(); // Refrešuje listu
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          alert(error.error.error);
        } else {
          // Nespecificirane greške
          alert('Pojavila se greška. Unesite ponovo podatke.');
        }
      }
    );
  }
}