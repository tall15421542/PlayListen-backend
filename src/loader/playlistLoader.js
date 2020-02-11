import DataLoader from 'dataloader'
import { modelInstance as model, user_database_to_graphql } from '../models/index'
import { merge } from './util'

export const listByIdLoader = new DataLoader(async keys => {
  const results = await model.songList.getByIds(keys)
  const mergeResults = merge("listId", results)
  return keys.map(key => mergeResults[key] || new Error(`No result for ${key}`))
})
