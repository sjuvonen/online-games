import { select, fields, from, groupBy, orderBy, join, on, where } from '../sql/select.js'

export class HomeController {
  static requirements = ['database']

  #db

  constructor (db) {
    this.#db = db
  }

  async index () {
    const query = select(
      fields(
        'max(a.id) AS id',
        'max(b.name) AS name',
        'max(b.slug) AS game',
        'max(a.created_at) AS created_at',
        'a.settings',
        `
        jsonb_agg(
          jsonb_build_object(
            'id', d.user_id,
            'name', d.name,
            'joinedAt', c.joined_at,
            'rating', d.rating
          )
          ORDER BY c.joined_at
        )
        AS players
        `
      ),
      from('rooms', 'a',
        join('games', 'b', on('a.game_id', 'b.id')),
        join('rooms_players', 'c', on('a.id', 'c.room_id')),
        join('players', 'd', on('c.player_id', 'd.user_id'))
      ),
      where('a.active = true'),
      groupBy('a.id'),
      orderBy('name', 'created_at')
    )

    const rooms = await this.#db.query(query.toSql())

    return {
      type: '[Home] Index',
      rooms
    }
  }
}
