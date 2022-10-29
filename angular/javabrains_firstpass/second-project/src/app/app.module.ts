import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddressCard2Component } from './address-card2/address-card2.component';

@NgModule({
  declarations: [
    AppComponent,
    AddressCardComponent,
    AddressCard2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule  // allows use of ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
