<template>
  <main class="boxMainBlog">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Блог</a>
      </nav>
      <h1>Блог</h1>
    </div>
    <div class="blocks">
      <div class="block" v-for="item in items" :key="item.id">
        <div class="max-container">
          <h2>{{ item.title }}</h2>
          <div class="content">
            <div class="left">
              <div class="images">
                <img
                  v-for="(img, indexImg) in item.images"
                  :key="indexImg"
                  :src="img"
                  alt=""
                />
              </div>
            </div>
            <div class="right">
              <p
                v-for="(text, indexText) in item.texts"
                v-html="text"
                :key="indexText"
              ></p>
              <router-link :to="'/blog/' + item.id">
                Читать полностью
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/isBlog.min.css";
</style>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchBlogPosts();
  },
  methods: {
    fetchBlogPosts() {
      fetch("https://delice-spb.ru/api/v1/blogPosts")
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            this.items = data.data.map((item) => {
              let images = [];
              let texts = [];

              if (item.images && typeof item.images === "string") {
                try {
                  images = JSON.parse(item.images).slice(0, 3);
                } catch (e) {
                  images = [];
                }
              }
              if (item.short_text && typeof item.short_text === "string") {
                try {
                  texts = JSON.parse(item.short_text);
                } catch (e) {
                  texts = [];
                }
              }

              return {
                id: item.id,
                title: item.name,
                images,
                texts,
              };
            });
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки блога:", error);
        });
    },
  },
};
</script>