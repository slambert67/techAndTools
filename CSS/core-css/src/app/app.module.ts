import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColoursComponent } from './colours/colours.component';
import { LayoutBasicComponent } from './layout-basic/layout-basic.component';
import { BoxModelComponent } from './box-model/box-model.component';
import { LayoutFlexComponent } from './layout-flex/layout-flex.component';

@NgModule({
  declarations: [
    AppComponent,
    ColoursComponent,
    LayoutBasicComponent,
    BoxModelComponent,
    LayoutFlexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
