import { Card } from './game/types'

export namespace SixNimmt {
  export class Welcome {
    static readonly type = '[SixNimmt] Welcome'

    constructor (public status: string) {
      console.log('[SixNimmt.Welcome.constructor]')
    }
  }

  export class Hand {
    static readonly type = '[SixNimmt] Hand'

    constructor (public cards: Card[]) {}
  }

  export class Board {
    static readonly type = '[SixNimmt] Board'

    constructor (public board: Card[][]) {}
  }
}
