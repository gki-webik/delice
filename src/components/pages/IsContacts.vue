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
              <img src="/media/images/phone.svg" alt="" />
              {{ contactData.phone }}
            </div>
            <div class="item">
              <img src="/media/images/email.svg" alt="" />
              {{ contactData.email }}
            </div>
            <div class="item">
              <img
                src="/media/images/reshot-icon-location-marker-ZE5Y87KGQF 1.svg"
                alt=""
              />
              {{ contactData.address }}
            </div>
            <div class="item">
              <ul>
                <li v-for="(store, index) in contactData.stores" :key="index">
                  {{ store }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right">
          <p>
            {{ contactData.text_one[0] }}
          </p>
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A82c6d26c77006c6b2d2312f707018451ad64bf1e87ebe6f4d9aff61bab0dca29&amp;source=constructor"
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
          {{ contactData.text_two[0] }}
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
      contactData: {
        text_one: [""],
        text_two: [""],
        phone: "",
        email: "",
        address: "",
        stores: [],
      },
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
    fetchContacts() {
      fetch("https://ce95524.tw1.ru/api/v1/getContacts")
        .then((response) => response.json())
        .then((data) => {
          if (data.data && data.data.length > 0) {
            const contact = data.data[0];
            this.contactData = {
              text_one: JSON.parse(contact.text_one),
              text_two: JSON.parse(contact.text_two),
              phone: contact.phone,
              email: contact.email,
              address: contact.address,
              stores: JSON.parse(contact.stores),
            };
          }
        })
        .catch((error) => {
          console.error("Ошибка при загрузке контактов:", error);
        });
    },
  },
  mounted() {
    this.fetchContacts();
  },
};
</script>