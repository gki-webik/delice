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
              <img src="/media/images/phone.svg" alt="" /> 8 (888) 888-88-88
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
          <img src="/media/images/map.png" alt="" />
        </div>
      </div>
      <div class="block2">
        <h2>Форма обратной связи</h2>
        <p>
          Мы ценим ваше мнение и хотели бы узнать, как мы можем улучшить наш
          сервис. Пожалуйста, заполните форму ниже, и мы свяжемся с вами в
          ближайшее время.
        </p>
        <form action="">
          <div>
            <label>
              <span>Имя</span>
              <input type="text" name="" id="" />
            </label>
            <label>
              <span>E-mail</span>
              <input type="email" name="" id="" />
            </label>
            <label><button type="submit">Отправить</button></label>
          </div>
          <div>
            <label>
              <span>Тема</span>
              <input type="text" name="" id="" />
            </label>
            <textarea></textarea>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/isBlog.min.css";
</style>