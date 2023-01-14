import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExternalTransaction from 'App/Models/ExternalTransaction'
import ExternalTransactionValidator from 'App/Validators/ExternalTransactionValidator'
import { generateUnusedUuid } from 'App/Helpers/UniqueId'

export default class DepositsController {
  public async show({ view, request, auth }: HttpContextContract) {
    const withdrawals = await ExternalTransaction.query()
      .select('*')
      .where({
        ownerId: auth.user!.id,
        type: 'WITHDRAWAL',
      })
      .orderBy('created_at', 'desc')
      .paginate(request.input('page', 1), 5)

    return view.render('withdrawal', {
      title: 'Retrait',
      withdrawals,
      page: withdrawals.currentPage,
      last: withdrawals.lastPage,
    })
  }

  public async send({ request, response, auth }: HttpContextContract) {
    const { amount, phone } = await request.validate(ExternalTransactionValidator)

    const eTransaction = new ExternalTransaction()
    eTransaction.id = await generateUnusedUuid('id', ExternalTransaction)
    eTransaction.phone = phone
    eTransaction.type = 'WITHDRAWAL'
    eTransaction.amount = amount
    eTransaction.ownerId = auth.user!.id
    eTransaction.state = 'PENDING'
    await eTransaction.save()

    return response.redirect().back()
  }
}
