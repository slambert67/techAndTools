import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MySidenavComponent } from './my-sidenav/my-sidenav.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { MyTableComponent } from './my-table/my-table.component';
import {MatTableModule} from "@angular/material/table";
import { MyTable2Component } from './my-table2/my-table2.component';
import { MyService } from './services/my.service';
import { MyTable3Component } from './my-table3/my-table3.component';
import { MyTable4Component } from './my-table4/my-table4.component';
import { MyTable5Component } from './my-table5/my-table5.component';

@NgModule({
  declarations: [
    AppComponent,
    MySidenavComponent,
    MyTableComponent,
    MyTable2Component,
    MyTable3Component,
    MyTable4Component,
    MyTable5Component
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatTableModule,
        HttpClientModule
    ],
  providers: [MyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
