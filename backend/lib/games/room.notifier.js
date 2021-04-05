import { select, from, fields, where } from '../sql/select.js'

/**
 * Broadcasts a message to all players in the room.
 */
export class RoomNotifier {
  static requirements = ['database']

  #db
  #users

  constructor (db) {
    this.#db = db
    this.#users = new Map()
  }

  onConnection (socket) {
    if (!socket.user) {
      console.error('SOCKET NOT INITIALIZED YET!')
      return
    }

    console.log('register socket')

    if (!this.#users.has(socket.user)) {
      this.#users.set(socket.user, new Set())
    }

    /**
     * FIXME: Handle disconnects as well!
     */
    this.#users.get(socket.user).add(socket)
  }

  async notify (roomId, message) {
    for await (const socket of this.getSockets(roomId)) {
      socket.send(JSON.stringify(message))
    }
  }

  async notifyPlayer (roomId, playerId, message) {
    for await (const socket of this.getSockets(roomId)) {
      if (socket.user === playerId) {
        socket.send(JSON.stringify(message))
      }
    }
  }

  async * getSockets (roomId) {
    for await (const pid of this.getPlayers(roomId)) {
      for (const socket of this.#users.get(pid) || []) {
        yield socket
      }
    }
  }

  async * getPlayers (roomId) {
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

    for (const row of result) {
      yield row.id
    }
  }
}
