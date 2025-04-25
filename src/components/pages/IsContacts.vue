<template>
  <main class="boxMainContacts">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Контакты</a>
      </nav>
      <h1>КОНТАКТЫ</h1>
      <div class="block1">
        <div class="left">
          <div class="items">
            <div class="item">
              <img src="/media/images/phone.svg" alt="" /> +7 961 333 94 44
            </div>
            <div class="item">
              <img src="/media/images/email.svg" alt="" /> Info@delice.ru
            </div>
            <div class="item">
              <img
                src="/media/images/reshot-icon-location-marker-ZE5Y87KGQF 1.svg"
                alt=""
              />
              г. Санкт-Петербург
            </div>
            <div class="item">
              <ul>
                <li>ТЦ “Галерея”, Невский проспект, 65</li>
                <li>ТЦ “Мега Дыбенко”, проспект Дыбенко, 1</li>
                <li>ТЦ “РИО”, проспект Культуры, 1</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right">
          <p>
            Мы всегда рады услышать от вас! Если у вас есть вопросы, предложения
            или комментарии, не стесняйтесь обращаться к нам. Мы здесь, чтобы
            помочь вам!
          </p>
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A5052d3a53167b1e999acc06dd2a4bfe9d22c0847c68e1019ebc73dc997636131&amp;source=constructor"
            width="100%"
            height="400"
            frameborder="0"
            style="border: 1px solid #ccc; border-radius: 8px"
          ></iframe>
        </div>
      </div>
      <div class="block2">
        <h2>Форма обратной связи</h2>
        <p>
          Мы ценим ваше мнение и хотели бы узнать, как мы можем улучшить наш
          сервис. Пожалуйста, заполните форму ниже, и мы свяжемся с вами в
          ближайшее время.
        </p>
        <form @submit.prevent="submitFormMail">
          <div>
            <label>
              <span>Имя</span>
              <input type="text" v-model="name" name="" id="" />
            </label>
            <label>
              <span>E-mail</span>
              <input type="email" v-model="email" name="" id="" />
            </label>
            <label><button type="submit">Отправить</button></label>
          </div>
          <div>
            <label>
              <span>Тема</span>
              <input type="text" v-model="theme" name="" id="" />
            </label>
            <textarea v-model="text"></textarea>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/isContacts.min.css";
</style>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      text: "",
      theme: "",
    };
  },
  methods: {
    submitFormMail() {
      if (!this.email.trim()) {
        alert("Пожалуйста, введите корректный e-mail");
        return;
      }
      if (!this.name.trim()) {
        alert("Пожалуйста, введите корректное имя");
        return;
      }
      if (!this.text.trim()) {
        alert("Пожалуйста, введите корректное сообщение");
        return;
      }
      if (!this.theme.trim()) {
        alert("Пожалуйста, введите корректную тему сообщения");
        return;
      }
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("email", this.email);
      formData.append("text", this.text);
      formData.append("theme", this.theme);
      fetch("https://ce95524.tw1.ru/api/v1/mailHelp", {
        method: "POST",
        body: formData,
      }).then((response) => {
        return response.json().then(() => {
          alert("Сообщение отправлено. Ожидайте ответа по указанной почте.");
          this.name = "";
          this.email = "";
          this.text = "";
          this.theme = "";
        });
      });
    },
  },
};
</script>