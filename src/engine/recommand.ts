import { StyleGuideCollection, StyleGuideVariable } from '../model'
import { evaluate } from './expression'
import { getVariableObject } from '../utils'

export function recommand(variables: StyleGuideVariable[], collections: StyleGuideCollection[], constrains?: string[]) {
  let result: StyleGuideVariable[][] = []
  for (const variable of variables) {
    if (result.length === 0) {
      result.push([])
    }
    const newResult: StyleGuideVariable[][] = []
    for (const r of result) {
      for (const collection of collections) {
        if (collection.kind === variable.kind) {
          newResult.push([...r, { ...variable, value: collection.color }])
        }
      }
    }
    result = newResult
  }

  return result.filter((r) => {
    if (constrains) {
      for (const constrain of constrains) {
        const valid = evaluate(constrain, { variable: getVariableObject(r) })
        if (!valid) {
          return false
        }
      }
    }
    return true
  })
}
