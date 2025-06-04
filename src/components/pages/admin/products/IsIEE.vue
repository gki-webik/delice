<template>
  <main class="boxMainAdminPanelAED">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Импорт/Экспорт</a>
      </nav>
      <h1>Импорт/Экспорт</h1>
      <form
        action="https://delice-spb.ru/api/components/admin/import-export.php"
        method="post"
        enctype="multipart/form-data"
      >
        <input type="submit" name="export" value="Экспорт товаров в Excel" />
        <small>// Экспорт может начаться не сразу</small>
      </form>
      <form
        action="https://delice-spb.ru/api/components/admin/import-export.php"
        method="post"
        enctype="multipart/form-data"
      >
        <input type="file" name="import_file" required />
        <input type="submit" name="import" value="Импорт товаров из Excel" />
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelAED.min.css";
</style>

<script>
export default {
  created() {
    this.isAuth();
  },
  methods: {
    isAuth() {
      fetch("https://delice-spb.ru/api/v2/checkAuth", {
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