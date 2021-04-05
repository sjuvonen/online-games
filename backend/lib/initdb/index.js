import { readFile } from 'fs/promises'

export class InitDbExtension {
  static requirements = ['database', 'events']

  #db

  constructor (db, events) {
    this.#db = db
    events.on('kernel.start', this.initDb.bind(this))
  }

  async initDb () {
    const files = ['database.schema.sql']

    for (const file of files) {
      const sql = (await readFile(`data/${file}`, 'utf-8')).split(';')

      for (const op of sql) {
        await this.#db.query(op)
      }
    }

    console.info('Database synced.')
  }
}
