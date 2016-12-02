import { db } from '../index'

export async function getAllUsers(roles) {
  return db.users.find({
    roles,
  })
}

