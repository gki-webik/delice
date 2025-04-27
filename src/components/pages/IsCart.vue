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
          <div class="is-name" v-if="username">{{ username }}</div>
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
              :key="item.id + '-' + item.size + '-' + item.color"
            >
              <input
                type="checkbox"
                v-model="item.selected"
                @change="
                  item.IsAccess ? updateSelectAll() : (item.selected = false)
                "
                :disabled="!item.IsAccess"
              />
              <img
                :src="item.image"
                class="is-photo"
                @click="$router.push('/catalog/product/' + item.id)"
                :alt="item.name"
              />
              <div class="content">
                <div
                  class="top"
                  @click="$router.push('/catalog/product/' + item.id)"
                >
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
                    <p class="item-details">
                      Размер: <strong>{{ item.size }}</strong
                      >, Цвет: <strong>{{ item.color }}</strong>
                    </p>
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
              @click="proceedToCheckout"
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
              <option
                v-for="store in availableStores"
                :key="store.id"
                :value="store.name"
              >
                {{ store.name }}
              </option>
            </select>
            <div class="error" v-if="formErrors.store">
              {{ formErrors.store }}
            </div>
            <div
              v-if="unavailableProducts.length > 0"
              class="unavailable-products"
            >
              <p>Некоторые товары отсутствуют в магазинах:</p>
              <ul>
                <li v-for="(item, index) in unavailableProducts" :key="index">
                  {{ item.productName }} - доступен в:
                  {{ item.availableStores.join(", ") }}
                </li>
              </ul>
              <p>Оформите их по отдельности.</p>
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
              @click="$router.push('/catalog/product/' + item.id)"
              :key="item.id + '-' + item.size + '-' + item.color"
            >
              <div class="count">{{ item.quantity }} Товар(а)</div>
              <img :src="item.image" alt="" />
              <div class="price">
                {{ formatPrice(Number(item.price) * Number(item.quantity)) }}
              </div>
              <div class="item-details">{{ item.size }}, {{ item.color }}</div>
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
      stores: [],
      storesAvailability: {},
      unavailableProducts: [],
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
      username: null,
    };
  },
  created() {
    this.isAuth();
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
        .map((item) => ({
          id: item.id,
          size: item.size,
          color: item.color,
        }));
    },
    totalQuantity() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter((item) => item.selected && item.IsAccess)
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
    availableStores() {
      if (
        !this.storesAvailability ||
        Object.keys(this.storesAvailability).length === 0
      ) {
        return [];
      }

      // Получаем ID выбранных товаров
      const selectedProductIds = this.selectedItems.map((item) => item.id);

      // Находим магазины, где есть все выбранные товары
      const storesWithAllProducts = this.stores.filter((store) => {
        return selectedProductIds.every((productId) => {
          return (
            this.storesAvailability[productId] &&
            this.storesAvailability[productId].includes(store.name)
          );
        });
      });

      return storesWithAllProducts;
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
          this.username = data.data.first_name + " " + data.data.last_name;
        })
        .catch((err) => {
          alert(err.message);
        });
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
    async fetchCartItems(cartItems) {
      this.cartItems = null;
      try {
        const requests = cartItems.map((item) => {
          const id = typeof item === "object" ? item.id : item;
          return fetch(`https://ce95524.tw1.ru/api/v1/getProductById/${id}`)
            .then((response) => response.json())
            .then((data) => {
              const productData = data.data[0];
              if (!productData) return null;

              const countNumber = Number(productData.count);

              // Если item - это объект с размером и цветом
              if (typeof item === "object" && item.size && item.color) {
                return {
                  ...productData,
                  size: item.size,
                  color: item.color,
                  selected: false,
                  quantity: 1,
                  IsAccess: countNumber > 0,
                };
              } else {
                // Для обратной совместимости со старыми записями в корзине
                return {
                  ...productData,
                  size: productData.size || "M", // Значение по умолчанию
                  color: productData.color || "Синий", // Значение по умолчанию
                  selected: false,
                  quantity: 1,
                  IsAccess: countNumber > 0,
                };
              }
            });
        });

        const results = await Promise.all(requests);
        this.cartItems = results.filter(Boolean);
        this.updateSelectAll();
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        this.cartItems = [];
      }
    },
    loadCartFromLocalStorage() {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      if (cartItems.length === 0) {
        this.cartItems = [];
        return;
      }
      this.fetchCartItems(cartItems);
    },
    applyPromo() {
      let formData = new FormData();
      formData.append("promo", this.promoCode);
      fetch("https://ce95524.tw1.ru/api/v1/checkPromoCode", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            alert("Промокод не найден");
            return;
          } else {
            return res.json().then((data) => {
              this.discount =
                (this.selectedItemsTotal * Number(data.data)) / 100;
            });
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    removeItem(index) {
      // Получаем удаляемый элемент
      const removedItem = this.cartItems[index];

      // Удаляем из текущего списка
      this.cartItems.splice(index, 1);

      // Обновляем localStorage
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      // Находим индекс элемента в localStorage
      const storageIndex = cartItems.findIndex((item) => {
        if (typeof item === "object") {
          return (
            item.id === removedItem.id &&
            item.size === removedItem.size &&
            item.color === removedItem.color
          );
        }
        return item === removedItem.id; // Для обратной совместимости
      });

      // Удаляем из localStorage если найден
      if (storageIndex !== -1) {
        cartItems.splice(storageIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }

      this.updateSelectAll();
    },
    saveCartToLocalStorage() {
      // Преобразуем cartItems в формат для localStorage
      const cartItems = this.cartItems.map((item) => ({
        id: item.id,
        size: item.size,
        color: item.color,
      }));

      localStorage.setItem("cart", JSON.stringify(cartItems));
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
          image: item.image,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          size: item.size,
          color: item.color,
          nameStore: this.selectedStore,
          paymentMethod: this.selectedPaymentMethod,
        })),
        totalBeforeDiscount: this.selectedAvailableItemsTotal,
        totalAfterDiscount: this.selectedAvailableItemsTotal - this.discount,
        discount: this.discount,
        promoCode: this.promoCode,
        store: this.selectedStore,
        paymentMethod: this.selectedPaymentMethod,
      };

      let formData = new FormData();
      formData.append("orderData", JSON.stringify(orderData));
      fetch("https://ce95524.tw1.ru/api/v1/cartBuy", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((dataRes) => {
              alert(dataRes.message);
              return;
            });
          } else {
            // Получаем текущие элементы корзины из localStorage
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

            // Фильтруем элементы, которые не были выбраны для заказа
            const remainingCartItems = cartItems.filter((cartItem) => {
              // Проверяем, не входит ли этот элемент в выбранные для заказа
              return !selectedItems.some((selectedItem) => {
                if (typeof cartItem === "object") {
                  return (
                    cartItem.id === selectedItem.id &&
                    cartItem.size === selectedItem.size &&
                    cartItem.color === selectedItem.color
                  );
                }
                return cartItem === selectedItem.id; // Для обратной совместимости
              });
            });

            // Обновляем localStorage
            localStorage.setItem("cart", JSON.stringify(remainingCartItems));

            // Обновляем cartItems, оставляя только неоформленные товары
            this.cartItems = this.cartItems.filter(
              (item) => !item.selected || !item.IsAccess
            );

            // Закрываем форму оформления
            this.showCheckoutForm = false;

            // Сбрасываем форму
            this.selectedStore = "";
            this.selectedPaymentMethod = "";
            this.promoCode = "";
            this.discount = 0;

            alert("Заказ успешно создан!");
            this.$router.push("/account/orders");
          }
        })
        .catch((err) => {
          alert(err.message);
          return;
        });
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
          this.loadCartFromLocalStorage();
          this.fetchUserData();
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    async getStoresProduct(productId) {
      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v1/getStoresProduct/" + productId
        );

        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }

        const result = await response.json();
        return result.data.filter((store) => store.count !== "0");
      } catch (error) {
        console.error("Ошибка при получении данных о магазинах:", error);
        return [];
      }
    },
    async proceedToCheckout() {
      this.showCheckoutForm = true;
      this.stores = [];
      this.storesAvailability = {};
      this.unavailableProducts = [];

      // Получаем выбранные товары
      const selectedItems = this.selectedItems;

      if (selectedItems.length === 0) {
        return;
      }

      // Для каждого выбранного товара получаем список магазинов
      for (const item of selectedItems) {
        const storesWithProduct = await this.getStoresProduct(item.id);

        // Если товар есть хотя бы в одном магазине
        if (storesWithProduct.length > 0) {
          // Сохраняем список магазинов для этого товара
          this.storesAvailability[item.id] = storesWithProduct.map(
            (store) => store.name
          );

          // Добавляем уникальные магазины в общий список
          for (const store of storesWithProduct) {
            if (!this.stores.some((s) => s.id === store.id)) {
              this.stores.push({
                id: store.id,
                name: store.name,
              });
            }
          }
        } else {
          // Если товара нет ни в одном магазине
          this.storesAvailability[item.id] = [];
        }
      }

      // Проверяем наличие товаров в магазинах
      for (const item of selectedItems) {
        const availableStores = this.storesAvailability[item.id] || [];

        // Если товар отсутствует хотя бы в одном магазине
        if (availableStores.length < this.stores.length) {
          this.unavailableProducts.push({
            productId: item.id,
            productName: item.name,
            availableStores: availableStores,
          });
        }
      }
    },
  },
};
</script>