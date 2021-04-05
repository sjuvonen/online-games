import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { Player } from '../models'
import { DUMMY_PLAYERS } from '../models/player'
import { Loader } from './loader.service'

@Injectable({
  providedIn: 'root'
})
export class PlayerService implements Loader<Player> {
  private players: Player[] = DUMMY_PLAYERS

  fetch (uuid: string): Observable<Player> {
    for (const player of this.players) {
      if (player.id === uuid) {
        return of(player)
      }
    }

    throw new Error(`Could not load Player#${uuid}.`)
  }

  fetchAll (uuids: string[]): Observable<Player[]> {
    return of(this.players.filter(p => uuids.includes(p.id)))
  }
}
