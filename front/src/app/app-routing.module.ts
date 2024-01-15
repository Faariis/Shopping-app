import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { KupciComponent } from './kupci/kupci.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { ListeComponent } from './liste/liste.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'kupac', component: KupciComponent }, 
  { path: 'proizvodi', component: ProizvodiComponent },
  { path: 'kupac/liste', component: ListeComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
