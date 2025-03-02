import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { fmtSpecimenNumber } from './lib/string-format'
import { format, fromUnixTime } from 'date-fns'
// import localStorage from './lib/local-storage'


Vue.config.productionTip = false

Vue.filter('customerSpecimenStatus', function (val) {
  return val == 'Received' ? 'Received by Lab' : val
})
Vue.filter('specimenNumber', function (val) {
  return fmtSpecimenNumber(val)
})
Vue.filter('timestampToDate', function (val) {
  try {
    return format(fromUnixTime(val), 'MMMM dd yyyy')
  } catch (err) {
    console.log(err)
    return ''
  }
})
Vue.filter('timestampToDateTime', function (val) {
  try {
    return format(fromUnixTime(val), 'MMMM dd yyyy hh:mm')
  } catch (err) {
    console.log(err)
    return ''
  }
})

/**
 * setupAppDependencies
 *
 * Wait for web3 and smart contracts to load
 * this will set web3 and smart contracts to store
 */
/*
async function setupAppDependencies() {
  const DEFAULT_RPC_URL = 'http://34.101.116.238:8545'
  let rpcUrl = localStorage.getRpcUrl() || DEFAULT_RPC_URL
  await store.dispatch('ethereum/initWeb3', rpcUrl)
  store.dispatch('ethereum/contracts/initContracts')
  return
}
*/

async function setupAppDependencies() {
  const DEFAULT_RPC_URL = 'https://testnet.theapps.dev/rpc'
  //let rpcUrl = localStorage.getRpcUrl() || DEFAULT_RPC_URL
  await store.dispatch('metamask/initWeb3', DEFAULT_RPC_URL)
  store.dispatch('metamask/contracts/initContracts')
  return
}



setupAppDependencies()
  .then(() => {

    new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

  })