import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DesktopMain } from './components/desktop-main/desktop-main';
import { Mobile } from './components/mobile/mobile';
import { DesktopDetail } from './components/desktop-detail/desktop-detail';

@NgModule({
  declarations: [
    App,
    DesktopMain,
    Mobile,
    DesktopDetail
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
