<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary text-light" data-toggle="modal" @click="openProductModal(true)">新增商品</button>
    </div>
    <table class="table mt-4 table-responsive-md table-hover">
      <thead class="thead-light">
        <th width="120">類別</th>
        <th>名稱</th>
        <th width="100">原價</th>
        <th width="100">售價</th>
        <th width="100">是否啟用</th>
        <th width="120">編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            <span v-if="item.origin_price">{{ item.origin_price | currency }}</span>
            <span v-else></span>
          </td>
          <td class="text-right">
            <span v-if="item.price">{{ item.price | currency }}</span>
            <span v-else></span>
          </td>
          <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span class="text-secondary" v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openProductModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁 -->
    <pagination :pageData="pagination" @renderPage="getProducts"></pagination>
    <!-- Modal 新增 -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title" id="productModalLabel">
              <span v-if="isNew">新增產品</span>
              <span v-else>修改產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploading">
                </div>
                <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-row">
                    <label for="title">產品名稱</label>
                    <input type="text" class="form-control" id="title" placeholder="請輸入產品名稱" v-model="tempProduct.title">
                </div>             
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">類別</label>
                    <input type="text" class="form-control" id="category" placeholder="請輸入產品類別" v-model="tempProduct.category">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="unit">單位</label>
                    <input type="text" class="form-control" id="unit" placeholder="請輸入單位" v-model="tempProduct.unit">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" placeholder="請輸入售價" v-model="tempProduct.price">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled" v-model="tempProduct.is_enabled">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary text-light" @click="updateProduct">儲存</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal 刪除-->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteModalLabel">刪除產品</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body h6">
            是否確定刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品？（刪除後將無法恢復）
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" @click="deleteProduct">刪除</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import $ from "jquery";

export default {
  name: "Products",
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/products?page=${page}`;

      this.isLoading = true;

      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    },
    openProductModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      $("#productModal").modal("show");
    },
    updateProduct() {
      const vm = this;
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product`;
      let method = "post";

      if (!this.isNew) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/product/${vm.tempProduct.id}`;
        method = "put";
      }

      this.$http[method](api, { data: vm.tempProduct }).then(response => {
        if (response.data.success) {
          $("#productModal").modal("hide");
          this.$bus.$emit("alertMessage", response.data.message, "success");
          vm.getProducts();
        } else {
          $("#productModal").modal("hide");
          this.$bus.$emit("alertMessage", response.data.message, "danger");
          vm.getProducts();
        }
      });
    },
    uploading() {
      const vm = this;
      const file = this.$refs.files.files[0];
      const formData = new FormData();
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/upload`;

      formData.append("file-to-upload", file);
      this.status.fileUploading = true;

      this.$http
        .post(api, formData, {
          headers: {
            // 以表單格式傳送
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          vm.status.fileUploading = false;
          response.data.success
            ? vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl)
            : this.$bus.$emit("alertMessage", response.data.message, "danger");
        });
    },
    openDeleteModal(item) {
      this.tempProduct = Object.assign({}, item);
      $("#deleteModal").modal("show");
    },
    deleteProduct() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product/${vm.tempProduct.id}`;

      this.$http.delete(api).then(response => {
        if (response.data.success) {
          $("#deleteModal").modal("hide");
          this.$bus.$emit("alertMessage", response.data.message, "success");
          vm.getProducts();
        } else {
          $("#deleteModal").modal("hide");
          this.$bus.$emit("alertMessage", response.data.message, "danger");
          vm.getProducts();
        }
      });
    }
  },
  created() {
    this.getProducts();
  }
};
</script>
