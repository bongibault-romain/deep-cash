import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/Admin/UserValidator'
import UsersService from 'App/Services/UsersService'
import UpdateValidator from 'App/Validators/Admin/User/UpdateValidator'

export default class UsersController {
  public async show({ view, request }: HttpContextContract) {
    const users = await User.query().paginate(request.input('page', 1), 30);

    return view.render('admin/users', {
      users,
      page: users.currentPage,
      last: users.lastPage,
    })
  }

  public async update({ request, response }: HttpContextContract) {
    const { user_id: userId } = await request.validate(UserValidator)
    const { amount } = await request.validate(UpdateValidator)

    const user = await User.findOrFail(userId)

    user.amount = amount
    await user.save()

    return response.redirect().back()
  }

  public async promote({ request, auth, response }: HttpContextContract) {
    const { user_id: userId } = await request.validate(UserValidator)

    const user = await User.findOrFail(userId)

    if ((!user.isAdmin && !user.isOwner) || (user.isAdmin && auth.user!.isOwner)) {
      user.isAdmin = true
      await user.save()
    }

    return response.redirect().back()
  }

  public async unpromote({ request, auth, response }: HttpContextContract) {
    const { user_id: userId } = await request.validate(UserValidator)

    const user = await User.findOrFail(userId)

    if ((!user.isAdmin && !user.isOwner) || (user.isAdmin && auth.user!.isOwner)) {
      user.isAdmin = false
      await user.save()
    }

    return response.redirect().back()
  }

  public async delete({ request, auth, response }: HttpContextContract) {
    const { user_id: userId } = await request.validate(UserValidator)

    const user = await User.findOrFail(userId)

    if ((!user.isAdmin && !user.isOwner) || (user.isAdmin && auth.user!.isOwner)) {
      await UsersService.delete(user)
    }

    return response.redirect().back()
  }
}
