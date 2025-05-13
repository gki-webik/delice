<template>
  <main class="boxMainAdminPanel">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Админ-панель</a>
      </nav>
      <h1>Админ-панель</h1>
      <details>
        <summary>Управление товарами</summary>
        <nav>
          <router-link to="/admin/panel/products/aed"
            >Добавление/редактирование/удаление товаров</router-link
          >
          <router-link to="/admin/panel/products/iee"
            >Импорт/экспорт товаров (Excel)</router-link
          >
        </nav>
      </details>
      <details>
        <summary>Управление заказами</summary>
        <nav>
          <router-link to="/admin/panel/orders"
            >Просмотр списка заказов</router-link
          >
        </nav>
      </details>
      <details>
        <summary>Управление пользователями</summary>
        <nav>
          <router-link to="/admin/panel/users/list"
            >Список пользователей</router-link
          >
          <router-link to="/admin/panel/users/messages"
            >Рассылка email-уведомлений</router-link
          >
        </nav>
      </details>
      <details>
        <summary>Управление контентом</summary>
        <p>Находится в разработке</p>
      </details>
      <details>
        <summary>Аналитика и отчеты</summary>
        <p>Находится в разработке</p>
      </details>
    </div>
  </main>
</template>

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
        .then(() => {})
        .catch((err) => {
          console.error(err.message);
        });
    },
  },
};
</script>

<style scoped>
@import "../../../assets/styles/admin/dist/min/IsPanel.min.css";
</style>
