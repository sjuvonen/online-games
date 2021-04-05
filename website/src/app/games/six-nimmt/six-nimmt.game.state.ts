import { Injectable } from '@angular/core'
import { State } from '@ngxs/store'
import { Player } from '@game-base/models'
import { Action, Selector, StateContext } from '@ngxs/store'
import { SixNimmt } from './six-nimmt.game.actions'
import { Card } from './game/types'
import { WebsocketMessageError } from '@ngxs/websocket-plugin'

const GAME_DEFAULTS: SixNimmtGameState = {
  board: [],
  hand: []
}

@State<SixNimmtGameState>({
  name: 'sixNimmtGameState',
  defaults: { ...GAME_DEFAULTS }
})
@Injectable()
export class SixNimmtStore {
  @Selector()
  static welcome (...args: any[]) {
    console.log('[SixNimmtStore.welcome]', ...args)
  }

  @Selector()
  static hand (state: SixNimmtGameState): Card[] {
    return state.hand
  }

  @Selector()
  static board (state: SixNimmtGameState): Card[][] {
    return state.board
  }

  @Action(SixNimmt.Hand)
  receiveHand (ctx: StateContext<SixNimmtGameState>, action: SixNimmt.Hand) {
    ctx.patchState({
      hand: [...action.cards]
    })
  }

  @Action(SixNimmt.Board)
  receiveBoard (ctx: StateContext<SixNimmtGameState>, action: SixNimmt.Board) {
    ctx.patchState({
      board: [...action.board]
    })
  }
}

export interface SixNimmtGameState {
  board: Card[][]
  hand: Card[]
}
