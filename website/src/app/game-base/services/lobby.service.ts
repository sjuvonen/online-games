import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { v4 as uuid4 } from 'uuid'
import { Lobby } from '../models'
import { DUMMY_SESSIONS } from '../models/lobby'
import { CURRENT_PLAYER, DUMMY_PLAYERS } from '../models/player'
import { Loader } from './loader.service'
import { Persister } from './persister.service'
import { Searcher } from './searcher.service'

@Injectable({
  providedIn: 'root'
})
export class LobbyService implements Loader<Lobby>, Persister<Lobby>, Searcher<Lobby> {
  private sessions: Lobby[] = DUMMY_SESSIONS

  fetch (id: string) {
    for (const lobby of this.sessions) {
      if (lobby.id === id) {
        return of(lobby)
      }
    }

    throw new Error(`Could not load Lobby#${id}.`)
  }

  fetchAll (ids: string[]) {
    return of(this.sessions)
  }

  search (options: any) {
    return of(this.sessions)
  }

  join (id: string): Observable<Lobby> {
    return this.fetch(id).pipe(
      tap ((lobby: Lobby) => {
        if (!lobby.players.includes(CURRENT_PLAYER)) {
          lobby.players.push(CURRENT_PLAYER)
        }
      })
    )
  }

  persist (payload: Lobby): Observable<Lobby> {
    const instance = {
      id: uuid4(),
      game: payload.game,
      owner: CURRENT_PLAYER,
      players: [CURRENT_PLAYER],
      started: false,
      created: 'foo'
    }

    this.sessions.push(instance as unknown as Lobby)

    return of(instance as unknown as Lobby)
  }
}
