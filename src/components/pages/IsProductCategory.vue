<template>
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
  <div
    class="box-modal is-stores is-centered"
    v-if="showMagazines && stores && stores.length > 0"
  >
    <div class="modal">
      <span class="is-close" @click="showMagazines = !showMagazines">×</span>
      <ul>
        <li v-for="(item, index) in stores" :key="index">
          {{ item.name }} - {{ item.count }} шт.
        </li>
      </ul>
    </div>
  </div>
  <div class="box-modal" v-if="showModalSizes">
    <div class="modal">
      <h2>
        ТАБЛИЦА РАЗМЕРОВ
        <span class="is-close" @click="showModalSizes = !showModalSizes"
          >×</span
        >
      </h2>
      <div class="table-container">
        <table class="size-table">
          <thead>
            <tr class="is-border-line">
              <th>Европейский размер</th>
              <th class="is-select">XS</th>
              <th>S</th>
              <th class="is-select">M</th>
              <th>L</th>
              <th class="is-select">XL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Российский размер</td>
              <td>42</td>
              <td>44</td>
              <td>46</td>
              <td>48</td>
              <td>50</td>
            </tr>
            <tr>
              <td>Обхват груди (см)</td>
              <td>84</td>
              <td>88</td>
              <td>92</td>
              <td>96</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Обхват талии (см)</td>
              <td>64</td>
              <td>68</td>
              <td>72</td>
              <td>76</td>
              <td>80</td>
            </tr>
            <tr>
              <td>Обхват бёдер (см)</td>
              <td>90</td>
              <td>94</td>
              <td>98</td>
              <td>102</td>
              <td>106</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>КАК СНЯТЬ МЕРКИ?</h2>
      <p>
        Используй мягкую сантиметровую ленту. При снятии мерок она должна плотно
        прилегать к телу, но не перетягивать его.
      </p>
      <div class="box">
        <img
          src="/media/images/8a24edbcb103d96a771fbb946b5af7bb10ee00e7.jpg"
          alt=""
        />
        <div class="text">
          <h3>Обхват груди (см)</h3>
          <p>
            Измеряется по самым выступающим точкам. Рекомендуем снимать мерки в
            белье.
          </p>
          <h3>Обхват талии (см)</h3>
          <p>
            Оберните сантиметровую ленту вокруг талии. Встаньте прямо, дышите
            нормально. Приложите начальный конец сантиметровой ленты к пупку,
            после чего оберните ленту по линии талии вокруг спины и снова
            выведите вперед. Лента должна лежать параллельно полу и плотно
            облегать вашу талию, но не врезаться в кожу. Посмотрите на
            соответствующую метку сантиметровой ленты. Выдохните, а потом
            посмотрите на значение на ленте.
          </p>
          <h3>Обхват бёдер (см)</h3>
          <p>Измеряется по самым выпуклым точкам ягодиц.</p>
        </div>
      </div>
    </div>
  </div>
  <main class="boxMainProductCategory">
    <div class="max-container">
      <nav class="is-kroshki" v-if="product">
        <router-link to="/">Главная</router-link>
        <router-link to="/catalog">Каталог</router-link>
        <router-link :to="'/catalog/' + product.categoryUrl">{{
          categoryUrlMap[product.categoryUrl]
        }}</router-link>
        <a class="is-end">{{ product.name }}</a>
      </nav>
      <div class="block1" v-if="product">
        <div class="left">
          <div class="currentImage">
            <img :src="currentImage" alt="" />
          </div>
          <div class="otherImages">
            <img
              v-for="(image, index) in otherImages"
              :key="index"
              :src="image"
              alt=""
              @click="switchImage(index)"
              :class="{ 'is-active': currentImage === image }"
            />
          </div>
        </div>
        <div class="right">
          <small>ID {{ product.id }}</small>
          <h1>{{ product.name }}</h1>
          <div class="cost" v-if="product.price">
            {{ formatPrice(product.price) }} ₽
          </div>
          <h3>Цвет</h3>
          <div class="colors">
            <img
              v-for="(colorImage, colorName) in parsedColorsImages"
              :key="colorName"
              :src="colorImage"
              :alt="colorName"
              :class="{ 'is-active': selectedColor === colorName }"
              @click="selectColor(colorName)"
            />
          </div>
          <h3>Размер</h3>
          <div class="sizes">
            <span
              v-for="(size, index) in product.sizes"
              :key="index"
              :class="{ 'is-active': selectedSize === size }"
              @click="selectSize(size)"
              >{{ size }}</span
            >
            <a role="button" @click="showModalSizes = !showModalSizes"
              >Таблицы размеров</a
            >
          </div>
          <div class="actions">
            <button
              type="button"
              @click="
                productCount !== 0
                  ? isAuth
                    ? toggleCart()
                    : this.$emit('modal-auth')
                  : null
              "
              class="is-1"
              :disabled="!selectedSize || !selectedColor || productCount === 0"
            >
              <img src="/media/images/cart__logo.svg" alt="" />
              {{
                productCount !== 0
                  ? isInCart() && isAuth
                    ? "Удалить из корзины"
                    : "Добавить в корзину"
                  : "Товар закончился"
              }}
            </button>
            <button type="button" class="is-2" @click="toggleFavorite()">
              <svg
                width="27"
                height="25"
                viewBox="0 0 27 25"
                fill="none"
                class="is-heart"
                xmlns="http://www.w3.org/2000/svg"
                :class="{
                  'is-favorite': favorites.includes($route.params.product),
                }"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.49338 2.46262C3.41 3.45074 1.88372 5.80103 1.88372 8.60367C1.88372 11.4669 3.01297 13.6739 4.63181 15.5653C5.96602 17.1241 7.58115 18.4161 9.1563 19.6761C9.53042 19.9754 9.90228 20.2729 10.2676 20.5717C10.9282 21.1121 11.5174 21.5862 12.0855 21.9306C12.6537 22.2753 13.1112 22.4326 13.5 22.4326C13.8888 22.4326 14.3463 22.2753 14.9145 21.9306C15.4826 21.5862 16.0718 21.1121 16.7325 20.5717C17.0978 20.2729 17.4696 19.9754 17.8437 19.6761C19.4189 18.4161 21.034 17.1241 22.3682 15.5653C23.9871 13.6739 25.1163 11.4669 25.1163 8.60367C25.1163 5.80103 23.59 3.45074 21.5066 2.46262C19.4826 1.50267 16.763 1.75689 14.1786 4.54297C14.0011 4.73437 13.7561 4.84252 13.5 4.84252C13.2439 4.84252 12.9989 4.73437 12.8214 4.54297C10.237 1.75689 7.51739 1.50267 5.49338 2.46262ZM13.5 2.50774C10.5965 -0.187672 7.34521 -0.56473 4.71026 0.68499C1.92731 2.0049 0 5.06977 0 8.60367C0 12.0769 1.39458 14.7266 3.22332 16.8632C4.68779 18.5742 6.48028 20.0063 8.06337 21.271C8.42223 21.5577 8.77033 21.8359 9.10141 22.1067C9.74468 22.6328 10.4352 23.1939 11.1351 23.6182C11.8347 24.0423 12.633 24.3871 13.5 24.3871C14.367 24.3871 15.1653 24.0423 15.8649 23.6182C16.5648 23.1939 17.2553 22.6328 17.8986 22.1067C18.2296 21.8359 18.5778 21.5577 18.9367 21.271C20.5198 20.0063 22.3122 18.5742 23.7767 16.8632C25.6054 14.7266 27 12.0769 27 8.60367C27 5.06977 25.0727 2.0049 22.2897 0.68499C19.6547 -0.56473 16.4036 -0.187672 13.5 2.50774Z"
                  fill="#26436C"
                />
              </svg>
            </button>
          </div>
          <div class="map">
            <img
              src="/media/images/reshot-icon-location-marker-ZE5Y87KGQF 1.svg"
              alt=""
            />
            <div class="text">
              <span class="is-1"
                >Забрать из
                <a role="button" @click="openListMagazines()"
                  >{{ stores ? stores.length : 0 }} магазинов</a
                >
              </span>
              <span class="is-2">после предоплаты</span>
            </div>
          </div>
        </div>
      </div>
      <div class="block2" v-if="product">
        <div class="left">
          <h2 @click="toggleBlock('specs')">
            ХАРАКТЕРИСТИКИ
            <img
              src="/media/images/filter__icon__dropdown.svg"
              alt="Раскрыть"
              :class="{ rotate: openBlocks.specs }"
            />
          </h2>
          <hr />
          <ul v-show="openBlocks.specs">
            <li v-for="(item, index) in product.characteristic" :key="index">
              {{ item }}
            </li>
          </ul>
          <hr v-show="openBlocks.specs" />
        </div>
        <div class="right">
          <h2 @click="toggleBlock('care')">
            УХОД ЗА ИЗДЕЛИЕМ
            <img
              src="/media/images/filter__icon__dropdown.svg"
              alt="Раскрыть"
              :class="{ rotate: openBlocks.care }"
            />
          </h2>
          <hr />
          <ul v-show="openBlocks.care">
            <li v-for="(item, index) in product.product_care" :key="index">
              {{ item }}
            </li>
          </ul>
          <hr v-show="openBlocks.care" />
        </div>
      </div>
      <div class="block3" v-if="product">
        <h2>ОТЗЫВЫ</h2>
        <div class="renting">
          <b>{{ averageRating.toFixed(1) }}</b>
          <span v-html="starRating"></span>
        </div>
        <button
          type="button"
          v-if="!myComment"
          @click="showModalComment = !showModalComment"
        >
          Написать отзыв
        </button>
        <p class="is-Montserrat" v-if="!comments || comments.length === 0">
          Отзывов пока нет. Оставь его первым!
        </p>
        <hr />
        <div class="items" v-if="comments && comments.length">
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="name">{{ item.user_name }}</div>
            <div class="content">
              <div class="stars">
                <span
                  v-for="star in 5"
                  :key="star"
                  v-show="star <= Number(item.rating)"
                >
                  ★
                </span>
              </div>
              <div>{{ item.review_text }}</div>
            </div>
            <div class="date">{{ getNormalFormatDate(item.review_date) }}</div>
          </div>
        </div>
      </div>
      <div class="block4" v-if="newItems">
        <h2>ПОХОЖИЕ ТОВАРЫ</h2>
        <div class="tape">
          <div class="slider_box">
            <div class="slider" ref="sliderNew" @scroll="handleScrollNew">
              <div
                class="slider__item"
                @click="$router.push('/catalog/product/' + item.id)"
                v-for="(item, index) in newItems"
                :key="index"
              >
                <img :src="item.image" alt="" />
                <span class="name">{{ item.name }}</span>
                <span class="price" v-if="item.price"
                  >{{ formatPrice(item.price) }}₽</span
                >
              </div>
            </div>
          </div>
          <button
            class="sliderButtonPrev"
            @click="slideNew(-1)"
            :disabled="currentSlideNew === 0"
          >
            <svg
              width="8"
              height="16"
              viewBox="0 0 8 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="7.38302"
                y1="15.339"
                x2="0.95515"
                y2="7.67856"
                stroke="#26436C"
              />
              <line
                x1="7.61698"
                y1="0.678606"
                x2="1.1891"
                y2="8.33905"
                stroke="#26436C"
              />
            </svg>
          </button>
          <button
            class="sliderButtonNext"
            @click="slideNew(1)"
            :disabled="currentSlideNew >= maxSlidesNew - visibleSlidesNew"
          >
            <svg
              width="8"
              height="16"
              viewBox="0 0 8 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.616978"
                y1="15.339"
                x2="7.04485"
                y2="7.67856"
                stroke="#26436C"
              />
              <line
                x1="0.383022"
                y1="0.678606"
                x2="6.8109"
                y2="8.33905"
                stroke="#26436C"
              />
            </svg>
          </button>
        </div>
        <button type="button">Смотреть всё</button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      product: [],
      newItems: [],
      currentSlideNew: 0,
      visibleSlidesNew: 4,
      productCount: 0,
      itemWidthNew: 200,
      sliderWidthNew: 0,
      showModalComment: false,
      showModalSizes: false,
      hoverRating: 0,
      selectedRating: 0,
      commentText: "",
      currentImage: "/media/images/MaskProduct.png",
      comments: null,
      otherImages: [
        "/media/images/MaskProduct.png",
        "/media/images/MaskProduct.png",
        "/media/images/MaskProduct.png",
      ],
      openBlocks: {
        specs: false,
        care: false,
      },
      categoryUrlMap: {
        women_clothing: "ЖЕНСКАЯ ОДЕЖДА",
        men_clothing: "МУЖСКАЯ ОДЕЖДА",
        women_shoes: "ЖЕНСКАЯ ОБУВЬ",
        men_shoes: "МУЖСКАЯ ОБУВЬ",
        women_accessories: "АКСЕССУАРЫ",
        men_accessories: "АКСЕССУАРЫ",
        popular: "Популярные товары",
        new: "Новинки",
        sale: "Скидки до 50%",
      },
      favorites: [],
      cart: [],
      myComment: false,
      selectedSize: "",
      selectedColor: "",
      stores: [],
      parsedColorsImages: {},
      availableColors: [],
      isAuth: false,
      showMagazines: false,
    };
  },
  computed: {
    maxSlidesNew() {
      return this.newItems.length;
    },
    averageRating() {
      if (!this.comments || this.comments.length === 0) return 0;
      const sum = this.comments.reduce((total, comment) => {
        return total + Number(comment.rating);
      }, 0);
      return sum / this.comments.length;
    },
    starRating() {
      const fullStars = "★".repeat(Math.floor(this.averageRating));
      const halfStar = this.averageRating % 1 >= 0.5 ? "★" : "";
      const emptyStars = "☆".repeat(5 - Math.ceil(this.averageRating));
      return " " + fullStars + halfStar + emptyStars;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateVisibleSlidesNew);
  },
  methods: {
    openListMagazines() {
      this.showMagazines = true;
    },
    init() {
      this.isAuthFetch();
      this.calculateVisibleSlidesNew();
      this.fetchProduct(this.$route.params.product);
      window.addEventListener("resize", this.calculateVisibleSlidesNew);
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        this.favorites = JSON.parse(savedFavorites);
      }
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
      this.fetchMyComments();
      this.getStoresProduct(this.$route.params.product);
    },
    async submitComment() {
      if (this.selectedRating === 0) {
        alert("Пожалуйста, выберите рейтинг.");
        return;
      }
      if (this.myComment) return;

      const commentData = {
        productId: this.$route.params.product,
        rating: this.selectedRating,
        review_text: this.commentText,
      };
      let formData = new FormData();
      formData.append("commentData", JSON.stringify(commentData));
      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v1/addComment",
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
            "https://ce95524.tw1.ru/api/v1/getCommentProductById/" +
              this.$route.params.product
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
    async fetchMyComments() {
      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v1/getComment/" +
            this.$route.params.product,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }

        const comments = await response.json();
        // Предполагается, что response.data — массив комментариев
        this.myComment = comments.data.length > 0;
      } catch (error) {
        console.error("Ошибка при получении комментариев:", error);
        this.myComment = false; // На всякий случай
      }
    },
    async getStoresProduct() {
      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v1/getStoresProduct/" +
            this.$route.params.product
        );

        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }

        const stores = await response.json();
        this.stores = stores.data;
        this.stores = this.stores.filter((store) => store.count !== "0");
      } catch (error) {
        console.error("Ошибка при получении комментариев:", error);
        this.stores = null; // На всякий случай
      }
    },

    toggleFavorite() {
      const index = this.favorites.indexOf(this.$route.params.product);
      if (index === -1) {
        this.favorites.push(this.$route.params.product);
      } else {
        this.favorites.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },

    // Проверка, находится ли товар в корзине с учетом размера и цвета
    isInCart() {
      if (!this.cart) return false;

      return this.cart.some((item) => {
        if (typeof item === "object") {
          return (
            item.id === this.$route.params.product &&
            item.size === this.selectedSize &&
            item.color === this.selectedColor
          );
        }
        return false;
      });
    },

    // Добавление/удаление товара из корзины с учетом размера и цвета
    toggleCart() {
      if (!this.selectedSize || !this.selectedColor) {
        alert("Пожалуйста, выберите размер и цвет товара");
        return;
      }

      // Создаем объект товара с выбранными параметрами
      const productItem = {
        id: this.$route.params.product,
        size: this.selectedSize,
        color: this.selectedColor,
      };

      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = this.cart.findIndex((item) => {
        if (typeof item === "object") {
          return (
            item.id === productItem.id &&
            item.size === productItem.size &&
            item.color === productItem.color
          );
        }
        return false;
      });

      if (existingItemIndex !== -1) {
        // Если товар уже в корзине, удаляем его
        this.cart.splice(existingItemIndex, 1);
      } else {
        // Если товара нет в корзине, добавляем его
        this.cart.push(productItem);
      }

      // Обновляем localStorage
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // Выбор размера
    selectSize(size) {
      this.selectedSize = size;
    },

    // Выбор цвета
    selectColor(color) {
      this.selectedColor = color;
    },

    fetchProduct(id) {
      fetch("https://ce95524.tw1.ru/api/v1/getProductById/" + id).then(
        (response) => {
          return response.json().then((data) => {
            this.product = data.data[0];
            this.currentImage = this.product.image;
            this.product.sizes = JSON.parse(this.product.sizes);
            this.otherImages = JSON.parse(this.product.images);
            this.product.product_care = JSON.parse(this.product.product_care);
            this.product.characteristic = JSON.parse(
              this.product.characteristic
            );

            this.productCount = Number(this.product.count);

            // Парсим доступные цвета
            this.availableColors = JSON.parse(this.product.availableColors);

            // Парсим изображения цветов
            this.parsedColorsImages = JSON.parse(this.product.colorsImages);

            // Устанавливаем начальные значения для размера и цвета
            if (this.product.sizes && this.product.sizes.length > 0) {
              this.selectedSize = this.product.size;
            }

            if (this.availableColors && this.availableColors.length > 0) {
              this.selectedColor = this.product.color;
            }
            this.checkCartForProduct(id);
          });
        }
      );
      fetch("https://ce95524.tw1.ru/api/v1/getCommentProductById/" + id).then(
        (response) => {
          return response.json().then((data) => {
            this.comments = data.data;
          });
        }
      );
      fetch("https://ce95524.tw1.ru/api/v1/similarProducts/" + id).then(
        (response) => {
          return response.json().then((data) => {
            this.newItems = data.data;
          });
        }
      );
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
    // Проверяем, есть ли товар в корзине и устанавливаем выбранные параметры
    checkCartForProduct(productId) {
      const cartItem = this.cart.find((item) => {
        if (typeof item === "object") {
          return item.id === productId;
        }
        return item === productId; // Для обратной совместимости
      });

      if (cartItem && typeof cartItem === "object") {
        // Если товар найден в корзине, устанавливаем выбранные параметры
        if (cartItem.size && this.product.sizes.includes(cartItem.size)) {
          this.selectedSize = cartItem.size;
        }

        if (cartItem.color && this.availableColors.includes(cartItem.color)) {
          this.selectedColor = cartItem.color;
        }
      }
    },

    calculateVisibleSlidesNew() {
      this.$nextTick(() => {
        if (this.$refs.sliderNew && this.$refs.sliderNew.firstElementChild) {
          const sliderBox = this.$refs.sliderNew.parentElement;
          const item = this.$refs.sliderNew.firstElementChild;
          const itemStyle = window.getComputedStyle(item);

          this.itemWidthNew =
            item.offsetWidth +
            parseInt(itemStyle.marginLeft) +
            parseInt(itemStyle.marginRight);

          this.sliderWidthNew = sliderBox.clientWidth;
          this.visibleSlidesNew = Math.floor(
            this.sliderWidthNew / this.itemWidthNew
          );
        }
      });
    },
    slideNew(direction) {
      const maxScrollPositionNew =
        (this.maxSlidesNew - this.visibleSlidesNew) * this.itemWidthNew;

      const newPosition =
        this.$refs.sliderNew.scrollLeft +
        direction * this.itemWidthNew * this.visibleSlidesNew;

      const scrollTo = Math.max(0, Math.min(newPosition, maxScrollPositionNew));

      this.$refs.sliderNew.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      this.currentSlideNew = Math.round(scrollTo / this.itemWidthNew);
    },
    handleScrollNew() {
      this.currentSlideNew = Math.round(
        this.$refs.sliderNew.scrollLeft / this.itemWidthNew
      );
    },
    switchImage(index) {
      // Меняем местами текущее изображение и выбранное
      const temp = this.currentImage;
      this.currentImage = this.otherImages[index];
      this.otherImages[index] = temp;
    },
    toggleBlock(blockName) {
      this.openBlocks[blockName] = !this.openBlocks[blockName];
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    getNormalFormatDate(d) {
      const dateString = d;
      const date = new Date(dateString);

      const day = date.getDate();
      const hours = date.getHours();

      const formattedDate = new Date(date);
      if (hours >= 23) {
        formattedDate.setDate(day + 1);
      }

      const monthNames = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      const formattedDay = formattedDate.getDate();
      const formattedMonth = monthNames[formattedDate.getMonth()];

      // Итоговая строка
      const result = `${formattedDay} ${formattedMonth}`;
      return result;
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/pages/dist/min/productCategory.min.css";
</style>