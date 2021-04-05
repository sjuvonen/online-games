import { sessions } from './six-nimmt.game.js'

export class SixNimmtController {
  static requirements = ['database']

  #db

  constructor (db) {
    this.#db = db
  }

  start () {
    console.log('six-nimmt.controller')
  }

  selectCardFromHand (socket, action) {

  }
}
