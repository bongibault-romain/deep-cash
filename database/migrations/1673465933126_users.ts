import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 255).primary()
      table.string('username', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.bigInteger('amount').unsigned().notNullable().defaultTo(0)
      table.string('transfer_key', 255).notNullable().unique()
      table.boolean('is_admin').defaultTo(false).notNullable()
      table.boolean('is_owner').defaultTo(false).notNullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
