import * as axios from '../plugins/axios'

export default {
  name: 'room',

  async list() {
    const res = await axios._get({ url: '/all' })
    return res.data
  },

  async get(id) {
    const res = await axios._get({ url: '/room', params: { id: id } })
    return res.data[0]
  },

  async update(entity) {
    const res = await axios._post({ url: '/update', data: entity })
    return res.data
  },

  async insertRecord(entity) {
    const res = await axios._post({ url: '/insertRecord', data: entity })
    return res.data
  },

  async loadRecords() {
    const res = await axios._get({ url: '/records' })
    return res.data
  },

  async insertRelation(entity) {
    const res = await axios._post({ url: '/insertRelation', data: entity })
    return res.data
  },

  async updateRelation(entity) {
    const res = await axios._post({ url: '/updateRelation', data: entity })
    return res.data
  },

  async loadRelations() {
    const res = await axios._get({ url: '/relations' })
    return res.data
  },

  async getRelation(id) {
    const res = await axios._get({ url: '/getRelation', params: { id: id } })
    return res.data[0]
  }
}
