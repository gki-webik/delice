<template>
  <main class="boxMainAccount">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/account/orders">Личный кабинет</router-link>
        <a class="is-end">{{
          isCurrentPage === "orders"
            ? "Заказы"
            : isCurrentPage === "data"
            ? "Мои данные"
            : isCurrentPage === "comments"
            ? "Отзывы"
            : "Не известно"
        }}</a>
      </nav>
      <div class="box">
        <AccountLeftMenu></AccountLeftMenu>

        <!-- Блок Заказы -->
        <div class="block1" v-if="isCurrentPage === 'orders'">
          <h1>Мои заказы</h1>
          <div v-if="loadingOrders" class="is-Montserrat">
            Загрузка заказов...
          </div>
          <div v-else-if="errorOrders" class="is-Montserrat error">
            {{ errorOrders }}
          </div>
          <div class="tableBox" v-else>
            <table>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Сумма заказа</th>
                  <th>Статус заказа</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>{{ order.number }}</td>
                  <td>{{ order.date }}</td>
                  <td>{{ order.total }} ₽</td>
                  <td>{{ order.status }}</td>
                  <td>
                    <a :href="'/order/' + order.id">Перейти к заказу &gt;</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Блок Мои данные -->
        <div class="block2" v-if="isCurrentPage === 'data'">
          <h1>Мои данные</h1>
          <div v-if="loadingUser" class="is-Montserrat">Загрузка данных...</div>
          <div v-else-if="errorUser" class="is-Montserrat error">
            {{ errorUser }}
          </div>
          <form v-else @submit.prevent="saveUserData">
            <div class="line">
              <label>
                <span>Имя</span>
                <input type="text" v-model="userData.firstName" />
              </label>
              <label>
                <span>Фамилия</span>
                <input type="text" v-model="userData.lastName" />
              </label>
            </div>
            <div class="line">
              <label>
                <span>E-mail</span>
                <input type="email" v-model="userData.email" />
              </label>
              <label>
                <span>Телефон</span>
                <input type="tel" v-model="userData.phone" />
              </label>
            </div>
            <button type="submit">Сохранить</button>
          </form>
          <div class="actions">
            <a href="#">Выйти из профиля</a>
            <a href="#">Удалить профиль</a>
          </div>
        </div>

        <!-- Блок Мои отзывы -->
        <div class="block3" v-if="isCurrentPage === 'comments'">
          <h1>Мои отзывы</h1>
          <div v-if="loadingComments" class="is-Montserrat">
            Загрузка отзывов...
          </div>
          <div v-else-if="errorComments" class="is-Montserrat error">
            {{ errorComments }}
          </div>
          <div class="items" v-else>
            <div class="item" v-for="comment in comments" :key="comment.id">
              <img src="/media/images/MaskProduct.png" alt="" />
              <div class="content">
                <div class="name">{{ comment.productName }}</div>
                <div class="params">{{ comment.params }}</div>
                <div class="renting">{{ comment.rating }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import AccountLeftMenu from "../parts/AccountLeftMenu.vue";

export default {
  components: { AccountLeftMenu },
  data() {
    return {
      isCurrentPage: "orders",
      orders: [],
      userData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      comments: [],
      loadingOrders: false,
      errorOrders: null,
      loadingUser: false,
      errorUser: null,
      loadingComments: false,
      errorComments: null,
    };
  },
  mounted() {
    this.updateCurrentPage();
    this.fetchData();
  },
  methods: {
    updateCurrentPage() {
      const path = this.$route.path;
      if (path.includes("/account/orders")) {
        this.isCurrentPage = "orders";
      } else if (path.includes("/account/data")) {
        this.isCurrentPage = "data";
      } else if (path.includes("/account/comments")) {
        this.isCurrentPage = "comments";
      } else {
        this.isCurrentPage = "orders";
      }
    },
    fetchData() {
      if (this.isCurrentPage === "orders") {
        this.fetchOrders();
      } else if (this.isCurrentPage === "data") {
        this.fetchUserData();
      } else if (this.isCurrentPage === "comments") {
        this.fetchComments();
      }
    },
    fetchOrders() {
      this.loadingOrders = true;
      this.errorOrders = null;
      fetch("https://profi.local/api/profile-orders", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки заказов");
          return res.json();
        })
        .then((data) => {
          this.orders = data.orders;
        })
        .catch((err) => {
          this.errorOrders = err.message;
        })
        .finally(() => {
          this.loadingOrders = false;
        });
    },
    fetchUserData() {
      this.loadingUser = true;
      this.errorUser = null;
      fetch("https://profi.local/api/profile-user")
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки данных пользователя");
          return res.json();
        })
        .then((data) => {
          this.userData.firstName = data.firstName;
          this.userData.lastName = data.lastName;
          this.userData.email = data.email;
          this.userData.phone = data.phone;
        })
        .catch((err) => {
          this.errorUser = err.message;
        })
        .finally(() => {
          this.loadingUser = false;
        });
    },
    fetchComments() {
      this.loadingComments = true;
      this.errorComments = null;
      fetch("https://profi.local/api/profile-comments")
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки отзывов");
          return res.json();
        })
        .then((data) => {
          this.comments = data.comments;
        })
        .catch((err) => {
          this.errorComments = err.message;
        })
        .finally(() => {
          this.loadingComments = false;
        });
    },
    saveUserData() {
      fetch("https://profi.local/api/profile-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.userData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка сохранения данных");
          alert("Данные успешно сохранены");
        })
        .catch((err) => {
          alert("Ошибка: " + err.message);
        });
    },
  },
  watch: {
    isCurrentPage() {
      this.fetchData();
    },
    $route() {
      this.updateCurrentPage();
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/pages/dist/min/myAccount.min.css";
</style>