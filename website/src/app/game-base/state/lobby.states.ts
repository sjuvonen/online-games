import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { Observable } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'
import { Lobby, Player } from '../models'
import { CURRENT_PLAYER } from '../models/player'
import { LobbyService, PlayerService } from '../services'
import { Lobby as LobbyActions } from './lobby.actions'

export enum LobbyStatus {
  Initial = 'initial',
  Open = 'open',
  Launched = 'launched'
}

export interface LobbyState {
  id: string | null
  game: string
  players: Player[]
  status: LobbyStatus
}

const LOBBY_DEFAULTS = {
  id: null,
  game: '',
  status: LobbyStatus.Initial,
  players: []
}

function comparePlayers (lobby: Lobby, a: Player, b: Player): number {
  return lobby.players.indexOf(a.id) - lobby.players.indexOf(b.id)
}

@State<LobbyState>({
  name: 'lobbyState',
  defaults: LOBBY_DEFAULTS
})
@Injectable()
export class LobbyStore {
  constructor (
    private lobbyService: LobbyService,
    private playerService: PlayerService
  ) { }

  @Selector()
  static players (state: LobbyState): Player[] {
    return state.players
  }

  @Selector()
  static status (state: LobbyState): LobbyStatus {
    return state.status
  }

  @Selector()
  static id (state: LobbyState): string | null {
    return state.id
  }

  @Action(LobbyActions.Joined)
  addPlayer (ctx: StateContext<LobbyState>, action: LobbyActions.Joined): Observable<any> {
    return this.playerService.fetch(action.player)
      .pipe(
        tap((player: Player) => {
          const state = ctx.getState()

          ctx.patchState({
            players: [...state.players, player]
          })
        })
      )
  }

  @Action(LobbyActions.Enter)
  enterLobby (ctx: StateContext<LobbyState>, action: LobbyActions.Enter): Observable<any> {
    return this.lobbyService.join(action.id)
      .pipe(
        switchMap((lobby: Lobby) => {
          return this.playerService.fetchAll(lobby.players)
            .pipe(
              tap((players: Player[]) => {
                players.sort(comparePlayers.bind(null, lobby))

                ctx.patchState({
                  players: [...players]
                })
              })
            )
        })
      )
  }

  @Action(LobbyActions.Initialize)
  initialize (ctx: StateContext<LobbyState>, action: LobbyActions.Initialize) {
    ctx.patchState(LOBBY_DEFAULTS)

    return this.playerService.fetch(CURRENT_PLAYER)
      .pipe(
        tap((player) => {
          ctx.patchState({
            players: [player]
          })
        })
      )
  }

  @Action(LobbyActions.Create)
  create (ctx: StateContext<LobbyState>, action: LobbyActions.Create): Observable<Lobby> {
    return this.lobbyService.persist({ game: action.game } as unknown as Lobby)
      .pipe(
        tap((lobby: Lobby) => {
          ctx.patchState({
            id: lobby.id,
            game: lobby.game,
          })
        })
      )
  }
}
