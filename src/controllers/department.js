import * as axios from '../plugins/axios'

export default {
  name: 'department',

  async list() {
    const res = await axios._get({ url: '/dep' })
    return res.data
  }
}
