<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary text-light mt-4" data-toggle="modal" @click="openCouponModal(true)">新增優惠券</button>
    </div>
    <table class="table mt-4 table-responsive-md table-hover">
      <thead class="thead-light">
        <th>優惠券名稱</th>
        <th>優惠券代碼</th>
        <th>到期日</th>
        <th>折扣百分比 (%)</th>
        <th>是否啟用</th>
        <th width="150">編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.code}}</td>
          <td>{{item.due_date}}</td>          
          <td>{{item.percent}}</td>          
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-secondary">不啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openCouponModal(false, item)">編輯</button>
            <button class="btn btn-outline-secondary btn-sm" @click="openDeleteModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :page-data="pagination" @render="getCoupons"></Pagination>
    <!-- Modal 新增-->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="couponModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="couponModalLabel">新增優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入優惠券名稱" v-model="tempCoupon.title">
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="percent">折扣 %</label>
                  <input type="number" class="form-control" id="percent" placeholder="請輸入折扣百分比" v-model="tempCoupon.percent">
                </div>
              </div>      
            </div>
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="due_date">到期日</label>
                  <input type="date" class="form-control" id="due_date" placeholder="到期日" v-model="tempCoupon.due_date">
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="code">優惠碼</label>
                  <input type="text" class="form-control" id="code" placeholder="請輸入折扣代碼" v-model="tempCoupon.code">
                </div>
              </div>      
            </div>
            <div class="form-group text-right">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="is_enabled"  v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal 刪除 -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券？（刪除後將無法恢復）
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import $ from "jquery";

export default {
  name: "Coupons",
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      pagination: {},
      isNew: false,
      isLoading: false
    };
  },
  methods: {
    getCoupons() {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupons`;
      const vm = this;

      this.isLoading = true;

      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
      });
    },
    openCouponModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }
      $("#couponModal").modal("show");
    },
    updateCoupon(page = 1) {
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon?page=${page}`;
      let httpMethod = "post";
      const vm = this;

      if (!this.isNew) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }

      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          console.log("新增失敗");
        }
      });
    },
    openDeleteModal(item) {
      this.tempCoupon = Object.assign({}, item);
      $("#delCouponModal").modal("show");
    },
    deleteCoupon() {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon/${this.tempCoupon.id}`;
      const vm = this;

      this.$http.delete(api).then(response => {
        if (response.data) {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
          console.log("刪除失敗");
        }
      });
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>
