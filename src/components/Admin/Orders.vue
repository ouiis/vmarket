<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4 table-responsive-md table-hover">
      <thead class="thead-light">
        <th>訂購時間</th>
        <th>Email</th>
        <th>商品名稱</th>
        <th>觀看次數</th>
        <th>訂單金額</th>
        <th>付款狀態</th>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id" v-if="item.user">
          <td>{{ item.create_at | date }}</td>
          <td>{{ item.user.email }}</td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(products, id) in item.products" :key="id">
                {{ products.product.title }}
              </li>
            </ul>
          </td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, id) in item.products" :key="id">
                {{ product.product.num }} {{product.product.unit}}
              </li>
            </ul>
          </td>
          <td>{{ item.total | currency}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else class="text-secondary">尚未付款</span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁 -->
    <pagination :pageData="pagination" @renderPage="getOrders"></pagination>

  </div>
</template>


<script>
import $ from "jquery";

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      pagination: {},
      isLoading: false
    };
  },
  methods: {
    getOrders(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/orders?page=${page}`;

      this.isLoading = true;

      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    }
  },
  created() {
    this.getOrders();
  }
};
</script>