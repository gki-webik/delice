<template>
  <main class="boxMainAdminPanelUsersList">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Пользователи</a>
      </nav>
      <h1>Пользователи</h1>
      <input
        type="search"
        placeholder="Поиск"
        v-model="searchQuery"
        @input="filterUsers"
      />

      <!-- Список пользователей -->
      <div
        class="items"
        v-if="filteredItems && filteredItems.length > 0 && !showDetails"
      >
        <div class="item" v-for="(item, index) in filteredItems" :key="index">
          {{ index + 1 }}. ID {{ item.id }} |
          <router-link to="#" role="button" @click="getUserDetails(item)"
            >{{ item.last_name }} {{ item.first_name }}</router-link
          >
          | {{ item.email }} | {{ item.type }} <span v-if="item.phone">|</span>
          {{ item.phone }} |
          <router-link to="#" role="button" @click="getUserOrders(item)"
            >Заказы</router-link
          >
        </div>
      </div>

      <div
        v-if="showDetails && showDetails.type === 'details'"
        class="user-details"
      >
        <button @click="showDetails = null" class="back-button">← Назад</button>
        <h2>{{ selectedUser.last_name }} {{ selectedUser.first_name }}</h2>

        <div v-if="!showDetails.editing" class="user-info">
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p v-if="selectedUser.phone">
            <strong>Телефон:</strong> {{ selectedUser.phone }}
          </p>
          <p><strong>ID:</strong> {{ selectedUser.id }}</p>

          <button @click="toggleEditMode" class="edit-button">
            Редактировать
          </button>
          <button @click="getUserOrders(selectedUser)" class="orders-button">
            Показать заказы
          </button>
        </div>

        <div v-else class="edit-form">
          <div class="form-group">
            <label>Тип:</label>
            <select v-model="selectedUser.type">
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
            </select>
          </div>

          <div class="form-group">
            <label>Фамилия:</label>
            <input v-model="selectedUser.last_name" type="text" />
          </div>

          <div class="form-group">
            <label>Имя:</label>
            <input v-model="selectedUser.first_name" type="text" />
          </div>

          <div class="form-group">
            <label>Email:</label>
            <input v-model="selectedUser.email" type="email" />
          </div>

          <div class="form-group">
            <label>Телефон:</label>
            <input v-model="selectedUser.phone" type="tel" />
          </div>

          <div class="form-group">
            <label>Новый пароль (оставьте пустым, чтобы не менять):</label>
            <input v-model="showDetails.tempPassword" type="password" />
          </div>

          <div class="form-actions">
            <button @click="saveUserChanges" class="save-button">
              Сохранить
            </button>
            <button @click="toggleEditMode" class="cancel-button">
              Отмена
            </button>
          </div>
          <div class="form-actions">
            <button @click="deleteUser" class="cancel-button">
              УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ (DANGER)
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showDetails && showDetails.type === 'orders'"
        class="user-orders"
      >
        <button @click="showDetails = null" class="back-button">← Назад</button>
        <h2>
          Заказы пользователя: {{ selectedUser.last_name }}
          {{ selectedUser.first_name }}
        </h2>

        <div v-if="orders && orders.length > 0" class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <h3>Заказ #{{ order.id }}</h3>
            <p>
              <strong>Статус:</strong> {{ getOrderStatusText(order.status) }}
            </p>
            <p><strong>Дата:</strong> {{ formatDate(order.date) }}</p>
            <p><strong>Сумма:</strong> {{ order.total }} ₽</p>

            <div class="order-products">
              <h4>Товары:</h4>
              <div
                v-for="(product, idx) in JSON.parse(order.products).items"
                :key="idx"
                class="product-item"
              >
                <p>
                  {{ idx + 1 }}.
                  <router-link :to="'/catalog/product/' + product.id">{{
                    product.name
                  }}</router-link>
                  ({{ product.size }}, {{ product.color }})
                </p>
                <p>
                  Цена: {{ product.price }} ₽ × {{ product.quantity }} =
                  {{ product.price * product.quantity }} ₽
                </p>
              </div>
            </div>
          </div>
        </div>

        <p v-else>У пользователя нет заказов</p>
      </div>

      <p v-if="!filteredItems">Загрузка...</p>
      <p v-if="filteredItems && filteredItems.length === 0">
        {{ searchQuery ? "Пользователи не найдены" : "Пользователей нет..." }}
      </p>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      items: null,
      filteredItems: null,
      orders: null,
      showDetails: null,
      selectedUser: null,
      searchQuery: "",
    };
  },
  created() {
    this.isAuth();
    this.getAllUsers();
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
    getAllUsers() {
      fetch("https://ce95524.tw1.ru/api/v2/getAllUsers", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка");
          }
          return res.json();
        })
        .then((data) => {
          this.items = data.data;
          this.filteredItems = [...data.data];
          console.log(this.filteredItems);
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
    filterUsers() {
      if (!this.items) return;

      if (!this.searchQuery) {
        this.filteredItems = [...this.items];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((user) => {
        return (
          (user.first_name && user.first_name.toLowerCase().includes(query)) ||
          (user.last_name && user.last_name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.phone && user.phone.includes(query))
        );
      });
    },
    getUserDetails(user) {
      if (Number(user.id) === 1 || Number(user.id) === 0) {
        alert("Редактирование этого пользователя запрещено");
        return;
      }
      this.selectedUser = user;
      this.showDetails = {
        type: "details",
        editing: false,
      };
    },
    async saveUserChanges() {
      try {
        const formData = new FormData();
        formData.append("id", this.selectedUser.id);
        formData.append("last_name", this.selectedUser.last_name);
        formData.append("first_name", this.selectedUser.first_name);
        formData.append("email", this.selectedUser.email);
        formData.append("phone", this.selectedUser.phone);
        formData.append("type", this.selectedUser.type);

        if (this.showDetails.tempPassword) {
          formData.append("password", this.showDetails.tempPassword);
        }

        const response = await fetch(
          "https://ce95524.tw1.ru/api/v2/updateUser/" + this.selectedUser.id,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при обновлении данных пользователя");
        }

        const updatedUserIndex = this.items.findIndex(
          (u) => u.id === this.selectedUser.id
        );
        if (updatedUserIndex !== -1) {
          this.items[updatedUserIndex] = { ...this.selectedUser };
          this.filteredItems = [...this.items];
        }

        this.showDetails.editing = false;
        this.showDetails.tempPassword = "";
        alert("Данные пользователя успешно обновлены");
      } catch (err) {
        console.error(err.message);
        alert("Произошла ошибка при обновлении данных пользователя");
      }
    },
    async deleteUser() {
      if (
        Number(this.selectedUser.id) === 1 ||
        Number(this.selectedUser.id) === 0
      ) {
        alert("Редактирование этого пользователя запрещено");
        return;
      }
      const confirmation = confirm(
        `Вы уверены, что хотите удалить пользователя ${this.selectedUser.last_name} ${this.selectedUser.first_name} (ID: ${this.selectedUser.id})? Это действие нельзя отменить.`
      );

      if (!confirmation) {
        return;
      }

      const promptConfirmation = prompt(
        `Для подтверждения удаления введите "УДАЛИТЬ ${this.selectedUser.id}"`
      );

      if (promptConfirmation !== `УДАЛИТЬ ${this.selectedUser.id}`) {
        alert("Удаление отменено. Текст подтверждения не совпадает.");
        return;
      }

      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v2/deleteUser/" + this.selectedUser.id,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при обновлении данных пользователя");
        }

        const updatedUserIndex = this.items.findIndex(
          (u) => u.id === this.selectedUser.id
        );
        if (updatedUserIndex !== -1) {
          this.items[updatedUserIndex] = { ...this.selectedUser };
          this.filteredItems = [...this.items];
        }

        this.showDetails.editing = false;
        this.showDetails.tempPassword = "";
        this.showDetails = false;
        this.getAllUsers();
        alert("Пользователь удален");
      } catch (err) {
        console.error(err.message);
        alert("Произошла ошибка при удалении данных пользователя");
      }
    },

    toggleEditMode() {
      this.showDetails.editing = !this.showDetails.editing;
      if (!this.showDetails.editing) {
        this.showDetails.tempPassword = "";
      }
    },
    async getUserOrders(user) {
      this.selectedUser = user;
      try {
        const response = await fetch(
          `https://ce95524.tw1.ru/api/v2/getUserOrders/${user.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при получении заказов");
        }

        const data = await response.json();
        this.orders = data.data;
        this.showDetails = {
          type: "orders",
        };
      } catch (err) {
        console.error(err.message);
      }
    },
    getOrderStatusText(status) {
      switch (status) {
        case "success":
          return "Успешно завершен";
        case "completed":
          return "Выполнен";
        case "created":
          return "Создан";
        case "default":
          return "В обработке";
        default:
          return status;
      }
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },
  },
};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsListUsers.min.css";
</style>