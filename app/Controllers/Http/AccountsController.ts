import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/Accounts/UpdateValidator'
import UsersService from 'App/Services/UsersService'

export default class AccountsController {
  public async show({ view }: HttpContextContract) {
    return view.render('account', {
      title: 'Compte',
    })
  }

  public async update({ request, auth, session, response }: HttpContextContract) {
    const {
      username,
      new_password: newPassword,
      password,
    } = await request.validate(UpdateValidator)

    if (password && newPassword) {
      await auth.verifyCredentials(auth.user!.username, password)

      auth.user!.password = newPassword
    }

    if (username !== auth.user!.username) {
      auth.user!.username = username
    }

    await auth.user!.save()

    session.flash({
      success: 'Modifications effectuées.',
    })

    return response.redirect().back()
  }

  public async delete({ auth, response }: HttpContextContract) {
    await UsersService.delete(auth.user!)

    await auth.logout()

    return response.redirect().toRoute('home')
  }
}
