<template>
<div>
  <div class="container">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-transparent pl-0">
          <li class="breadcrumb-item" aria-current="page"><router-link to="/">首頁</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">購物車</li>
        </ol>
      </nav>
  </div>
  <div class="container">
    <loading :active.sync="isLoading"></loading>
    <div class="row justify-content-center mb-5">
      <div class="col-md-8">
        <!-- 購物車 -->
        <div class="card">
          <div class="card-header d-flex align-items-center" id="headingOne">
              <a data-toggle="collapse" href="#collapseOne">
                顯示購物車細節  <i class="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <span class="h3 ml-auto mb-0" v-if="cart.total">{{ cart.total | currency }}</span>
          </div>
        </div>
        <div id="collapseOne" class="collapse mt-3">
          <table class="table table-sm">
            <thead>
              <tr>
                <th width="30"></th>
                <th width="100"></th>
                <th>電影名稱</th>
                <th width="50">期限</th>
                <th width="30" class="text-right">小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle text-center">
                  <a href="#removeModal" class="text-muted" @click.prevent="removeCartItem(item.id)">
                    <i class="far fa-trash-alt"></i>
                  </a>
                </td>
                <td class="align-middle">
                  <img :src="item.product.imageUrl" class="img-fluid img-thumbnail" alt="">
                </td>
                <td class="align-middle">
                  {{ item.product.title }}
                  <p class="text-success" v-if="item.coupon">已套用優惠券</p>
                </td>
                <td class="align-middle">{{ item.qty }} {{ item.product.unit }}</td>
                <td class="align-middle text-right">
                  <span class="text-success" v-if="item.coupon"> {{ item.final_total | currency }}</span>
                  <span v-else>{{ item.total | currency }}</span>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td class="align-middle text-right " colspan="4">合計</td>
                <td class="align-middle text-right h4">
                  <strong>{{ cart.total | currency }}</strong>
                </td>
              </tr>
              <tr v-if="cart.total !== cart.final_total">
                <td class="align-middle text-right" colspan="4">折扣價</td>
                <td class="align-middle text-right h4 text-success">
                  <strong>{{ cart.final_total | currency }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 優惠券 -->
          <div class="row justify-content-end">
            <div class="col-md-6">
              <div class="input-group mb-3 input-group-sm">
                <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="couponCode">
                <div class="input-group-append">
                  <button class="btn btn-info" type="button" @click="useCoupon">套用優惠碼</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 結帳表單 -->
        <h5 class="py-3 mt-5 mb-2 text-center bg-light">訂購人資訊</h5>
        <form @submit.prevent="creatOrder">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="username">姓名</label>
              <input type="text" class="form-control" id="username" placeholder="姓名" v-model="form.user.name" required>
              <div class="invalid-feedback">請輸入姓名</div>
            </div>
            <div class="form-group col-md-6">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" placeholder="Email" v-model="form.user.email" required>
              <div class="invalid-feedback">請輸入正確的 Email</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="tel">電話</label>
              <input type="tel" class="form-control" id="tel" name="tel" maxlength="10" :class="{'is-invalid': errors.has('tel')}" placeholder="聯絡電話" v-model="form.user.tel" v-validate="{ required: true, regex: /^09[0-9]{8}$/ }">
              <span class="text-danger" v-if="errors.has('tel')">請輸入正確的電話號碼</span>
            </div>
            <div class="form-group col-md-8">
              <label for="inputAddress">地址</label>
              <input type="text" class="form-control" id="inputAddress" placeholder="請輸入帳單地址" v-model="form.user.address">
              <div class="invalid-feedback">請輸入帳單地址</div>
            </div>
          </div>
          <div class="form-group">
            <label for="useraddress">備註</label>
            <textarea name="" id="" class="form-control" rows="3" v-model="form.message" required></textarea>
          </div>
          <div class="text-right">
            <router-link class="btn btn-secondary" to="/">繼續選購</router-link>
            <button class="btn btn-primary">確認訂單</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
</div>
</template>


<script>
export default {
  name: "Cart",
  data() {
    return {
      cart: [],
      couponCode: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      isLoading: false
    };
  },
  methods: {
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;

      this.isLoading = true;

      this.$http.get(api).then(response => {
        vm.cart = response.data.data;
        vm.isLoading = false;
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
        this.$bus.$emit("updateCart");
        vm.isLoading = false;
      });
    },
    useCoupon() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const vm = this;
      const coupon = {
        code: vm.couponCode
      };

      vm.isLoading = true;

      this.$http.post(api, { data: coupon }).then(response => {
        // console.log(response);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    creatOrder() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const vm = this;
      const order = vm.form;

      this.$validator.validate().then(result => {
        if (result) {
          this.$http.post(api, { data: order }).then(response => {
            if (response.data.success) {
              vm.$router.push(`checkout/${response.data.orderId}`);
              vm.$bus.$emit("updateCart");
            }
          });
        } else {
          this.$bus.$emit("alertMessage", response.data.message, "danger");
        }
      });
    }
  },
  created() {
    this.getCart();
  }
};
</script>