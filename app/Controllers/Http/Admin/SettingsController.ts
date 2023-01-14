import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/Settings/UpdateValidator'
import Setting from 'App/Models/Setting'
import { generateUnusedUuid } from 'App/Helpers/UniqueId'

export default class SettingsController {
  public async show({ view }: HttpContextContract) {
    return view.render('admin/settings', { title: 'Paramètres' })
  }

  public async update({ response, request, session }: HttpContextContract) {
    const {
      name,
      symbol,
      is_history_enabled: isHistoryEnabled,
      is_chat_enabled: isChatEnabled,
    } = await request.validate(UpdateValidator)

    const settings = new Setting()
    settings.id = await generateUnusedUuid('id', Setting)
    settings.name = name
    settings.symbol = symbol
    settings.isChatEnabled = isChatEnabled || false
    settings.isHistoryEnabled = isHistoryEnabled || false

    await settings.save()

    session.flash({
      success: 'Modifications sauvegardées.',
    })

    return response.redirect().back()
  }
}
