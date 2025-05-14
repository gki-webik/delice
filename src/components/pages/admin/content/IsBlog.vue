<template>
  <main class="boxMainAdminPanelBlog">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Блог</a>
      </nav>

      <h1>Блог</h1>

      <div class="admin-blog-actions">
        <button @click="openCreateModal" class="btn-primary">
          Создать пост
        </button>
      </div>

      <div class="blog-posts-list">
        <div v-for="post in posts" :key="post.id" class="blog-post-card">
          <div class="post-preview">
            <img
              v-if="post.images && JSON.parse(post.images).length"
              :src="JSON.parse(post.images)[0]"
              alt="Preview"
            />
            <div v-else class="no-image">Нет изображения</div>
          </div>
          <div class="post-content">
            <h3>{{ post.name }}</h3>
            <div v-html="JSON.parse(post.short_text)[0]"></div>
            <div class="post-date">{{ formatDate(post.date) }}</div>
          </div>
          <div class="post-actions">
            <button @click="editPost(post)" class="btn-edit">
              Редактировать
            </button>
            <button @click="deletePost(post.id)" class="btn-delete">
              Удалить
            </button>
          </div>
        </div>
      </div>

      <!-- Модальное окно для создания/редактирования -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>
            {{ editingPost ? "Редактировать пост" : "Создать новый пост" }}
          </h2>

          <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="form-group">
              <label>Название поста</label>
              <input v-model="formData.name" type="text" required />
            </div>

            <div class="form-group">
              <label>Краткое описание</label>
              <div class="paragraphs-container">
                <div
                  v-for="(paragraph, index) in shortTextParagraphs"
                  :key="'short-' + index"
                  class="paragraph-item"
                >
                  <textarea
                    v-model="shortTextParagraphs[index]"
                    rows="3"
                    placeholder="Введите текст абзаца"
                    required
                  ></textarea>
                </div>
                <button
                  v-if="canAddMoreParagraphs('short')"
                  @click.prevent="addParagraph('short')"
                  class="add-paragraph-btn"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Полный текст</label>
              <div class="paragraphs-container">
                <div
                  v-for="(paragraph, index) in longTextParagraphs"
                  :key="'long-' + index"
                  class="paragraph-item"
                >
                  <textarea
                    v-model="longTextParagraphs[index]"
                    rows="6"
                    placeholder="Введите текст абзаца"
                    required
                  ></textarea>
                </div>
                <button
                  v-if="canAddMoreParagraphs('long')"
                  @click.prevent="addParagraph('long')"
                  class="add-paragraph-btn"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div class="form-group">
              <label
                >Изображения (должно быть четное количество, минимум 2)</label
              >
              <input
                type="file"
                multiple
                @change="handleImageUpload"
                accept="image/*"
              />
              <div
                v-if="formData.images.length % 2 !== 0"
                class="error-message"
              >
                Количество изображений должно быть четным (сейчас:
                {{ formData.images.length }})
              </div>
              <div class="image-preview-container">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="image-preview"
                >
                  <img :src="image" alt="Preview" />
                  <button
                    @click.stop="removeImage(index)"
                    type="button"
                    class="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn-cancel">
                Отмена
              </button>
              <button
                type="submit"
                class="btn-submit"
                :disabled="
                  formData.images.length % 2 !== 0 || formData.images.length < 2
                "
              >
                {{ editingPost ? "Обновить" : "Создать" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      showModal: false,
      editingPost: null,
      formData: {
        id: null,
        name: "",
        short_text: "",
        long_text: "",
        images: [],
      },
      shortTextParagraphs: [""],
      longTextParagraphs: [""],
      apiBaseUrl: "https://ce95524.tw1.ru/api/v2",
      newImageFiles: [],
    };
  },
  async mounted() {
    await this.fetchPosts();
  },
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
    async fetchPosts() {
      try {
        const response = await fetch(this.apiBaseUrl + "/blogPosts", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка сети");
        const data = await response.json();
        this.posts = data.data;
      } catch (error) {
        console.error("Ошибка при загрузке постов:", error);
        alert("Не удалось загрузить посты");
      }
    },

    canAddMoreParagraphs(type) {
      const maxParagraphs = Math.floor(this.formData.images.length / 2);
      return type === "short"
        ? this.shortTextParagraphs.length < maxParagraphs
        : this.longTextParagraphs.length < maxParagraphs;
    },

    addParagraph(type) {
      if (type === "short") {
        this.shortTextParagraphs.push("");
      } else {
        this.longTextParagraphs.push("");
      }
    },

    async submitForm() {
      try {
        // Проверка на четное количество изображений
        if (
          this.formData.images.length % 2 !== 0 ||
          this.formData.images.length < 2
        ) {
          alert("Количество изображений должно быть четным и не менее 2");
          return;
        }

        if (this.canAddMoreParagraphs("long")) {
          alert("Параграфы должны быть заполнены все.");
          return;
        }

        this.shortTextParagraphs = this.shortTextParagraphs.map((p) =>
          p.replace(/\n/g, "<br>")
        );
        this.longTextParagraphs = this.longTextParagraphs.map((p) =>
          p.replace(/\n/g, "<br>")
        );

        const postData = {
          ...this.formData,
          short_text: this.shortTextParagraphs.filter((p) => p.trim()),
          long_text: this.longTextParagraphs.filter((p) => p.trim()),
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(postData));

        // Добавляем только новые изображения как файлы
        if (this.formData.images && this.formData.images.length) {
          for (let i = 0; i < this.formData.images.length; i++) {
            formData.append("images[]", this.formData.images[i]);
          }
        }
        const url = this.editingPost
          ? `${this.apiBaseUrl}/editBlogPost/${this.formData.id}`
          : this.apiBaseUrl + "/createBlogPost";

        const method = "POST";

        const response = await fetch(url, {
          method,
          body: formData,
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Ошибка сохранения");
        }

        await this.fetchPosts();
        this.closeModal();
      } catch (error) {
        console.error("Ошибка при сохранении поста:", error);
        alert("Не удалось сохранить пост: " + error.message);
      }
    },
    async deletePost(id) {
      if (confirm("Вы уверены, что хотите удалить этот пост?")) {
        try {
          const response = await fetch(
            `${this.apiBaseUrl}/deleteBlogPost/` + id,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("Ошибка удаления");

          await this.fetchPosts();
        } catch (error) {
          console.error("Ошибка при удалении поста:", error);
          alert("Не удалось удалить пост");
        }
      }
    },

    openCreateModal() {
      this.resetForm();
      this.showModal = true;
      this.editingPost = null;
    },
    editPost(post) {
      this.resetForm(); // Сначала сбрасываем форму

      this.formData = {
        id: post.id,
        name: post.name,
        short_text: "",
        long_text: "",
        images: JSON.parse(post.images),
      };

      this.shortTextParagraphs = JSON.parse(post.short_text);
      this.longTextParagraphs = JSON.parse(post.long_text);

      this.shortTextParagraphs = this.shortTextParagraphs.map((p) =>
        p.replaceAll("<br>", "\n")
      );
      this.longTextParagraphs = this.longTextParagraphs.map((p) =>
        p.replaceAll("<br>", "\n")
      );

      this.editingPost = post;
      this.showModal = true;
      this.newImageFiles = []; // Очищаем массив новых файлов при редактировании
    },

    resetForm() {
      this.formData = {
        id: null,
        name: "",
        short_text: "",
        long_text: "",
        images: [],
      };
      this.shortTextParagraphs = [""];
      this.longTextParagraphs = [""];
      this.newImageFiles = [];
    },

    closeModal() {
      this.showModal = false;
    },
    handleImageUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Сохраняем новые файлы для отправки на сервер
      this.newImageFiles = Array.from(files);

      // Создаем превью для новых изображений
      // Важно: очищаем массив newImageFiles перед добавлением новых файлов
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Добавляем превью в массив изображений только один раз
          // Проверяем, не добавлено ли уже это изображение
          const imageUrl = e.target.result;
          if (!this.formData.images.includes(imageUrl)) {
            this.formData.images.push(imageUrl);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    },

    removeImage(index) {
      this.formData.images.splice(index, 1);

      // Если это было новое изображение, удаляем его из newImageFiles
      if (this.newImageFiles.length > index) {
        this.newImageFiles.splice(index, 1);
      }

      // Удаляем лишние абзацы, если количество изображений уменьшилось
      const maxParagraphs = Math.floor(this.formData.images.length / 2);
      if (this.shortTextParagraphs.length > maxParagraphs) {
        this.shortTextParagraphs = this.shortTextParagraphs.slice(
          0,
          maxParagraphs
        );
      }
      if (this.longTextParagraphs.length > maxParagraphs) {
        this.longTextParagraphs = this.longTextParagraphs.slice(
          0,
          maxParagraphs
        );
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },
  },
};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelBlog.min.css";
</style>