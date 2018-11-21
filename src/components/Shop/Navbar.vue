<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <nav class="navbar navbar-expand-lg bg-primary">
      <div class="container">
        <router-link class="navbar-brand font-weight-bold text-custom" to="/">
          <i class="fas fa-film fa-lg mr-2"></i> V-MARKET
        </router-link>
        <!-- Navbar Link -->
        <div class="dropdown ml-auto mr-3">
          <button class="btn btn-cart text-custom bg-transparent" data-toggle="dropdown" data-flip="false">
            <i class="fas fa-shopping-cart fa-lg"></i>
            <span class="badge badge-pill badge-danger" v-if="carts.carts">{{ carts.carts.length }}</span>
          </button>
          <div class="dropdown-menu  dropdown-menu-right p-3 dropdown-cart" style="min-width: 300px" data-offset="400">
              <h6 class="text-center">購物車商品</h6>
              <table class="table table-sm">
                <tbody>
                  <tr v-for="item in carts.carts" :key="item.id">
                    <td><a href="" @click.prevent="removeCartItem(item.id)"><i class="far fa-trash-alt"></i></a></td>
                    <td>{{ item.product.title }}</td>
                    <td width="50" class="text-right">{{ item.qty }} {{ item.product.unit }}</td>
                    <td class="text-right">{{ item.total | currency }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-right">總金額</td>
                    <td class="text-right">{{ carts.final_total | currency }}</td>
                  </tr>
                </tfoot>
              </table>
              <button class="btn btn-primary btn-block mt-3" @click="gotoCart">前往結帳</button>
            </div>
        </div>
        <router-link class="text-custom" to="/admin/products">
          <i class="fas fa-user fa-lg"></i>
        </router-link>
      </div>
    </nav>

  </div>
</template>


<script>
export default {
  name: "Navbar",
  data() {
    return {
      carts: [],
      isLoading: false
    };
  },
  methods: {
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;

      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.carts = response.data.data;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;

      this.isLoading = true;

      this.$http.delete(api).then(response => {
        vm.getCart();
        vm.isLoading = false;
      });
    },
    gotoCart() {
      this.$router.push("/cart");
    }
  },
  created() {
    const vm = this;

    this.getCart();
    this.$bus.$on("updateCart", () => {
      vm.getCart();
    });
  }
};
</script>
