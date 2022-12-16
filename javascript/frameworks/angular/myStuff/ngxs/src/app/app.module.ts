import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import { Ngxs1Component } from './ngxs1/ngxs1/ngxs1.component';
import {Ngxs1State} from "./ngxs1/ngxs1-state";
import { Ngxs2Component } from './ngxs2/ngxs2/ngxs2.component';
import {Ngxs2State} from "./ngxs2/ngxs2-state";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { Ngxs3Component } from './ngxs3/ngxs3/ngxs3.component';
import {Ngxs3State} from "./ngxs3/ngxs3-state";
import { Ngxs4Component } from './ngxs4/ngxs4/ngxs4.component';
import {Ngxs4State} from "./ngxs4/ngxs4-state";
import { Ngxs5Component } from './ngxs5/ngxs5/ngxs5.component';
import {NavigationState} from "./ngxs5/ngxs5/ngxs5-state";

@NgModule({
  declarations: [
    AppComponent,
    Ngxs1Component,
    Ngxs2Component,
    Ngxs3Component,
    Ngxs4Component,
    Ngxs5Component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxsModule.forRoot([ Ngxs1State, Ngxs2State, Ngxs3State, Ngxs4State, NavigationState ], {
      developmentMode: !environment.production
    })
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
