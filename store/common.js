export const state = () => ({
  theme: 'light',
})

export const mutations = {
  updateTheme(state, newTheme) {
    state.theme = newTheme
  },
}

export const getters = {
  getTheme(state) {
    return state.theme
  },
}
