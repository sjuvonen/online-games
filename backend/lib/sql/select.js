import { Part, and } from './common.js'

export { fields, where } from './common.js'

export class Select {
  constructor () {
    this.fields = undefined
    this.from = undefined
    this.where = undefined
    this.groupBy = undefined
    this.orderBy = undefined
    this.having = undefined
  }

  set (part, ...rest) {
    for (const arg of [part, ...rest]) {
      arg.applyTo(this)
    }

    return this
  }

  toSql () {
    return 'SELECT ' + Object.values(this).filter(p => !!p).map(p => p.toSql()).join(' ')
  }
}

export class Count extends Select { }

export class From extends Part {
  static key = 'from'

  #table
  #alias
  #joins

  constructor (table, alias, ...joins) {
    super()

    this.#table = table
    this.#alias = alias
    this.#joins = joins || []
  }

  get table () {
    return this.#table
  }

  toSql () {
    const joins = this.#joins.map(j => j.toSql()).join(' ')

    return `FROM ${this.#table} ${this.#alias} ${joins}`.trim()
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

export class GroupBy extends Part {
  static key = 'groupBy'

  #fields

  constructor (...fields) {
    super()

    this.#fields = fields
  }

  toSql () {
    return `GROUP BY ${this.#fields.join(', ')}`
  }

  get fields () {
    return this.#fields
  }
}

export class OrderBy extends Part {
  static key = 'orderBy'

  #fields

  constructor (...fields) {
    super()

    this.#fields = fields.map(f => Array.isArray(f) ? f : [f, 'ASC'])
  }

  toSql () {
    const fields = this.#fields.map(f => f.join(' ')).join(', ')

    return `ORDER BY ${fields}`
  }

  get fields () {
    return this.#fields
  }
}

export class On extends Part {
  #left
  #right

  constructor (left, right) {
    super()

    this.#left = left
    this.#right = right
  }

  toSql () {
    return `ON ${this.#left} = ${this.#right}`
  }
}

export class Where extends Part {
  static key = 'where'

  #conditions

  constructor (first, ...rest) {
    super()

    const strings = rest.filter(c => typeof c === 'string')
    const exprs = rest.filter(c => c instanceof Part)

    this.#conditions = [new Raw(first), and(...strings), ...exprs]
  }

  toSql () {
    const conditions = this.#conditions.map(conds => conds.toSql()).filter(c => c.length).join(' ')

    return `WHERE ${conditions}`.trim()
  }
}

export class Conjunction extends Part {
  #name
  #conditions

  constructor (name, condition, ...rest) {
    super()

    this.#name = name

    const first = typeof condition === 'string' ? new Raw(condition) : condition
    const conds = rest.map(c => typeof c === 'string' ? new Conjunction(name, new Raw(c)) : c)

    this.#conditions = [first, ...conds].filter(c => c !== undefined)
  }

  get name () {
    return this.#name
  }

  toSql () {
    if (!this.#conditions.length) {
      return ''
    }

    const conditions = this.#conditions.map(c => c.toSql()).join(' ')

    return `${this.name} (${conditions})`
  }
}

class Raw extends Part {
  #raw

  constructor (raw) {
    super()

    this.#raw = raw
  }

  toSql () {
    return this.#raw
  }
}

export class Comparison extends Part {
  #left
  #right
  #operator

  constructor (left, operator, right) {
    super()

    this.#left = left
    this.#operator = operator
    this.#right = right
  }

  toSql () {
    return `${this.#left} ${this.#operator} ${this.#right}`
  }
}

export function select (fields, from, ...rest) {
  return new Select().set(fields, from, ...rest)
}

export function count (from, ...rest) {
  return new Count().set(from, ...rest)
}

export function from (table, alias, ...rest) {
  return new From(table, alias, ...rest)
}

export function join (table, alias, condition) {
  return new Join('INNER', table, alias, condition)
}

export function joinLeft (table, alias, condition) {
  return new Join('LEFT', table, alias, condition)
}

export function groupBy (...fields) {
  return new GroupBy(...fields)
}

export function orderBy (...fields) {
  return new OrderBy(...fields)
}

export function on (left, right) {
  return new On(left, right)
}
