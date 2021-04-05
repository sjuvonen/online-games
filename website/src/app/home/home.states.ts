import { Injectable } from '@angular/core'
import { Player, Room } from '@game-base/models'
import { RoomAction } from '@game-base/state'
import { Action, Selector, State, StateContext, Store } from '@ngxs/store'
import { append, patch, removeItem, updateItem }  from '@ngxs/store/operators'
import { SendWebSocketMessage } from '@ngxs/websocket-plugin'
import { Home as HomeActions } from './home.actions'

export interface HomeState {
  rooms: Room[]
}

const HOME_DEFAULTS = {
  rooms: []
}

@State<HomeState>({
  name: 'homeState',
  defaults: HOME_DEFAULTS
})
@Injectable()
export class HomeStore {
  constructor (
    private store: Store
  ) { }

  @Selector()
  static rooms (state: HomeState): Room[] {
    return state.rooms
  }

  @Action(HomeActions.LoadIndex)
  view (ctx: StateContext<HomeState>) {
    ctx.patchState({ rooms: [] })

    return this.store.dispatch(new SendWebSocketMessage({
      type: HomeActions.LoadIndex.type
    }))
  }

  @Action(HomeActions.Index)
  index (ctx: StateContext<HomeState>, action: HomeActions.Index) {
    ctx.patchState({
      rooms: [...action.rooms]
    })
  }

  @Action(RoomAction.Created)
  created (ctx: StateContext<HomeState>, action: RoomAction.Created) {
    /**
     * Append the player to the room's list of players.
     */
    ctx.setState(
      patch({
        rooms: append<Room>([{ ...action.room }])
      })
    )
  }

  @Action(RoomAction.Closed)
  closed (ctx: StateContext<HomeState>, action: RoomAction.Closed) {
    /**
     * Remove the whole room.
     */
    ctx.setState(
      patch({
        rooms: removeItem<Room>(room => room!.id === action.room)
      })
    )
  }

  @Action(RoomAction.Joined)
  joined (ctx: StateContext<HomeState>, action: RoomAction.Joined) {
    /**
     * Append the player to the room's list of players.
     */
    ctx.setState(
      patch({
        rooms: updateItem<Room>(
          room => room!.id === action.room,
          patch ({
            players: append([action.player])
          })
        )
      })
    )
  }

  @Action(RoomAction.Left)
  left (ctx: StateContext<HomeState>, action: RoomAction.Left) {
    /**
     * Remove the player from the given room.
     */
    ctx.setState(
      patch({
        rooms: updateItem<Room>(
          room => room!.id === action.room,
          patch ({
            players: removeItem<Player>(player => player!.id === action.player.id)
          })
        )
      })
    )
  }
}
