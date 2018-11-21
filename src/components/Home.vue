<template>
  <div>
    <Navbar/>
    <Alert/>
      <router-view/>
    <Footer/>
  </div>
</template>

<script>
import Navbar from "./Shop/Navbar";
import Products from "./Shop/Products";
import Footer from "./Shop/Footer";
import Alert from "./AlertMessage";

export default {
  name: "Home",
  components: {
    Products,
    Navbar,
    Footer,
    Alert
  }
};
</script>
