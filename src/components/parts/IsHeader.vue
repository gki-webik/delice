<template>
  <div class="box-modal is-centered is-400" v-if="showModalLogin">
    <div class="modal">
      <span class="is-close" @click="showModalLogin = !showModalLogin">×</span>
      <form @submit.prevent="submitFormLogin">
        <label>
          <span>E-mail</span>
          <input type="email" v-model="form_email" />
        </label>
        <label>
          <span>Пароль</span>
          <input type="password" v-model="form_password" />
        </label>
        <a role="button" @click="showModalRecover = true">Забыли пароль?</a>
        <button type="submit">Войти</button>
        <a role="button" @click="showModalSignUp = true">Регистрация</a>
        <span class="is-error" v-if="modalError">{{ modalError }}</span>
      </form>
    </div>
  </div>

  <div class="box-modal is-centered is-400" v-if="showModalNewPassword">
    <div class="modal">
      <span
        class="is-close"
        @click="showModalNewPassword = !showModalNewPassword"
        >×</span
      >
      <form @submit.prevent="submitFormNewPassword">
        <label>
          <span>Новый пароль</span>
          <input type="password" v-model="form_password" />
        </label>
        <button type="submit">Восстановить</button>
        <span class="is-error" v-if="modalError4">{{ modalError4 }}</span>
      </form>
    </div>
  </div>
  <div class="box-modal is-400" v-if="showModalSignUp">
    <div class="modal">
      <span class="is-close" @click="showModalSignUp = !showModalSignUp"
        >×</span
      >
      <form @submit.prevent="submitFormSignUp">
        <label>
          <span>Имя</span>
          <input type="text" v-model="form_first_name" />
        </label>
        <label>
          <span>Фамилия</span>
          <input type="text" v-model="form_last_name" />
        </label>
        <label>
          <span>E-mail</span>
          <input type="email" v-model="form_email" />
        </label>
        <label>
          <span>Пароль</span>
          <input type="password" v-model="form_password" />
        </label>
        <label>
          <span>Повторите пароль</span>
          <input type="password" v-model="form_password2" />
        </label>
        <button type="submit">Регистрация</button>
        <span class="is-error" v-if="modalError2">{{ modalError2 }}</span>
      </form>
    </div>
  </div>
  <div class="box-modal is-centered is-400" v-if="showModalRecover">
    <div class="modal">
      <span class="is-close" @click="showModalRecover = !showModalRecover"
        >×</span
      >
      <form @submit.prevent="submitFormRecover">
        <p>
          Введите свой e-mail, который вы указывали при регистрации. На него мы
          вышлем ссылку на восстановление
        </p>
        <label>
          <span>E-mail</span>
          <input type="email" v-model="form_email" />
        </label>
        <button type="submit">Отправить</button>
        <span class="is-error" v-if="modalError3">{{ modalError3 }}</span>
      </form>
    </div>
  </div>
  <div class="boxHeader no-print"></div>
  <div class="boxHeader no-print">
    <div class="topLine">• tu le mérites •</div>
    <header>
      <h1 @click="$router.push('/')">DÉLICE</h1>
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
              @click="
                isAuth
                  ? $router.push('/account/orders')
                  : isAuth === false
                  ? (showModalLogin = true)
                  : null
              "
              alt=""
            />
            <img
              src="/media/images/heart__logo.svg"
              @click="$router.push('/favorites')"
              alt=""
            />
            <img
              src="/media/images/cart__logo.svg"
              @click="isAuth ? $router.push('/cart') : (showModalLogin = true)"
              alt=""
            />
          </div>
          <div class="data">
            <div>
              <span>Товары:</span>
              <span class="is-right">{{ isCountCart }} шт</span>
            </div>
            <div>
              <span>Сумма: </span
              ><span class="is-right">{{ formatPrice(isAmountCart) }} ₽</span>
            </div>
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
      class="IsHeaderCategory"
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
      modalError: null,
      modalError2: null,
      modalError3: null,
      modalError4: null,
      IsHeaderCategory: false,
      isCountCart: 0,
      isAmountCart: 0,
      showModalLogin: false,
      showModalSignUp: false,
      showModalRecover: false,
      showModalNewPassword: false,
      isAuth: null,
      currentTokenMail: "",
      form_email: "",
      form_password: "",
      form_last_name: "",
      form_first_name: "",
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
  mounted() {
    this.isAuthFetch();
    setInterval(() => {
      this.cartProducts();
      this.cartAmount();
    }, 1000);
  },
  watch: {
    "$route.query": {
      handler(newQuery) {
        if (newQuery.modal === "newPassword" && newQuery.token) {
          this.currentTokenMail = newQuery.token;
          this.showModalNewPassword = true;
        }
      },
      immediate: true,
    },
    $route(to) {
      // Проверяем, что мы на главной странице
      if (to.path === "/") {
        // Находим элемент с классом IsHeaderCategory
        const headerCategory = document.querySelector(".IsHeaderCategory");
        if (headerCategory && headerCategory.classList.contains("active")) {
          // Удаляем класс active
          headerCategory.classList.remove("active");
        }
      }
    },
  },
  methods: {
    cartProducts() {
      this.isCountCart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart")).length
        : 0;
    },
    cartAmount() {
      if (!localStorage.getItem("cart")) {
        this.isAmountCart = 0;
        return;
      }
      const cart = JSON.parse(localStorage.getItem("cart"));
      const ids = cart.map((item) => item.id);
      const idsString = JSON.stringify(ids);

      const formData = new FormData();
      formData.append("products", idsString);

      fetch("https://ce95524.tw1.ru/api/v1/amountCart", {
        method: "POST",
        body: formData,
      }).then((response) => {
        return response.json().then((data) => {
          this.isAmountCart = data.data;
        });
      });
    },
    performSearch() {
      if (!this.searchQuery.trim()) {
        // Можно сбросить фильтр или оставить как есть
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
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    isAuthFetch() {
      fetch("https://ce95524.tw1.ru/api/v1/checkAuth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            this.isAuth = true;
          } else {
            this.isAuth = false;
          }
        })
        .catch((err) => {
          this.isAuth = false;
          console.error(err.message);
        });
    },
    submitFormLogin() {
      this.modalError = null;
      let formData = new FormData();
      formData.append("email", this.form_email);
      formData.append("password", this.form_password);
      fetch("https://ce95524.tw1.ru/api/v1/login", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          return response.json().then((data) => {
            if (response.status !== 200) {
              this.modalError = data.message;
              return;
            }
            this.isAuth = true;
            this.showModalLogin = false;
            this.showModalSignUp = false;
            this.showModalRecover = false;
            this.showModalNewPassword = false;
            this.$router.replace("/account/orders");
          });
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    submitFormRecover() {
      this.modalError3 = null;
      let formData = new FormData();
      formData.append("email", this.form_email);
      fetch("https://ce95524.tw1.ru/api/v1/recover", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          return response.json().then((data) => {
            if (response.status !== 200) {
              this.modalError3 = data.message;
              return;
            }
            this.showModalLogin = false;
            this.showModalSignUp = false;
            this.showModalRecover = false;
            this.showModalNewPassword = false;
            alert("Ссылка для восстановления доступа успешно отправлена");
          });
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    submitFormNewPassword() {
      this.modalError4 = null;
      let formData = new FormData();
      formData.append("password", this.form_password);
      formData.append("token", this.currentTokenMail);
      fetch("https://ce95524.tw1.ru/api/v1/newPassword", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          return response.json().then((data) => {
            if (response.status !== 200) {
              this.modalError4 = data.message;
              return;
            }
            this.showModalLogin = false;
            this.showModalSignUp = false;
            this.showModalRecover = false;
            this.showModalNewPassword = false;
            this.isAuth = true;
            this.$router.replace("/account/orders");
          });
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    submitFormSignUp() {
      this.modalError2 = null;
      if (this.form_password != this.form_password2) {
        this.modalError2 = "Пароли не совпадают";
        return;
      }
      let formData = new FormData();
      formData.append("email", this.form_email);
      formData.append("password", this.form_password);
      formData.append("first_name", this.form_first_name);
      formData.append("last_name", this.form_last_name);
      fetch("https://ce95524.tw1.ru/api/v1/signup", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          return response.json().then((data) => {
            if (response.status !== 201) {
              this.modalError2 = data.message;
              return;
            }
            this.isAuth = true;
            this.showModalLogin = false;
            this.showModalSignUp = false;
            this.showModalRecover = false;
            this.showModalNewPassword = false;
            this.$router.replace("/account/orders");
          });
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/parts/dist/min/header.min.css";
</style>
