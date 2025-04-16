<template>
  <main class="boxMainAccount">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/account/orders">Личный кабинет</router-link>
        <a class="is-end">{{
          isCurrentPage === "orders"
            ? "Заказы"
            : isCurrentPage === "data"
            ? "Мои данные"
            : isCurrentPage === "comments"
            ? "Отзывы"
            : "Не известно"
        }}</a>
      </nav>
      <div class="box">
        <AccountLeftMenu></AccountLeftMenu>
        <div class="block1" v-if="isCurrentPage === 'orders'">
          <h1>Мои заказы</h1>
          <div class="tableBox">
            <table>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Сумма заказа</th>
                  <th>Статус заказа</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>350-46</td>
                  <td>07.04.2025</td>
                  <td>54 000 ₽</td>
                  <td>Оформлен</td>
                  <td><a href="">Перейти к заказу &gt;</a></td>
                </tr>
                <tr>
                  <td>350-46</td>
                  <td>07.04.2025</td>
                  <td>54 000 ₽</td>
                  <td>Оформлен</td>
                  <td><a href="">Перейти к заказу &gt;</a></td>
                </tr>
                <tr>
                  <td>350-46</td>
                  <td>07.04.2025</td>
                  <td>54 000 ₽</td>
                  <td>Оформлен</td>
                  <td><a href="">Перейти к заказу &gt;</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="block2" v-if="isCurrentPage === 'data'">
          <h1>Мои данные</h1>
          <form action="">
            <div class="line">
              <label>
                <span>Имя</span>
                <input type="text" />
              </label>
              <label>
                <span>Фамилия</span>
                <input type="text" />
              </label>
            </div>
            <div class="line">
              <label>
                <span>E-mail</span>
                <input type="email" />
              </label>
              <label>
                <span>Телефон</span>
                <input type="tel" />
              </label>
            </div>
            <button type="submit">Сохранить</button>
          </form>
          <div class="actions">
            <a href="">Выйти из профиля</a>
            <a href="">Удалить профиль</a>
          </div>
        </div>
        <div class="block3" v-if="isCurrentPage === 'comments'">
          <h1>Мои отзывы</h1>
          <div class="items">
            <div class="item">
              <img src="/media/images/MaskProduct.png" alt="" />
              <div class="content">
                <div class="name">Товар</div>
                <div class="params">XS, Цвет</div>
                <div class="renting">★★★★★</div>
              </div>
            </div>
            <div class="item">
              <img src="/media/images/MaskProduct.png" alt="" />
              <div class="content">
                <div class="name">Товар</div>
                <div class="params">XS, Цвет</div>
                <div class="renting">★★★★★</div>
              </div>
            </div>
            <div class="item">
              <img src="/media/images/MaskProduct.png" alt="" />
              <div class="content">
                <div class="name">Товар</div>
                <div class="params">XS, Цвет</div>
                <div class="renting">★★★★★</div>
              </div>
            </div>
            <div class="item">
              <img src="/media/images/MaskProduct.png" alt="" />
              <div class="content">
                <div class="name">Товар</div>
                <div class="params">XS, Цвет</div>
                <div class="renting">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../assets/styles/pages/dist/min/myAccount.min.css";
</style>

<script>
import AccountLeftMenu from "../parts/AccountLeftMenu.vue";
export default {
  components: { AccountLeftMenu },
  data() {
    return {
      isCurrentPage: "orders",
    };
  },
  watch: {
    $route() {
      this.updateCurrentPage();
    },
  },
  mounted() {
    this.updateCurrentPage();
  },
  methods: {
    updateCurrentPage() {
      const path = this.$route.path;
      if (path.includes("/account/orders")) {
        this.isCurrentPage = "orders";
      } else if (path.includes("/account/data")) {
        this.isCurrentPage = "data";
      } else if (path.includes("/account/comments")) {
        this.isCurrentPage = "comments";
      } else {
        this.isCurrentPage = "orders"; // Default fallback
      }
    },
  },
};
</script>