import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'

export default class LoginController {
  public async show({ view }: HttpContextContract) {
    return view.render('auth/login', {
      title: 'Connexion',
    })
  }

  public async post({ request, auth, response }: HttpContextContract) {
    const { username, password } = await request.validate(LoginValidator)

    await auth.use('web').attempt(username, password)

    return response.redirect().toRoute('wallet.show')
  }
}
