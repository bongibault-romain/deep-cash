import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'

export default class HistoriesController {
  public async show({ view, request }: HttpContextContract) {
    const transactions = await Transaction.query()
      .select('*')
      .orderBy('created_at', 'desc')
      .paginate(request.input('page', 1), 15)

    return view.render('admin/history', {
      transactions,
      page: transactions.currentPage,
      last: transactions.lastPage,
    })
  }
}
