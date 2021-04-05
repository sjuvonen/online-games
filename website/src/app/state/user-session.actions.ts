export namespace UserSession {
  export class Hello {
    static readonly type = '[User] Hello'
  }

  export class Login {
    static readonly type = '[User] Login'

    constructor (public username: string, public password: string) { }
  }

  export class Session {
    static readonly type = '[User] Session'

    constructor (public id: number, public name: string) { }
  }
}
