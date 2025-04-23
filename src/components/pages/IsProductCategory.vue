<template>
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
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/catalog">Каталог</router-link>
        <router-link to="/catalog/women_clothing">Женская одежда</router-link>
        <a class="is-end">Футболка с текстовым принтом</a>
      </nav>
      <div class="block1">
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
          <h1>Футболка с текстовым принтом</h1>
          <div class="cost">2 900 ₽</div>
          <h3>Цвет</h3>
          <div class="colors">
            <img src="/media/images/Mask_group8.png" class="is-active" alt="" />
            <img src="/media/images/Mask_group8.png" alt="" />
            <img src="/media/images/Mask_group8.png" alt="" />
          </div>
          <h3>Размер</h3>
          <div class="sizes">
            <span class="is-active">XS</span>
            <span>S</span>
            <span>M</span>
            <span>L</span>
            <span>Xl</span>
            <a role="button" @click="showModalSizes = !showModalSizes"
              >Таблицы размеров</a
            >
          </div>
          <div class="actions">
            <button type="button" class="is-1">
              <img src="/media/images/cart__logo.svg" alt="" />
              Добавить в корзину
            </button>
            <button type="button" class="is-2">
              <svg
                width="27"
                height="25"
                viewBox="0 0 27 25"
                fill="none"
                class="is-heart"
                xmlns="http://www.w3.org/2000/svg"
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
              <span class="is-1">Забрать из <a href="">2 магазинов</a> </span>
              <span class="is-2">после предоплаты</span>
            </div>
          </div>
        </div>
      </div>
      <div class="block2">
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
            <li>Состав: 100% хлопок</li>
            <li>Страна производства: Бангладеш</li>
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
            <li>Максимальная температура стирки 30°С, мягкий режим</li>
            <li>Не отбеливать</li>
            <li>Не применять барабанную сушку</li>
            <li>
              Гладить при максимальной температуре подошвы утюга 110°С, без
              пара; глажение с паром может вызывать необратимые повреждения
            </li>
            <li>Сухая чистка запрещена</li>
          </ul>
          <hr v-show="openBlocks.care" />
        </div>
      </div>
      <div class="block3">
        <h2>ОТЗЫВЫ</h2>
        <div class="renting"><b>5,0</b> ★★★★★</div>
        <button type="button">Написать отзыв</button>
        <hr />
        <div class="items">
          <div class="item">
            <div class="name">Валерия</div>
            <div class="content">
              <div class="stars">★★★★★</div>
              <div>Хорошее качество! Идет в размер</div>
            </div>
            <div class="date">7 апреля</div>
          </div>
          <div class="item">
            <div class="name">Кристина</div>
            <div class="content">
              <div class="stars">★★★★★</div>
              <div>
                Недавно приобрела женскую футболку, и осталась очень довольна!
                Материал мягкий и приятный на ощупь, отлично сидит по фигуре.
                Футболка имеет стильный дизайн и яркий цвет, который отлично
                поднимает настроение. Она хорошо стирается и не теряет форму,
                даже после нескольких стирок. Подходит как для повседневной
                носки, так и для более нарядных образов. Рекомендую всем, кто
                ищет комфорт и стиль в одном флаконе!
              </div>
            </div>
            <div class="date">2 апреля</div>
          </div>
        </div>
      </div>
      <div class="block4">
        <h2>ПОХОЖИЕ ТОВАРЫ</h2>
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
  </main>
</template>

<script>
export default {
  data() {
    return {
      newItems: Array(10).fill(0),
      currentSlideNew: 0,
      visibleSlidesNew: 4,
      itemWidthNew: 200,
      sliderWidthNew: 0,
      showModalSizes: false,
      currentImage: "/media/images/Mask_group5.png",
      otherImages: [
        "/media/images/Mask_group6.png",
        "/media/images/Mask_group7.png",
        "/media/images/Mask_group8.png",
        "/media/images/Mask_group9.png",
      ],
      openBlocks: {
        specs: false,
        care: false,
      },
    };
  },
  computed: {
    maxSlidesNew() {
      return this.newItems.length;
    },
  },
  mounted() {
    this.calculateVisibleSlidesNew();
    window.addEventListener("resize", this.calculateVisibleSlidesNew);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateVisibleSlidesNew);
  },
  methods: {
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
  },
};
</script>

<style scoped>
@import "../../assets/styles/pages/dist/min/productCategory.min.css";
</style>