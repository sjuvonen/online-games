import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { Game } from '../models'
import { Loader } from './loader.service'
import { Searcher } from './searcher.service'

@Injectable({
  providedIn: 'root'
})
export class GameService implements Loader<Game>, Searcher<Game> {
  private games: Game[] = []

  constructor () {
    this.games = [
      {
        id: 'six-nimmt',
        name: '6 Nimmt!',
        description: 'Fun card game for everybody!'
      },
      {
        id: 'solo',
        name: 'Solo',
        description: 'Crazy card game that requires fast reflexes and a sharp mind.'
      }
    ]
  }

  fetch (id: string): Observable<Game> {
    for (const game of this.games) {
      if (game.id === id) {
        return of(game)
      }
    }

    throw new Error('Could not load game ${id}.')
  }

  fetchAll (ids: string[]): Observable<Game[]> {
    return of(this.games.filter(g => ids.includes(g.id)))
  }

  search (options: any): Observable<Game[]> {
    return of(this.games)
  }
}
