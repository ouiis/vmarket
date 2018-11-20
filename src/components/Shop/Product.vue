<template>
  <div>
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-transparent pl-0">
          <li class="breadcrumb-item" aria-current="page"><router-link to="/">首頁</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">電影介紹</li>
        </ol>
      </nav>
    </div>
    <div class="container mb-5">
      <loading :active.sync="isLoading"></loading>
      <div class="row">
        <div class="col-md-6">
          <img class="w-100" :src="product.imageUrl" alt="">
        </div>
        <div class="col-md-6">
          <h1 class="h2">{{ product.title }}</h1>
          <hr>
          <div class="h5"><span class="badge badge-info">{{ product.category }}</span></div>
          <p class="h6 my-3">{{ product.description }}</p>
          <p class="mb-5">{{ product.content }}</p>
          <hr>
          <div class="d-flex justify-content-between" v-if="product.price">
            <div class="h5" v-if="!product.price">售價 {{ product.origin_price | currency }}</div>
            <del class="h6 text-muted" v-if="product.price">原價 {{ product.origin_price | currency }}</del>
            <div class="h5 text-success" v-if="product.price">特價 <b>{{ product.price | currency }}</b></div>
          </div>
          <div class="row mt-4">
            <div class="col-md-6">
              <select class="form-control" name="qty" v-model="quantity">
                <option value="" hidden>請選擇觀看期限</option>
                <option v-for="qty in 10" :value="qty" :key="qty">選購 {{ qty }} {{ product.unit }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <button class="btn btn-primary btn-block" @click="addtoCart(product.id, quantity)">
                <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === product.id"></i>加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Product",
  data() {
    return {
      product: {},
      quantity: "",
      productId: "",
      isLoading: false,
      status: {
        loadingItem: ""
      }
    };
  },
  methods: {
    getProduct() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${vm.productId}`;

      this.isLoading = true;

      this.$http.get(api).then(response => {
        // console.log(response.data);
        if (response.data.success === true) {
          vm.product = response.data.product;
          vm.isLoading = false;
        }
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = {
        product_id: id,
        qty
      };

      vm.status.loadingItem = id;

      this.$http.post(api, { data: cart }).then(response => {
        this.$bus.$emit("updateCart");
        vm.status.loadingItem = "";
      });
    }
  },
  created() {
    this.productId = this.$route.params.productId;
    this.getProduct();
  }
};
</script>
