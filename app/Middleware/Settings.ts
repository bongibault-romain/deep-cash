import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Setting from 'App/Models/Setting'
import { generateUnusedUuid } from 'App/Helpers/UniqueId'

export default class Admin {
  public async handle({ view }: HttpContextContract, next: () => Promise<void>) {
    let settings = await Setting.query().orderBy('created_at', 'desc').first()

    if (!settings) {
      settings = new Setting()
      settings.id = await generateUnusedUuid('id', Setting)

      settings = await settings.save()
    }

    view.share({
      settings,
    })

    await next()
  }
}
