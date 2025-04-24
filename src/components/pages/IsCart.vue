<template>
  <main class="boxMainCart">
    <div class="max-container">
      <nav class="is-kroshki" v-if="!showCheckoutForm">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Корзина</a>
      </nav>
      <nav class="is-kroshki" v-if="showCheckoutForm">
        <router-link to="/">Главная</router-link>
        <router-link to="/cart">Корзина</router-link>
        <a class="is-end">Оформление заказа</a>
      </nav>
      <h1 v-if="!showCheckoutForm">
        Корзина <span>{{ totalItems }} {{ pluralizeGoods }}</span>
      </h1>
      <h1 v-if="showCheckoutForm" class="is-h1-2">
        <div>ОФОРМЛЕНИЕ ЗАКАЗА</div>
        <div class="user">
          <router-link to="/account/orders"
            ><img src="/media/images/account__logo.svg" alt=""
          /></router-link>
          <div class="is-name">Иван Иванов</div>
        </div>
      </h1>
      <div class="box" v-if="!showCheckoutForm">
        <div class="left">
          <label v-if="cartItems && cartItems.length > 0">
            <input
              type="checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
              :disabled="!hasAvailableItems"
            />
            Выбрать все
          </label>
          <p v-if="cartItems === null" class="is-Montserrat">
            Загружаем данные...
          </p>
          <p v-else-if="cartItems.length === 0" class="is-Montserrat">
            У вас нет товаров в корзине
          </p>
          <div class="items" v-else>
            <div
              class="item"
              :class="{ noIsAccess: !item.IsAccess }"
              v-for="(item, index) in cartItems"
              :key="item.id"
            >
              <input
                type="checkbox"
                v-model="item.selected"
                @change="
                  item.IsAccess ? updateSelectAll() : (item.selected = false)
                "
                :disabled="!item.IsAccess"
              />
              <img :src="item.image" class="is-photo" :alt="item.name" />
              <div class="content">
                <div class="top">
                  <div class="is-1">
                    <span class="is-title">{{ item.name }}</span>
                    <span class="is-cost">
                      {{
                        item.IsAccess
                          ? formatPrice(
                              Number(item.price) * Number(item.quantity)
                            )
                          : "Нет в наличии"
                      }}
                    </span>
                  </div>
                  <div class="is-2">
                    <p class="description">{{ item.description }}</p>
                  </div>
                </div>
                <div class="actions">
                  <div class="count">
                    <button
                      @click="decreaseQuantity(index)"
                      :disabled="!item.IsAccess || item.quantity <= 1"
                    >
                      -
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button
                      @click="increaseQuantity(index)"
                      :disabled="
                        !item.IsAccess || item.quantity >= Number(item.count)
                      "
                    >
                      +
                    </button>
                  </div>
                  <div class="trash" @click="removeItem(index)">
                    <img
                      src="/media/images/trash-bin-minimalistic-2-svgrepo-com 1.svg"
                      alt="Удалить"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right" v-if="cartItems && cartItems.length > 0">
          <div class="order-summary">
            <h2>Сумма заказа</h2>
            <div class="summary-row">
              <span>Товары ({{ selectedAvailableItemsCount }})</span>
              <span>{{ formatPrice(selectedAvailableItemsTotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Промокод</span>
              <span>{{ formatPrice(discount) }}</span>
            </div>
            <div class="summary-row total">
              <span>Итого</span>
              <span>{{
                formatPrice(selectedAvailableItemsTotal - discount)
              }}</span>
            </div>
            <button
              class="checkout-btn"
              :disabled="selectedAvailableItemsCount === 0"
              @click="showCheckoutForm = true"
            >
              К оформлению
            </button>
            <div class="summary-row promo">
              <input
                type="text"
                v-model="promoCode"
                placeholder="Промокод"
                class="promo-input"
              />
              <button @click="applyPromo">GO</button>
            </div>
          </div>
        </div>
      </div>

      <div class="checkout-form-overlay" v-if="showCheckoutForm">
        <div class="left">
          <div class="line-group">
            <label for="pickup-store">Выберите магазин для самовывоза:</label>
            <select id="pickup-store" v-model="selectedStore">
              <option value="">Выберите магазин</option>
              <option v-for="store in stores" :key="store.id" :value="store.id">
                {{ store.name }} - {{ store.address }}
              </option>
            </select>
            <div class="error" v-if="formErrors.store">
              {{ formErrors.store }}
            </div>
          </div>
          <div class="line-group">
            <label for="payment-method">Выберите способ оплаты:</label>
            <select id="payment-method" v-model="selectedPaymentMethod">
              <option value="">Выберите способ оплаты</option>
              <option
                v-for="method in paymentMethods"
                :key="method.id"
                :value="method.id"
              >
                {{ method.name }}
              </option>
            </select>
            <div class="error" v-if="formErrors.payment">
              {{ formErrors.payment }}
            </div>
          </div>
          <div class="line-group total">
            <span>Итого</span>
            <span>{{
              formatPrice(selectedAvailableItemsTotal - discount)
            }}</span>
          </div>
          <div class="form-actions">
            <button class="cancel-btn is-1" @click="showCheckoutForm = false">
              Отмена
            </button>
            <button class="submit-btn is-2" @click="submitOrder">
              Оформить заказ
            </button>
          </div>
        </div>
        <div class="right">
          <div class="cartBoxResult">
            <div
              class="cartResult"
              v-for="item in selectedItems"
              :key="item.id"
            >
              <div class="count">{{ item.quantity }} Товар(а)</div>
              <img :src="item.image" alt="" />
              <div class="price">
                {{ formatPrice(Number(item.price) * Number(item.quantity)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/isCart.min.css";
</style>

<script>
export default {
  data() {
    return {
      selectAll: false,
      cartItems: null,
      promoCode: "",
      discount: 0,
      showCheckoutForm: false,
      selectedStore: "",
      selectedPaymentMethod: "",
      formErrors: {
        store: "",
        payment: "",
      },
      stores: [
        { id: 1, name: 'ТЦ "Галерея"', address: "Невский проспект, 65" },
        { id: 2, name: 'ТЦ "Мега Дыбенко"', address: "проспект Дыбенко, 1" },
        { id: 3, name: 'ТЦ "РИО"', address: "проспект Культуры, 1" },
      ],
      paymentMethods: [
        {
          id: "card",
          name: "Банковская карта",
        },
        { id: "cash", name: "Наличные" },
        {
          id: "online",
          name: "Онлайн оплата",
        },
      ],
    };
  },
  created() {
    this.loadCartFromLocalStorage();
  },
  computed: {
    totalItems() {
      if (!this.cartItems) return 0;
      return this.cartItems.reduce(
        (total, item) => total + Number(item.quantity),
        0
      );
    },
    pluralizeGoods() {
      if (!this.cartItems) return "товаров";
      const total = this.totalItems;
      const lastDigit = total % 10;
      const lastTwoDigits = total % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "товаров";
      }
      if (lastDigit === 1) return "товар";
      if (lastDigit >= 2 && lastDigit <= 4) return "товара";
      return "товаров";
    },
    selectedItems() {
      if (!this.cartItems) return [];
      return this.cartItems.filter((item) => item.selected && item.IsAccess);
    },
    selectedItemsCount() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter((item) => item.selected)
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
    selectedItemsTotal() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter((item) => item.selected)
        .reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );
    },
    selectedAvailableItemsCount() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
    selectedAvailableItemsTotal() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );
    },
    hasAvailableItems() {
      if (!this.cartItems) return false;
      return this.cartItems.some((item) => item.IsAccess);
    },
    selectedItemsIds() {
      if (!this.cartItems) return [];
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .map((item) => item.id);
    },
    totalQuantity() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
  },
  methods: {
    formatPrice(price) {
      if (isNaN(price)) return "0 ₽";
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
      })
        .format(price)
        .replace("RUB", "₽");
    },
    increaseQuantity(index) {
      const item = this.cartItems[index];
      const maxCount = Number(item.count);
      if (item.IsAccess && item.quantity < maxCount) {
        item.quantity++;
      }
    },
    decreaseQuantity(index) {
      const item = this.cartItems[index];
      if (item.IsAccess && item.quantity > 1) {
        item.quantity--;
      }
    },
    toggleSelectAll() {
      if (!this.cartItems) return;
      this.cartItems.forEach((item) => {
        if (item.IsAccess) {
          item.selected = this.selectAll;
        }
      });
    },
    updateSelectAll() {
      if (!this.cartItems) return;
      this.selectAll = this.cartItems.every(
        (item) => !item.IsAccess || item.selected
      );
    },
    async fetchCartItems(ids) {
      this.cartItems = null;
      try {
        const requests = ids.map((id) =>
          fetch(`https://profi.local/api/getProductById/${id}`)
            .then((response) => response.json())
            .then((data) => data.data[0])
        );
        const results = await Promise.all(requests);
        this.cartItems = results.filter(Boolean).map((item) => {
          const countNumber = Number(item.count);
          return {
            ...item,
            selected: false,
            quantity: 1,
            IsAccess: countNumber > 0,
          };
        });
        this.updateSelectAll();
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        this.cartItems = [];
      }
    },
    loadCartFromLocalStorage() {
      const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
      if (cartIds.length === 0) {
        this.cartItems = [];
        return;
      }
      this.fetchCartItems(cartIds);
    },
    applyPromo() {
      if (this.promoCode === "DISCOUNT10") {
        this.discount = this.selectedItemsTotal * 0.1;
      } else {
        this.discount = 0;
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1);
      this.updateSelectAll();
      this.saveCartToLocalStorage();
    },
    saveCartToLocalStorage() {
      const ids = this.cartItems.map((item) => item.id);
      localStorage.setItem("cart", JSON.stringify(ids));
    },
    validateForm() {
      let isValid = true;
      this.formErrors = {
        store: "",
        payment: "",
      };

      if (!this.selectedStore) {
        this.formErrors.store = "Пожалуйста, выберите магазин для самовывоза";
        isValid = false;
      }

      if (!this.selectedPaymentMethod) {
        this.formErrors.payment = "Пожалуйста, выберите способ оплаты";
        isValid = false;
      }

      return isValid;
    },
    submitOrder() {
      if (!this.validateForm()) {
        return;
      }

      // Получаем выбранные товары
      const selectedItems = this.cartItems.filter(
        (item) => item.selected && item.IsAccess
      );

      // Формируем данные заказа
      const orderData = {
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        totalBeforeDiscount: this.selectedAvailableItemsTotal,
        totalAfterDiscount: this.selectedAvailableItemsTotal - this.discount,
        discount: this.discount,
        promoCode: this.promoCode,
        store: this.selectedStore,
        paymentMethod: this.selectedPaymentMethod,
      };

      // Выводим информацию в консоль
      console.log("Оформлен заказ:");
      console.log("ID товаров:", this.selectedItemsIds);
      console.log("Количество товаров:", this.totalQuantity);
      console.log("Промокод:", this.promoCode || "Не применен");
      console.log("Сумма без промокода:", this.selectedAvailableItemsTotal);
      console.log(
        "Сумма с промокодом:",
        this.selectedAvailableItemsTotal - this.discount
      );
      console.log("Полные данные заказа:", orderData);

      // Очищаем корзину от оформленных товаров
      this.cartItems = this.cartItems.filter(
        (item) => !item.selected || !item.IsAccess
      );
      this.saveCartToLocalStorage();

      // Закрываем форму оформления
      this.showCheckoutForm = false;

      // Сбрасываем форму
      this.selectedStore = "";
      this.selectedPaymentMethod = "";
      this.promoCode = "";
      this.discount = 0;

      // Можно добавить уведомление об успешном оформлении заказа
      alert("Заказ успешно оформлен!");
    },
  },
};
</script>