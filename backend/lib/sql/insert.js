import { Part, Where } from './common.js'
import { Select } from './select.js'

export class Insert {
  constructor () {
    this.into = undefined
    this.values = undefined
    this.onConflict = undefined
  }

  set (part, ...rest) {
    for (const arg of [part, ...rest]) {
      if (arg instanceof Select) {
        this.values = arg
      } else {
        arg.applyTo(this)
      }
    }

    return this
  }

  toSql () {
    return 'INSERT ' + Object.values(this).filter(p => !!p).map(p => p.toSql()).join(' ')
  }
}

export class Into extends Part {
  static key = 'into'

  #table
  #joins

  constructor (table, ...joins) {
    super()

    this.#table = table
    this.#joins = joins || []
  }

  get table () {
    return this.#table
  }

  toSql () {
    const joins = this.#joins.map(j => j.toSql()).join(' ')

    return `INTO ${this.#table} ${joins}`.trim()
  }
}

export class Values extends Part {
  static key = 'values'

  #tuples

  constructor (...tuples) {
    super()

    this.#tuples = tuples.map(v => typeof v === 'string' ? v.split(/\s*=\s*/) : v)
  }

  toSql () {
    const fields = [...this.#tuples.values()].map(([field, value]) => field).join(', ')
    const values = [...this.#tuples.values()].map(([field, value]) => value).join(', ')

    return `(${fields}) VALUES (${values})`
  }

  get fields () {
    return this.#tuples
  }
}

export class Join extends Part {
  #type
  #table
  #alias
  #condition

  constructor (type, table, alias, condition) {
    super()

    this.#type = type
    this.#table = table
    this.#alias = alias
    this.#condition = condition
  }

  get table () {
    return this.#table
  }

  toSql () {
    const condition = this.#condition ? this.#condition.toSql() : '{joinClause}'

    return `${this.#type} JOIN ${this.#table} ${this.#alias} ${condition}`.trim()
  }
}

class OnConflict extends Part {
  static key = 'onConflict'

  #constraint
  #action

  constructor (constraint, action) {
    super()

    this.#constraint = Array.isArray(constraint) ? constraint.join(', ') : constraint
    this.#action = action
  }

  toSql () {
    return `ON CONFLICT (${this.#constraint}) DO ${this.#action}`
  }
}

export function insert (fields, into, ...rest) {
  return new Insert().set(fields, into, ...rest)
}

export function into (table) {
  return new Into(table)
}

export function values (...tuples) {
  return new Values(...tuples)
}

export function where (condition, ...other) {
  return new Where(condition, ...other)
}

export function onConflict (constraint, action) {
  return new OnConflict(constraint, action)
}
