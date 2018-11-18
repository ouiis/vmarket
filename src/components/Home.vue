<template>
  <div>
    <Navbar/>
      <router-view/>
    <Footer/>
  </div>
</template>

<script>
import Navbar from "./Shop/Navbar";
import Products from "./Shop/Products";
import Footer from "./Shop/Footer";

export default {
  name: "Home",
  components: {
    Products,
    Navbar,
    Footer
  }
};
</script>
