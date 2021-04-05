import { select, fields, from, where } from '../../sql/select.js'
import { makeCards } from './six-nimmt.library.js'

export const sessions = new Map()

export class SixNimmtGame {
  static requirements = ['database', 'room.notifier']

  #db
  #notifier

  constructor (db, notifier) {
    this.#db = db
    this.#notifier = notifier
  }

  async start (roomId) {
    // if (sessions.has(roomId)) {
    //   console.error(`Game is already started for room #${roomId}.`)
    //   return
    // }

    const pids = await this.getPlayers(roomId)
    const instance = new SixNimmtSession(this.#notifier, roomId, pids)

    instance.start()

    sessions.set(roomId, instance)
  }

  async getPlayers (roomId) {
    const result = await this.#db.query(
      select(
        fields('a.player_id AS id'),
        from('rooms_players', 'a'),
        where('a.room_id = ?')
      ),
      [
        roomId
      ]
    )

    return result.map(row => row.id)
  }
}

class SixNimmtSession {
  constructor (notifier, room, pids) {
    this.notifier = notifier
    this.room = room
    this.players = pids
    this.hands = new Map()
  }

  start () {
    const deck = makeCards().sort(() => 0.5 - Math.random())

    const board = [
      new Array(6),
      new Array(6),
      new Array(6),
      new Array(6)
    ]

    for (const pid of this.players) {
      const cards = deck.splice(0, 10).sort((a, b) => a.number - b.number)

      this.hands.set(pid, cards)

      this.notifier.notifyPlayer(this.room, pid, {
        type: '[SixNimmt] Hand',
        cards
      })
    }

    for (let i = 0; i < board.length; i++) {
      board[i][0] = deck.pop()
    }

    this.notifier.notify(this.room, {
      type: '[SixNimmt] Board',
      board
    })
  }
}
