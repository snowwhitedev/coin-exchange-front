export const state = () => ({
  data: {},
  list: [],
})

export const getters = {
  getSymbols(state) {
    return state.list
  },
  getSymbolData(state) {
    return state.data
  },
}

export const mutations = {
  updateData(state, v) {
    state.data = v
  },
  updateList(state, v) {
    state.list = v
  },
  updateBaseBalance(state, v) {
    state.data.BaseAssetBalance = v
  },
  updateQuatoBalance(state, v) {
    state.data.QuatoAssetBalance = v
  },
}

export const actions = {
  updateData(ctx, [base, quato]) {
    const data = ctx.state.list.find(
      (v) => v.BaseAsset === base && v.QuatoAsset === quato
    )
    ctx.commit('updateData', data)
  },
}
