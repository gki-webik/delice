<template>
  <main class="boxMainPromotions">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Акции</a>
      </nav>
      <p class="is-Montserrat" v-if="!items">Загрузка акций...</p>
      <p
        class="is-Montserrat"
        v-if="(items && items.length === 0) || items == 0"
      >
        Акций пока нет...
      </p>
      <div class="items" v-if="items && items != 0 && items.length > 0">
        <div class="item" v-for="(item, index) in items" :key="index">
          <img :src="item.image" alt="" />
          <div class="right">
            <div class="msg">{{ item.title }}</div>
            <div class="text" v-html="item.text.replaceAll('\n', '<br>')"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/promotions.min.css";
</style>

<script>
export default {
  data() {
    return {
      items: null,
    };
  },
  mounted() {
    this.fetchSalesProducts();
  },
  methods: {
    fetchSalesProducts() {
      fetch("https://delice-spb.ru/api/v1/getSales").then((response) => {
        return response.json().then((data) => {
          this.items = data.data;
        });
      });
    },
  },
};
</script>