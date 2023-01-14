import Ws from 'App/Services/Ws'
import Message from 'App/Models/Message'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import AuthManager from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator'
import { generateUnusedUuid } from 'App/Helpers/UniqueId'
import Setting from 'App/Models/Setting'

Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io
  .use(async (socket, next) => {
    let settings = await Setting.query().orderBy('created_at', 'desc').first()

    if (!settings || !settings.isChatEnabled) next(new Error('Chat is not enabled.'))

    // HttpContextContract
    const ctx = HttpContext.create('/', {}, socket.request)
    //AuthContract
    const auth = AuthManager.getAuthForRequest(ctx)

    try {
      const readyOnly = true
      await ctx.session.initiate(readyOnly)
      const isAuthenticated = await auth.use('web').check()

      if (isAuthenticated) {
        socket.handshake['user'] = auth.user
        next()
      } else {
        next(new Error('User must be authenticated to perform socket protocol'))
      }
    } catch (e) {
      console.log('Adonis session init failed')
      next(new Error('Adonis session init failed'))
    }
  })
  .on('connection', async (socket) => {
    const messages = await Message.query().select('*').orderBy('created_at', 'desc').limit(20)

    // @ts-ignore
    const user: User = socket.handshake.user

    socket.emit('messages', { messages })

    socket.on('message', async (data) => {
      try {
        const { content } = await validator.validate({
          schema: schema.create({
            content: schema.string({ escape: true, trim: true }, [rules.maxLength(255)]),
          }),
          data: {
            content: data.content,
          },
        })

        const message = new Message()
        message.id = await generateUnusedUuid('id', Message, [10, 10, 10, 10])
        message.content = content
        // @ts-ignore
        message.author = user.username
        await message.save()

        socket.emit('message', { message })
      } catch (e) {}
    })
  })
