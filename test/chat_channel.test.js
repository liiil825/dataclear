import { URI } from '../db/uri'
import pmongo from 'promised-mongo'
import get from 'lodash/get'
import map from 'lodash/map'
import isArray from 'lodash/isArray'

import { getAllUsers } from '../db/users'
import { clearPaitentNoDoctor } from '../db/users/patient'

let needLog = false
if (process.env.NEDD_LOG === 'need') needLog = true

const db = pmongo(URI, ['chat_channel, users'])

async function getAssistant() {
  return db.users.findOne({
    roles: 'assistant'
  })
}

async function getChannel(userId, assistantId, $size = 2) {
  return db.chat_channel.find({
    $and: [{
      participant: {
        $all: [userId, assistantId],
      },
    }, {
      participant: {
        $size,
      },
    }],
  })
}

describe('check chat_channel',async () => {
  // it(`check had same channel in [patient, assistant]`, async function() {
  //   const assistant = await getAssistant()
  //   const error = []

  //   const users = await getAllUsers('patient')
  //   expect(users).to.not.be.empty
  //   expect(assistant).to.not.be.empty
  //   const promises = users.map(function(user){
  //     return getChannel(user._id, assistant._id)
  //   })
  //   const channels = await Promise.all(promises)
  //   channels.forEach((channel, index) => {
  //     if (channel.length !== 1) {
  //       error.push({
  //         channelIds: map(channel, '_id'),
  //         userId: users[index]._id,
  //       })
  //     }
  //   })

  //   if (needLog && error.length) console.log(error)
  //   expect(error.length).to.be.empty
  // })
  // it(`check had same channel in [doctor, assistant]`, async function() {
  //   const assistant = await getAssistant()
  //   const error = []

  //   const users = await getAllUsers('doctor')
  //   expect(users).to.not.be.empty
  //   expect(assistant).to.not.be.empty
  //   const promises = users.map(function(user){
  //     return getChannel(user._id, assistant._id)
  //   })
  //   const channels = await Promise.all(promises)
  //   channels.forEach((channel, index) => {
  //     if (channel.length !== 1) {
  //       error.push({
  //         channelIds: map(channel, '_id'),
  //         userId: users[index]._id,
  //       })
  //     }
  //   })
  //   if (needLog && error.length) console.log(error)
  //   expect(error.length).to.be.empty
  // })
  it(`check had same channel in [patient, doctor]`, async function() {
    const assistant = await getAssistant()
    const error = []

    const users = await getAllUsers('patient')
    expect(users).to.not.be.empty
    expect(assistant).to.not.be.empty
    const promises = users.map(function(user){
      const doctorList = get(user, 'profile.doctorList')
      if (doctorList) {
        const doctorId = Object.keys(doctorList)[0]
        return getChannel(user._id, doctorId, 3)
      } else {
        return new Promise(
          (resolve, reject) => { resolve([null, null, null, null])
        })
      }
    })
    const channels = await Promise.all(promises)
    channels.forEach((channel, index) => {
      if (channel.length !== 1) {
        error.push({
          channelIds: map(channel, '_id'),
          userId: users[index]._id,
        })
      }
    })
    if (needLog && error.length) console.log(error)
    expect(error.length).to.be.empty
  })

  // it(`check all channle user exist`, async function() {
  //   const channels = await db.chat_channel.find({})
  //   const users = await db.users.find({})
  //   const userIds = map(users, '_id')
  //   const error = []
  //   channels.forEach((channel, index) => {
  //     if (isArray(channel.participant)) {
  //       channel.participant.forEach(userId => {
  //         if (userIds.indexOf < 0) {
  //           error.push({
  //             error: 'user not exist',
  //             userId, channelId: channel._id,
  //           })
  //         }
  //       })
  //     } else {
  //       error.push({
  //         error: 'participant is not array',
  //         channelId: channel._id,
  //       })
  //     }
  //   })
  //   if (needLog && error.length) console.log(error)
  //   expect(error.length).to.be.empty
  // })
})

