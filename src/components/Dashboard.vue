<template>
  <div>
    <Navbar/>
    <Alert/>
    <div class="container-fluid">
      <div class="row">
        <Sidebar/>
        <main role="main" class="col-9 ml-auto mr-5">
          <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>


<script>
import Navbar from "./Admin/Navbar";
import Sidebar from "./Admin/Sidebar";
import Alert from "./AlertMessage";

export default {
  name: "Dashboard",
  components: {
    Navbar,
    Sidebar,
    Alert
  },
  data() {
    return {};
  }
};
</script>
