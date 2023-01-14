import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    username: schema.string({ escape: true, trim: true }, [
      rules.maxLength(30),
      rules.minLength(3),
    ]),
    password: schema.string({ escape: true, trim: true }, [
      rules.maxLength(30),
      rules.minLength(8),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'username.maxLength': "Votre nom d'utilisateur ne doit pas contenir plus de 30 caractères.",
    'username.minLength': "Votre nom d'utilisateur doit pas contenir au moins 3 caractères.",
    'password.maxLength': 'Votre mot de passe ne doit pas contenir plus de 30 caractères.',
    'password.minLength': 'Votre mot de passe doit contenir au moins 8 caractères.',
  }
}
