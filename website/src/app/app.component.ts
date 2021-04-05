import { Component, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { UserSession } from './state/user-session.actions'
import { UserSessionState } from './state/user-session.states'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'online-games'

  @Select(UserSessionState.username)
  username$!: Observable<string | null>

  constructor (private store: Store) { }

  ngOnInit () {
    this.store.dispatch([new UserSession.Hello()])
  }
}
