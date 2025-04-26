<template>
  <div>
    <main class="boxMainPage">
      <div class="max-container">
        <div class="block1">
          <IsHeaderCategory></IsHeaderCategory>
          <img src="/media/images/Mask_group.png" class="is-1" alt="" />
        </div>
        <div class="block2">
          <div class="items">
            <div class="item">
              <img src="/media/images/Mask_group2.png" alt="" />
              <span>Скидка 15% на первый заказ</span>
            </div>
            <div class="item">
              <img src="/media/images/Mask_group3.png" alt="" />
              <span>1+1=3 на аксессуары</span>
            </div>
            <div class="item">
              <img src="/media/images/Mask_group4.png" alt="" />
              <span>Подарок при заказе на сумму от 5 000 ₽</span>
            </div>
          </div>
        </div>
        <div class="block3">
          <h2>ПОПУЛЯРНЫЕ ТОВАРЫ</h2>
          <div class="tape">
            <!-- <div class="poster">
              <img src="/media/images/MaskProduct.png" alt="" />
            </div> -->
            <div class="slider_box">
              <div class="slider" ref="slider" @scroll="handleScroll">
                <div
                  class="slider__item"
                  v-for="(item, index) in items"
                  :key="index"
                  @click="goToProduct(item.id)"
                >
                  <img :src="item.image" alt="" />
                  <span class="name">{{ item.name }}</span>
                  <span class="price">{{ formatPrice(item.price) }}₽</span>
                </div>
              </div>
            </div>
            <button
              class="sliderButtonPrev"
              @click="slide(-1)"
              :disabled="currentSlide === 0"
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
              @click="slide(1)"
              :disabled="currentSlide >= maxSlides - visibleSlides"
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
        <div class="block4">
          <h2>НОВИНКИ</h2>
          <div class="tape">
            <div class="slider_box">
              <div class="slider" ref="sliderNew" @scroll="handleScrollNew">
                <div
                  class="slider__item"
                  v-for="(item, index) in newItems"
                  @click="goToProduct(item.id)"
                  :key="index"
                >
                  <img :src="item.image" alt="" />
                  <span class="name">{{ item.name }}</span>
                  <span class="price">{{ formatPrice(item.price) }}₽</span>
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
      <div class="block5" v-if="blogItems && blogItems.length">
        <div class="max-container">
          <h2>БЛОГ</h2>
        </div>
        <div class="box">
          <div class="max-container">
            <h3>{{ currentBlogTitle }}</h3>
          </div>
          <div class="slider-container">
            <button
              class="sliderButtonPrev"
              @click="slideBlog(-1)"
              :disabled="currentBlogSlide === 0"
            >
              <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
                <line
                  x1="7.38302"
                  y1="15.339"
                  x2="0.95515"
                  y2="7.67856"
                  stroke="#c9b297"
                />
                <line
                  x1="7.61698"
                  y1="0.678606"
                  x2="1.1891"
                  y2="8.33905"
                  stroke="#c9b297"
                />
              </svg>
            </button>

            <div class="slider-wrapper">
              <div
                class="slider-blog"
                ref="sliderBlog"
                @scroll="handleScrollBlog"
              >
                <div
                  class="blog-item"
                  v-for="(item, index) in blogItems"
                  :key="index"
                >
                  <div class="blog-images">
                    <img
                      :src="item_img"
                      v-for="(item_img, index_img) in item.images"
                      :key="index_img"
                      alt="Модная сумка"
                    />
                  </div>
                  <div class="blog-content">
                    <p
                      v-for="(item_text, index_text) in item.short_text"
                      :key="index_text"
                    >
                      {{ item_text }}
                    </p>
                    <p class="read-more">
                      <router-link :to="'/blog/' + item.id"
                        >Читать полностью ></router-link
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              class="sliderButtonNext"
              @click="slideBlog(1)"
              :disabled="currentBlogSlide >= maxBlogSlides - 1"
            >
              <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
                <line
                  x1="0.616978"
                  y1="15.339"
                  x2="7.04485"
                  y2="7.67856"
                  stroke="#c9b297"
                />
                <line
                  x1="0.383022"
                  y1="0.678606"
                  x2="6.8109"
                  y2="8.33905"
                  stroke="#c9b297"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import IsHeaderCategory from "./parts/IsHeaderCategory.vue";
export default {
  data() {
    return {
      items: [],
      newItems: [],
      currentSlide: 0,
      currentSlideNew: 0,
      visibleSlides: 4,
      visibleSlidesNew: 4,
      itemWidth: 200,
      itemWidthNew: 200,
      sliderWidth: 0,
      sliderWidthNew: 0,
      currentBlogSlide: 0,
      maxBlogSlides: 2,
      blogItemWidth: 0,
      blogItems: null,
      currentBlogTitleIndex: 0,
    };
  },
  components: { IsHeaderCategory },
  computed: {
    blogTitles() {
      return this.blogItems ? this.blogItems.map((item) => item.name) : [];
    },
    currentBlogTitle() {
      if (this.blogTitles.length === 0) return "Блог";
      return this.blogTitles[this.currentBlogTitleIndex] || "Блог";
    },
    maxSlides() {
      return this.items.length;
    },
    maxSlidesNew() {
      return this.newItems.length;
    },
    maxScrollPosition() {
      return (this.maxSlides - this.visibleSlides) * this.itemWidth;
    },
    maxScrollPositionNew() {
      return (this.maxSlidesNew - this.visibleSlidesNew) * this.itemWidthNew;
    },
  },
  mounted() {
    this.calculateVisibleSlides();
    this.calculateVisibleSlidesNew();
    this.calculateBlogItemWidth();
    window.addEventListener("resize", this.calculateVisibleSlides);
    window.addEventListener("resize", this.calculateVisibleSlidesNew);
    window.addEventListener("resize", this.calculateBlogItemWidth);
    this.fetchPopularProducts();
    this.fetchNewProducts();
    this.fetchBlogPosts();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateVisibleSlides);
    window.removeEventListener("resize", this.calculateVisibleSlidesNew);
    window.removeEventListener("resize", this.calculateBlogItemWidth);
  },
  methods: {
    calculateBlogItemWidth() {
      this.$nextTick(() => {
        if (this.$refs.sliderBlog && this.$refs.sliderBlog.firstElementChild) {
          const item = this.$refs.sliderBlog.firstElementChild;
          const itemStyle = window.getComputedStyle(item);

          this.blogItemWidth =
            item.offsetWidth +
            parseInt(itemStyle.marginLeft) +
            parseInt(itemStyle.marginRight);
        }
      });
    },
    slideBlog(direction) {
      const newSlideIndex = this.currentBlogSlide + direction;

      if (newSlideIndex < 0) {
        this.currentBlogSlide = this.maxBlogSlides - 1;
        this.currentBlogTitleIndex = this.blogTitles.length - 1;
        this.$refs.sliderBlog.scrollLeft =
          this.blogItemWidth * (this.maxBlogSlides - 1);
      } else if (newSlideIndex >= this.maxBlogSlides) {
        this.currentBlogSlide = 0;
        this.currentBlogTitleIndex = 0;
        this.$refs.sliderBlog.scrollLeft = 0;
      } else {
        this.currentBlogSlide = newSlideIndex;
        this.currentBlogTitleIndex = newSlideIndex % this.blogTitles.length;
        const newPosition = this.blogItemWidth * this.currentBlogSlide;
        this.$refs.sliderBlog.scrollTo({
          left: newPosition,
          behavior: "smooth",
        });
      }
    },
    handleScrollBlog() {
      const index = Math.round(
        this.$refs.sliderBlog.scrollLeft / this.blogItemWidth
      );
      this.currentBlogSlide = index;
      this.currentBlogTitleIndex = index % this.blogTitles.length;
    },
    calculateVisibleSlides() {
      this.$nextTick(() => {
        if (this.$refs.slider && this.$refs.slider.firstElementChild) {
          const sliderBox = this.$refs.slider.parentElement;
          const item = this.$refs.slider.firstElementChild;
          const itemStyle = window.getComputedStyle(item);

          this.itemWidth =
            item.offsetWidth +
            parseInt(itemStyle.marginLeft) +
            parseInt(itemStyle.marginRight);

          this.sliderWidth = sliderBox.clientWidth;
          this.visibleSlides = Math.floor(this.sliderWidth / this.itemWidth);
        }
      });
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
    slide(direction) {
      const newPosition =
        this.$refs.slider.scrollLeft +
        direction * this.itemWidth * this.visibleSlides;
      const maxPosition = this.maxScrollPosition;

      const scrollTo = Math.max(0, Math.min(newPosition, maxPosition));

      this.$refs.slider.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      this.currentSlide = Math.round(scrollTo / this.itemWidth);
    },
    slideNew(direction) {
      const newPosition =
        this.$refs.sliderNew.scrollLeft +
        direction * this.itemWidthNew * this.visibleSlidesNew;
      const maxPosition = this.maxScrollPositionNew;

      const scrollTo = Math.max(0, Math.min(newPosition, maxPosition));

      this.$refs.sliderNew.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      this.currentSlideNew = Math.round(scrollTo / this.itemWidthNew);
    },
    handleScroll() {
      this.currentSlide = Math.round(
        this.$refs.slider.scrollLeft / this.itemWidth
      );
    },
    handleScrollNew() {
      this.currentSlideNew = Math.round(
        this.$refs.sliderNew.scrollLeft / this.itemWidthNew
      );
    },
    goToProduct(id) {
      this.$router.push("/catalog/product/" + id);
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    fetchPopularProducts() {
      fetch("https://ce95524.tw1.ru/api/v1/popularProducts").then(
        (response) => {
          return response.json().then((data) => {
            this.items = data.data;
          });
        }
      );
    },
    fetchNewProducts() {
      fetch("https://ce95524.tw1.ru/api/v1/newProducts").then((response) => {
        return response.json().then((data) => {
          this.newItems = data.data;
        });
      });
    },
    fetchBlogPosts() {
      fetch("https://ce95524.tw1.ru/api/v1/blogPosts")
        .then((response) => response.json())
        .then((data) => {
          this.blogItems = data.data.map((item) => {
            let images = [];
            let short_text = [];

            if (item.images && typeof item.images === "string") {
              try {
                images = JSON.parse(item.images);
                if (images.length > 3) {
                  images = images.slice(0, 3);
                }
              } catch (e) {
                console.error("Ошибка парсинга images:", e);
                images = [];
              }
            }
            if (item.short_text && typeof item.short_text === "string") {
              try {
                short_text = JSON.parse(item.short_text);
              } catch (e) {
                console.error("Ошибка парсинга short_text:", e);
                short_text = [];
              }
            }
            return {
              ...item,
              images,
              short_text,
            };
          });
        })
        .catch((error) => {
          console.error("Error fetching blog posts:", error);
        })
        .finally(() => {
          this.calculateBlogItemWidth();
          window.addEventListener("resize", this.calculateBlogItemWidth);
        });
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/dist/min/index.min.css";
</style>