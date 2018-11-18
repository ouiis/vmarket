import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import VeeValidate from 'vee-validate';
import zhTW_Validate from 'vee-validate/dist/locale/zh_TW'
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';


import App from './App';
import router from './router';
import './bus';
import Pagination from './components/Pagination';
import currency from './filters/currency';
import date from './filters/date';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', zhTW_Validate);

Vue.component('Loading', Loading);
Vue.component('Pagination', Pagination);
Vue.filter('currency', currency);
Vue.filter('date', date);

// 跨域登入，將 cookies 存入前端
axios.defaults.withCredentials = true;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 導航守衛
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;

    axios.post(api).then(response => {
      response.data.success ? next() : next({ path: '/login' })
    });
  } else {
    next();
  }
});