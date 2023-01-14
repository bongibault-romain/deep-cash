import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogoutController {
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect().toRoute('auth.login.show')
  }
}
