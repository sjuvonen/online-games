import { SettingsBase } from '../models/lobby'

export namespace Lobby {
  /**
   * (Receive) Player has joined the lobby.
   */
  export class Joined {
    static readonly type = '[Lobby] Joined'

    constructor (public player: string) { }
  }

  /**
   * (Receive) Player has left the lobby.
   */
  export class Left {
    static readonly type = '[Lobby] Left'

    constructor (public player: string) { }
  }

  /**
   * (Send) Current user enters a lobby.
   */
  export class Enter {
    static readonly type = '[Lobby] Enter'

    constructor (public id: string) { }
  }

  /**
   * Current user sets up an initial lobby.
   */
  export class Initialize {
    static readonly type = '[Lobby] Initialize'

    constructor (public game: string) { }
  }

  /**
   * (Send) Current user initiates a new public session.
   */
  export class Create {
    static readonly type = '[Lobby] Create'

    constructor (public game: string, public settings: SettingsBase) { }
  }
}
