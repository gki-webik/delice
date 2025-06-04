<template>
  <main class="boxMainAdminPanelMassMailing">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Массовая рассылка</a>
      </nav>
      <h1>Массовая рассылка сообщений</h1>

      <div class="mass-mailing-container">
        <div class="mailing-form">
          <div class="form-group">
            <label>Тип рассылки:</label>
            <select v-model="mailingType">
              <option value="all">Всем пользователям</option>
              <option value="customers">Только покупателям</option>
              <option value="non-customers">Тем, кто не делал заказы</option>
              <option value="selected">Выбранным пользователям</option>
            </select>
          </div>

          <div class="form-group" v-if="mailingType === 'selected'">
            <label>Выберите пользователей:</label>
            <div class="users-selector">
              <input
                type="text"
                placeholder="Поиск пользователей..."
                v-model="userSearch"
                @input="searchUsers"
              />
              <div class="users-list">
                <div
                  v-for="user in searchedUsers"
                  :key="user.id"
                  class="user-checkbox"
                >
                  <input
                    type="checkbox"
                    :id="'user-' + user.id"
                    :value="user.id"
                    v-model="selectedUsers"
                  />
                  <label :for="'user-' + user.id">
                    {{ user.last_name }} {{ user.first_name }} ({{
                      user.email
                    }})
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Тема сообщения:</label>
            <input
              v-model="messageSubject"
              type="text"
              placeholder="Тема письма"
            />
          </div>

          <div class="form-group">
            <label>Текст сообщения:</label>
            <textarea
              v-model="messageText"
              rows="10"
              placeholder="Текст сообщения..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button @click="sendMassMailing" class="send-button">
              Отправить рассылку
            </button>
            <button @click="previewMessage" class="preview-button">
              Предпросмотр
            </button>
          </div>
        </div>

        <div class="stats-panel">
          <h3>Статистика рассылки</h3>
          <div class="stats-item">
            <strong>Всего получателей:</strong> {{ totalRecipients }}
          </div>
          <div class="stats-item">
            <strong>Email-сообщений:</strong> {{ emailCount }}
          </div>

          <div class="recent-mailings">
            <h4>Последние рассылки:</h4>
            <div
              v-for="mailing in recentMailings"
              :key="mailing.id"
              class="mailing-item"
            >
              <div class="mailing-date">{{ formatDate(mailing.date) }}</div>
              <div class="mailing-subject">{{ mailing.subject }}</div>
              <div class="mailing-recipients">
                Получателей: {{ mailing.recipients_count }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Модальное окно предпросмотра -->
      <div v-if="showPreview" class="preview-modal">
        <div class="modal-content">
          <h2>Предпросмотр сообщения</h2>
          <div class="preview-header">
            <div><strong>Тема:</strong> {{ messageSubject }}</div>
            <div><strong>Получатели:</strong> {{ previewRecipientsCount }}</div>
          </div>
          <div class="preview-body" v-html="formattedMessage"></div>
          <div class="modal-actions">
            <button @click="showPreview = false" class="close-button">
              Закрыть
            </button>
            <button @click="sendMassMailing" class="send-button">
              Отправить
            </button>
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
      mailingType: "all",
      userSearch: "",
      searchedUsers: [],
      selectedUsers: [],
      messageSubject: "",
      messageText: "",
      sendAsEmail: true,
      recentMailings: [],
      showPreview: false,
      allUsers: [],
    };
  },
  computed: {
    totalRecipients() {
      switch (this.mailingType) {
        case "selected":
          return this.selectedUsers.length;
        case "all":
          return this.allUsers.length;
        case "customers":
          return this.allUsers.filter((user) => user.type === "user").length;
        case "non-customers":
          return this.allUsers.filter((user) => user.type !== "user").length;
        default:
          return 0;
      }
    },
    emailCount() {
      return this.sendAsEmail ? this.totalRecipients : 0;
    },

    previewRecipientsCount() {
      if (this.mailingType === "selected") {
        return `Выбранные пользователи (${this.selectedUsers.length})`;
      }
      return {
        all: "Все пользователи",
        customers: "Все покупатели",
        "non-customers": "Пользователи без заказов",
      }[this.mailingType];
    },
    formattedMessage() {
      // Простая замена переносов строк на <br> для предпросмотра
      return this.messageText.replace(/\n/g, "<br>");
    },
  },
  created() {
    this.isAuth();
    this.loadRecentMailings();
    this.loadAllUsers();
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
        .catch((err) => {
          console.error(err.message);
        });
    },
    loadAllUsers() {
      fetch("https://delice-spb.ru/api/v2/getAllUsers", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          this.allUsers = data.data;
        })
        .catch((err) => {
          console.error("Ошибка загрузки пользователей:", err);
        });
    },
    loadRecentMailings() {
      // Загрузка последних рассылок с сервера
      fetch("https://delice-spb.ru/api/v2/getRecentMailings", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          this.recentMailings = data.data;
        })
        .catch((err) => {
          console.error("Ошибка загрузки рассылок:", err);
        });
    },
    searchUsers() {
      if (!this.userSearch.trim()) {
        this.searchedUsers = [];
        return;
      }
      const query = this.userSearch.toLowerCase();
      this.searchedUsers = this.allUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          (user.last_name && user.last_name.toLowerCase().includes(query)) ||
          (user.first_name && user.first_name.toLowerCase().includes(query))
      );
    },
    previewMessage() {
      if (!this.messageSubject || !this.messageText) {
        alert("Заполните тему и текст сообщения");
        return;
      }
      this.showPreview = true;
    },
    async sendMassMailing() {
      if (!this.messageSubject || !this.messageText) {
        alert("Заполните тему и текст сообщения");
        return;
      }

      if (this.mailingType === "selected" && this.selectedUsers.length === 0) {
        alert("Выберите хотя бы одного пользователя");
        return;
      }

      const confirmSend = confirm(
        `Вы уверены, что хотите отправить рассылку для ${this.totalRecipients} получателей?`
      );
      if (!confirmSend) return;

      try {
        const response = await fetch(
          "https://delice-spb.ru/api/v2/sendMassMailing",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mailing_type: this.mailingType,
              user_ids:
                this.mailingType === "selected" ? this.selectedUsers : null,
              subject: this.messageSubject,
              message: this.messageText,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при отправке рассылки");
        }

        const result = await response.json();
        alert(
          `Рассылка успешно отправлена для ${result.recipients_count} пользователей`
        );
        this.loadRecentMailings();
        this.showPreview = false;
      } catch (err) {
        console.error(err);
        alert("Произошла ошибка при отправке рассылки");
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
@import "../../../../assets/styles/admin/dist/min/IsMessagesUsers.min.css";
</style>