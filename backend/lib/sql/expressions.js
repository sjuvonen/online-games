export class Select {
  #cacheKey
  #fields
  #table
  #joins = []

  constructor (cacheKey) {
    this.cacheAs(cacheKey)
  }

  cacheAs (key) {
    this.#cacheKey = key
  }

  get cacheKey () {
    return this.#cacheKey
  }

  fields (...fields) {
    this.#fields = fields
  }

  from (table, alias) {
    this.#table = table
  }

  join (table, alias, conditions) {
    this.#joins.push(new Join('INNER', table, alias, conditions))
  }

  leftJoin (table, alias, conditions) {
    this.#joins.push(new Join('LEFT', table, alias, conditions))
  }

  rightJoin (table, alias, conditions) {
    this.#joins.push(new Join('RIGHT', table, alias, conditions))
  }

  fullJoin (table, alias, conditions) {
    this.#joins.push(new Join('FULL', table, alias, conditions))
  }

  get lastTable () {
    return this.joins[this.joins.length - 1] || this.#table
  }
}

class Join {
  constructor (type, table, alias, conditions) {
    this.type = type
    this.table = table
    this.alias = alias

    if (typeof conditions === 'string') {
      this.conditions = [conditions]
    } else {
      this.conditions = conditions
    }
  }
}

export function select (...parts) {
  return new Select()
}
