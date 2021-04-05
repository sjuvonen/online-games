import { v4 as uuid } from 'uuid'
import { select, fields, from, join, joinLeft, on, where } from '../sql/select.js'
import { insert, into, onConflict, values } from '../sql/insert.js'

export class SessionController {
  static requirements = ['database']

  #db

  constructor (db) {
    this.#db = db
  }

  /**
   * HTTP: Returns user session state.
   */
  async status (request) {
    const cookieData = JSON.parse(request.getCookie('session') || 'null')
    const sid = cookieData ? cookieData.id : null

    const result = await this.#db.query(
      select(
        fields(
          'a.id AS sid',
          'b.user_id AS id',
          'b.name'
        ),
        from('user_sessions', 'a',
          join('players', 'b', on('a.user_id', 'b.user_id'))
        ),
        where(
          'a.id = ?'
        )
      ),
      [
        sid
      ]
    )

    if (result.length) {
      const { sid, ...user } = result[0]

      return user
    } else {
      return null
    }
  }

  /**
   * HTTP: Handles login requests.
   */
  async login (request, response) {
    /**
     * Lazy initialization of session or no-op if session already exists.
     */
    await this.#db.query(
      insert(
        values(
          'id = ?',
          'user_id = ?'
        ),
        into('user_sessions'),
        select(
          fields(
            '?',
            'id'
          ),
          from('users', 'a'),
          where('a.username = ?')
        ),
        onConflict('user_id', 'NOTHING')
      ),
      [
        uuid(),
        request.body.username
      ]
    )

    const result = await this.#db.query(
      select(
        fields(
          'c.id AS sid',
          'b.user_id AS id',
          'b.name'
        ),
        from('users', 'a',
          join('players', 'b', on('a.id', 'b.user_id')),
          joinLeft('user_sessions', 'c', on('b.user_id', 'c.user_id'))
        ),
        where(
          'a.username = ?'
        )
      ),
      [
        request.body.username
      ]
    )

    if (result.length) {
      const { sid, ...user } = result[0]

      /**
       * WARNING: THIS IS UNSECURE!
       *
       * We are passing user ID into the cookie because we will read that value
       * back in the WebSocket handler. This is dangerous as anyone can fake any
       * other user by changing the value inside the cookie.
       *
       * This is because in production we would use secure JWT payload but for
       * now we're only emulating it.
       *
       * FIXME: Use secure JWT payload instead of unsigned, untrusted content.
       */
      response.setCookie('session', JSON.stringify({ id: sid, user: user.id }))

      /**
       * FIXME: Generate random token.
       *
       * Anti-CSRF token will be used as a counter-measure against request forgery.
       */
      response.setCookie('anti-csrf', 'NOT IMPLEMENTED YET!')

      return user
    } else {
      throw new Error('Invalid username.')
    }
  }
}
