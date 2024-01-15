import { Component, OnInit } from '@angular/core';
import { ListeService } from '../services/liste.services';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css'],
})
export class ListeComponent implements OnInit {
  public shoppingLists: any[] = [];
  public newItemIds: { [key: number]: number | undefined } = {};
  public errorMessage: string | undefined;
  public selectedShoppingListId: number | undefined;

  constructor(private listeService: ListeService) {}

  ngOnInit() {
    this.getAllShoppingLists();
  }
  
  // Ovdje ispisuje sve liste
  getAllShoppingLists(): void {
    this.listeService.getAllShoppingLists().subscribe({
      next: (response: any[]) => {
        this.shoppingLists = response;
        console.log('Shopping Lists:', response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Biranje liste
  selectShoppingList(listId: number): void {
    this.selectedShoppingListId = listId;
  }

  // Dodavanje jednog proizvoda
  addItemToList(shoppingListId: number): void {
    const itemId = this.newItemIds[shoppingListId];
    if (itemId === undefined || itemId === null) {
      console.error('Item ID is required');
      return;
    }

    console.log('Shopping List ID:', shoppingListId);
    console.log('Item ID:', itemId);

    this.listeService.addItemToShoppingList(shoppingListId, itemId).subscribe({
      next: (response) => {
        console.log(response);
        this.getAllShoppingLists(); // Refrešuje ako je nova dodana lista
      },
      error: (error) => {
        console.error('Full error object:', error);

        const errorMessage = error.error && error.error.error ? error.error.error : 'An unexpected error occurred.';

        alert(errorMessage);
      },
    });

    // Kada se unese očisti se unos
    this.newItemIds[shoppingListId] = undefined;
  }

  // Izbriše se samo jedan proizvod iz liste
  deleteItemFromList(shoppingListId: number, itemId: number): void {
    console.log('Deleting Item from List - List ID:', shoppingListId);
    console.log('Deleting Item from List - Item ID:', itemId);

    this.listeService.deleteItemFromShoppingList(shoppingListId, itemId).subscribe({
      next: (response) => {
        console.log('Delete Item Response:', response);
        // Opet se refrešuje kad se izbriše
        this.getAllShoppingLists();
      },
      error: (error) => {
        console.error('Full error object:', error);
        const errorMessage = error.error && error.error.error ? error.error.error : 'An unexpected error occurred.';
        alert(errorMessage);
      },
    });
  }

  // Brisanje cijele liste
  deleteWholeList(shoppingListId: number): void {
    if (confirm('Jeste sigurni da želite izbrisati ovu listu?')) {
      this.listeService.deleteWholeShoppingList(shoppingListId).subscribe({
        next: (response) => {
          console.log('Delete Shopping List Response:', response);
          // Refrešuje
          this.getAllShoppingLists();
        },
        error: (error) => {
          console.error('Full error object:', error);
          const errorMessage = error.error && error.error.error ? error.error.error : 'An unexpected error occurred.';
          alert(errorMessage);
        },
      });
    }
  }

  // Ukloni sve liste
  deleteAllShoppingLists(): void {
    if (confirm('Jeste sigurni da želite izbrisati sve?')) {
      this.listeService.deleteAllShoppingLists().subscribe({
        next: (response) => {
          console.log('Delete All Shopping Lists Response:', response);
          // Refrešuje
          this.getAllShoppingLists();
        },
        error: (error) => {
          console.error('Full error object:', error);
          const errorMessage = error.error && error.error.error ? error.error.error : 'An unexpected error occurred.';
          alert(errorMessage);
        },
      });
    }
}
}