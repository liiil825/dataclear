import { URI } from './uri'
import pmongo from 'promised-mongo'

export const db = pmongo(URI, ['chat_channel, users'])
