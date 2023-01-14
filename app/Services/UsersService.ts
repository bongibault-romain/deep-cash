import User from 'App/Models/User'
import Transaction from 'App/Models/Transaction'

export default class UsersService {
  public static async delete(user: User) {
    await Transaction.query()
      .update({
        ownerTransferKey: null,
      })
      .where({
        ownerTransferKey: user.transferKey,
      })

    await Transaction.query()
      .update({
        targetTransferKey: null,
      })
      .where({
        targetTransferKey: user!.transferKey,
      })

    await user!.delete()
  }
}
