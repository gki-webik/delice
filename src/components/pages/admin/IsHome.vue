<template>
  <main class="boxMainAdminIndex">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Форма авторизации</a>
      </nav>
      <form @submit.prevent="submitForm">
        <label>
          <span>E-mail</span>
          <input type="email" v-model="form_email" />
        </label>
        <label>
          <span>Пароль</span>
          <input type="password" v-model="form_password" />
        </label>
        <button type="submit">Войти</button>
        <span class="is-error" v-if="modalError">{{ modalError }}</span>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      form_email: "",
      form_password: "",
      modalError: null,
    };
  },
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
            throw new Error("Ошибка аутентификации");
          }
          return res.json();
        })
        .then(() => {
          this.$router.replace("/admin/panel");
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    submitForm() {
      this.modalError = null;
      let formData = new FormData();
      formData.append("email", this.form_email);
      formData.append("password", this.form_password);
      fetch("https://delice-spb.ru/api/v2/login", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          return response.json().then((data) => {
            if (response.status !== 200) {
              this.modalError = data.message;
              return;
            }
            this.$router.replace("/admin/panel");
          });
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
  },
};
</script>

<style scoped>
@import "../../../assets/styles/admin/dist/min/IsHome.min.css";
</style>
