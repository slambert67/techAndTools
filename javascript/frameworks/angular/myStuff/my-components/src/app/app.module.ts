import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { P1Component } from './p1/p1.component';
import { C1Component } from './c1/c1.component';
import { P2Component } from './p2/p2.component';

@NgModule({
  declarations: [
    AppComponent,
    P1Component,
    C1Component,
    P2Component
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
