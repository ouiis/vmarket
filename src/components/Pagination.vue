<template>
  <div>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pageData.has_pre}">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="goPage(pageData.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pageData.total_pages" :key="page" :class="{'active': page === pageData.current_page}">
          <a class="page-link" href="#" @click.prevent="goPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !pageData.has_next}">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="goPage(pageData.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>


<script>
export default {
  name: "Pagination",
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  methods: {
    goPage(page) {
      this.$emit("renderPage", page);
    }
  }
};
</script>
