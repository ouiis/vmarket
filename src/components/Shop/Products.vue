<template>
  <div>
    <Slide/>
    <div class="container main-content mb-5">
      <div class="row">
        <div class="col-lg-3">
          <!-- 左側選單 (List group) -->
          <div class="list-group sticky-top">
            <a class="list-group-item list-group-item-action active" data-toggle="list" href="#list-gold">
              <i class="fas fa-space-shuttle fa-lg mr-2"></i> 復仇者</a>
            <a class="list-group-item list-group-item-action" data-toggle="list" href="#list-gift">
              <i class="fas fa-users fa-lg mr-2"></i> 復仇者聯盟</a>
            <a class="list-group-item list-group-item-action">
              <i class="far fa-gem fa-lg mr-2"></i> 無限寶石
            </a>
          </div>
        </div>
        <!-- 主內容 -->
        <div class="col-lg-9">
          <div class="d-flex mb-4">
            <!-- Search bar -->
            <form class="form-inline my-3 my-lg-0">
              <div class="input-group">
                <input class="form-control" type="text" placeholder="搜尋電影" aria-label="Search" v-model="filter">
                <div class="input-group-append">
                  <button class="btn btn-outline-warning" type="submit" disabled>
                    <i class="fa fa-search" aria-hidden="true"></i> Search</button>
                </div>
              </div>
            </form>
          </div>

          <!-- Card 1 -->
          <div class="tab-content">
            <loading :active.sync="isLoading"></loading>
            <div class="tab-pane active" id="list-gold">
              <div class="row">
                <div class="col-lg-4 mb-4" v-for="item in avenger" :key="item.id">
                  <div class="card border-0 text-center h-100 box-shadow">
                    <div style="height: 350px; background-size: cover; background-position: center"
                      :style="{backgroundImage: `url(${item.imageUrl})`}"></div>
                    <div class="card-body">
                      <div class="text-right"><span class="badge badge-secondary">{{ item.category }}</span></div>
                      <h4 class="card-title text-left">{{ item.title }}</h4>
                      <p class="card-text text-left">{{ item.description }}</p>
                    </div>
                    <div class="card-footer border-top-0 bg-white">
                      <div class="d-flex justify-content-between align-items-baseline mb-3">
                        <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
                        <del class="h6 text-muted" v-if="item.price">原價 {{item.origin_price}} 元</del>
                        <div class="h5" v-if="item.price">特價 {{item.price}} 元</div>
                      </div>
                      <button type="button" class="btn btn-primary btn-sm" @click="checkDetail(item.id)">
                        電影介紹
                      </button>
                      <button type="button" class="btn btn-info btn-sm ml-auto" @click="addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Card 2 -->
            <div class="tab-pane" id="list-gift">
              <div class="row align-items-stretch">
                <div class="col-lg-4 mb-4" v-for="item in avengers" :key="item.id">
                  <div class="card border-0 text-center h-100 box-shadow">
                    <div style="height: 350px; background-size: cover; background-position: center"
                      :style="{backgroundImage: `url(${item.imageUrl})`}"></div>
                    <div class="card-body">
                      <div class="text-right"><span class="badge badge-secondary">{{ item.category }}</span></div>
                      <h4 class="card-title text-left">{{ item.title }}</h4>
                      <p class="card-text text-left">{{ item.description }}</p>
                    </div>
                    <div class="card-footer border-top-0 bg-white">
                      <div class="d-flex justify-content-between align-items-baseline mb-3">
                        <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
                        <del class="h6 text-muted" v-if="item.price">原價 {{item.origin_price}} 元</del>
                        <div class="h5" v-if="item.price">特價 {{item.price}} 元</div>
                      </div>
                      <button type="button" class="btn btn-primary btn-sm" @click="checkDetail(item.id)">電影介紹</button>
                      <button type="button" class="btn btn-info btn-sm ml-auto" @click="addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i> 加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 分頁 -->
            <pagination :pageData="pagination" @renderPage="getProducts"></pagination>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from "jquery";
import Slide from "./Slide";

export default {
  name: "Products",
  components: {
    Slide
  },
  data() {
    return {
      products: [],
      pagination: {},
      isLoading: false,
      status: {
        loadingItem: ""
      },
      filter: "",
      category: ""
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products?page=${page}`;

      this.isLoading = true;

      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    },
    checkDetail(id) {
      this.$router.push(`/product/${id}`);
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
  computed: {
    avenger() {
      const vm = this;
      let newAry = [];

      if (!this.filter) {
        newAry = this.products.filter(item => {
          return item.title !== "復仇者聯盟";
        });
      } else {
        newAry = this.products.filter(item => {
          return item.title.match(vm.filter);
        });
      }

      return newAry;
    },
    avengers() {
      const vm = this;
      let newAry = [];

      return (newAry = this.products.filter(item => {
        return item.title === "復仇者聯盟";
      }));
    }
  },
  created() {
    this.getProducts();
  }
};
</script>