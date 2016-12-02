import { getAllUsers } from './index'
import get from 'lodash/get'
import map from 'lodash/map'
import { db } from '../index'

const db = pmongo(URI, ['chat_channel, users'])

export async function clearPaitentNoDoctor() {
  const users = await getAllUsers('patient')
  const errorUserIds = []
  const promises = users.map(function(user){
    const doctorList = get(user, 'profile.doctorList')
    if (!doctorList) {
      errorUserIds.push(user._id)
    }
  })
  console.log({errorUserIds})
}
