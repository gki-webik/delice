<template>
  <main class="boxMainAdminPanelOrders">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Заказы</a>
      </nav>
      <h1>Заказы</h1>
      <select @change="filterOrders($event)">
        <option value="all">Все заказы</option>
        <option value="status">По статусу</option>
        <option value="date1">По дате убывания</option>
        <option value="date2">По дате возрастания</option>
        <option value="success">Заказ оплачен</option>
        <option value="st_default">Заказ не оплачен</option>
        <option value="st_pending">Заказ в процессе</option>
        <option value="st_created">Заказ создан</option>
        <option value="st_completed">Заказ выполнен</option>
      </select>
      <div
        class="items"
        v-if="filteredItems && filteredItems.length > 0 && !showDetails"
      >
        <div class="item" v-for="(item, index) in filteredItems" :key="index">
          {{ index + 1 }}.
          <router-link to="#" role="button" @click="fetchOrderDetails(item.id)"
            >Заказ #{{ item.id }}</router-link
          >
          |
          {{
            item.status === "default"
              ? "Не оплачен"
              : item.status === "pending"
              ? "В процессе"
              : item.status === "created"
              ? "Создан"
              : item.status === "completed"
              ? "Выполнен"
              : item.status === "success"
              ? "Оплачен"
              : "Неизвестно"
          }}
          | {{ item.total }} руб. | {{ item.date }}
        </div>
      </div>
      <div class="order" v-if="parsedProducts && showDetails">
        <p v-if="loadingOrderDetails">Загрузка информации...</p>
        <p v-if="!loadingOrderDetails && parsedProducts.items.length === 0">
          Товары в заказе отсутствуют...
        </p>
        <div
          class="content"
          v-if="!loadingOrderDetails && parsedProducts.items.length > 0"
        >
          <div class="order-details">
            <!-- Общая информация о заказе -->
            <div class="order-header">
              <h2>Заказ #{{ orderDetails.id }}</h2>
              <label>
                Статус:
                <select
                  name=""
                  id=""
                  @change="fetchUpdateStatusOrder($event, orderDetails.id)"
                  v-model="orderDetails.status"
                >
                  <option value="default">Не оплачен</option>
                  <option value="success">Оплачен</option>
                  <option value="pending">В процессе</option>
                  <option value="created">Создан</option>
                  <option value="completed">Выполнен</option>
                </select>
              </label>
              <div class="order-meta">
                <span class="date">Дата: {{ orderDetails.date }}</span>
              </div>
              <div class="order-meta">
                <strong>
                  <span class="total"
                    >Сумма:
                    {{ formatPrice(Number(orderDetails.total)) }} ₽</span
                  >
                </strong>
              </div>
              <button type="button" @click="showDetails = null">Закрыть</button>
            </div>

            <!-- Информация о клиенте -->
            <div
              class="customer-info"
              v-if="orderDetails && orderDetails.user && orderDetails.user[0]"
            >
              <h3>Клиент</h3>
              <p>
                {{ orderDetails.user[0].last_name }}
                {{ orderDetails.user[0].first_name }}
              </p>
              <p>Телефон: {{ orderDetails.user[0].phone }}</p>
              <p>Email: {{ orderDetails.user[0].email }}</p>
            </div>

            <!-- Товары в заказе -->
            <div class="order-products">
              <h3>Товары ({{ parsedProducts.items.length }} позиции)</h3>
              <div class="product-list">
                <div
                  class="product-item"
                  v-for="(item, index) in parsedProducts.items"
                  :key="index"
                  @click="$router.push('/catalog/product/' + item.id)"
                >
                  <img :src="item.image" alt="" class="product-image" />
                  <div class="product-details">
                    <h4>{{ item.name }}</h4>
                    <div class="product-meta">
                      <span>Цена: {{ formatPrice(item.price) }} ₽</span>
                      <span>Кол-во: {{ item.quantity }}</span>
                      <span>Размер: {{ item.size }}</span>
                      <span>Цвет: {{ item.color }}</span>
                      <span>Магазин: {{ item.nameStore }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Итоговая информация -->
            <div class="order-summary">
              <h3>Итоги заказа</h3>
              <div class="summary-row">
                <span>Сумма без скидки:</span>
                <span
                  >{{ formatPrice(parsedProducts.totalBeforeDiscount) }} ₽</span
                >
              </div>
              <div
                class="summary-row discount"
                v-if="parsedProducts.discount > 0"
              >
                <span>Скидка:</span>
                <span>-{{ formatPrice(parsedProducts.discount) }} ₽</span>
              </div>
              <div class="summary-row total">
                <span>Итого к оплате:</span>
                <span
                  >{{ formatPrice(parsedProducts.totalAfterDiscount) }} ₽</span
                >
              </div>
            </div>

            <!-- Дополнительная информация -->
            <div class="order-extra">
              <div class="extra-row">
                <span>Магазин:</span>
                <span>{{ parsedProducts.store }}</span>
              </div>
              <div class="extra-row">
                <span>Способ оплаты:</span>
                <span>
                  {{ getPaymentMethodText(parsedProducts.paymentMethod) }}</span
                >
              </div>
              <div class="extra-row">
                <span>Промокод:</span>
                <span> {{ parsedProducts.promoCode || "Нет" }}</span>
              </div>
              <div class="extra-row">
                <span>Подарок:</span>
                <span>
                  {{
                    parsedProducts.totalAfterDiscount >= 5000 ? "Да" : "Нет"
                  }}</span
                >
              </div>
              <div class="extra-row promo" v-if="parsedProducts.appliedPromo">
                <span>Акция:</span>
                <span>{{ parsedProducts.appliedPromo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="!items">Загрузка...</p>
      <p v-if="items && filteredItems.length === 0">Заказов нет...</p>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      items: null,
      filteredItems: null,
      orderDetails: null,
      parsedProducts: null,
      showDetails: null,
      loadingOrderDetails: null,
    };
  },
  created() {
    this.isAuth();
    this.getAllOrders();
  },
  methods: {
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    isAuth() {
      fetch("https://ce95524.tw1.ru/api/v2/checkAuth", {
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
        .then(() => {})
        .catch((err) => {
          console.error(err.message);
        });
    },
    getAllOrders() {
      fetch("https://ce95524.tw1.ru/api/v2/getAllOrders", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка");
          }
          return res.json();
        })
        .then((data) => {
          this.items = data.data;
          this.filteredItems = [...data.data];
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    fetchUpdateStatusOrder(data, id) {
      const formData = new FormData();
      formData.append("status", data.target.value);
      fetch("https://ce95524.tw1.ru/api/v2/updateStatusOrder/" + id, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка");
          }
          return res.json();
        })
        .then(() => {
          alert("Статус обновлен");
          this.getAllOrders();
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    filterOrders(event) {
      const filterValue = event.target.value;

      let filtered = [...this.items];

      switch (filterValue) {
        case "all":
          break;

        case "status":
          filtered.sort((a, b) => {
            const statusA = this.getStatusText(a.status);
            const statusB = this.getStatusText(b.status);
            return statusA.localeCompare(statusB);
          });
          break;

        case "date1":
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;

        case "date2":
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;

        case "success":
          filtered = filtered.filter((item) => item.status === "success");
          break;

        case "st_default":
          filtered = filtered.filter((item) => item.status === "default");
          break;

        case "st_pending":
          filtered = filtered.filter((item) => item.status === "pending");
          break;

        case "st_created":
          filtered = filtered.filter((item) => item.status === "created");
          break;

        case "st_completed":
          filtered = filtered.filter((item) => item.status === "completed");
          break;
      }

      this.filteredItems = filtered;
    },

    getStatusText(status) {
      switch (status) {
        case "default":
          return "Не оплачен";
        case "pending":
          return "В процессе";
        case "created":
          return "Создан";
        case "completed":
          return "Выполнен";
        case "success":
          return "Оплачен";
        default:
          return "Неизвестно";
      }
    },
    fetchOrderDetails(orderId) {
      this.loadingOrderDetails = true;
      this.showDetails = true;
      fetch("https://ce95524.tw1.ru/api/v2/fetchOrderDetails/" + orderId, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка загрузки деталей заказа");
          return res.json();
        })
        .then((data) => {
          const order = data.data[0];
          this.orderDetails = order;
          try {
            let cleanedJson = "";
            if (order.products) {
              for (let i = 0; i < order.products.length; i++) {
                const charCode = order.products.charCodeAt(i);
                if (charCode > 31 && charCode !== 127) {
                  cleanedJson += order.products[i];
                }
              }

              cleanedJson = cleanedJson
                .replace(/\\n/g, "\\n")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t");
            }

            this.parsedProducts = JSON.parse(cleanedJson || '{"items":[]}');
          } catch (e) {
            console.error("Ошибка при парсинге товаров:", e);

            try {
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

              this.errorOrderDetails = "Ошибка при обработке данных о товарах";

              this.parsedProducts = { items: [] };
            }
          }
        })
        .catch((err) => {
          alert(err.message);
        })
        .finally(() => {
          this.loadingOrderDetails = false;
        });
    },
    getPaymentMethodText(method) {
      switch (method) {
        case "cash":
          return "Наличные";
        case "card":
          return "Карта";
        case "online":
          return "Онлайн оплата";
        default:
          return method;
      }
    },
  },
};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsMainOrders.min.css";
</style> 