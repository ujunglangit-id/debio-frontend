import localStorage from '../lib/local-storage'
import store from '@/store/index'

const globalFunctions = {
  hasStatusLogin() {
    const keystore = localStorage.getAddress()
    return !!keystore
  },
  async checkIsLoggedIn(to, from, next) {
    let api = store.getters['substrate/getAPI'];
    if (api == null) {
      await store.dispatch('substrate/connect');
    }

    let wallet = store.getters['substrate/wallet'];
    const keystore = localStorage.getAddress()
    const isLoggedIn = !!keystore;
    const address = localStorage.getAddress();
    if (to.path == '/login') {
      if (isLoggedIn) {
        if (wallet == null) {
          if (address != "") {
            await store.dispatch('substrate/getAkun', {
              address: address
            })
          }
        }
        next('/')
        return address;
      } else {
        next()
        return ""
      }
    } else {
      if (isLoggedIn) {
        if (wallet == null) {
          if (address != "") {
            await store.dispatch('substrate/getAkun', {
              address: address
            })
          }
        }
        next()
        return address;
      } else {
        next('/login')
        return ""
      }
    }
  },
}

export default globalFunctions
