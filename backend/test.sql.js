import { select, fields, from, groupBy, orderBy, join, on, where } from './lib/sql/select.js'
import { insert, into, values, onConflict } from './lib/sql/insert.js'

const qSelect = select(
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
  where(
    'a.active = true',
    'a.id = ?1',
    'a.foo = "bar"'
  ),
  groupBy('a.id'),
  orderBy('name', 'created_at')
)

const qInsert = insert(
  into('rooms_players', 'a'),
  values(
    'room_id = ?',
    'played_id = ?'
  ),
  onConflict('player_id', 'ignore')
)

const qUpsert = insert(
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
    where('a.id = ?')
  ),
  onConflict('user_id', 'NOTHING')
)

console.log(qSelect.toSql())
console.log(qInsert.toSql())
console.log(qUpsert.toSql())
