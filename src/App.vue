<template>
  <div>
    <IsHeader ref="isHeader"></IsHeader>
    <router-view @modal-auth="openModalAuth"></router-view>
    <IsFooter></IsFooter>
  </div>
</template>

<script>
import "./assets/styles/dist/min/all.min.css";
import IsHeader from "./components/parts/IsHeader.vue";
import IsFooter from "./components/parts/IsFooter.vue";

export default {
  components: {
    IsHeader,
    IsFooter,
  },
  methods: {
    openModalAuth() {
      this.$refs["isHeader"].showModalLogin = true;
    },
  },
  watch: {
    $route() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>
