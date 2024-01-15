
import { Component, OnInit } from '@angular/core';
import { ShoppingItem } from '../proizvodi';
import { ProizvodiService } from '../services/proizvodi.services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-proizvodi',
  templateUrl: './proizvodi.component.html',
  styleUrls: ['./proizvodi.component.css']
})

export class ProizvodiComponent implements OnInit{  
  public proizvodi: ShoppingItem[] = [];
  title = 'front';

  constructor(private proizvodiService: ProizvodiService){}

  ngOnInit() {
    this.getProizvodi();
  }

  public getProizvodi(): void {
    this.proizvodiService.getProizvodi().subscribe({
      next:(response: ShoppingItem[]) => this.proizvodi = response,
      error:(error:HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
    public onOpenModal(proizvodi: ShoppingItem, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
  
    container?.appendChild(button);
    button.click();
  }
}


