import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import User from 'App/Models/User'
import { generateUnusedUuid } from '../../../Helpers/UniqueId'

export default class RegisterController {
  public async show({ view }: HttpContextContract) {
    return view.render('auth/register', {
      title: 'Inscription',
    })
  }

  public async post({ request, auth, response }: HttpContextContract) {
    const { username, password } = await request.validate(RegisterValidator)

    const user = new User()
    user.id = await generateUnusedUuid('id', User)
    user.username = username
    user.password = password
    user.transferKey = await generateUnusedUuid('transfer_key', User, [6, 4, 6])

    await user.save()

    await auth.use('web').loginViaId(user.id)

    return response.redirect().toRoute('wallet.show')
  }
}
