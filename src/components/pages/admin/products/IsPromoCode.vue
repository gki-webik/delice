<template>
  <main class="boxMainAdminPanelAED">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Управление промокодами</a>
      </nav>
      <h1>Управление промокодами</h1>

      <!-- Форма добавления промокода -->
      <div class="promo-form">
        <h2>Добавить новый промокод</h2>
        <form @submit.prevent="addPromoCode">
          <div class="form-group">
            <label for="promoName">Название промокода:</label>
            <input
              type="text"
              id="promoName"
              v-model="newPromo.name"
              required
              placeholder="Введите название промокода"
            />
          </div>
          <div class="form-group">
            <label for="promoSale">Скидка (%):</label>
            <input
              type="number"
              id="promoSale"
              v-model="newPromo.sale"
              required
              min="1"
              max="100"
              placeholder="Введите размер скидки"
            />
          </div>
          <button type="submit" class="btn-add">Добавить промокод</button>
        </form>
      </div>

      <!-- Таблица промокодов -->
      <div class="promo-list">
        <h2>Список промокодов</h2>
        <div v-if="loading" class="loading">Загрузка...</div>
        <div v-else-if="promoCodes.length === 0" class="no-data">
          Промокоды не найдены
        </div>
        <table v-else class="promo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Скидка (%)</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="promo in promoCodes" :key="promo.id">
              <td>{{ promo.id }}</td>
              <td>{{ promo.name }}</td>
              <td>{{ promo.sale }}%</td>
              <td>{{ formatDate(promo.date) }}</td>
              <td>
                <button @click="deletePromoCode(promo.id)" class="btn-delete">
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelAED.min.css";

.promo-form,
.promo-list {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-add,
.btn-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-add {
  background-color: #4caf50;
  color: white;
}

.btn-add:hover {
  background-color: #45a049;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.promo-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.promo-table th,
.promo-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.promo-table th {
  font-weight: 600;
}

.loading,
.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
}

.error {
  background-color: #f2dede;
  color: #a94442;
  border: 1px solid #ebccd1;
}
</style>

<script>
export default {
  data() {
    return {
      promoCodes: [],
      loading: true,
      newPromo: {
        name: "",
        sale: "",
        date: "",
      },
      message: "",
      messageType: "",
      userAdmin: false,
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
            this.$router.replace("/");
            throw new Error("Ошибка аутентификации");
          }
          return res.json();
        })
        .then((data) => {
          this.userAdmin = data.type === "admin" || false;
          if (this.userAdmin) {
            this.fetchPromoCodes();
          } else {
            this.$router.replace("/");
          }
        })
        .catch((err) => {
          console.error(err.message);
          this.showMessage(err.message, "error");
        });
    },

    fetchPromoCodes() {
      this.loading = true;
      fetch("https://delice-spb.ru/api/v2/getPromoCodes", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка при получении промокодов");
          }
          return res.json();
        })
        .then((data) => {
          this.promoCodes = data.data || [];
          this.loading = false;
        })
        .catch((err) => {
          console.error(err.message);
          this.showMessage(err.message, "error");
          this.loading = false;
        });
    },

    addPromoCode() {
      const formData = new FormData();
      formData.append("name", this.newPromo.name);
      formData.append("sale", this.newPromo.sale);

      fetch("https://delice-spb.ru/api/v2/addPromoCode", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка при добавлении промокода");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            this.showMessage("Промокод успешно добавлен", "success");
            this.resetForm();
            this.fetchPromoCodes();
          } else {
            throw new Error(data.error || "Ошибка при добавлении промокода");
          }
        })
        .catch((err) => {
          console.error(err.message);
          this.showMessage(err.message, "error");
        });
    },

    deletePromoCode(id) {
      if (!confirm("Вы уверены, что хотите удалить этот промокод?")) {
        return;
      }

      const formData = new FormData();
      formData.append("id", id);

      fetch("https://delice-spb.ru/api/v2/deletePromoCode", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка при удалении промокода");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            this.showMessage("Промокод успешно удален", "success");
            this.fetchPromoCodes();
          } else {
            throw new Error(data.error || "Ошибка при удалении промокода");
          }
        })
        .catch((err) => {
          console.error(err.message);
          this.showMessage(err.message, "error");
        });
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },

    resetForm() {
      this.newPromo = {
        name: "",
        sale: "",
      };
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;

      setTimeout(() => {
        this.message = "";
      }, 5000);
    },
  },
};
</script>