import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { environment } from '@env/environment'
import { NgxsModule } from '@ngxs/store'
import { NgxsWebsocketPluginModule } from '@ngxs/websocket-plugin'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { HomePlayersListComponent } from './home/home-players-list.component'
import { HomeStore } from './home/home.states'
import { UserSessionState } from './state/user-session.states'
import { LoginComponent } from './login/login.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomePlayersListComponent,
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot([HomeStore, UserSessionState]),
    NgxsWebsocketPluginModule.forRoot({ ...environment.ws })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
