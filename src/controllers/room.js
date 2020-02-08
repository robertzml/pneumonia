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
  }
}
