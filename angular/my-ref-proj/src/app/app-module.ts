import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { UserContainer } from './containers/user-container/user-container';
import { UserDisplay } from './components/user-display/user-display';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatTab } from '@angular/material/tabs';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTable } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    App,
    UserContainer,
    UserDisplay
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatTable,
    MatList,
    MatListItem,
    MatTableModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
