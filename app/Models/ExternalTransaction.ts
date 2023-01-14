import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from 'App/Models/User'

export default class ExternalTransaction extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public ownerId: string

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
    localKey: 'id',
  })
  public owner: BelongsTo<typeof User>

  @column()
  public amount: number

  @column()
  public phone: string

  @column()
  public state: 'PENDING' | 'DONE' | 'CANCELED'

  @column()
  public type: 'DEPOSIT' | 'WITHDRAWAL'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
