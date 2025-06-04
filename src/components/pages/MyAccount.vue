<template>
  <div class="boxHeader">
    <div class="box-modal is-comment is-centered" v-if="showModalComment">
      <div class="modal">
        <span class="is-close" @click="showModalComment = !showModalComment"
          >×</span
        >
        <h2>ОСТАВЬТЕ ОТЗЫВ</h2>
        <form @submit.prevent="submitComment">
          <div class="stars">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ active: star <= hoverRating || star <= selectedRating }"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0"
              @click="selectedRating = star"
            >
              ★
            </span>
          </div>
          <textarea
            v-model="commentText"
            placeholder="Что понравилось? Что не так?"
            required
          ></textarea>
          <button type="submit">Отправить отзыв</button>
        </form>
      </div>
    </div>
  </div>
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
            : isCurrentPage === "order"
            ? "Мои заказы"
            : isCurrentPage === "comments"
            ? "Отзывы"
            : "Не известно"
        }}</a>
      </nav>
      <div class="box">
        <AccountLeftMenu></AccountLeftMenu>

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
                        : order.status === "completed"
                        ? "Выполнен"
                        : order.status === "success"
                        ? "Оплачен"
                        : "Неизвестно"
                    }}
                  </td>
                  <td>
                    <a
                      role="button"
                      @click="
                        isCurrentPage = 'order';
                        currentIdOrder = order.id;
                      "
                      >Перейти к заказу &gt;</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="block3" v-if="isCurrentPage === 'order'">
          <h1>
            Мои заказы (#{{ currentIdOrder ? currentIdOrder : null }} -
            {{ orderDetails && orderDetails.date }})
          </h1>
          <div v-if="loadingOrderDetails" class="is-Montserrat">
            Загрузка деталей заказа...
          </div>
          <div v-else-if="errorOrderDetails" class="is-Montserrat error">
            {{ errorOrderDetails }}
          </div>
          <div v-else-if="!orderDetails" class="is-Montserrat">
            Информация о заказе не найдена
          </div>
          <div class="orderDetails" v-else>
            <div
              class="items"
              v-if="
                parsedProducts &&
                parsedProducts.items &&
                parsedProducts.items.length > 0
              "
            >
              <div
                class="item"
                v-for="(item, index) in parsedProducts.items"
                :key="index"
                @click="$router.push('/catalog/product/' + item.id)"
              >
                <img :src="item.image" alt="" />
                <div class="content">
                  <div class="name">{{ item.name }}</div>
                  <div class="price">{{ formatPrice(item.price) }} ₽</div>
                  <div class="params">{{ item.size }}, {{ item.color }}</div>
                  <button
                    type="button"
                    v-if="!commentsIds.includes(item.id)"
                    @click.stop="
                      currentCommentId = item.id;
                      showModalComment = true;
                    "
                  >
                    Написать отзыв
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="is-Montserrat">В заказе нет товаров</div>
          </div>
        </div>

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
            <div
              class="item"
              @click="$router.push('/catalog/product/' + comment.product_id)"
              v-for="comment in comments"
              :key="comment.id"
            >
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
      currentIdOrder: null,
      orders: [],
      orderDetails: null,
      parsedProducts: null,
      showModalComment: false,
      hoverRating: 0,
      selectedRating: 0,
      commentsIds: [],
      commentText: "",
      userData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      comments: [],
      loadingOrders: false,
      errorOrders: null,
      loadingOrderDetails: false,
      errorOrderDetails: null,
      loadingUser: false,
      errorUser: null,
      loadingComments: false,
      errorComments: null,
    };
  },
  mounted() {
    this.isAuth();
    setTimeout(() => {
      this.checkPay();
    });
  },
  methods: {
    checkPay() {
      fetch("https://delice-spb.ru/api/v1/checkPay", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки данных пользователя");
          return res.json();
        })
        .then((data) => {
          if (data && data.message) {
            this.fetchData();
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.checkPay();
          }, 1500);
        });
    },
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
      } else if (this.isCurrentPage === "order" && this.currentIdOrder) {
        this.fetchComments();
        this.fetchOrderDetails(this.currentIdOrder);
      }
    },

    async submitComment() {
      if (this.selectedRating === 0) {
        alert("Пожалуйста, выберите рейтинг.");
        return;
      }
      if (this.myComment) return;

      const commentData = {
        productId: this.currentCommentId,
        rating: this.selectedRating,
        review_text: this.commentText,
      };
      let formData = new FormData();
      formData.append("commentData", JSON.stringify(commentData));
      try {
        const response = await fetch(
          "https://delice-spb.ru/api/v1/addComment",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (response.ok) {
          this.showModalComment = false;
          this.selectedRating = 0;
          this.commentText = "";
          fetch(
            "https://delice-spb.ru/api/v1/getCommentProductById/" +
              this.currentCommentId
          ).then((response) => {
            return response.json().then((data) => {
              this.comments = data.data;
              this.myComment = true;
            });
          });
        } else {
          alert("Ошибка при отправке отзыва. Попробуйте снова.");
        }
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при отправке отзыва. Попробуйте снова.");
      }
    },
    isAuth() {
      fetch("https://delice-spb.ru/api/v1/checkAuth", {
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
      fetch("https://delice-spb.ru/api/v1/profile-orders", {
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
    fetchOrderDetails(orderId) {
      this.loadingOrderDetails = true;
      this.errorOrderDetails = null;
      this.orderDetails = null;
      this.parsedProducts = null;

      fetch("https://delice-spb.ru/api/v1/profile-orders", {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки деталей заказа");
          return res.json();
        })
        .then((data) => {
          // Находим заказ по ID
          const order = data.data.find((order) => order.id === orderId);
          if (!order) {
            throw new Error("Заказ не найден");
          }

          this.orderDetails = order;
          try {
            // Безопасный способ очистки строки без использования управляющих символов в регулярном выражении
            let cleanedJson = "";
            if (order.products) {
              // Проходим по каждому символу и оставляем только печатаемые символы
              for (let i = 0; i < order.products.length; i++) {
                const charCode = order.products.charCodeAt(i);
                // Оставляем только печатаемые символы ASCII и расширенные символы
                if (charCode > 31 && charCode !== 127) {
                  cleanedJson += order.products[i];
                }
              }

              // Дополнительная обработка для экранирования
              cleanedJson = cleanedJson
                .replace(/\\n/g, "\\n")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t");
            }

            this.parsedProducts = JSON.parse(cleanedJson || '{"items":[]}');
          } catch (e) {
            console.error("Ошибка при парсинге товаров:", e);

            // Попробуем альтернативный подход, если первый не сработал
            try {
              // Попытка использовать простую замену проблемных символов
              const safeJson = order.products
                ? order.products
                    .replace(/\n/g, "")
                    .replace(/\r/g, "")
                    .replace(/\t/g, "")
                    .replace(/\f/g, "")
                    .replace(/\v/g, "")
                : '{"items":[]}';

              this.parsedProducts = JSON.parse(safeJson);
            } catch (innerError) {
              console.error("Вторая попытка парсинга не удалась:", innerError);

              // Если у нас есть строка с продуктами, попробуем вывести её для диагностики
              if (order.products) {
                console.log(
                  "Проблемная строка JSON (первые 200 символов):",
                  order.products.substring(0, 200)
                );
              }

              this.errorOrderDetails = "Ошибка при обработке данных о товарах";

              // Создаем пустую структуру, чтобы избежать ошибок в шаблоне
              this.parsedProducts = { items: [] };
            }
          }
        })
        .catch((err) => {
          this.errorOrderDetails = err.message;
        })
        .finally(() => {
          this.loadingOrderDetails = false;
        });
    },
    fetchUserData() {
      this.loadingUser = true;
      this.errorUser = null;
      fetch("https://delice-spb.ru/api/v1/profile-user", {
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
      fetch("https://delice-spb.ru/api/v1/profile-comments", {
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
          data.data.forEach((element) => {
            this.commentsIds.push(element.id);
          });
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
      fetch("https://delice-spb.ru/api/v1/profile-user", {
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
      fetch("https://delice-spb.ru/api/v1/profile-exit", {
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
      fetch("https://delice-spb.ru/api/v1/profile-delete", {
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
    currentIdOrder() {
      if (this.isCurrentPage === "order" && this.currentIdOrder) {
        this.fetchOrderDetails(this.currentIdOrder);
      }
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/pages/dist/min/myAccount.min.css";
</style>