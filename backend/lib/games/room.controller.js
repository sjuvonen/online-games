import { fields, where } from '../sql/common.js'
import { select, from, groupBy, joinLeft, orderBy, join, on } from '../sql/select.js'
import { insert, into, values } from '../sql/insert.js'

const ERR_DUPLICATE_KEY = '23505'

export class RoomController {
  static requirements = ['database', 'events', 'store.player', 'room.notifier']

  #db
  #events
  #playerStore
  #notifier

  constructor (db, events, playerStore, roomNotifier) {
    this.#db = db
    this.#events = events
    this.#playerStore = playerStore
    this.#notifier = roomNotifier
  }

  async index (socket, action) {
    const query = select(
      fields(
        'max(a.id) AS room',
        'max(b.name) AS name',
        'max(b.slug) AS game',
        'max(a.created_at) AS created_at',
        'max(a.owner_id) AS owner',
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
        joinLeft('rooms_players', 'c', on('a.id', 'c.room_id')),
        join('players', 'd', on('c.player_id', 'd.user_id'))
      ),
      where(
        'a.active = true',
        'a.id = ?'
      ),
      groupBy('a.id'),
      orderBy('name', 'created_at')
    )

    const rooms = await this.#db.query(query.toSql(), [action.room])

    if (rooms.length) {
      return {
        type: '[Room] Overview',
        ...rooms[0]
      }
    } else {
      return null
    }
  }

  async enter (socket, action) {
    const query = insert(
      into('rooms_players', 'a'),
      values(
        'room_id = ?',
        'player_id = ?'
      )
    )

    try {
      /**
       * Will throw if player is already in the room.
       */
      await this.#db.query(query.toSql(), [action.room, socket.user])

      const player = await this.#playerStore.loadForRoom(socket.user, action.room)

      this.#notifier.notify(action.room, {
        type: '[Room] Joined',
        player
      })
    } catch (error) {
      if (error.code === ERR_DUPLICATE_KEY) {
        // no-op
      } else {
        console.error(error)
        return {
          type: '[Error] Database',
          message: 'Database error.'
        }
      }
    }
  }

  async launch (socket, action) {
    /**
     * TODO: Verify that only the room owner can launch a game.
     *
     * TODO: Dispatch a 'request to start' message that each user must confirm
     * first.
     */
    this.#notifier.notify(action.room, {
      type: '[Room] Started',
      room: action.room
    })

    const game = await this.#db.query(
      select(
        fields('a.slug'),
        from('games', 'a',
          join('rooms', 'b', on('a.id', 'b.game_id'))
        ),
        where('b.id = ?')
      ),
      [
        action.room
      ]
    )

    console.log('START', `${game[0].slug}.start`)

    this.#events.emit(`${game[0].slug}.start`, action.room)
  }
}
