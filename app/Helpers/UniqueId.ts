import { LucidModel } from '@ioc:Adonis/Lucid/Orm'

export async function generateUnusedUuid(
  column: string,
  Model: LucidModel,
  amounts: number[] = [10, 4, 4, 10]
): Promise<string> {
  if (amounts.length <= 0) return ''

  let generated = generateId(amounts[0])

  for (let i = 1; i < amounts.length; i++) {
    generated += '-' + generateId(amounts[i])
  }

  if (!(await Model.findBy(column, generated))) {
    return generated
  }

  return generateUnusedUuid(column, Model, amounts)
}

function generateId(size: number) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'

  let generated = ''

  for (let i = 0; i < size; i++) {
    generated += alphabet[Math.round(Math.random() * (alphabet.length - 1))]
  }

  return generated
}
