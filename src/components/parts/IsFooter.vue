<template>
  <div class="boxFooter">
    <footer>
      <div class="top">
        <section>
          <h4>Подписывайтесь на новости!</h4>
          <p>Не пропустите новости об акциях и мероприятиях</p>
          <div class="input">
            <input type="email" placeholder="Ваш e-mail" />
            <button>
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
            <input type="checkbox" name="" id="" /> Нажимая на кнопку, я
            принимаю условия публичной оферты и политики конфиденциальности
          </label>
        </section>
        <hr />
        <section>
          <h4>О КОМПАНИИ</h4>
          <nav>
            <a href="">Доставка и оплата</a>
            <a href="">Блог</a>
            <a href="">О нас</a>
            <a href="">Таблица размеров</a>
          </nav>
        </section>
        <hr />
        <section class="is-3">
          <h4>КОНТАКТЫ</h4>
          <a href="">8 (888) 888-88-88</a>
          <a href="">info@delice.ru</a>
          <address>г. Санкт-Петербург, Невский пр., 65</address>
          <div class="social">
            <img src="/media/images/telegram__icon.svg" alt="" />
            <img src="/media/images/whatsapp__icon.svg" alt="" />
          </div>
        </section>
      </div>
      <div class="bottom">© 2025 DELICE.RU</div>
    </footer>
  </div>
</template>

<style scoped>
@import "../../assets/styles/parts/dist/min/footer.min.css";
</style>