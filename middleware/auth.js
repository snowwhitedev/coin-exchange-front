export default function ({ $cookies, store, route, redirect }) {
  const token = $cookies.get('Token')
  if (!!token) {
    store.commit('auth/setLoggedIn', true)
  } else {
    store.commit('auth/setLoggedIn', false)
    if (!route.path.includes('/trade/')) {
      redirect('/login')
    }
  }
}
