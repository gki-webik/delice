<template>
  <main class="boxMainAdminPanelContacts">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Контакты</a>
      </nav>
      <h1>Контакты</h1>

      <div v-if="loading" class="loading-indicator">Загрузка...</div>
      <div v-else class="admin-contacts-form">
        <form @submit.prevent="saveContacts">
          <div class="form-group">
            <label>Текст 1 (приветствие)</label>
            <div class="text-hint">
              Добавляйте и редактируйте абзацы с помощью кнопок
            </div>

            <!-- Форма добавления нового абзаца для text_one -->
            <div class="paragraph-add-form">
              <textarea
                v-model="newParagraphOne"
                rows="3"
                placeholder="Введите новый абзац"
                class="paragraph-input"
              ></textarea>
              <button
                type="button"
                class="add-paragraph-btn"
                @click="addParagraph('one')"
                :disabled="!newParagraphOne.trim()"
              >
                Добавить абзац
              </button>
            </div>

            <!-- Список абзацев для text_one -->
            <div class="paragraphs-list">
              <div v-if="paragraphsOne.length === 0" class="no-paragraphs">
                Текст пуст. Добавьте абзацы с помощью формы выше.
              </div>
              <div
                v-for="(paragraph, index) in paragraphsOne"
                :key="'one-' + index"
                class="paragraph-item"
              >
                <div class="paragraph-text">{{ paragraph }}</div>
                <div class="paragraph-actions">
                  <button
                    type="button"
                    class="edit-paragraph-btn"
                    @click="editParagraph('one', index)"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="delete-paragraph-btn"
                    @click="deleteParagraph('one', index)"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                  <button
                    type="button"
                    class="move-up-btn"
                    @click="moveParagraph('one', index, -1)"
                    :disabled="index === 0"
                    title="Переместить вверх"
                  >
                    ⬆️
                  </button>
                  <button
                    type="button"
                    class="move-down-btn"
                    @click="moveParagraph('one', index, 1)"
                    :disabled="index === paragraphsOne.length - 1"
                    title="Переместить вниз"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Текст 2 (описание)</label>
            <div class="text-hint">
              Добавляйте и редактируйте абзацы с помощью кнопок
            </div>

            <!-- Форма добавления нового абзаца для text_two -->
            <div class="paragraph-add-form">
              <textarea
                v-model="newParagraphTwo"
                rows="3"
                placeholder="Введите новый абзац"
                class="paragraph-input"
              ></textarea>
              <button
                type="button"
                class="add-paragraph-btn"
                @click="addParagraph('two')"
                :disabled="!newParagraphTwo.trim()"
              >
                Добавить абзац
              </button>
            </div>

            <!-- Список абзацев для text_two -->
            <div class="paragraphs-list">
              <div v-if="paragraphsTwo.length === 0" class="no-paragraphs">
                Текст пуст. Добавьте абзацы с помощью формы выше.
              </div>
              <div
                v-for="(paragraph, index) in paragraphsTwo"
                :key="'two-' + index"
                class="paragraph-item"
              >
                <div class="paragraph-text">{{ paragraph }}</div>
                <div class="paragraph-actions">
                  <button
                    type="button"
                    class="edit-paragraph-btn"
                    @click="editParagraph('two', index)"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="delete-paragraph-btn"
                    @click="deleteParagraph('two', index)"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                  <button
                    type="button"
                    class="move-up-btn"
                    @click="moveParagraph('two', index, -1)"
                    :disabled="index === 0"
                    title="Переместить вверх"
                  >
                    ⬆️
                  </button>
                  <button
                    type="button"
                    class="move-down-btn"
                    @click="moveParagraph('two', index, 1)"
                    :disabled="index === paragraphsTwo.length - 1"
                    title="Переместить вниз"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Телефон</label>
            <input
              type="text"
              id="phone"
              v-model="formData.phone"
              @input="formatPhone"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              @blur="validateEmail"
            />
            <span v-if="emailError" class="error-message">{{
              emailError
            }}</span>
          </div>

          <div class="form-group">
            <label for="address">Адрес (город)</label>
            <input type="text" id="address" v-model="formData.address" />
          </div>

          <div class="form-group">
            <label>Магазины</label>
            <div class="text-hint">
              Добавьте адреса магазинов в формате "Название магазина: адрес"
            </div>

            <!-- Форма добавления нового адреса -->
            <div class="store-add-form">
              <input
                type="text"
                v-model="newStore"
                placeholder="Пример: ТЦ Мега: г. Москва, ул. Ленина, 10"
                class="store-input"
              />
              <button
                type="button"
                class="add-store-btn"
                @click="addStore"
                :disabled="!newStore.trim()"
              >
                Добавить
              </button>
            </div>

            <!-- Список магазинов -->
            <div class="stores-list">
              <div v-if="formData.stores.length === 0" class="no-stores">
                Список магазинов пуст. Добавьте магазины с помощью формы выше.
              </div>
              <div
                v-for="(store, index) in formData.stores"
                :key="index"
                class="store-item"
              >
                <span class="store-text">{{ store }}</span>
                <div class="store-actions">
                  <button
                    type="button"
                    class="edit-store-btn"
                    @click="editStore(index)"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="delete-store-btn"
                    @click="deleteStore(index)"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div class="stores-count">
              Всего магазинов: {{ formData.stores.length }}
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="isSaving">
              <span v-if="isSaving">Сохранение...</span>
              <span v-else>Сохранить изменения</span>
            </button>
            <button
              type="button"
              class="cancel-btn"
              @click="resetForm"
              :disabled="isSaving"
            >
              Отменить изменения
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно для редактирования -->
    <div v-if="showEditModal" class="edit-modal-overlay">
      <div class="edit-modal">
        <h3>{{ editModalTitle }}</h3>
        <textarea
          v-model="editingContent"
          class="edit-content-input"
          rows="5"
        ></textarea>
        <div class="edit-modal-actions">
          <button
            type="button"
            class="save-edit-btn"
            @click="saveEditedContent"
          >
            Сохранить
          </button>
          <button type="button" class="cancel-edit-btn" @click="cancelEdit">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        id: "",
        text_one: "",
        text_two: "",
        phone: "",
        email: "",
        address: "",
        stores: [],
      },
      originalData: {},
      loading: true,
      isSaving: false,
      emailError: "",

      // Для абзацев
      paragraphsOne: [],
      paragraphsTwo: [],
      newParagraphOne: "",
      newParagraphTwo: "",

      // Для магазинов
      newStore: "",

      // Для модального окна
      showEditModal: false,
      editModalTitle: "",
      editingContent: "",
      editingType: "", // 'one', 'two', 'store'
      editingIndex: -1,
    };
  },
  computed: {
    hasChanges() {
      return (
        JSON.stringify(this.formData) !== JSON.stringify(this.originalData)
      );
    },
  },
  watch: {
    // Синхронизация paragraphsOne и paragraphsTwo с formData
    paragraphsOne: {
      handler(newVal) {
        this.formData.text_one = newVal.join("\n\n");
      },
      deep: true,
    },
    paragraphsTwo: {
      handler(newVal) {
        this.formData.text_two = newVal.join("\n\n");
      },
      deep: true,
    },
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
    // Методы для работы с абзацами
    addParagraph(type) {
      if (type === "one" && this.newParagraphOne.trim()) {
        this.paragraphsOne.push(this.newParagraphOne.trim());
        this.newParagraphOne = "";
      } else if (type === "two" && this.newParagraphTwo.trim()) {
        this.paragraphsTwo.push(this.newParagraphTwo.trim());
        this.newParagraphTwo = "";
      }
    },

    editParagraph(type, index) {
      this.editingType = type;
      this.editingIndex = index;

      if (type === "one") {
        this.editingContent = this.paragraphsOne[index];
        this.editModalTitle = "Редактирование абзаца (Текст 1)";
      } else if (type === "two") {
        this.editingContent = this.paragraphsTwo[index];
        this.editModalTitle = "Редактирование абзаца (Текст 2)";
      }

      this.showEditModal = true;
    },

    deleteParagraph(type, index) {
      if (confirm("Вы уверены, что хотите удалить этот абзац?")) {
        if (type === "one") {
          this.paragraphsOne.splice(index, 1);
        } else if (type === "two") {
          this.paragraphsTwo.splice(index, 1);
        }
      }
    },

    moveParagraph(type, index, direction) {
      const newIndex = index + direction;

      if (type === "one") {
        if (newIndex >= 0 && newIndex < this.paragraphsOne.length) {
          const paragraphs = [...this.paragraphsOne];
          const temp = paragraphs[index];
          paragraphs[index] = paragraphs[newIndex];
          paragraphs[newIndex] = temp;
          this.paragraphsOne = paragraphs;
        }
      } else if (type === "two") {
        if (newIndex >= 0 && newIndex < this.paragraphsTwo.length) {
          const paragraphs = [...this.paragraphsTwo];
          const temp = paragraphs[index];
          paragraphs[index] = paragraphs[newIndex];
          paragraphs[newIndex] = temp;
          this.paragraphsTwo = paragraphs;
        }
      }
    },

    // Методы для работы с магазинами
    addStore() {
      if (this.newStore.trim()) {
        this.formData.stores.push(this.newStore.trim());
        this.newStore = "";
      }
    },

    editStore(index) {
      this.editingType = "store";
      this.editingIndex = index;
      this.editingContent = this.formData.stores[index];
      this.editModalTitle = "Редактирование адреса магазина";
      this.showEditModal = true;
    },

    deleteStore(index) {
      if (confirm("Вы уверены, что хотите удалить этот адрес?")) {
        this.formData.stores.splice(index, 1);
      }
    },

    // Общие методы для модального окна
    saveEditedContent() {
      if (this.editingContent.trim()) {
        if (this.editingType === "one") {
          this.paragraphsOne[this.editingIndex] = this.editingContent.trim();
        } else if (this.editingType === "two") {
          this.paragraphsTwo[this.editingIndex] = this.editingContent.trim();
        } else if (this.editingType === "store") {
          this.formData.stores[this.editingIndex] = this.editingContent.trim();
        }
        this.cancelEdit();
      }
    },

    cancelEdit() {
      this.showEditModal = false;
      this.editingType = "";
      this.editingIndex = -1;
      this.editingContent = "";
      this.editModalTitle = "";
    },

    formatPhone() {
      // Простой форматтер телефона
      if (!this.formData.phone) return;

      let phone = this.formData.phone.replace(/\D/g, "");
      if (phone.length > 0) {
        phone = phone.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (phone) {
          this.formData.phone = !phone[2]
            ? phone[1]
            : (phone[1] ? phone[1] + " " : "") +
              phone[2] +
              (phone[3] ? " " + phone[3] : "") +
              (phone[4] ? " " + phone[4] : "") +
              (phone[5] ? " " + phone[5] : "");
        }
      }
    },

    validateEmail() {
      if (!this.formData.email) {
        this.emailError = "Email не может быть пустым";
        return;
      }

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(this.formData.email)) {
        this.emailError = "Введите корректный email адрес";
      } else {
        this.emailError = "";
      }
    },

    async fetchContacts() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v1/getContacts",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const contacts = data.data[0];
          this.formData = {
            id: contacts.id || "",
            text_one: this.parseJsonField(contacts.text_one) || "",
            text_two: this.parseJsonField(contacts.text_two) || "",
            phone: contacts.phone || "",
            email: contacts.email || "",
            address: contacts.address || "",
            stores: this.parseStores(contacts.stores) || [],
          };

          // Разбиваем текст на абзацы
          this.paragraphsOne = this.splitParagraphs(this.formData.text_one);
          this.paragraphsTwo = this.splitParagraphs(this.formData.text_two);

          // Сохраняем оригинальные данные для проверки изменений
          this.originalData = JSON.parse(JSON.stringify(this.formData));
        }
      } catch (error) {
        console.error("Ошибка при загрузке контактов:", error);
        if (this.$toast) {
          this.$toast.error("Не удалось загрузить контакты");
        } else {
          alert("Не удалось загрузить контакты");
        }
      } finally {
        this.loading = false;
      }
    },

    splitParagraphs(text) {
      if (!text) return [];
      return text.split(/\n\s*\n/).filter((p) => p.trim());
    },

    parseJsonField(field) {
      if (!field) return "";

      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed[0] : parsed;
      } catch (e) {
        return field;
      }
    },

    parseStores(stores) {
      if (!stores) return [];

      try {
        // Обрабатываем строку с экранированными кавычками
        let parsed = stores;
        if (typeof parsed === "string") {
          // Удаляем лишние кавычки в начале и конце
          parsed = parsed.replace(/^"+|"+$/g, "");
          // Заменяем экранированные кавычки на обычные
          parsed = parsed.replace(/\\"/g, '"');
          try {
            parsed = JSON.parse(parsed);
          } catch (e) {
            // Если не удалось распарсить JSON, возвращаем как есть
            return [stores];
          }
        }
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error("Ошибка парсинга stores:", e);
        return [stores];
      }
    },

    async saveContacts() {
      if (this.emailError) {
        if (this.$toast) {
          this.$toast.warning("Исправьте ошибки в форме перед сохранением");
        } else {
          alert("Исправьте ошибки в форме перед сохранением");
        }
        return;
      }

      this.isSaving = true;
      try {
        const payload = {
          ...this.formData,
          text_one: this.formData.text_one,
          text_two: this.formData.text_two,
          stores: this.formData.stores,
        };

        const response = await fetch(
          "https://ce95524.tw1.ru/api/v2/updateContacts",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          if (this.$toast) {
            this.$toast.success("Контакты успешно обновлены!");
          } else {
            alert("Контакты успешно обновлены!");
          }
          // Обновляем оригинальные данные после успешного сохранения
          this.originalData = JSON.parse(JSON.stringify(this.formData));
        } else {
          const error = await response.json();
          throw new Error(error.message || "Ошибка при обновлении контактов");
        }
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        if (this.$toast) {
          this.$toast.error(error.message || "Произошла ошибка при сохранении");
        } else {
          alert(error.message || "Произошла ошибка при сохранении");
        }
      } finally {
        this.isSaving = false;
      }
    },

    resetForm() {
      if (confirm("Отменить все изменения и вернуть исходные значения?")) {
        this.formData = JSON.parse(JSON.stringify(this.originalData));
        this.paragraphsOne = this.splitParagraphs(this.formData.text_one);
        this.paragraphsTwo = this.splitParagraphs(this.formData.text_two);
      }
    },
  },
  async created() {
    await this.fetchContacts();
    this.isAuth();
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasChanges) {
      if (
        confirm(
          "У вас есть несохраненные изменения. Вы уверены, что хотите уйти?"
        )
      ) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelContacts.min.css";
</style>