import { Room } from '@game-base/models'

export namespace Home {
  export class LoadIndex {
    static readonly type = '[Home] LoadIndex'
  }

  export class Index {
    static readonly type = '[Home] Index'

    constructor (public rooms: Room[]) { }
  }
}
