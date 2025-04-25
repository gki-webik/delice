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
          <div v-else-if="orders && orders.length === 0" class="is-Montserrat">
            У вас нет заказов...
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
                  <td>{{ order.id }}</td>
                  <td>{{ order.date }}</td>
                  <td>{{ formatPrice(order.total) }} ₽</td>
                  <td>
                    {{
                      order.status === "default"
                        ? "Не оплачен"
                        : order.status === "pending"
                        ? "В процессе"
                        : order.status === "created"
                        ? "Создан"
                        : order.status === "success"
                        ? "Выполнен"
                        : "Неизвестно"
                    }}
                  </td>
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
            <a role="button" @click="fetchAccountExit()">Выйти из профиля</a>
            <a role="button" @click="fetchAccountDelete()">Удалить профиль</a>
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
          <div
            v-if="comments && comments.length === 0"
            class="is-Montserrat error"
          >
            У вас нет отзывов...
          </div>
          <div class="items" v-else>
            <div class="item" v-for="comment in comments" :key="comment.id">
              <img :src="comment.product.image" alt="" />
              <div class="content">
                <div class="name">{{ comment.product.name }}</div>
                <div class="params">
                  {{ comment.product.size }}, {{ comment.product.color }}
                </div>
                <div class="renting">
                  <span
                    v-for="star in 5"
                    :key="star"
                    v-show="star <= Number(comment.stars)"
                  >
                    ★
                  </span>
                </div>
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
    this.isAuth();
  },
  methods: {
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
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
    isAuth() {
      fetch("https://ce95524.tw1.ru/api/v1/checkAuth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            this.$router.replace("/");
            throw new Error("Ошибка аутентификации");
          }
          return res.json();
        })
        .then(() => {
          this.updateCurrentPage();
          this.fetchData();
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    fetchOrders() {
      this.loadingOrders = true;
      this.errorOrders = null;
      fetch("https://ce95524.tw1.ru/api/v1/profile-orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки заказов");
          return res.json();
        })
        .then((data) => {
          this.orders = data.data;
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
      fetch("https://ce95524.tw1.ru/api/v1/profile-user", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки данных пользователя");
          return res.json();
        })
        .then((data) => {
          this.userData.firstName = data.data.first_name;
          this.userData.lastName = data.data.last_name;
          this.userData.email = data.data.email;
          this.userData.phone = data.data.phone;
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
      fetch("https://ce95524.tw1.ru/api/v1/profile-comments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки отзывов");
          return res.json();
        })
        .then((data) => {
          this.comments = data.data;
        })
        .catch((err) => {
          this.errorComments = err.message;
        })
        .finally(() => {
          this.loadingComments = false;
        });
    },
    saveUserData() {
      let formData = new FormData();
      formData.append("userData", JSON.stringify(this.userData));
      fetch("https://ce95524.tw1.ru/api/v1/profile-user", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка сохранения данных");
          alert("Данные успешно сохранены");
        })
        .catch((err) => {
          alert("Ошибка: " + err.message);
        });
    },
    fetchAccountExit() {
      fetch("https://ce95524.tw1.ru/api/v1/profile-exit", {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка сохранения данных");
          document.location.reload();
        })
        .catch((err) => {
          alert("Ошибка: " + err.message);
        });
    },
    fetchAccountDelete() {
      fetch("https://ce95524.tw1.ru/api/v1/profile-delete", {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка сохранения данных");
          document.location.reload();
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