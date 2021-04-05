import { select, from, join, on, fields, where } from '../sql/select.js'

export class PlayerStore {
  static requirements = ['database']

  #db

  constructor (db) {
    this.#db = db
  }

  async loadForRoom (pid, rid) {
    const result = await this.#db.query(
      select(
        fields(`
          json_build_object(
            'id', a.user_id,
            'name', a.name,
            'rating', a.rating,
            'joinedAt', b.joined_at
          )
          AS player
        `),
        from('players', 'a',
          join('rooms_players', 'b', on('a.user_id', 'b.player_id'))
        ),
        where(
          'a.user_id = ?',
          'b.room_id = ?'
        )
      ),
      [
        pid,
        rid
      ]
    )

    if (result.length) {
      return result[0].player
    } else {
      throw new Error(`Player #${pid} is not in room #${rid}.`)
    }
  }
}
