<template>
  <div class="boxFooter">
    <footer>
      <div class="top">
        <section>
          <h4>Подписывайтесь на новости!</h4>
          <p>Не пропустите новости об акциях и мероприятиях</p>
          <div class="input">
            <input type="email" v-model="email" placeholder="Ваш e-mail" />
            <button type="button" @click="submitFormMail">
              Подписаться
              <svg
                width="8"
                height="16"
                viewBox="0 0 8 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.616978"
                  y1="15.339"
                  x2="7.04485"
                  y2="7.67856"
                  stroke="#26436C"
                />
                <line
                  x1="0.383022"
                  y1="0.678606"
                  x2="6.8109"
                  y2="8.33905"
                  stroke="#26436C"
                />
              </svg>
            </button>
          </div>
          <label class="acceptance">
            <input type="checkbox" v-model="accepted" /> Нажимая на кнопку, я
            принимаю условия публичной оферты и политики конфиденциальности
          </label>
        </section>
        <hr />
        <section>
          <h4>О КОМПАНИИ</h4>
          <nav>
            <router-link to="/delivery-and-payment"
              >Доставка и оплата</router-link
            >
            <router-link to="/blog">Блог</router-link>
            <router-link to="/about-us">О нас</router-link>
            <a role="button">Таблица размеров</a>
          </nav>
        </section>
        <hr />
        <section class="is-3">
          <h4>КОНТАКТЫ</h4>
          <a href="tel:+79613339444">+7 961 333 94 44</a>
          <a href="mailto:info@delice.ru">info@delice.ru</a>
          <address>г. Санкт-Петербург, Невский пр., 65</address>
          <div class="social">
            <a href="https://t.me/unp_lug" target="_blank"
              ><img src="/media/images/telegram__icon.svg" alt="telegram__icon"
            /></a>
            <a href="https://wa.me/+79613339444" target="_blank"
              ><img src="/media/images/whatsapp__icon.svg" alt="whatsapp__icon"
            /></a>
          </div>
        </section>
      </div>
      <div class="bottom">© 2025 DELICE.RU</div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      accepted: false, // добавили переменную для чекбокса
    };
  },
  methods: {
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    submitFormMail() {
      if (!this.isValidEmail(this.email)) {
        alert("Пожалуйста, введите корректный e-mail");
        return;
      }
      if (!this.accepted) {
        alert(
          "Пожалуйста, примите условия публичной оферты и политики конфиденциальности"
        );
        return;
      }
      const formData = new FormData();
      formData.append("email", this.email);
      fetch("https://ce95524.tw1.ru/api/v1/mailing", {
        method: "POST",
        body: formData,
      }).then((response) => {
        return response.json().then(() => {
          alert("Вы подписались на рассылку");
          this.email = "";
          this.accepted = false; // сбрасываем чекбокс
        });
      });
    },
  },
};
</script>
<style scoped>
@import "../../assets/styles/parts/dist/min/footer.min.css";
</style>
