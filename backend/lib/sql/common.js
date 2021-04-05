export class Part {
  applyTo (parent) {
    if (!Object.hasOwnProperty.call(parent, this.constructor.key)) {
      throw new Error(`Blocks of type ${parent.constructor.name} do not accept ${this.constructor.name} parts.`)
    }

    parent[this.constructor.key] = this
  }

  toSql () {
    throw new Error(`${this.constructor.name}.toSql() not implemented.`)
  }
}

export class Fields extends Part {
  static key = 'fields'

  #fields

  constructor (...fields) {
    super()

    this.#fields = fields
  }

  toSql () {
    return this.#fields.join(', ')
  }

  get fields () {
    return this.#fields
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

export function fields (...fields) {
  return new Fields(...fields)
}

export function where (condition, ...other) {
  return new Where(condition, ...other)
}

export function and (condition, ...rest) {
  return new Conjunction('AND', condition, ...rest)
}

export function or (condition, ...rest) {
  return new Conjunction('OR', condition, ...rest)
}
