const categories = {
  1: '艺考课程',
  2: '小学面试',
  3: '职场情商',
  4: '面试辅导',
}
const infocategories = {
  1:'教育资讯',
  2:'品牌资讯',
}
const state = {
  categories: categories,
  infocategories: infocategories,
}

const mutations = {
  // CHANGE_SETTING: (state, { key, value }) => {
  //   // eslint-disable-next-line no-prototype-builtins
  //   if (state.hasOwnProperty(key)) {
  //     state[key] = value
  //   }
  // }
}

const actions = {
  // changeSetting({ commit }, data) {
  //   commit('CHANGE_SETTING', data)
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

