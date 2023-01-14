/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }) => {
  return response.redirect().toRoute('auth.login.show')
}).as('home')

Route.group(() => {
  Route.get('transactions', 'Admin/ExternalTransactionsController.show').as('transactions.show')
  Route.post('transactions/cancel', 'Admin/ExternalTransactionsController.cancel').as(
    'transactions.cancel'
  )
  Route.post('transactions/done', 'Admin/ExternalTransactionsController.done').as(
    'transactions.done'
  )
  Route.post('transactions/restart', 'Admin/ExternalTransactionsController.restart').as(
    'transactions.restart'
  )

  Route.get('users', 'Admin/UsersController.show').as('users.show')
  Route.post('users/update', 'Admin/UsersController.update').as('users.update')
  Route.post('users/delete', 'Admin/UsersController.delete').as('users.delete')
  Route.post('users/promote', 'Admin/UsersController.promote').as('users.promote')
  Route.post('users/unpromote', 'Admin/UsersController.unpromote').as('users.unpromote')

  Route.get('history', 'Admin/HistoriesController.show').as('histories.show')
})
  .middleware('admin')
  .as('admin')
  .prefix('admin')

Route.group(() => {
  Route.get('settings', 'Admin/SettingsController.show').as('settings.show')
  Route.post('settings', 'Admin/SettingsController.update').as('settings.update')
})
  .as('admin')
  .prefix('admin')
  .middleware('owner')

Route.group(() => {
  Route.get('/wallet', 'WalletsController.show').as('wallet.show')
  Route.post('/wallet', 'WalletsController.send').as('wallet.send')

  Route.get('/account', 'AccountsController.show').as('account.show')
  Route.post('/account', 'AccountsController.update').as('account.update')
  Route.post('/account/delete', 'AccountsController.delete').as('account.delete')

  Route.get('history', 'HistoriesController.show').as('histories.show')

  Route.get('deposit', 'DepositsController.show').as('deposits.show')
  Route.post('deposit', 'DepositsController.send').as('deposits.send')

  Route.get('withdrawal', 'WithdrawalsController.show').as('withdrawals.show')
  Route.post('withdrawal', 'WithdrawalsController.send').as('withdrawals.send')

  Route.get('/auth/logout', 'Auth/LogoutController.logout').as('auth.logout')
}).middleware('auth')

Route.group(() => {
  Route.get('/login', 'LoginController.show').as('login.show')
  Route.post('/login', 'LoginController.post').as('login.post')

  Route.get('/register', 'RegisterController.show').as('register.show')
  Route.post('/register', 'RegisterController.post').as('register.post')
})
  .namespace('App/Controllers/Http/Auth')
  .as('auth')
  .prefix('auth')
  .middleware('guest')
