import DataLoader from 'dataloader'
import { modelInstance as model, user_database_to_graphql } from '../models/index'
import { merge } from './util'

export const userByIdLoader = new DataLoader(async keys => {
  const results = await model.user.getByIds(keys)
  const mergeResults = merge("userId", results)
  return keys.map(key => mergeResults[key] || new Error(`No result for ${key}`))
})

const userByFacebookIdLoader = new DataLoader(async keys => {

})


