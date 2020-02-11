import DataLoader from 'dataloader'
import { modelInstance as model, user_database_to_graphql } from '../models/index'
import { merge } from './util'

export const songsByListIdLoader = new DataLoader(async keys => {
  const results = await model.song.getSongsByListIds(keys)
  return keys.map(key => results[key] || new Error(`No result for ${key}`))
})

const userByFacebookIdLoader = new DataLoader(async keys => {

})

