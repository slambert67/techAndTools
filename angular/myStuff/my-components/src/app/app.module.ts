import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { P1Component } from './p1/p1.component';
import { C1Component } from './c1/c1.component';
import { P2Component } from './p2/p2.component';
import { Dynamic1Component } from './dynamic1/dynamic1.component';
import { DynamicCompContainerComponent } from './dynamic-comp-container/dynamic-comp-container.component';
import { Dynamic2Component } from './dynamic2/dynamic2.component';
import { DynamicCompWithConfigComponent } from './dynamic-comp-with-config/dynamic-comp-with-config.component';
import { C2Component } from './c2/c2.component';
import { Unrelated1Component } from './unrelated1/unrelated1.component';
import { Unrelated2Component } from './unrelated2/unrelated2.component';
import {UnrelatedService} from "./unrelated.service";

@NgModule({
  declarations: [
    AppComponent,
    P1Component,
    C1Component,
    P2Component,
    Dynamic1Component,
    DynamicCompContainerComponent,
    Dynamic2Component,
    DynamicCompWithConfigComponent,
    C2Component,
    Unrelated1Component,
    Unrelated2Component
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [UnrelatedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
