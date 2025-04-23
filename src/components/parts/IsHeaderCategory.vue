<template>
  <div class="categoriesList">
    <div class="listItem">
      <router-link to="/catalog" @click="$emit('close-menu')">
        <img src="/media/images/chek__logo.svg" alt="" />
        Все категории
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/women_clothing' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/dress__logo.svg" alt="" /> Женская одежда
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/women_shoes' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/heels__logo.svg" alt="" />Женская обувь
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/women_accessories' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/bag__logo.svg" alt="" />Женские аксессуары
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/men_clothing' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/menclothes__logo.svg" alt="" />Мужская одежда
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/men_shoes' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/menshoes__logo.svg" alt="" />Мужская обувь
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/men_accessories' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/wallet__logo.svg" alt="" />Мужские аксессуары
      </router-link>
    </div>
    <div class="listItem">
      <router-link
        :to="{ path: '/catalog/popular' }"
        @click="$emit('close-menu')"
      >
        <img src="/media/images/pop__logo.svg" alt="" />Популярные товары
      </router-link>
    </div>
    <div class="listItem">
      <router-link :to="{ path: '/catalog/new' }" @click="$emit('close-menu')">
        <img src="/media/images/new__logo.svg" alt="" />Новинки
      </router-link>
    </div>
    <div class="listItem">
      <router-link :to="{ path: '/catalog/sale' }" @click="$emit('close-menu')">
        <img src="/media/images/sale__logo.svg" alt="" />Скидки до 50%
      </router-link>
    </div>
  </div>
</template>