<template>
  <main class="boxMainBlogPage">
    <div class="max-container">
      <nav class="is-kroshki" v-if="name">
        <router-link to="/">Главная</router-link>
        <router-link to="/blog">Главная</router-link>
        <a class="is-end">{{ name }}</a>
      </nav>
      <h1 v-if="name">{{ name }}</h1>
      <div class="blocks">
        <div class="block is-1">
          <img :src="images[0]" alt="" />
          <div class="flex-column">
            <img :src="images[1]" alt="" />
            <div v-html="texts[0]"></div>
          </div>
        </div>
        <!-- Обновленный цикл для отображения пар изображений -->
        <div
          class="block"
          :class="{ 'is-right': index % 2 !== 0 }"
          v-for="(pair, index) in imagePairs"
          :key="index"
        >
          <div v-html="texts[index + 1]"></div>
          <div class="flex-row">
            <img class="is-1" :src="pair[0]" alt="" />
            <img class="is-2" :src="pair[1]" alt="" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      images: [],
      texts: [],
    };
  },
  computed: {
    // Создаем массив пар изображений
    imagePairs() {
      const pairs = [];
      for (let i = 2; i < this.images.length; i += 2) {
        pairs.push(this.images.slice(i, i + 2));
      }
      return pairs;
    },
  },
  mounted() {
    this.fetchBlogPost();
  },
  methods: {
    fetchBlogPost() {
      fetch("https://ce95524.tw1.ru/api/v1/blogPost/" + this.$route.params.id)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            // Предполагается, что data.data — массив, берем первый элемент
            const item = data.data[0]; // или другой способ получения нужного элемента
            this.name = item.name;

            // Парсим изображения
            if (item.images && typeof item.images === "string") {
              try {
                this.images = JSON.parse(item.images);
              } catch (e) {
                this.images = [];
              }
            }

            // Парсим тексты
            if (item.long_text && typeof item.long_text === "string") {
              try {
                this.texts = JSON.parse(item.long_text);
              } catch (e) {
                this.texts = [];
              }
            }
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки блога:", error);
        });
    },
  },
};
</script>

<style scoped>
@import "../../assets/styles/pages/dist/min/isBlogPage.min.css";
</style>
