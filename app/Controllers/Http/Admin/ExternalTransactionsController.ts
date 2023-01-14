import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExternalTransaction from 'App/Models/ExternalTransaction'
import ExternalTransactionValidator from 'App/Validators/Admin/ExternalTransactionValidator'

export default class ExternalTransactionsController {
  public async show({ view, request }: HttpContextContract) {
    const deposits = await ExternalTransaction.query()
      .select('*')
      .where({
        type: 'DEPOSIT',
      })
      .preload('owner')
      .orderBy('state')
      .orderBy('created_at', 'desc')
      .paginate(request.input('dpage', 1), 5)

    const withdrawals = await ExternalTransaction.query()
      .select('*')
      .where({
        type: 'WITHDRAWAL',
      })
      .preload('owner')
      .orderBy('state')
      .orderBy('created_at', 'desc')
      .paginate(request.input('wpage', 1), 5)

    return view.render('admin/externalTransactions', {
      title: 'Transactions',
      withdrawals,
      deposits,
      dpage: deposits.currentPage,
      dlast: deposits.lastPage,
      wpage: withdrawals.currentPage,
      wlast: withdrawals.lastPage,
    })
  }

  public async done({ request, response, session }: HttpContextContract) {
    const { transaction_id: transactionId } = await request.validate(ExternalTransactionValidator)

    const transaction = await ExternalTransaction.findOrFail(transactionId)

    await transaction.load('owner')

    if (transaction.type === 'WITHDRAWAL') {
      if (transaction.amount > transaction.owner.amount) {
        session.flash({
          error: "L'utilisateur n'a pas assez de crypto-monnaie sur son compte.",
        })

        return response.redirect().back()
      }

      transaction.owner.amount -= transaction.amount
    } else {
      transaction.owner.amount += transaction.amount
    }

    transaction.state = 'DONE'
    await transaction.save()

    await transaction.owner.save()

    return response.redirect().back()
  }

  public async cancel({ request, response }: HttpContextContract) {
    const { transaction_id: transactionId } = await request.validate(ExternalTransactionValidator)

    const transaction = await ExternalTransaction.findOrFail(transactionId)

    transaction.state = 'CANCELED'
    await transaction.save()

    return response.redirect().back()
  }

  public async restart({ request, response, session }: HttpContextContract) {
    const { transaction_id: transactionId } = await request.validate(ExternalTransactionValidator)

    const transaction = await ExternalTransaction.findOrFail(transactionId)

    if (transaction.state === 'CANCELED') {
      transaction.state = 'PENDING'
      await transaction.save()

      return response.redirect().back()
    }

    session.flash({
      error: 'Seule une transaction annulée peut être reprise.',
    })

    return response.redirect().back()
  }
}
