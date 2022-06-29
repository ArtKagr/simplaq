export const state = () => ({
  activeNewsMenuItem: 'all_posts',
  menuList: [],
  newsMenu: [
    { title: 'All posts', flag: 'all_posts', counter: null },
    { title: 'Drafts', flag: 'drafts', counter: null },
    // { title: 'Pending approval', flag: 'pending_approval', counter: null },
    // { title: 'Rejected', flag: 'rejected', counter: null },
    { title: 'Scheduled', flag: 'scheduled', counter: null },
    { title: 'Published', flag: 'published', counter: null },
    { title: 'Archived', flag: 'archived', counter: null }
  ],
  newsList: [],
  currentPost: {
    id: null,
    status: null,
    title: null,
    article: null,
    news_attachments: [],
    title_picture: null,
    publish_at: null,
    company_id: null
  },
  currentPostSideBarMode: 'view',
  imageTitle: null,
  titleImage: null
})

export const getters = {
  getCurrentPostSidebarMode: state => state.currentPostSideBarMode,
  getActiveNewsMenuItem: state => state.activeNewsMenuItem,
  getCurrentNewsType (state, getters) {
    if (getters.getActiveNewsMenuItem === 'all_posts') {
      return null
    } else if (getters.getActiveNewsMenuItem === 'drafts') {
      return '0'
    } else if (getters.getActiveNewsMenuItem === 'scheduled') {
      return '4'
    } else if (getters.getActiveNewsMenuItem === 'published') {
      return '5'
    } else if (getters.getActiveNewsMenuItem === 'archived') {
      return '6'
    } else {
      return null
    }
  },
  getNewsMenu (state, getters) {
    const newsMenu = JSON.parse(JSON.stringify(state.newsMenu))
    return newsMenu.map(function (menuItem) {
      if (menuItem.flag === 'all_posts') {
        menuItem.counter = getters.getMenuList.length
      } else if (menuItem.flag === 'drafts') {
        menuItem.counter = getters.getMenuList.filter(item => item === 0).length
      } else if (menuItem.flag === 'scheduled') {
        menuItem.counter = getters.getMenuList.filter(item => item === 4).length
      } else if (menuItem.flag === 'published') {
        menuItem.counter = getters.getMenuList.filter(item => item === 5).length
      } else if (menuItem.flag === 'archived') {
        menuItem.counter = getters.getMenuList.filter(item => item === 6).length
      }
      return menuItem
    })
  },
  getMenuList: state => JSON.parse(JSON.stringify(state.menuList)),
  getNewsList: state => JSON.parse(JSON.stringify(state.newsList)),
  getCurrentPost: state => JSON.parse(JSON.stringify(state.currentPost)),
  getImageTitle: state => state.imageTitle,
  getTitleImage: state => state.titleImage
}

export const mutations = {
  SET_ACTIVE_NEWS_MENU_ITEM (state, item) {
    state.activeNewsMenuItem = item
  },
  SAVE_CURRENT_POST (state, currentPost) {
    state.currentPost = JSON.parse(JSON.stringify(currentPost))
  },
  SAVE_NEWS_LIST (state, newsList) {
    state.newsList = newsList
  },
  SAVE_MENU_LIST (state, menuList) {
    state.menuList = menuList
  },
  UPDATE_CURRENT_POST (state, payload) {
    state.currentPost[payload.field] = payload.value
  },
  UPDATE_CURRENT_POST_SIDEBAR_MODE (state, mode) {
    state.currentPostSideBarMode = mode
  },
  CLEAR_CURRENT_POST (state) {
    state.currentPost = {
      id: null,
      status: null,
      title: null,
      article: null,
      news_attachments: [],
      title_picture: null,
      publish_at: null,
      company_id: null
    }
    state.imageTitle = null
    state.titleImage = null
  },
  SAVE_NEWS_IMAGE_TITLE (state, imageTitle) {
    state.imageTitle = imageTitle
  },
  SAVE_NEWS_TITLE_IMAGE (state, titleImage) {
    state.titleImage = titleImage
  },
  CLEAR_NEWS_IMAGES (state) {
    state.imageTitle = null
    state.titleImage = null
  }
}

export const actions = {
  async fetchMenuList ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('api/news?per_page=1000000', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      await commit('SAVE_MENU_LIST', data.data.data.map(item => item.status))
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchNews ({ dispatch, commit, getters, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get(`api/news/status${getters.getCurrentNewsType ? ('/' + getters.getCurrentNewsType) : ''}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'news-successfully-fetched', { root: true })
        await commit('SAVE_NEWS_LIST', data.data.data)
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
        await dispatch('fetchMenuList')
      } else {
        await commit('dictionaries/SAVE_STATUS', 'news-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async createPost ({ dispatch, getters, rootGetters, commit }) {
    const post = Object.fromEntries(Object.entries(getters.getCurrentPost).filter(([_, v]) => v != null))
    post.title_picture = null
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.post('api/news', post, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await dispatch('uploadPostTitlePicture', data.data.id)
        await commit('dictionaries/SAVE_STATUS', 'post-successfully-created', { root: true })
        await commit('SAVE_CURRENT_POST', data.data)
        await dispatch('fetchMenuList')
        await dispatch('fetchNews', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'post-not-created', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async updatePost ({ dispatch, getters, rootGetters, commit }, postId) {
    const attachments = JSON.parse(JSON.stringify({
      title_picture: getters.getCurrentPost.title_picture,
      news_attachments: getters.getCurrentPost.news_attachments
    }))
    const post = JSON.parse(JSON.stringify({
      title: getters.getCurrentPost.title,
      article: getters.getCurrentPost.article,
      publish_at: getters.getCurrentPost.publish_at,
      status: getters.getCurrentPost.status,
      company_id: getters.getCurrentPost.company_id
    }))
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.put(`api/news/${postId || getters.getCurrentPost.id}`, post, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        if (getters.getImageTitle) {
          await dispatch('uploadPostTitlePicture', getters.getCurrentPost.id)
        }
        await commit('dictionaries/SAVE_STATUS', 'post-successfully-updated', { root: true })
        const updatedPost = JSON.parse(JSON.stringify(data.data))
        updatedPost.title_picture = attachments.title_picture
        updatedPost.news_attachments = attachments.news_attachments
        await commit('SAVE_CURRENT_POST', updatedPost)
        await dispatch('fetchMenuList')
        await dispatch('fetchNews', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'post-not-updated', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async uploadPostTitlePicture ({ commit, getters, rootGetters }, postId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.put(`api/news/upload-title-pic/${postId || getters.getCurrentPost.id}`,
        getters.getImageTitle, {
          headers: {
            'Content-Type': 'image/png',
            Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
          }
        })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'post-title-picture-successfully-uploaded', { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'post-title-picture-not-uploaded', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async removePost ({ commit, dispatch, getters, rootGetters }, postId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.delete(`api/news/${postId || getters.getCurrentPost.id}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'post-successfully-deleted', { root: true })
        await dispatch('fetchMenuList')
        await dispatch('fetchNews', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'post-not-deleted', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async archivePost ({ commit, dispatch, getters, rootGetters }, postId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.put(`api/news/${postId}`, { status: '6' }, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'post-successfully-archived', { root: true })
        await dispatch('fetchMenuList')
        await dispatch('fetchNews', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'post-not-archived', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async publishPostImmediately ({ commit, dispatch, getters, rootGetters }, payload) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.put(`api/news/publish-force/${payload.postId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'post-successfully-updated', { root: true })
        dispatch('fetchMenuList')
        await dispatch('fetchNews', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'post-not-published', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }
  // async addPostFiles ({ commit, dispatch, getters, rootGetters }, payload) {
  //   let file = null
  //   if (payload.file && payload.file.length === 1) {
  //     file = payload.file[0]
  //   } else if (payload.file && payload.file.length > 1) {
  //     file = payload.file[payload.file.length - 1]
  //   }
  //   await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
  //   try {
  //     const { data } = await this.$axios.post(`api/news-attach/${getters.getStoredPostId || getters.getCurrentPost.id}/${payload.type === 'image' ? 1 : 3}`,
  //       file, {
  //         headers: {
  //           Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
  //         }
  //       })
  //     if (data.status === 'success') {
  //       await commit('dictionaries/SAVE_STATUS', 'post-files-successfully-added', { root: true })
  //       if (getters.getStoredPostId) {
  //         commit('SAVE_STORED_POST_ATTACHMENT', data.data)
  //       }
  //       await dispatch('fetchNews', {
  //         page: rootGetters['dictionaries/getPagination'].current_page,
  //         perPage: rootGetters['dictionaries/getPagination'].per_page
  //       })
  //     } else {
  //       await commit('dictionaries/SAVE_STATUS', 'post-files-not-added', { root: true })
  //       if (data.httpCode === 401) {
  //         await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // },
  // async fetchCurrentPost ({ commit, getters, rootGetters }) {
  //   await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
  //   try {
  //     const { data } = await this.$axios.get(`api/news/${getters.getCurrentPost.id}`, {
  //       headers: {
  //         Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
  //       }
  //     })
  //     if (data.status === 'success') {
  //       await commit('dictionaries/SAVE_STATUS', 'current-post-successfully-fetched', { root: true })
  //       await commit('SAVE_CURRENT_POST', data.data)
  //     } else {
  //       await commit('dictionaries/SAVE_STATUS', 'current-post-not-fetched', { root: true })
  //       if (data.httpCode === 401) {
  //         await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // },
  // async deleteNewsAttachment ({ commit, dispatch, getters, rootGetters }, attachmentId) {
  //   await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
  //   try {
  //     const { data } = await this.$axios.delete(`api/news-attach/${attachmentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
  //       }
  //     })
  //     if (data.status === 'success') {
  //       await commit('dictionaries/SAVE_STATUS', 'news-attachment-successfully-deleted', { root: true })
  //       await dispatch('fetchNews', {
  //         page: rootGetters['dictionaries/getPagination'].current_page,
  //         perPage: rootGetters['dictionaries/getPagination'].per_page
  //       })
  //     } else {
  //       await commit('dictionaries/SAVE_STATUS', 'news-attachment-not-deleted', { root: true })
  //       if (data.httpCode === 401) {
  //         await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // },
  // async updateCurrentPost ({ dispatch, getters, rootGetters, commit }) {
  //   const attachments = JSON.parse(JSON.stringify({
  //     title_picture: getters.getCurrentPost.title_picture,
  //     news_attachments: getters.getCurrentPost.news_attachments
  //   }))
  //   const post = JSON.parse(JSON.stringify({
  //     title: getters.getCurrentPost.title,
  //     article: getters.getCurrentPost.article,
  //     publish_at: getters.getCurrentPost.publish_at,
  //     status: getters.getCurrentPost.status,
  //     company_id: getters.getCurrentPost.company_id
  //   }))
  //   await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
  //   try {
  //     const { data } = await this.$axios.put(`api/news/${getters.getCurrentPost.id}`, post, {
  //       headers: {
  //         Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
  //       }
  //     })
  //     if (data.status === 'success') {
  //       await commit('dictionaries/SAVE_STATUS', 'current-post-successfully-updated', { root: true })
  //       const updatedPost = JSON.parse(JSON.stringify(data.data))
  //       updatedPost.title_picture = attachments.title_picture
  //       updatedPost.news_attachments = attachments.news_attachments
  //       await commit('SAVE_CURRENT_POST', updatedPost)
  //       await dispatch('fetchMenuList')
  //       await dispatch('fetchNews', {
  //         page: rootGetters['dictionaries/getPagination'].current_page,
  //         perPage: rootGetters['dictionaries/getPagination'].per_page
  //       })
  //     } else {
  //       await commit('dictionaries/SAVE_STATUS', 'post-not-updated', { root: true })
  //       if (data.httpCode === 401) {
  //         await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // },
  // async updatePostStatus ({ dispatch, getters, rootGetters, commit }, payload) {
  //   const changedPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null))
  //   await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
  //   try {
  //     const { data } = await this.$axios.patch(`api/news/change-status/${changedPayload.postId || getters.getStoredPostId}`, {
  //       status: changedPayload.status === 0 ? 0 : changedPayload.status || getters.getStoredPost.status,
  //       publish_at: changedPayload.publish_at || getters.getStoredPost.publish_at
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
  //       }
  //     })
  //     if (data.status === 'success') {
  //       await commit('dictionaries/SAVE_STATUS', `post-status-changed${changedPayload.status ? `-to-${changedPayload.status}` : ''}`, { root: true })
  //       await commit('SAVE_STORED_POST', data.data)
  //       await dispatch('fetchMenuList')
  //       await dispatch('fetchNews', {
  //         page: rootGetters['dictionaries/getPagination'].current_page,
  //         perPage: rootGetters['dictionaries/getPagination'].per_page
  //       })
  //     } else {
  //       await commit('dictionaries/SAVE_STATUS', 'post-status-not-updated', { root: true })
  //       if (data.httpCode === 401) {
  //         await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // },
  // async uploadPostTitlePicture ({ commit, getters, rootGetters }, image) {
  //   await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
  //   try {
  //     const { data } = await this.$axios.put(`api/news/upload-title-pic/${getters.getStoredPostId}`,
  //       image, {
  //         headers: {
  //           'Content-Type': 'image/png',
  //           Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
  //         }
  //       })
  //     if (data.status === 'success') {
  //       await commit('dictionaries/SAVE_STATUS', 'post-title-picture-successfully-uploaded', { root: true })
  //       await commit('SAVE_STORED_POST_TITLE_PICTURE', data.data.title_picture)
  //     } else {
  //       await commit('dictionaries/SAVE_STATUS', 'post-title-picture-not-uploaded', { root: true })
  //       if (data.httpCode === 401) {
  //         await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error', e)
  //   }
  // },
}
