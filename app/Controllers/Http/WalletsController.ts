import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import SendValidator from 'App/Validators/Wallet/SendValidator'
import User from 'App/Models/User'
import { generateUnusedUuid } from 'App/Helpers/UniqueId'

export default class WalletsController {
  public async show({ view, auth }: HttpContextContract) {
    return view.render('wallet', {
      title: 'Portefeuille',
      transactions: await Transaction.query()
        .select('*')
        .where('owner_transfer_key', auth.user!.transferKey)
        .orWhere('target_transfer_key', auth.user!.transferKey)
        .orderBy('created_at', 'desc')
        .limit(6),
    })
  }

  public async send({ request, auth, response, session }: HttpContextContract) {
    const { amount, target: targetKey } = await request.validate(SendValidator)

    if (targetKey === auth.user!.transferKey) {
      session.flash({
        errors: {
          target: 'La cible ne doit pas être vous même.',
        },
      })

      return response.redirect().back()
    }

    if (amount > auth.user!.amount) {
      session.flash({
        errors: {
          amount: "Vous n'avez pas assez sur votre compte.",
        },
      })

      return response.redirect().back()
    }

    const target = await User.findByOrFail('transfer_key', targetKey)

    target.amount += amount
    auth.user!.amount -= amount

    await target.save()
    await auth.user!.save()

    const transaction = new Transaction()
    transaction.id = await generateUnusedUuid('id', Transaction)
    transaction.amount = amount
    transaction.ownerTransferKey = auth.user!.transferKey
    transaction.targetTransferKey = target.transferKey

    await transaction.save()

    return response.redirect().back()
  }
}
