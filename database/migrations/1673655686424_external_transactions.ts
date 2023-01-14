import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'external_transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('owner_id').references('id').inTable('users').onDelete('CASCADE')
      table.bigInteger('amount').unsigned().notNullable()
      table.string('phone').notNullable()
      table.enum('state', ['PENDING', 'CANCELED', 'DONE']).defaultTo('PENDING')
      table.enum('type', ['DEPOSIT', 'WITHDRAWAL'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
