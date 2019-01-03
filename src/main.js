import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import './registerServiceWorker'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFolderPlus, faSync } from '@fortawesome/free-solid-svg-icons'

library.add(faFolderPlus)
library.add(faSync)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('modal', { template: '#modal-template' })

Vue.config.productionTip = false

Vue.config.devtools = true
Vue.use(BootstrapVue)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
