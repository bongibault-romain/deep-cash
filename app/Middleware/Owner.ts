import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.isAuthenticated && auth.user!.isOwner) {
      return await next()
    }

    return response.redirect().toRoute('wallet.show')
  }
}
