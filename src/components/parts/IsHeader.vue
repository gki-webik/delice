<template>
  <div class="boxHeader">
    <div class="topLine">• tu le mérites •</div>
    <header>
      <h1>DÉLICE</h1>
      <div class="mainContent" :class="{ 'is-active': mainContentActive }">
        <div class="center">
          <input
            type="search"
            placeholder="Поиск..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
          />
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
          <button type="button" @click="performSearch">
            <img src="/media/images/search__logo.svg" alt="Поиск" />
          </button>
        </div>
        <div class="right">
          <div class="icons">
            <img
              src="/media/images/account__logo.svg"
              @click="$router.push('/account/orders')"
              alt=""
            />
            <img
              src="/media/images/heart__logo.svg"
              @click="$router.push('/favorites')"
              alt=""
            />
            <img
              src="/media/images/cart__logo.svg"
              @click="$router.push('/cart')"
              alt=""
            />
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
            <router-link to="/promotions">АКЦИИ</router-link>
            <router-link to="/delivery-and-payment"
              >ДОСТАВКА И ОПЛАТА</router-link
            >
            <router-link to="/blog">БЛОГ</router-link>
            <router-link to="/about-us">О НАС</router-link>
            <router-link to="/contacts">КОНТАКТЫ</router-link>
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
      if (!this.searchQuery.trim()) {
        // Если строка поиска пустая, можно не выполнять поиск
        return;
      }
      this.$router.push({
        path: "/search",
        query: {
          q: this.searchQuery,
          category: this.selectedOption || undefined,
        },
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

<style scoped>
@import "../../assets/styles/parts/dist/min/header.min.css";
</style>
