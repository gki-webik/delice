<template>
  <main class="boxMainAdminPanelBlog">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Акции</a>
      </nav>
      <h1>Акции</h1>
      <p>
        Для CRUD-операций с Акциями обратитесь к разработчику по
        <a href="https://klicks.ru/my" target="_blank">ссылке</a>.
      </p>
    </div>
  </main>
</template>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelBlog.min.css";
</style>

<script>
export default {
  created() {
    this.isAuth();
  },
  methods: {
    isAuth() {
      fetch("https://ce95524.tw1.ru/api/v2/checkAuth", {
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
        .then((data) => {
          this.userAdmin = data.type === "admin" || false;
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
  },
};
</script>