<template>
  <main class="boxMainBlog">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <a class="is-end">Блог</a>
      </nav>
      <h1>Корзина</h1>
    </div>
    <div class="blocks">
      <div class="block" v-for="(item, index) in items" :key="index">
        <h2>{{ item.title }}</h2>
        <div class="content">
          <div class="left">
            <div class="images">
              <img
                v-for="(img, indexImg) in item.images"
                :key="indexImg"
                :src="img"
                alt=""
              />
            </div>
          </div>
          <div class="right">
            <p v-for="(text, indexText) in item.texts" :key="indexText">
              {{ text }}
            </p>
            <router-link :to="'/blog/' + item.id"
              >Читать полностью ></router-link
            >
          </div>
        </div>
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
      items: [
        {
          id: 1,
          title: "Самые модные сумки сезона весна-лето 2025",
          images: [
            "/media/images/bag__item.png",
            "/media/images/bag__item2.png",
            "/media/images/bag__item3.png",
          ],
          texts: [
            "Новый сезон — еще одна возможность начать с чистого листа, особенно если все предыдущие месяцы вы откладывали преображение. При обновлении гардероба важно уделить внимание не только модной одежде, но и аксессуарам. Сумка играет ключевую роль в образе — задает настроение, объединяет детали и может полностью изменить восприятие наряда.",
            "Вместе со стилистом выяснили, какие сумки сейчас модные, и собрали для вас подборку новинок.",
          ],
        },
        {
          id: 2,
          title: "Стильные женские аксессуары в 2025 году",
          images: [
            "/media/images/bag__item.png",
            "/media/images/bag__item2.png",
            "/media/images/bag__item3.png",
          ],
          texts: [
            "Как выяснилось из показов, прошедших в модных столицах мира, в предстоящем сезоне в украшениях будет доминировать максимализм и многослойность. Мода в одежде уходит в лаконичность и простоту, но аксессуары идут по другому пути. В тренде: крупные детали, яркие оттенки, сочетание несочетаемого и природные элементы.",
            "Носите женские аксессуары не только в деловых и вечерних образах, но и в уличных, повседневных и даже спортивных луках. Не бойтесь выходить за рамки: главный девиз нового сезона — все лучшее сразу.",
          ],
        },
      ],
    };
  },
};
</script>