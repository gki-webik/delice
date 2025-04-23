<template>
  <main class="boxMainCart">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Корзина</a>
      </nav>
      <h1>
        Корзина <span>{{ totalItems }} {{ pluralizeGoods }}</span>
      </h1>
      <div class="box">
        <div class="left">
          <label>
            <input
              type="checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
              :disabled="!hasAvailableItems"
            />
            Выбрать все
          </label>
          <div class="items">
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
                    <span class="is-cost">{{
                      item.IsAccess
                        ? formatPrice(
                            Number(item.price) * Number(item.quantity)
                          )
                        : "Нет в наличии"
                    }}</span>
                  </div>
                  <div class="is-2">
                    <p class="description">{{ item.description }}</p>
                  </div>
                </div>
                <div class="actions">
                  <div class="count">
                    <button
                      @click="decreaseQuantity(index)"
                      :disabled="item.quantity <= 1 || !item.IsAccess"
                    >
                      -
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button
                      @click="increaseQuantity(index)"
                      :disabled="!item.IsAccess"
                    >
                      +
                    </button>
                  </div>
                  <div class="trash" @click="removeItem(index)">
                    <img
                      src="/media/images/trash-bin-minimalistic-2-svgrepo-com 1.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
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
              <button>GO</button>
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
      cartItems: [
        {
          id: 1,
          name: "Товар №1",
          price: 5000,
          quantity: 1,
          description: "Описание товара №1",
          image: "/media/images/MaskProduct.png",
          selected: false,
          IsAccess: true,
        },
        {
          id: 3,
          name: "Товар №1",
          price: 4000,
          quantity: 1,
          description: "Описание товара №1",
          image: "/media/images/MaskProduct.png",
          selected: false,
          IsAccess: true,
        },
        {
          id: 2,
          name: "Товар №2",
          price: 7000,
          quantity: 1,
          description: "Описание товара №2",
          image: "/media/images/MaskProduct.png",
          selected: false,
          IsAccess: false,
        },
      ],
      promoCode: "",
      discount: 0,
    };
  },
  computed: {
    totalItems() {
      return this.cartItems.reduce(
        (total, item) => total + Number(item.quantity),
        0
      );
    },
    pluralizeGoods() {
      const lastDigit = this.totalItems % 10;
      const lastTwoDigits = this.totalItems % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "товаров";
      }

      if (lastDigit === 1) return "товар";
      if (lastDigit >= 2 && lastDigit <= 4) return "товара";
      return "товаров";
    },
    selectedItemsCount() {
      return this.cartItems
        .filter((item) => item.selected)
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
    selectedItemsTotal() {
      return this.cartItems
        .filter((item) => item.selected)
        .reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );
    },
    selectedAvailableItemsCount() {
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
    selectedAvailableItemsTotal() {
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );
    },
    hasAvailableItems() {
      return this.cartItems.some((item) => item.IsAccess);
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
      if (this.cartItems[index].IsAccess) {
        this.cartItems[index].quantity++;
      }
    },
    decreaseQuantity(index) {
      if (
        this.cartItems[index].IsAccess &&
        this.cartItems[index].quantity > 1
      ) {
        this.cartItems[index].quantity--;
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1);
      this.updateSelectAll();
    },
    toggleSelectAll() {
      this.cartItems.forEach((item) => {
        if (item.IsAccess) {
          item.selected = this.selectAll;
        }
      });
    },
    updateSelectAll() {
      this.selectAll = this.cartItems.every(
        (item) => !item.IsAccess || item.selected
      );
    },
  },
};
</script>