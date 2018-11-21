import Vue from 'vue';

Vue.prototype.$bus = new Vue();

// Alert
// vm.$bus.$emit('alertMessage', message, status);
// message(String): 訊息內容
// status(String): Alert 的樣式

// Navbar Cart
// this.$bus.$emit("updateCart");