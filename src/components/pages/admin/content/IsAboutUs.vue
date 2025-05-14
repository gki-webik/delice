<template>
  <main class="boxMainAdminPanelAboutUs">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">О Нас</a>
      </nav>
      <h1>О Нас</h1>

      <div v-if="loading" class="loading">Загрузка...</div>

      <div v-else>
        <div class="editor-container">
          <h2>Редактирование страницы "О Нас"</h2>

          <div class="formatting-tools">
            <button @click="insertTag('h2')" title="Заголовок">H2</button>
            <button @click="insertTag('h3')" title="Подзаголовок">H3</button>
            <button @click="insertTag('p')" title="Абзац">P</button>
            <button @click="insertTag('ul')" title="Маркированный список">
              UL
            </button>
            <button @click="insertTag('ol')" title="Нумерованный список">
              OL
            </button>
            <button @click="insertTag('li')" title="Элемент списка">LI</button>
            <button @click="insertTag('strong')" title="Жирный текст">B</button>
            <button @click="insertTag('em')" title="Курсив">I</button>
          </div>

          <div
            v-for="(item, index) in contentBlocks"
            :key="index"
            class="content-block"
          >
            <select v-model="blockTypes[index]" class="block-type-select">
              <option value="p">Абзац</option>
              <option value="h2">Заголовок</option>
              <option value="h3">Подзаголовок</option>
              <option value="ul">Маркированный список</option>
              <option value="ol">Нумерованный список</option>
            </select>

            <textarea
              v-model="contentBlocks[index]"
              class="content-input"
              :rows="getRowsCount(contentBlocks[index])"
              @input="formatText(index)"
              placeholder="Введите текст здесь..."
            ></textarea>

            <div class="block-actions">
              <button
                @click="moveUp(index)"
                class="move-btn"
                :disabled="index === 0"
              >
                ↑
              </button>
              <button
                @click="moveDown(index)"
                class="move-btn"
                :disabled="index === contentBlocks.length - 1"
              >
                ↓
              </button>
              <button @click="removeBlock(index)" class="remove-btn">
                Удалить
              </button>
            </div>
          </div>

          <div class="controls">
            <button @click="addBlock" class="add-btn">+ Добавить блок</button>
            <button @click="saveContent" class="save-btn">
              Сохранить изменения
            </button>
            <button @click="previewContent" class="preview-btn">
              Предпросмотр
            </button>
          </div>
        </div>

        <!-- Модальное окно предпросмотра -->
        <div v-if="showPreview" class="preview-modal">
          <div class="preview-content">
            <h3>Предпросмотр страницы "О Нас"</h3>
            <div class="preview-html" v-html="previewHTML"></div>
            <button @click="showPreview = false" class="close-preview">
              Закрыть
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
      loading: true,
      contentBlocks: [],
      blockTypes: [],
      originalContent: [],
      showPreview: false,
      previewHTML: "",
    };
  },
  created() {
    this.fetchContent();
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
    async fetchContent() {
      try {
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v1/getAboutUs",
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
          // Получаем texts из данных
          let textsData = data.data[0].texts;

          // Если это строка, парсим её
          if (typeof textsData === "string") {
            try {
              // Сначала распарсим JSON-строку
              textsData = JSON.parse(textsData);

              // Если результат - массив строк, обрабатываем каждую строку
              if (Array.isArray(textsData)) {
                // Распарсим каждый элемент массива, так как они могут быть экранированными JSON-строками
                const parsedBlocks = textsData.map((item) => {
                  // Если элемент - строка и похож на HTML
                  if (
                    typeof item === "string" &&
                    (item.startsWith("<") || item.includes('\\"'))
                  ) {
                    // Если строка содержит экранированные кавычки, раскодируем их
                    if (item.includes('\\"')) {
                      item = item.replace(/\\"/g, '"');
                    }
                    return item;
                  }
                  return item;
                });

                // Обрабатываем каждый HTML-блок
                this.contentBlocks = parsedBlocks.map((block) =>
                  this.extractTextContent(block)
                );
                this.blockTypes = parsedBlocks.map((block) =>
                  this.detectBlockType(block)
                );
              } else {
                // Если формат данных неожиданный, создаем пустой блок
                this.contentBlocks = [""];
                this.blockTypes = ["p"];
              }
            } catch (parseError) {
              console.error("Ошибка парсинга JSON:", parseError);
              this.contentBlocks = [""];
              this.blockTypes = ["p"];
            }
          } else if (Array.isArray(textsData)) {
            // Если textsData уже является массивом
            this.contentBlocks = textsData.map((block) =>
              this.extractTextContent(block)
            );
            this.blockTypes = textsData.map((block) =>
              this.detectBlockType(block)
            );
          } else {
            // Если формат данных неожиданный, создаем пустой блок
            this.contentBlocks = [""];
            this.blockTypes = ["p"];
          }

          this.originalContent = JSON.parse(JSON.stringify(this.contentBlocks));
        } else {
          // Если данных нет, создаем пустой блок
          this.contentBlocks = [""];
          this.blockTypes = ["p"];
          this.originalContent = [""];
        }
      } catch (error) {
        console.error("Ошибка загрузки контента:", error);
        // В случае ошибки также создаем пустой блок
        this.contentBlocks = [""];
        this.blockTypes = ["p"];
        this.originalContent = [""];
      } finally {
        this.loading = false;
      }
    },

    detectBlockType(html) {
      if (typeof html !== "string") return "p";

      // Удаляем экранированные кавычки, если они есть
      html = html.replace(/\\"/g, '"');

      if (html.startsWith("<h2")) return "h2";
      if (html.startsWith("<h3")) return "h3";
      if (html.startsWith("<ul")) return "ul";
      if (html.startsWith("<ol")) return "ol";
      return "p";
    },

    extractTextContent(html) {
      if (typeof html !== "string") return "";

      // Удаляем экранированные кавычки, если они есть
      html = html.replace(/\\"/g, '"');

      // Создаем временный DOM-элемент для парсинга HTML
      const div = document.createElement("div");
      div.innerHTML = html;

      // Обрабатываем списки особым образом
      if (html.startsWith("<ul") || html.startsWith("<ol")) {
        const items = div.querySelectorAll("li");
        return Array.from(items)
          .map(
            (item, idx) =>
              (html.startsWith("<ul") ? "• " : `${idx + 1}. `) +
              item.textContent
          )
          .join("\n");
      }

      return div.textContent || div.innerText || "";
    },
    formatText(index) {
      // Автоматическое увеличение высоты textarea
      this.$nextTick(() => {
        const textareas = document.querySelectorAll(".content-input");
        if (textareas[index]) {
          textareas[index].style.height = "auto";
          textareas[index].style.height = textareas[index].scrollHeight + "px";
        }
      });
    },

    getRowsCount(text) {
      if (!text) return 3;
      return Math.max(3, (text.match(/\n/g) || []).length + 1);
    },

    addBlock() {
      this.contentBlocks.push("");
      this.blockTypes.push("p");
    },

    removeBlock(index) {
      if (this.contentBlocks.length > 1) {
        this.contentBlocks.splice(index, 1);
        this.blockTypes.splice(index, 1);
      } else {
        // Если это последний блок, просто очищаем его
        this.contentBlocks[0] = "";
        this.blockTypes[0] = "p";
      }
    },

    moveUp(index) {
      if (index > 0) {
        [this.contentBlocks[index], this.contentBlocks[index - 1]] = [
          this.contentBlocks[index - 1],
          this.contentBlocks[index],
        ];
        [this.blockTypes[index], this.blockTypes[index - 1]] = [
          this.blockTypes[index - 1],
          this.blockTypes[index],
        ];
      }
    },

    moveDown(index) {
      if (index < this.contentBlocks.length - 1) {
        [this.contentBlocks[index], this.contentBlocks[index + 1]] = [
          this.contentBlocks[index + 1],
          this.contentBlocks[index],
        ];
        [this.blockTypes[index], this.blockTypes[index + 1]] = [
          this.blockTypes[index + 1],
          this.blockTypes[index],
        ];
      }
    },

    insertTag(tag) {
      const textareas = document.querySelectorAll(".content-input");
      const activeTextarea = document.activeElement;

      if (
        textareas &&
        activeTextarea &&
        Array.from(textareas).includes(activeTextarea)
      ) {
        const index = Array.from(textareas).indexOf(activeTextarea);
        const startPos = activeTextarea.selectionStart;
        const endPos = activeTextarea.selectionEnd;
        const selectedText = this.contentBlocks[index].substring(
          startPos,
          endPos
        );

        let newText = "";
        switch (tag) {
          case "h2":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              (selectedText || "Заголовок") +
              this.contentBlocks[index].substring(endPos);
            this.blockTypes[index] = "h2";
            break;
          case "h3":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              (selectedText || "Подзаголовок") +
              this.contentBlocks[index].substring(endPos);
            this.blockTypes[index] = "h3";
            break;
          case "p":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              (selectedText || "Новый абзац") +
              this.contentBlocks[index].substring(endPos);
            this.blockTypes[index] = "p";
            break;
          case "ul":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              (selectedText ? selectedText : "") +
              (selectedText ? "\n" : "") +
              "• Пункт 1\n• Пункт 2\n• Пункт 3" +
              this.contentBlocks[index].substring(endPos);
            this.blockTypes[index] = "ul";
            break;
          case "ol":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              (selectedText ? selectedText : "") +
              (selectedText ? "\n" : "") +
              "1. Пункт 1\n2. Пункт 2\n3. Пункт 3" +
              this.contentBlocks[index].substring(endPos);
            this.blockTypes[index] = "ol";
            break;
          case "li":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              (this.blockTypes[index] === "ul" ? "• " : "1. ") +
              (selectedText || "Новый пункт") +
              this.contentBlocks[index].substring(endPos);
            break;
          case "strong":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              "**" +
              (selectedText || "жирный текст") +
              "**" +
              this.contentBlocks[index].substring(endPos);
            break;
          case "em":
            newText =
              this.contentBlocks[index].substring(0, startPos) +
              "*" +
              (selectedText || "курсив") +
              "*" +
              this.contentBlocks[index].substring(endPos);
            break;
          default:
            newText = this.contentBlocks[index];
        }

        this.contentBlocks[index] = newText;
        this.$nextTick(() => {
          activeTextarea.focus();
          this.formatText(index);
        });
      } else {
        // Если нет активного textarea, добавляем новый блок
        let newContent = "";
        switch (tag) {
          case "h2":
            newContent = "Заголовок";
            this.contentBlocks.push(newContent);
            this.blockTypes.push("h2");
            break;
          case "h3":
            newContent = "Подзаголовок";
            this.contentBlocks.push(newContent);
            this.blockTypes.push("h3");
            break;
          case "ul":
            newContent = "• Пункт 1\n• Пункт 2\n• Пункт 3";
            this.contentBlocks.push(newContent);
            this.blockTypes.push("ul");
            break;
          case "ol":
            newContent = "1. Пункт 1\n2. Пункт 2\n3. Пункт 3";
            this.contentBlocks.push(newContent);
            this.blockTypes.push("ol");
            break;
          default:
            newContent = "Новый абзац";
            this.contentBlocks.push(newContent);
            this.blockTypes.push("p");
        }
      }
    },

    previewContent() {
      this.previewHTML = this.generateHTML();
      this.showPreview = true;
    },

    generateHTML() {
      return this.contentBlocks
        .map((content, index) => {
          if (!content.trim()) return ""; // Пропускаем пустые блоки

          const type = this.blockTypes[index];

          // Обработка маркированного текста
          let processedContent = content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Обработка жирного текста
            .replace(/\*(.*?)\*/g, "<em>$1</em>"); // Обработка курсива

          // Экранирование HTML-символов (кроме тех, что мы уже добавили)
          processedContent = processedContent
            .replace(/&(?!amp;|lt;|gt;|quot;|#039;)/g, "&amp;")
            .replace(/<(?!\/?strong|\/?em)/g, "&lt;")
            .replace(
              />(?!(?:(?!<strong|<em|<\/strong>|<\/em>).)*?<\/strong>|<\/em>)/g,
              "&gt;"
            )
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

          switch (type) {
            case "h2":
              return `<h2>${processedContent}</h2>`;
            case "h3":
              return `<h3>${processedContent}</h3>`;
            case "ul": {
              const items = processedContent
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => {
                  const itemContent = line.replace(/^•\s*/, "");
                  return `<li>${itemContent}</li>`;
                })
                .join("");
              return `<ul>${items}</ul>`;
            }
            case "ol": {
              const items = processedContent
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => {
                  const itemContent = line.replace(/^\d+\.\s*/, "");
                  return `<li>${itemContent}</li>`;
                })
                .join("");
              return `<ol>${items}</ol>`;
            }
            default:
              // Заменяем переносы строк на <br>
              return `<p>${processedContent.replace(/\n/g, "<br>")}</p>`;
          }
        })
        .filter((html) => html) // Удаляем пустые строки
        .join("");
    },

    async saveContent() {
      try {
        // Генерируем HTML для каждого блока
        const htmlBlocks = this.contentBlocks
          .map((content, index) => {
            if (!content.trim()) return ""; // Пропускаем пустые блоки

            const type = this.blockTypes[index];

            // Обработка маркированного текста
            let processedContent = content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Обработка жирного текста
              .replace(/\*(.*?)\*/g, "<em>$1</em>"); // Обработка курсива

            // Экранирование HTML-символов (кроме тех, что мы уже добавили)
            processedContent = processedContent
              .replace(/&(?!amp;|lt;|gt;|quot;|#039;)/g, "&amp;")
              .replace(/<(?!\/?strong|\/?em)/g, "&lt;")
              .replace(
                />(?!(?:(?!<strong|<em|<\/strong>|<\/em>).)*?<\/strong>|<\/em>)/g,
                "&gt;"
              )
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");

            switch (type) {
              case "h2":
                return `<h2>${processedContent}</h2>`;
              case "h3":
                return `<h3>${processedContent}</h3>`;
              case "ul": {
                const items = processedContent
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line) => {
                    const itemContent = line.replace(/^•\s*/, "");
                    return `<li>${itemContent}</li>`;
                  })
                  .join("");
                return `<ul>${items}</ul>`;
              }
              case "ol": {
                const items = processedContent
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line) => {
                    const itemContent = line.replace(/^\d+\.\s*/, "");
                    return `<li>${itemContent}</li>`;
                  })
                  .join("");
                return `<ol>${items}</ol>`;
              }
              default:
                // Заменяем переносы строк на <br>
                return `<p>${processedContent.replace(/\n/g, "<br>")}</p>`;
            }
          })
          .filter((html) => html); // Удаляем пустые строки

        // Отправляем на сервер
        const response = await fetch(
          "https://ce95524.tw1.ru/api/v2/updateAboutUs",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              texts: JSON.stringify(htmlBlocks), // Преобразуем массив в JSON-строку
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          alert("Изменения успешно сохранены");
          this.originalContent = JSON.parse(JSON.stringify(this.contentBlocks));
        } else {
          alert(
            "Ошибка при сохранении: " + (result.message || "Неизвестная ошибка")
          );
        }
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        alert("Произошла ошибка при сохранении: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelAboutUs.min.css";
</style>