import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { ConnectWebSocket, SendWebSocketMessage } from '@ngxs/websocket-plugin'
import { tap } from 'rxjs/operators'
import { UserSession } from './user-session.actions'

@State<UserSessionStateModel>({
  name: 'userSession',
  defaults: {
    id: 0,
    name: ''
  }
})
@Injectable()
export class UserSessionState {
  constructor (
    private http: HttpClient,
    private store: Store
  ) { }

  @Selector()
  static id (state: UserSessionStateModel): number | null {
    return state.id || null
  }

  @Selector()
  static username (state: UserSessionStateModel): string | null {
    return state.name || null
  }

  @Action(UserSession.Hello)
  hello (ctx: StateContext<UserSessionStateModel>, action: UserSession.Hello) {
    return this.http.get<UserSessionStateModel | null>('/api/session').pipe(
      tap((session: UserSessionStateModel | null) => {
        if (session) {
          this.store.dispatch(new UserSession.Session(session.id, session.name))
        }
      })
    )
  }

  @Action(UserSession.Login)
  login (ctx: StateContext<UserSessionStateModel>, action: UserSession.Login) {
    return this.http.post<UserSessionStateModel>('/api/login', {
      username: action.username,
      password: action.password
    })
    .pipe(
      tap((session: UserSessionStateModel) => {
        this.store.dispatch(new UserSession.Session(session.id, session.name))
      })
    )
  }

  @Action(UserSession.Session)
  session (ctx: StateContext<UserSessionStateModel>, action: UserSession.Session) {
    if (action.id) {
      this.store.dispatch(new ConnectWebSocket())
    }

    ctx.patchState({
      id: action.id,
      name: action.name,
    })
  }
}

export interface UserSessionStateModel {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
}
