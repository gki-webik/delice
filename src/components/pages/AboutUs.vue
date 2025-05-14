<template>
  <main class="boxMainDeliveryAndPayment">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">О Нас</a>
      </nav>
      <h1>О НАС</h1>
      <div v-if="items && items.length > 0">
        <div
          v-for="(item, index) in JSON.parse(items[0].texts)"
          :key="index"
          v-html="item"
        ></div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/aboutUs.min.css";
</style>

<script>
export default {
  data() {
    return {
      items: null,
    };
  },
  created() {
    this.fetchItems();
  },
  methods: {
    fetchItems() {
      fetch("https://ce95524.tw1.ru/api/v1/getAboutUs")
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            this.items = data.data;
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки блога:", error);
        });
    },
  },
};
</script>