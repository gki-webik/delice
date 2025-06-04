<template>
  <main class="boxMainCatalog">
    <div class="max-container">
      <div class="top">
        <nav class="is-kroshki">
          <router-link to="/">Главная</router-link>
          <a class="is-end">{{
            searchQuery ? "Поиск: " + searchQuery : "Каталог"
          }}</a>
        </nav>
        <button
          type="button"
          @click="showFiltersMobile = !showFiltersMobile"
          class="filterBtn"
        >
          Фильтры
        </button>
        <div class="filter" :class="{ 'is-no-active': !showFiltersMobile }">
          <div class="filter-container" v-if="showFilters || showFiltersMobile">
            <div class="filter-section">
              <img
                src="/media/images/filter__icon.svg"
                class="is-cursorPointer is-img-sort"
                alt="Фильтр"
                @click="toggleDropdown('showSortDropdown')"
              />
              <div class="dropdown-options" v-if="showSortDropdown">
                <label class="radio-option">
                  <input
                    type="radio"
                    v-model="sortOption"
                    value="priceAsc"
                    @change="sortProducts"
                  />
                  <span>По цене (возрастание)</span>
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    v-model="sortOption"
                    value="priceDesc"
                    @change="sortProducts"
                  />
                  <span>По цене (убывание)</span>
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    v-model="sortOption"
                    value="nameAsc"
                    @change="sortProducts"
                  />
                  <span>По названию (А-Я)</span>
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    v-model="sortOption"
                    value="nameDesc"
                    @change="sortProducts"
                  />
                  <span>По названию (Я-А)</span>
                </label>
              </div>
            </div>
            <div class="filter-section">
              <h3
                class="filter-title"
                @click="toggleDropdown('showCategoryDropdown')"
              >
                Категория
                <img
                  src="/media/images/filter__icon__dropdown.svg"
                  alt="Раскрыть"
                  :class="{ rotated: showCategoryDropdown }"
                />
              </h3>
              <div
                class="dropdown-options category-dropdown"
                v-if="showCategoryDropdown"
              >
                <div
                  v-for="(subcategories, category) in categories"
                  :key="category"
                  class="category-group"
                >
                  <h4
                    class="category-title"
                    :class="{ 'no-cursor': $route.params.name }"
                    v-if="
                      $route.params.name
                        ? openSubcategories.includes(category)
                        : true
                    "
                    @click="
                      $route.params.name ? null : toggleSubcategory(category)
                    "
                  >
                    {{ category }}
                    <img
                      src="/media/images/filter__icon__dropdown.svg"
                      alt="Раскрыть"
                      class="dropdown-icon"
                      v-if="!$route.params.name"
                      :class="{ rotated: openSubcategories.includes(category) }"
                    />
                  </h4>
                  <div
                    class="subcategory-options"
                    v-if="openSubcategories.includes(category)"
                  >
                    <label
                      v-for="subcategory in subcategories"
                      :key="subcategory"
                      class="dropdown-option"
                    >
                      <input
                        type="checkbox"
                        v-model="selectedCategories"
                        :value="subcategory"
                        @change="applyFilters"
                      />
                      <span>{{ subcategory }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="filter-section">
              <h3
                class="filter-title"
                @click="toggleDropdown('showColorDropdown')"
              >
                Цвет
                <img
                  src="/media/images/filter__icon__dropdown.svg"
                  alt="Раскрыть"
                  :class="{ rotated: showColorDropdown }"
                />
              </h3>
              <div class="dropdown-options" v-if="showColorDropdown">
                <label
                  v-for="color in availableColors"
                  :key="color"
                  class="dropdown-option"
                >
                  <input
                    type="checkbox"
                    v-model="selectedColors"
                    :value="color"
                    @change="applyFilters"
                  />
                  <span
                    class="color-indicator"
                    :style="{ backgroundColor: getColorCode(color) }"
                  ></span>
                  <span>{{ color }}</span>
                </label>
              </div>
            </div>

            <div class="filter-section is-sizeSection">
              <h3
                class="filter-title"
                @click="toggleDropdown('showSizesDropdown')"
              >
                Размеры
                <img
                  src="/media/images/filter__icon__dropdown.svg"
                  alt="Раскрыть"
                />
              </h3>
              <div class="size-options" v-show="showSizesDropdown">
                <label
                  v-for="size in availableSizes"
                  :key="size"
                  class="size-option"
                  :class="{ active: selectedSizes.includes(size) }"
                >
                  <input
                    type="checkbox"
                    v-model="selectedSizes"
                    :value="size"
                    @change="applyFilters"
                  />
                  <span>{{ size }}</span>
                </label>
              </div>
            </div>

            <div class="filter-section is-price">
              <h3
                class="filter-title"
                @click="toggleDropdown('showPriceDropdown')"
              >
                Цена
                <img
                  src="/media/images/filter__icon__dropdown.svg"
                  alt="Раскрыть"
                />
              </h3>
              <div class="boxInput" v-show="showPriceDropdown">
                <div class="input">
                  <input
                    type="number"
                    v-model.number="minPrice"
                    @change="handlePriceChange"
                    :min="0"
                    :max="maxPriceLimit"
                  />
                  <span>₽</span>
                </div>
                <span class="is-line"></span>
                <div class="input">
                  <input
                    type="number"
                    v-model.number="maxPrice"
                    @change="handlePriceChange"
                    :min="minPrice"
                    :max="maxPriceLimit"
                  />
                  <span>₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="searchQuery" class="search-results-info">
        Найдено товаров: {{ filteredProducts.length }}
        <button class="reset-search" @click="resetSearch">
          Сбросить поиск
        </button>
      </div>

      <div v-if="loading" class="loading">
        <p>Загрузка товаров...</p>
      </div>

      <div
        v-if="!loading && paginatedProducts.length === 0"
        class="no-products"
      >
        <p>
          По вашему запросу ничего не найдено. Попробуйте изменить параметры
          фильтрации.
        </p>
      </div>

      <div v-else class="cards">
        <div
          class="card"
          v-for="(product, index) in paginatedProducts"
          :key="index"
          @click="viewProductDetails(product)"
        >
          <img :src="product.image" class="is-product" alt="" />
          <div class="content">
            <div class="name">{{ product.name }}</div>
            <div class="price">{{ formatPrice(product.price) }} ₽</div>
            <div class="actions">
              <svg
                width="27"
                height="25"
                viewBox="0 0 27 25"
                fill="none"
                class="is-heart"
                @click.stop="toggleFavorite(product)"
                :class="{ 'is-favorite': favorites.includes(product.id) }"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.49338 2.46262C3.41 3.45074 1.88372 5.80103 1.88372 8.60367C1.88372 11.4669 3.01297 13.6739 4.63181 15.5653C5.96602 17.1241 7.58115 18.4161 9.1563 19.6761C9.53042 19.9754 9.90228 20.2729 10.2676 20.5717C10.9282 21.1121 11.5174 21.5862 12.0855 21.9306C12.6537 22.2753 13.1112 22.4326 13.5 22.4326C13.8888 22.4326 14.3463 22.2753 14.9145 21.9306C15.4826 21.5862 16.0718 21.1121 16.7325 20.5717C17.0978 20.2729 17.4696 19.9754 17.8437 19.6761C19.4189 18.4161 21.034 17.1241 22.3682 15.5653C23.9871 13.6739 25.1163 11.4669 25.1163 8.60367C25.1163 5.80103 23.59 3.45074 21.5066 2.46262C19.4826 1.50267 16.763 1.75689 14.1786 4.54297C14.0011 4.73437 13.7561 4.84252 13.5 4.84252C13.2439 4.84252 12.9989 4.73437 12.8214 4.54297C10.237 1.75689 7.51739 1.50267 5.49338 2.46262ZM13.5 2.50774C10.5965 -0.187672 7.34521 -0.56473 4.71026 0.68499C1.92731 2.0049 0 5.06977 0 8.60367C0 12.0769 1.39458 14.7266 3.22332 16.8632C4.68779 18.5742 6.48028 20.0063 8.06337 21.271C8.42223 21.5577 8.77033 21.8359 9.10141 22.1067C9.74468 22.6328 10.4352 23.1939 11.1351 23.6182C11.8347 24.0423 12.633 24.3871 13.5 24.3871C14.367 24.3871 15.1653 24.0423 15.8649 23.6182C16.5648 23.1939 17.2553 22.6328 17.8986 22.1067C18.2296 21.8359 18.5778 21.5577 18.9367 21.271C20.5198 20.0063 22.3122 18.5742 23.7767 16.8632C25.6054 14.7266 27 12.0769 27 8.60367C27 5.06977 25.0727 2.0049 22.2897 0.68499C19.6547 -0.56473 16.4036 -0.187672 13.5 2.50774Z"
                  fill="#26436C"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          &laquo; Назад
        </button>

        <div class="page-numbers">
          <button
            v-for="page in displayedPages"
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Вперед &raquo;
        </button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      currentCategoryUrl: null,
      showFilters: true,
      showFiltersMobile: false,
      showCategoryDropdown: false,
      showColorDropdown: false,
      showSizesDropdown: false,
      showSortDropdown: false,
      showPriceDropdown: false,
      selectedCategories: [],
      selectedColors: [],
      selectedSizes: [],
      minPrice: 0,
      maxPrice: 100000000,
      maxPriceLimit: 100000000,
      currentPage: 1,
      itemsPerPage: 25,
      openSubcategories: [],
      sortOption: "priceAsc",
      loading: false,
      favorites: [],
      searchQuery: "",
      searchCategory: "",
      categories: {
        "ЖЕНСКАЯ ОДЕЖДА": [
          "блузы и рубашки",
          "боди",
          "брюки",
          "верхняя одежда",
          "джемперы, свитера и кардиганы",
          "джинсы",
          "комбинезоны",
          "пиджаки и костюмы",
          "платья",
          "топы и майки",
          "футболки и поло",
          "худи и свитшоты",
          "шорты",
          "юбки",
        ],
        "МУЖСКАЯ ОДЕЖДА": [
          "брюки",
          "верхняя одежда",
          "джемперы, свитера и кардиганы",
          "джинсы",
          "комбинезоны",
          "майки",
          "пиджаки и костюмы",
          "рубашки",
          "футболки и поло",
          "худи и свитшоты",
          "шорты",
        ],
        АКСЕССУАРЫ: [
          "головные уборы",
          "кошельки и визитницы",
          "очки",
          "ремни и пояса",
          "рюкзаки",
          "сумки",
          "шарфы и платки",
        ],
        "ЖЕНСКАЯ ОБУВЬ": [
          "босоножки",
          "ботильоны",
          "ботинки",
          "вечерняя обувь",
          "кроссовки и кеды",
          "сабо",
          "сланцы",
          "туфли",
        ],
        "МУЖСКАЯ ОБУВЬ": [
          "ботинки",
          "кроссовки и кеды",
          "сабо",
          "сандалии",
          "сланцы",
          "туфли",
        ],
      },
      products: [],
      filteredProductsCache: [],
      availableColors: [
        "Белый",
        "Бежевый",
        "Голубой",
        "Желтый",
        "Зеленый",
        "Коричневый",
        "Красный",
        "Оранжевый",
        "Розовый",
        "Серый",
        "Синий",
        "Фиолетовый",
        "Черный",
      ],
      availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colorCodes: {
        Белый: "#ffffff",
        Бежевый: "#f5f5dc",
        Голубой: "#add8e6",
        Желтый: "#ffff00",
        Зеленый: "#008000",
        Коричневый: "#a52a2a",
        Красный: "#ff0000",
        Оранжевый: "#ffa500",
        Розовый: "#ffc0cb",
        Серый: "#808080",
        Синий: "#0000ff",
        Фиолетовый: "#800080",
        Черный: "#000000",
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
    };
  },
  watch: {
    "$route.params.name": {
      immediate: true,
      handler(categoryName) {
        if (categoryName) {
          this.handleCategoryFromUrl(categoryName);
        } else {
          this.resetFilters();
        }
      },
    },
    "$route.query": {
      handler() {
        this.handleSearchParams();
      },
      deep: true,
    },
  },
  computed: {
    filteredProducts() {
      return this.filteredProductsCache;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;

      if (this.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        let startPage = Math.max(2, this.currentPage - 1);
        let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

        if (this.currentPage <= 3) {
          endPage = Math.min(this.totalPages - 1, 4);
        }

        if (this.currentPage >= this.totalPages - 2) {
          startPage = Math.max(2, this.totalPages - 3);
        }

        if (startPage > 2) {
          pages.push("...");
        }
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < this.totalPages - 1) {
          pages.push("...");
        }

        pages.push(this.totalPages);
      }

      return pages;
    },
  },
  created() {
    this.loadProducts();
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites);
    }
    this.handleSearchParams();
  },
  methods: {
    handleSearchParams() {
      const query = this.$route.query.q;
      const category = this.$route.query.category;

      if (query) {
        this.searchQuery = query;

        if (category) {
          this.searchCategory = category;
          if (this.categoryUrlMap[category]) {
            const categoryName = this.categoryUrlMap[category];
            if (
              categoryName === "Популярные товары" ||
              categoryName === "Новинки" ||
              categoryName === "Скидки до 50%"
            ) {
              this.selectedCategories = [];
            } else {
              this.openSubcategories = [categoryName];
              if (this.categories[categoryName]) {
                this.selectedCategories = [...this.categories[categoryName]];
              }
            }
          }
        } else {
          this.selectedCategories = [];
          this.searchCategory = "";
        }

        this.performSearch();
      } else {
        this.applyFilters();
      }
    },
    loadProducts() {
      this.loading = true;
      setTimeout(() => {
        this.fetchProducts();
        this.applyFilters();
        this.loading = false;
      }, 800);
    },
    transliterate(text) {
      for (const [urlKey, categoryName] of Object.entries(
        this.categoryUrlMap
      )) {
        if (text === categoryName) {
          return urlKey;
        }
      }

      const translitMap = {};

      if (typeof text !== "string") return "";

      return text
        .split("")
        .map((char) => {
          const lowerChar = char.toLowerCase();
          const isUpperCase = char !== lowerChar;
          const translitChar = translitMap[lowerChar] || char;
          return isUpperCase
            ? translitChar.charAt(0).toUpperCase() + translitChar.slice(1)
            : translitChar;
        })
        .join("");
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    toggleDropdown(dropdownName) {
      const dropdowns = [
        "showCategoryDropdown",
        "showSizesDropdown",
        "showSortDropdown",
        "showColorDropdown",
        "showPriceDropdown",
      ];

      dropdowns.forEach((name) => {
        this[name] = name === dropdownName ? !this[name] : false;
      });
    },
    toggleSubcategory(category) {
      if (this.openSubcategories.includes(category)) {
        this.openSubcategories = this.openSubcategories.filter(
          (c) => c !== category
        );
      } else {
        this.openSubcategories.push(category);
      }
    },
    handleCategoryFromUrl(categoryName) {
      // Сбрасываем предыдущие фильтры
      this.selectedColors = [];
      this.selectedSizes = [];
      this.minPrice = 0;
      this.maxPrice = this.maxPriceLimit;
      this.selectedCategories = [];

      // Проверяем, является ли категория специальной (popular или new)
      if (categoryName === "popular") {
        this.currentCategoryUrl = categoryName;
        this.fetchPopularProducts();
        return; // Важно: прерываем выполнение метода здесь
      }

      if (categoryName === "new") {
        this.currentCategoryUrl = categoryName;
        this.fetchNewProducts();
        return; // Важно: прерываем выполнение метода здесь
      }

      // Если это одна из основных категорий (women_clothing, men_clothing и т.д.)
      if (this.categoryUrlMap[categoryName]) {
        const categoryToSelect = this.categoryUrlMap[categoryName];
        this.openSubcategories = [categoryToSelect];

        if (this.categories[categoryToSelect]) {
          this.selectedCategories = [...this.categories[categoryToSelect]];
        }

        // Сохраняем текущую категорию URL для фильтрации
        this.currentCategoryUrl = categoryName;
      } else {
        // Если это подкатегория
        let foundCategory = false;
        for (const [category, subcategories] of Object.entries(
          this.categories
        )) {
          if (subcategories.includes(categoryName)) {
            this.openSubcategories = [category];
            this.selectedCategories = [categoryName];
            foundCategory = true;
            break;
          }
        }

        if (!foundCategory && ["sale"].includes(categoryName)) {
          this.selectedCategories = [];
          this.currentCategoryUrl = categoryName;
        } else {
          this.currentCategoryUrl = null;
        }
      }

      // Загружаем обычные товары и применяем фильтры
      this.fetchProducts();
      this.applyFilters();
    },
    fetchPopularProducts() {
      this.loading = true;
      fetch("https://delice-spb.ru/api/v1/popularProductsAll")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Получены популярные товары:", data);
          this.products = data.data || [];
          this.filteredProductsCache = [...this.products];
          this.currentPage = 1;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Ошибка при загрузке популярных товаров:", error);
          this.loading = false;
        });
    },

    fetchNewProducts() {
      this.loading = true;
      fetch("https://delice-spb.ru/api/v1/newProductsAll")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Получены новые товары:", data);
          this.products = data.data || [];
          this.filteredProductsCache = [...this.products];
          this.currentPage = 1;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Ошибка при загрузке новых товаров:", error);
          this.loading = false;
        });
    },
    applyAdditionalFilters() {
      let filtered = this.products.filter((product) => {
        if (
          this.selectedCategories.length > 0 &&
          !this.selectedCategories.includes(product.category)
        ) {
          return false;
        }
        // Фильтр по цвету
        if (
          this.selectedColors.length > 0 &&
          !this.selectedColors.includes(product.color)
        ) {
          return false;
        }

        // Фильтр по размеру
        if (
          this.selectedSizes.length > 0 &&
          !this.selectedSizes.includes(product.size)
        ) {
          return false;
        }

        // Фильтр по цене
        if (product.price < this.minPrice || product.price > this.maxPrice) {
          return false;
        }

        return true;
      });

      this.sortProductsList(filtered);
      this.filteredProductsCache = filtered;
    },
    applyFilters() {
      if (
        this.currentCategoryUrl === "popular" ||
        this.currentCategoryUrl === "new"
      ) {
        this.applyAdditionalFilters();
        return;
      }
      if (this.searchQuery) {
        this.performSearch();
      } else {
        this.loading = true;

        setTimeout(() => {
          let filtered = this.products.filter((product) => {
            // Проверка на соответствие categoryUrl, если установлен
            if (this.$route.params.name && this.currentCategoryUrl) {
              if (product.categoryUrl !== this.currentCategoryUrl) {
                return false;
              }
            }

            // Проверка на соответствие выбранным категориям
            if (this.selectedCategories.length > 0) {
              if (!this.selectedCategories.includes(product.category)) {
                return false;
              }
            }

            // Остальные фильтры без изменений
            if (
              this.selectedColors.length > 0 &&
              !this.selectedColors.includes(product.color)
            ) {
              return false;
            }
            if (
              this.selectedSizes.length > 0 &&
              !this.selectedSizes.includes(product.size)
            ) {
              return false;
            }
            if (
              product.price < this.minPrice ||
              product.price > this.maxPrice
            ) {
              return false;
            }
            return true;
          });

          this.sortProductsList(filtered);
          this.filteredProductsCache = filtered;
          this.currentPage = 1;
          this.loading = false;
        }, 300);
      }
    },

    // Также модифицируем метод performSearch
    performSearch() {
      this.loading = true;

      setTimeout(() => {
        let filtered = this.products.filter((product) => {
          const matchesQuery = this.searchQuery
            ? product.name
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase())
            : true;

          // Проверка на соответствие categoryUrl, если установлен
          const matchesCategoryUrl = this.currentCategoryUrl
            ? product.categoryUrl === this.currentCategoryUrl
            : true;

          let matchesCategory = true;
          if (this.selectedCategories.length > 0) {
            matchesCategory = this.selectedCategories.includes(
              product.category
            );
          }

          const matchesColor =
            this.selectedColors.length > 0
              ? this.selectedColors.includes(product.color)
              : true;

          const matchesSize =
            this.selectedSizes.length > 0
              ? this.selectedSizes.includes(product.size)
              : true;

          const matchesPrice =
            product.price >= this.minPrice && product.price <= this.maxPrice;

          return (
            matchesQuery &&
            matchesCategoryUrl &&
            matchesCategory &&
            matchesColor &&
            matchesSize &&
            matchesPrice
          );
        });

        this.sortProductsList(filtered);
        this.filteredProductsCache = filtered;
        this.currentPage = 1;
        this.loading = false;
      }, 300);
    },
    resetSearch() {
      this.searchQuery = "";
      this.$router.push({
        path: this.$route.path,
        query: {},
      });
      this.resetFilters();
    },
    resetFilters() {
      this.selectedCategories = [];
      this.selectedColors = [];
      this.selectedSizes = [];
      this.minPrice = 0;
      this.maxPrice = this.maxPriceLimit;
      this.currentCategoryUrl = null;
      this.applyFilters();
    },
    sortProducts() {
      this.sortProductsList(this.filteredProductsCache);
    },
    sortProductsList(productsList) {
      switch (this.sortOption) {
        case "priceAsc":
          productsList.sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          productsList.sort((a, b) => b.price - a.price);
          break;
        case "nameAsc":
          productsList.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          productsList.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    },
    handlePriceChange() {
      if (
        this.currentCategoryUrl === "popular" ||
        this.currentCategoryUrl === "new"
      ) {
        this.applyAdditionalFilters();
      } else {
        this.applyFilters();
      }
    },
    changePage(page) {
      if (typeof page === "number") {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    viewProductDetails(product) {
      this.$router.push(`/catalog/product/${product.id}`);
    },
    toggleFavorite(product) {
      const index = this.favorites.indexOf(product.id);
      if (index === -1) {
        this.favorites.push(product.id);
      } else {
        this.favorites.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    getColorCode(colorName) {
      return this.colorCodes[colorName] || "#cccccc";
    },
    fetchProducts() {
      this.loading = true;
      fetch("https://delice-spb.ru/api/v1/products")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          this.products = data.data || [];
          this.applyFilters(); // Применяем фильтры после загрузки
          this.loading = false;
        })
        .catch((error) => {
          console.error("Ошибка при загрузке товаров:", error);
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/pages/dist/min/catalog.min.css";
</style>