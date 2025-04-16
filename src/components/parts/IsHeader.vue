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
        <div class="left" @click="toggleHeaderCategory">
          <span class="burger"></span>
          <a role="button">ВСЕ КАТЕГОРИИ</a>
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
    <IsHeaderCategory
      @close-menu="toggleHeaderCategory"
      :class="{ active: IsHeaderCategory }"
    ></IsHeaderCategory>
  </div>
</template>

<style scoped>
@import "../../assets/styles/parts/dist/min/header.min.css";
</style>

<script>
import IsHeaderCategory from "./IsHeaderCategory.vue";
export default {
  data() {
    return {
      mainContentActive: false,
      searchQuery: "",
      selectedOption: "",
      IsHeaderCategory: false,
      options: [
        { value: "women_clothing", label: "Женская одежда" },
        { value: "women_shoes", label: "Женская обувь" },
        { value: "women_accessories", label: "Женские аксессуары" },
        { value: "men_clothing", label: "Мужская одежда" },
        { value: "men_shoes", label: "Мужская обувь" },
        { value: "men_accessories", label: "Мужские аксессуары" },
        { value: "popular", label: "Популярные товары" },
        { value: "new", label: "Новинки" },
        { value: "sale", label: "Скидки до 50%" },
      ],
    };
  },
  components: { IsHeaderCategory },
  methods: {
    performSearch() {
      console.log("Поиск:", {
        query: this.searchQuery,
        category: this.selectedOption,
      });
    },
    toggleHeaderCategory() {
      if (
        this.$route.path === "/" &&
        document.documentElement.clientWidth > 850
      )
        return;

      this.IsHeaderCategory = !this.IsHeaderCategory;
    },
  },
};
</script>