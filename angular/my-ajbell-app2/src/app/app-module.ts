import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { UsersContainer } from './components/users-container/users-container';
import { UsersDetailsContainer } from './components/users-details-container/users-details-container';
import { UsersDetailsDumbui } from './components/users-details-dumbui/users-details-dumbui';
import { UsersDumbui } from './components/users-dumbui/users-dumbui';
import { Amui } from './components/amui/amui';
import { MatTableModule } from '@angular/material/table';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';

@NgModule({
  declarations: [
    App,
    UsersContainer,
    UsersDetailsContainer,
    UsersDetailsDumbui,
    UsersDumbui,
    Amui
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatCardModule,
    MatList,
    MatListItem
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
