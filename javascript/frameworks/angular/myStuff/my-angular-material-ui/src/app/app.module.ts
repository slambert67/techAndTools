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

@NgModule({
  declarations: [
    AppComponent,
    MySidenavComponent,
    MyTableComponent,
    MyTable2Component
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
