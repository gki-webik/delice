<template>
  <div class="boxHeader">
    <div class="topLine">• tu le mérites •</div>
    <header>
      <h1>DÉLICE</h1>
      <div class="mainContent" :class="{ 'is-active': mainContentActive }">
        <div class="center">
          <input type="search" placeholder="" />
          <select v-model="selectedOption" class="search-select">
            <option value="">Все категории</option>
            <option
              v-for="option in options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <button type="button">
            <img src="/media/images/search__logo.svg" alt="" />
          </button>
        </div>
        <div class="right">
          <div class="icons">
            <img src="/media/images/account__logo.svg" alt="" />
            <img src="/media/images/heart__logo.svg" alt="" />
            <img src="/media/images/cart__logo.svg" alt="" />
          </div>
          <div class="data">
            <div><span>Всего заказов:</span> <span>1 шт</span></div>
            <div><span>Сумма: </span><span>5000 ₽</span></div>
          </div>
        </div>
      </div>
      <div
        class="toggleBarMenu"
        @click="mainContentActive = !mainContentActive"
      >
        <span></span>
      </div>
    </header>
    <div class="menu">
      <div class="box">
        <div class="left">
          <span class="burger"></span>
          <a href="">ВСЕ КАТЕГОРИИ</a>
        </div>
        <div class="center">
          <nav>
            <a href="">ДОСТАВКА И ОПЛАТА</a>
            <a href="">БЛОГ</a>
            <a href="">О НАС</a>
            <a href="">КОНТАКТЫ</a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/styles/parts/dist/min/header.min.css";
</style>

<script>
export default {
  data() {
    return {
      mainContentActive: false,
      searchQuery: "",
      selectedOption: "",
      options: [
        { value: "category1", label: "Категория 1" },
        { value: "category2", label: "Категория 2" },
        { value: "category3", label: "Категория 3" },
      ],
    };
  },
  methods: {
    performSearch() {
      console.log("Поиск:", {
        query: this.searchQuery,
        category: this.selectedOption,
      });
    },
  },
};
</script>