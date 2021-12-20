import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewModule } from './view/view.module';
import { TestService } from './test.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // contains HttpClient service
    ViewModule
  ],
  providers: [TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
