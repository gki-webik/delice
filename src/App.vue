<template>
  <div>
    <IsHeader></IsHeader>
    <router-view></router-view>
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
};
</script>
