import { Player, Room } from '../models'

export namespace RoomAction {
  /**
   * Request player listing from the server.
   */
  export class Index {
   static readonly type = '[Room] Index'

   constructor (
     public room: number
   ) { }
  }

  /**
   * Request to enter the game room.
   */
  export class Enter {
    static readonly type = '[Room] Enter'

    constructor (
      public room: number
    ) { }
  }

  /**
   * Receives a list of players from the server.
   */
  export class Overview {
    static readonly type = '[Room] Overview'

    constructor (
      public room: number,
      public started: boolean,
      public players: Player[]
    ) { }
  }

  export class Launch {
    static readonly type = '[Room] Launch'

    constructor (
      public room: number
    ) {}
  }

  export class Started {
    static readonly type = '[Room] Started'

    constructor (
      public room: number
    ) {}
  }

  export class Created {
    static readonly type = '[Room] Created'

    constructor (
      public room: Room
    ) { }
  }

  export class Closed {
    static readonly type = '[Room] Closed'

    constructor (
      public room: number
    ) { }
  }

  /**
   * Someone enters a room.
   */
  export class Joined {
    static readonly type = '[Room] Joined'

    constructor (
      public room: number,
      public player: Player
    ) { }
  }

  export class Left {
    static readonly type = '[Room] Left'

    constructor (
      public room: number,
      public player: Player
    ) { }
  }
}
