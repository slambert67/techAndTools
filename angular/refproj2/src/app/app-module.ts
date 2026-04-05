import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DesktopMain } from './components/desktop-main/desktop-main';
import { DesktopDetail } from './components/desktop-detail/desktop-detail';
import { Mobile } from './components/mobile/mobile';

@NgModule({
  declarations: [
    App,
    DesktopMain,
    DesktopDetail,
    Mobile
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
