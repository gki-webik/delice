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
            <div class="poster">
              <img src="/media/images/MaskProduct.png" alt="" />
            </div>
            <div class="slider_box">
              <div class="slider" ref="slider" @scroll="handleScroll">
                <div
                  class="slider__item"
                  v-for="(item, index) in items"
                  :key="index"
                >
                  <img src="/media/images/MaskProduct.png" alt="" />
                  <span class="name">Название {{ index + 1 }}</span>
                  <span class="price">1000₽</span>
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
            <div class="poster">
              <img src="/media/images/MaskProduct.png" alt="" />
            </div>
            <div class="slider_box">
              <div class="slider" ref="sliderNew" @scroll="handleScrollNew">
                <div
                  class="slider__item"
                  v-for="(item, index) in newItems"
                  :key="index"
                >
                  <img src="/media/images/MaskProduct.png" alt="" />
                  <span class="name">Новинка {{ index + 1 }}</span>
                  <span class="price">1000₽</span>
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
      <div class="block5">
        <div class="max-container">
          <h2>БЛОГ</h2>
        </div>
        <div class="box">
          <div class="max-container">
            <h3>Самые модные сумки сезона весна-лето 2025</h3>
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
                <div class="blog-item">
                  <div class="blog-images">
                    <img src="/media/images/bag__item.png" alt="Модная сумка" />
                    <img
                      src="/media/images/bag__item2.png"
                      alt="Модная сумка"
                    />
                    <img
                      src="/media/images/bag__item3.png"
                      alt="Модная сумка"
                    />
                  </div>
                  <div class="blog-content">
                    <p>
                      Новый сезон — еще одна возможность начать с чистого листа,
                      особенно если все предыдущие месяцы вы откладывали
                      преображение. При обновлении гардероба важно уделить
                      внимание не только модной одежде, но и аксессуарам. Сумка
                      играет ключевую роль в образе — задает настроение,
                      объединяет детали и может полностью изменить восприятие
                      наряда.
                    </p>
                    <p>
                      Вместе со стилистом выяснили, какие сумки сейчас модные, и
                      собрали для вас подборку новинок.
                    </p>
                    <p class="read-more">
                      <a href="">Читать полностью ></a>
                    </p>
                  </div>
                </div>

                <div class="blog-item">
                  <div class="blog-images">
                    <img src="/media/images/bag__item.png" alt="Модная сумка" />
                    <img
                      src="/media/images/bag__item2.png"
                      alt="Модная сумка"
                    />
                    <img
                      src="/media/images/bag__item3.png"
                      alt="Модная сумка"
                    />
                  </div>
                  <div class="blog-content">
                    <p>
                      Новый сезон — еще одна возможность начать с чистого листа,
                      особенно если все предыдущие месяцы вы откладывали
                      преображение. При обновлении гардероба важно уделить
                      внимание не только модной одежде, но и аксессуарам.
                    </p>
                    <p class="read-more">
                      <a href="">Читать полностью ></a>
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
      items: Array(10).fill(0),
      newItems: Array(10).fill(0),
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
    };
  },
  components: { IsHeaderCategory },
  computed: {
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
      const newPosition =
        this.$refs.sliderBlog.scrollLeft + direction * this.blogItemWidth;

      // Для бесконечного слайдера
      if (direction === 1 && this.currentBlogSlide === this.maxBlogSlides - 1) {
        this.currentBlogSlide = 0;
        this.$refs.sliderBlog.scrollLeft = 0;
      } else if (direction === -1 && this.currentBlogSlide === 0) {
        this.currentBlogSlide = this.maxBlogSlides - 1;
        this.$refs.sliderBlog.scrollLeft =
          this.blogItemWidth * (this.maxBlogSlides - 1);
      } else {
        this.currentBlogSlide += direction;
        this.$refs.sliderBlog.scrollTo({
          left: newPosition,
          behavior: "smooth",
        });
      }
    },
    handleScrollBlog() {
      this.currentBlogSlide = Math.round(
        this.$refs.sliderBlog.scrollLeft / this.blogItemWidth
      );
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
  },
};
</script>

<style scoped>
@import "../assets/styles/dist/min/index.min.css";
</style>