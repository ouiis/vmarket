<template>
  <div class="message-alert">
    <div class="alert alert-dismissible" :class="'alert-' + item.status" v-for="(item, index) in messages" :key="index">
      {{ item.message }}
      <button type="button" class="close" @click="removeMessage(index)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: "Alert",
  data() {
    return {
      messages: []
    };
  },
  methods: {
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({
        message,
        status,
        timestamp
      });
      this.removeMessageWithTiming(timestamp);
    },
    removeMessage(index) {
      this.messages.splice(index, 1);
    },
    removeMessageWithTiming(timestamp) {
      const vm = this;
      setTimeout(() => {
        vm.messages.forEach((item, index) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(index, 1);
          }
        });
      }, 5000);
    }
  },
  created() {
    const vm = this;

    vm.$bus.$on("alertMessage", (message, status = "warning") => {
      vm.updateMessage(message, status);
    });
  }
};
</script>


<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 20px;
  right: 20px;
  z-index: 1100;
}
</style>