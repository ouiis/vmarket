<template>
  <div>
    <nav class="navbar fixed-top bg-primary flex-md-nowrap p-0 shadow">

      <router-link class="navbar-brand col-sm-3 col-md-2 mr-0 text-custom font-weight-bold" to="/">返回商店</router-link>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link text-custom" href="#" @click.prevent="logout"><i class="fas fa-user mr-1"></i> 登出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>


<script>
export default {
  name: "Navbar",
  methods: {
    logout() {
      const vm = this;
      const api = `${process.env.APIPATH}/logout`;

      this.$http.post(api).then(response => {
        // console.log(response.data);
        response.data.success ? vm.$router.push("/") : false;
      });
    }
  }
};
</script>
