import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import Setting from 'App/Models/Setting'

export default class HistoriesController {
  public async show({ view, request, response }: HttpContextContract) {
    let settings = await Setting.query().orderBy('created_at', 'desc').first()

    if (!settings || !settings.isHistoryEnabled) return response.redirect().toRoute('home')

    const transactions = await Transaction.query()
      .select('*')
      .orderBy('created_at', 'desc')
      .paginate(request.input('page', 1), 15)

    return view.render('history', {
      transactions,
      page: transactions.currentPage,
      last: transactions.lastPage,
    })
  }
}
