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
        action="https://ce95524.tw1.ru/api/components/admin/import-export.php"
        method="post"
        enctype="multipart/form-data"
      >
        <input
          type="submit"
          name="export"
          @click="showText = true"
          value="Экспорт товаров в Excel"
        />
        <small>// Экспорт может начаться не сразу</small>
      </form>
      <form
        action="https://ce95524.tw1.ru/api/components/admin/import-export.php"
        method="post"
        enctype="multipart/form-data"
      >
        <input type="file" name="import_file" required />
        <input type="submit" name="import" value="Импорт товаров из Excel" />
      </form>
    </div>
  </main>
</template>

<script>
export default {};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelAED.min.css";
</style>