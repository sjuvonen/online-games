import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { append, patch, iif, insertItem, removeItem, updateItem }  from '@ngxs/store/operators'
import { SendWebSocketMessage } from '@ngxs/websocket-plugin'
import { RoomAction } from './room.actions'
import { Player } from '../models'

const ROOM_DEFAULTS = {
  id: null,
  game: '',
  owner: 0,
  players: [],
  started: false
}

export interface RoomState {
  id: number | null
  game: string
  owner: number
  players: Player[]
  started: boolean
}

@State<RoomState>({
  name: 'roomState',
  defaults: ROOM_DEFAULTS
})
@Injectable()
export class RoomStore {
  constructor (
    private store: Store
  ) { }

  @Selector()
  static players (state: RoomState): Player[] {
    return state.players
  }

  @Selector()
  static id (state: RoomState): number | null {
    return state.id
  }

  @Selector()
  static started (state: RoomState): boolean {
    return state.started
  }

  @Selector()
  static owner (state: RoomState): number | null {
    return state.owner || null
  }

  @Action(RoomAction.Joined)
  receiveJoined (ctx: StateContext<RoomState>, action: RoomAction.Joined) {
    /**
     * When e.g. refreshing page, active user might already be included in
     * the itinerary, so here we must filter duplicates.
     */
    ctx.setState(
      patch({
        players: iif<Player[]>(
          players => players!.some(p => p.id === action.player.id),
          updateItem<Player>(
            p => p!.id === action.player.id,
            patch(action.player)
          ),
          insertItem<Player>(action.player)
        )
      })
    )
  }

  @Action(RoomAction.Left)
  receiveLeft (ctx: StateContext<RoomState>, action: RoomAction.Left) {
    ctx.setState(
      patch({
        players: removeItem<Player>(player => player!.id === action.player.id)
      })
    )
  }

  @Action(RoomAction.Index)
  requestIndex (ctx: StateContext<RoomState>, action: RoomAction.Index) {
    this.store.dispatch(new SendWebSocketMessage({
      type: RoomAction.Index.type,
      room: action.room
    }))
  }

  @Action(RoomAction.Enter)
  requestEnter (ctx: StateContext<RoomState>, action: RoomAction.Enter) {
    this.store.dispatch(new SendWebSocketMessage({
      type: RoomAction.Enter.type,
      room: action.room
    }))
  }

  @Action(RoomAction.Overview)
  receiveOverview (ctx: StateContext<RoomState>, action: RoomAction.Overview) {
    ctx.patchState({
      id: action.room,
      players: [...action.players]
    })
  }

  @Action(RoomAction.Launch)
  requestLaunch (ctx: StateContext<RoomState>, action: RoomAction.Launch) {
    this.store.dispatch(new SendWebSocketMessage({
      type: RoomAction.Launch.type,
      room: action.room
    }))
  }

  @Action(RoomAction.Started)
  receiveStarted (ctx: StateContext<RoomState>, action: RoomAction.Started) {
    ctx.patchState({
      started: true
    })
  }
}
