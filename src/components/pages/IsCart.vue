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
            <div class="summary-row" v-if="discount > 0">
              <span>Промокод</span>
              <span>-{{ formatPrice(discount) }}</span>
            </div>
            <div class="summary-row" v-if="freeItemDiscount > 0">
              <span>Акция 1+1=3</span>
              <span>-{{ formatPrice(freeItemDiscount) }}</span>
            </div>
            <div class="summary-row total">
              <span>Итого</span>
              <span>{{
                formatPrice(
                  selectedAvailableItemsTotal - freeItemDiscount - discount
                )
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
            <!-- Промо-акции -->
            <div class="promo-offers">
              <div class="promo-offer">
                <div v-if="accessoriesCount >= 2" class="promo-active">
                  Акция «1+1=3 на аксессуары» применена! Вы экономите
                  {{ formatPrice(freeItemDiscount) }}
                </div>
              </div>
              <div
                class="promo-offer"
                v-if="selectedAvailableItemsTotal >= 5000 && isFirstOrder"
              >
                <p>
                  Вы получите эксклюзивный подарок т.к. заказ оформлен на сумму
                  >= 5000р!
                </p>
              </div>
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
                  <b>{{ item.productName }}</b> - доступен в:
                  {{ item.availableStores.join("; ") }}
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
              formatPrice(
                selectedAvailableItemsTotal - freeItemDiscount - discount
              )
            }}</span>
          </div>
          <div
            class="gift-notification"
            v-if="selectedAvailableItemsTotal >= 5000 && isFirstOrder"
          >
            <p>🎁 Вам положен подарок при получении заказа!</p>
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
      isFirstOrder: null,
      selectAll: false,
      cartItems: null,
      promoCode: "",
      discount: 0,
      freeItemDiscount: 0,
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
      hasGift: false,
    };
  },
  created() {
    this.isAuth();
    this.firstOrder();
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

      if (selectedProductIds.length === 0) {
        return [];
      }

      // Находим магазины, где есть все выбранные товары
      const commonStores = this.stores.filter((store) => {
        return selectedProductIds.every((productId) => {
          return (
            this.storesAvailability[productId] &&
            this.storesAvailability[productId].includes(store.name)
          );
        });
      });

      // Возвращаем список магазинов, где доступны все выбранные товары
      return commonStores;
    },
    // Подсчет аксессуаров для акции 1+1=3
    accessoriesCount() {
      if (!this.cartItems) return 0;
      return this.cartItems
        .filter(
          (item) => item.selected && item.IsAccess && this.isAccessory(item)
        )
        .reduce((total, item) => total + Number(item.quantity), 0);
    },
  },
  watch: {
    selectedItems: {
      handler() {
        this.applyBuyTwoGetOneFreePromotion();
        this.checkGiftEligibility();
      },
      deep: true,
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
    // Проверка, является ли пользователь новым

    // Проверка, является ли товар аксессуаром
    isAccessory(item) {
      // Предположим, что у аксессуаров есть определенная категория или тег
      // Здесь можно реализовать логику определения аксессуаров
      // Для примера, считаем аксессуарами товары с ценой менее 2000 рублей
      return (
        item.categoryUrl === "men_accessories" ||
        item.categoryUrl === "women_accessories"
      );
    },
    // Применение акции 1+1=3 на аксессуары
    // Применение акции 1+1=3 на аксессуары
    applyBuyTwoGetOneFreePromotion() {
      if (this.accessoriesCount >= 3) {
        // Получаем все выбранные аксессуары
        const accessories = [];

        // Разворачиваем каждый аксессуар в соответствии с его количеством
        this.cartItems
          .filter(
            (item) => item.selected && item.IsAccess && this.isAccessory(item)
          )
          .forEach((item) => {
            for (let i = 0; i < item.quantity; i++) {
              accessories.push({
                id: item.id,
                price: Number(item.price),
              });
            }
          });

        // Сортируем по возрастанию цены
        accessories.sort((a, b) => a.price - b.price);

        // Рассчитываем количество бесплатных товаров (каждый третий)
        const freeItemsCount = Math.floor(accessories.length / 3);

        // Суммируем стоимость самых дешевых товаров, которые будут бесплатными
        let discount = 0;
        for (let i = 0; i < freeItemsCount; i++) {
          discount += accessories[i].price;
        }

        this.freeItemDiscount = discount;
      } else {
        this.freeItemDiscount = 0;
      }
    },
    // Проверка права на подарок при заказе от 5000 рублей
    checkGiftEligibility() {
      this.hasGift = this.selectedAvailableItemsTotal >= 5000;
    },
    increaseQuantity(index) {
      const item = this.cartItems[index];
      const maxCount = Number(item.count);
      if (item.IsAccess && item.quantity < maxCount) {
        item.quantity++;
        this.applyBuyTwoGetOneFreePromotion();
        this.checkGiftEligibility();
      }
    },
    decreaseQuantity(index) {
      const item = this.cartItems[index];
      if (item.IsAccess && item.quantity > 1) {
        item.quantity--;
        this.applyBuyTwoGetOneFreePromotion();
        this.checkGiftEligibility();
      }
    },
    toggleSelectAll() {
      if (!this.cartItems) return;
      this.cartItems.forEach((item) => {
        if (item.IsAccess) {
          item.selected = this.selectAll;
        }
      });
      this.applyBuyTwoGetOneFreePromotion();
      this.checkGiftEligibility();
    },
    updateSelectAll() {
      if (!this.cartItems) return;
      this.selectAll = this.cartItems.every(
        (item) => !item.IsAccess || item.selected
      );
      this.applyBuyTwoGetOneFreePromotion();
      this.checkGiftEligibility();
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
      if (!this.promoCode) {
        this.discount = 0;
        return;
      }

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
              if (this.promoCode === "new2025" && !this.isFirstOrder) return;

              // Применяем промокод к сумме после вычета скидки по акции 1+1=3
              const baseAmount =
                this.selectedAvailableItemsTotal - this.freeItemDiscount;
              this.discount = (baseAmount * Number(data.data)) / 100;
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
      this.applyBuyTwoGetOneFreePromotion();
      this.checkGiftEligibility();
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
        totalAfterDiscount:
          this.selectedAvailableItemsTotal -
          this.freeItemDiscount -
          this.discount,
        discount: this.discount + this.freeItemDiscount,
        promoCode: this.promoCode,
        store: this.selectedStore,
        paymentMethod: this.selectedPaymentMethod,
        hasGift: this.hasGift,
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
            return res.json().then((dataRes) => {
              console.log(dataRes);
              /*  // Если ссылки нет, продолжаем стандартный процесс оформления заказа
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
              this.freeItemDiscount = 0;

              // Если пользователь был новым, он больше не считается новым
              if (this.isFirstOrder) {
                this.isFirstOrder = false;
              }

              document.location.href = dataRes.link; */
            });
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

        // Сохраняем список магазинов для этого товара
        this.storesAvailability[item.id] = storesWithProduct.map(
          (store) => store.name
        );

        // Добавляем магазины в общий список
        for (const store of storesWithProduct) {
          if (!this.stores.some((s) => s.id === store.id)) {
            this.stores.push({
              id: store.id,
              name: store.name,
            });
          }
        }
      }

      // Проверяем, есть ли хотя бы один магазин, где доступны все товары
      const commonStores = this.stores.filter((store) => {
        return selectedItems.every((item) => {
          return (
            this.storesAvailability[item.id] &&
            this.storesAvailability[item.id].includes(store.name)
          );
        });
      });

      // Если нет общих магазинов, показываем предупреждение
      if (commonStores.length === 0) {
        for (const item of selectedItems) {
          this.unavailableProducts.push({
            productId: item.id,
            productName: item.name,
            availableStores: this.storesAvailability[item.id] || [],
          });
        }
      }
    },
    firstOrder() {
      fetch("https://ce95524.tw1.ru/api/v1/firstOrder", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json().then(() => {
              this.isFirstOrder = true;
            });
          }
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
  },
};
</script>