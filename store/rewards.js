export const state = () => ({
  rewards: [],
  rewardsList: [],
  currentReward: {
    loyalty_program_id: 1,
    title: null,
    company_id: null,
    points_cost: null,
    name: null,
    description: null,
    photo_link: null,
    limit: null,
    limit_left: null,
    limit_per_customer: null
  },
  rewardImage: null,
  imageReward: null
})

export const getters = {
  getRewards: state => JSON.parse(JSON.stringify(state.rewards)),
  getRewardsList: state => JSON.parse(JSON.stringify(state.rewardsList)),
  getCurrentReward: state => JSON.parse(JSON.stringify(state.currentReward)),
  getRewardImage: state => state.rewardImage,
  getImageReward: state => JSON.parse(JSON.stringify(state.imageReward))
}

export const mutations = {
  SAVE_REWARDS (state, rewards) {
    state.rewards = rewards.data
  },
  SAVE_REWARDS_LIST (state, rewardsList) {
    state.rewardsList = rewardsList
  },
  SAVE_CURRENT_REWARD (state, currentReward) {
    state.currentReward = JSON.parse(JSON.stringify(currentReward))
  },
  CLEAR_CURRENT_REWARD (state) {
    state.currentReward = {
      loyalty_program_id: 1,
      title: null,
      company_id: null,
      points_cost: null,
      name: null,
      description: null,
      photo_link: null,
      limit: null,
      limit_left: null
    }
    state.rewardImage = null
    state.imageReward = null
  },
  SAVE_REWARD_UPLOAD_IMAGE (state, image) {
    state.rewardImage = image
  },
  SAVE_REWARD_IMAGE_UPLOAD (state, image) {
    state.imageReward = image
  }
}

export const actions = {
  async fetchRewardsList ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('/api/rewards?per_page=1000000', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('SAVE_REWARDS_LIST', data.data.data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchRewards ({ commit, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get('api/rewards', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'rewards-successfully-fetched', { root: true })
        await commit('SAVE_REWARDS', data.data)
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'rewards-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async createCurrentReward ({ dispatch, rootGetters, commit }, payload) {
    const currentReward = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null))
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.post('api/rewards', currentReward, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'reward-successfully-created', { root: true })
        await commit('SAVE_CURRENT_REWARD', data.data)
        await dispatch('uploadCurrentRewardPicture')
        await dispatch('fetchRewards', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'reward-not-created', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async updateCurrentReward ({ dispatch, getters, rootGetters, commit }, payload) {
    const currentReward = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null))
    try {
      const { data } = await this.$axios.put(`api/rewards/${currentReward.id}`, currentReward, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('SAVE_CURRENT_REWARD', data.data)
        if (getters.getRewardImage) {
          await dispatch('uploadCurrentRewardPicture')
        }
        await commit('dictionaries/SAVE_STATUS', 'reward-successfully-updated', { root: true })
        await dispatch('fetchRewards', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'reward-not-updated', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async uploadCurrentRewardPicture ({ commit, getters, rootGetters }) {
    try {
      await this.$axios.put(`api/rewards/upload-photo/${getters.getCurrentReward.id}`,
        getters.getRewardImage, {
          headers: {
            'Content-Type': 'image/png',
            Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
          }
        })
    } catch (e) {
      console.log('error', e)
    }
  },
  async removeCurrentReward ({ commit, dispatch, getters, rootGetters }, rewardId) {
    try {
      const { data } = await this.$axios.delete(`api/rewards/${rewardId}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'reward-successfully-deleted', { root: true })
        await dispatch('fetchRewards', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'reward-not-deleted', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async archiveCurrentReward ({ commit, dispatch, getters, rootGetters }, rewardId) {
    try {
      const { data } = await this.$axios.patch(`api/rewards/archive/${rewardId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'reward-successfully-archived', { root: true })
        await dispatch('fetchRewards', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'reward-not-archived', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async publishCurrentReward ({ commit, dispatch, getters, rootGetters }, rewardId) {
    try {
      const { data } = await this.$axios.put(`api/rewards/publish/${rewardId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'reward-successfully-published', { root: true })
        await dispatch('fetchRewards', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'reward-not-published', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }
}
