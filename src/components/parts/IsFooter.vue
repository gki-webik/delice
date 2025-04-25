<template>
  <div class="box-modal" v-if="showModalSizes">
    <div class="modal">
      <h2>
        ТАБЛИЦА РАЗМЕРОВ
        <span class="is-close" @click="showModalSizes = !showModalSizes"
          >×</span
        >
      </h2>
      <div class="table-container">
        <table class="size-table">
          <thead>
            <tr class="is-border-line">
              <th>Европейский размер</th>
              <th class="is-select">XS</th>
              <th>S</th>
              <th class="is-select">M</th>
              <th>L</th>
              <th class="is-select">XL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Российский размер</td>
              <td>42</td>
              <td>44</td>
              <td>46</td>
              <td>48</td>
              <td>50</td>
            </tr>
            <tr>
              <td>Обхват груди (см)</td>
              <td>84</td>
              <td>88</td>
              <td>92</td>
              <td>96</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Обхват талии (см)</td>
              <td>64</td>
              <td>68</td>
              <td>72</td>
              <td>76</td>
              <td>80</td>
            </tr>
            <tr>
              <td>Обхват бёдер (см)</td>
              <td>90</td>
              <td>94</td>
              <td>98</td>
              <td>102</td>
              <td>106</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>КАК СНЯТЬ МЕРКИ?</h2>
      <p>
        Используй мягкую сантиметровую ленту. При снятии мерок она должна плотно
        прилегать к телу, но не перетягивать его.
      </p>
      <div class="box">
        <img
          src="/media/images/8a24edbcb103d96a771fbb946b5af7bb10ee00e7.jpg"
          alt=""
        />
        <div class="text">
          <h3>Обхват груди (см)</h3>
          <p>
            Измеряется по самым выступающим точкам. Рекомендуем снимать мерки в
            белье.
          </p>
          <h3>Обхват талии (см)</h3>
          <p>
            Оберните сантиметровую ленту вокруг талии. Встаньте прямо, дышите
            нормально. Приложите начальный конец сантиметровой ленты к пупку,
            после чего оберните ленту по линии талии вокруг спины и снова
            выведите вперед. Лента должна лежать параллельно полу и плотно
            облегать вашу талию, но не врезаться в кожу. Посмотрите на
            соответствующую метку сантиметровой ленты. Выдохните, а потом
            посмотрите на значение на ленте.
          </p>
          <h3>Обхват бёдер (см)</h3>
          <p>Измеряется по самым выпуклым точкам ягодиц.</p>
        </div>
      </div>
    </div>
  </div>
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
            <a role="button" @click="showModalSizes = true">Таблица размеров</a>
          </nav>
        </section>
        <hr />
        <section class="is-3">
          <h4>КОНТАКТЫ</h4>
          <nav>
            <a href="tel:+79613339444">+7 961 333 94 44</a>
            <a href="mailto:info@delice.ru">info@delice.ru</a>
            <address>г. Санкт-Петербург, Невский пр., 65</address>
            <div class="social">
              <a href="https://t.me/unp_lug" target="_blank"
                ><img
                  src="/media/images/telegram__icon.svg"
                  alt="telegram__icon"
              /></a>
              <a href="https://wa.me/+79613339444" target="_blank"
                ><img
                  src="/media/images/whatsapp__icon.svg"
                  alt="whatsapp__icon"
              /></a>
            </div>
          </nav>
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
      accepted: false,
      showModalSizes: false,
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
