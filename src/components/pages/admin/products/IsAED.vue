<template>
  <main class="boxMainAdminPanelAED">
    <div class="max-container">
      <nav class="is-kroshki">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Управление товарами</a>
      </nav>
      <h1>Управление товарами</h1>
      <div class="buttons">
        <button
          type="button"
          @click="
            isAddForm = !isAddForm;
            isGetForm = false;
          "
        >
          Добавить
        </button>
        <button
          type="button"
          @click="
            isGetForm = !isGetForm;
            isAddForm = false;
          "
        >
          Открыть товар
        </button>
      </div>

      <div class="edit-container" v-if="isAddForm">
        <div class="edit-header">
          <h2>Добавление нового товара</h2>
          <div class="edit-actions">
            <button @click="cancelAdding" class="cancel-btn">
              <i class="fas fa-times"></i> Отмена
            </button>
            <button @click="submitAdd" class="save-btn">
              <i class="fas fa-save"></i> Сохранить
            </button>
          </div>
        </div>

        <div class="edit-content">
          <div class="edit-main-info">
            <div class="form-section">
              <h3>Основная информация</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Название товара*</label>
                  <input type="text" v-model="addData.name" required />
                </div>
                <div class="form-group">
                  <label>Цена (₽)*</label>
                  <input type="number" v-model="addData.price" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Категория*</label>
                  <select
                    v-model="addData.categoryUrl"
                    required
                    @change="updateAddSubcategories"
                  >
                    <option value="women_clothing">ЖЕНСКАЯ ОДЕЖДА</option>
                    <option value="men_clothing">МУЖСКАЯ ОДЕЖДА</option>
                    <option value="women_shoes">ЖЕНСКАЯ ОБУВЬ</option>
                    <option value="men_shoes">МУЖСКАЯ ОБУВЬ</option>
                    <option value="women_accessories">
                      ЖЕНСКИЕ АКСЕССУАРЫ
                    </option>
                    <option value="men_accessories">МУЖСКИЕ АКСЕССУАРЫ</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Подкатегория*</label>
                  <select v-model="addData.category" required>
                    <option
                      v-for="subcat in currentAddSubcategories"
                      :value="subcat"
                      :key="subcat"
                    >
                      {{ subcat }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-section">
                <h3>Количество на складах</h3>
                <div class="form-row">
                  <div
                    class="form-group"
                    v-for="(store, index) in storeLocations"
                    :key="index"
                  >
                    <label>{{ store.name }}*</label>
                    <input
                      type="number"
                      v-model.number="addData.storeQuantities[index]"
                      @input="calculateAddTotalCount"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Общее количество</label>
                  <input type="number" v-model="addData.totalCount" readonly />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Характеристики</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Цвет*</label>
                  <select v-model="addData.color" required>
                    <option value="Белый">Белый</option>
                    <option value="Бежевый">Бежевый</option>
                    <option value="Голубой">Голубой</option>
                    <option value="Желтый">Желтый</option>
                    <option value="Зеленый">Зеленый</option>
                    <option value="Коричневый">Коричневый</option>
                    <option value="Красный">Красный</option>
                    <option value="Оранжевый">Оранжевый</option>
                    <option value="Розовый">Розовый</option>
                    <option value="Серый">Серый</option>
                    <option value="Синий">Синий</option>
                    <option value="Фиолетовый">Фиолетовый</option>
                    <option value="Черный">Черный</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Основной размер*</label>
                  <select v-model="addData.size" required>
                    <option v-for="size in allSizes" :value="size" :key="size">
                      {{ size }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Доступные цвета (через запятую)*</label>
                <input
                  type="text"
                  v-model="addData.availableColorsStr"
                  required
                  @input="updateAddColorImages"
                />
                <div class="tags-preview">
                  <span
                    v-for="(color, index) in addAvailableColorsArray"
                    :key="index"
                    class="tag"
                  >
                    {{ color }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label>Изображения для цветов*</label>
                <div class="color-images-container">
                  <div
                    v-for="color in addAvailableColorsArray"
                    :key="color"
                    class="color-image-item"
                  >
                    <div class="color-name">{{ color }}</div>
                    <div class="color-image-input">
                      <input
                        type="text"
                        v-model="addData.colorsImages[color]"
                        placeholder="URL изображения для цвета"
                        required
                      />
                      <img
                        v-if="addData.colorsImages[color]"
                        :src="addData.colorsImages[color]"
                        class="color-image-preview"
                        @error="handleAddColorImageError(color)"
                        alt="Превью изображения цвета"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Доступные размеры*</label>
                <div class="sizes-container">
                  <div v-for="size in allSizes" :key="size" class="size-option">
                    <input
                      type="checkbox"
                      :id="'add-size-' + size"
                      :value="size"
                      v-model="addData.selectedSizes"
                    />
                    <label :for="'add-size-' + size">{{ size }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="edit-images">
            <div class="form-section">
              <h3>Изображения</h3>
              <div class="form-group">
                <label>Основное изображение (URL)*</label>
                <input type="text" v-model="addData.image" required />
                <img
                  :src="addData.image"
                  class="image-preview"
                  v-if="addData.image"
                  @error="handleAddImageError('main')"
                  alt="Превью основного изображения"
                />
              </div>

              <div class="form-group">
                <label>Дополнительные изображения</label>
                <div
                  v-for="(img, index) in addData.images"
                  :key="index"
                  class="image-input-group"
                >
                  <input
                    type="text"
                    v-model="addData.images[index]"
                    placeholder="URL изображения"
                    @input="validateAddImageUrl(index)"
                  />
                  <button
                    type="button"
                    @click="removeAddImage(index)"
                    class="remove-image-btn"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addAddImageField"
                  class="add-image-btn"
                >
                  <i class="fas fa-plus"></i> Добавить изображение
                </button>
                <div class="images-grid">
                  <div
                    v-for="(img, index) in addData.images"
                    :key="index"
                    class="image-preview-container"
                  >
                    <img
                      :src="img"
                      class="thumbnail"
                      @error="handleAddImageError(index)"
                      alt="Превью дополнительного изображения"
                      v-if="img"
                    />
                    <span class="image-index">Изображение {{ index + 1 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="edit-details">
            <div class="form-section">
              <h3>Детали</h3>
              <div class="form-group">
                <label>Характеристики (каждая с новой строки)</label>
                <div class="textarea-container">
                  <textarea
                    v-model="addData.characteristicStr"
                    rows="5"
                  ></textarea>
                  <div class="hint">
                    Используйте Enter для разделения пунктов
                  </div>
                </div>
                <ul class="preview-list">
                  <li
                    v-for="(item, index) in addData.characteristicStr.split(
                      '\n'
                    )"
                    :key="index"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>

              <div class="form-group">
                <label>Уход за изделием (каждый пункт с новой строки)</label>
                <div class="textarea-container">
                  <textarea
                    v-model="addData.product_careStr"
                    rows="5"
                  ></textarea>
                  <div class="hint">
                    Используйте Enter для разделения пунктов
                  </div>
                </div>
                <ul class="preview-list">
                  <li
                    v-for="(item, index) in addData.product_careStr.split('\n')"
                    :key="index"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="fetchProduct" v-if="isGetForm">
        <input
          type="number"
          v-model="currentGetProduct"
          placeholder="Введите ID товара"
        />
        <button type="submit">Открыть</button>
        <a role="button" @click="faqIdProduct = !faqIdProduct"
          >Как узнать ID товара?</a
        >
        <div class="faqIdProduct" v-if="faqIdProduct">
          <section>Способ N1</section>
          <ol>
            <li>Перейдите на страницу товара.</li>
            <li>
              Рядом с главным названием товара будет надпись:&nbsp;<small
                ><b>«ID &lt;id товара&gt;»</b></small
              >.
            </li>
          </ol>
          <section>Способ N2</section>
          <ol>
            <li>Перейдите на страницу товара.</li>
            <li>Откройте адресную строку.</li>
            <li>
              Вы увидите ссылку по типу:
              <small>https://delice-spb.ru/catalog/product/<b>397</b></small
              >.
            </li>
            <li>Последнее значение ссылки - число. Это ID товара.</li>
          </ol>
        </div>
      </form>

      <div class="product_item" v-if="product && !isEditing">
        <div class="product_images">
          <div class="main_image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="additional_images">
            <img
              v-for="(img, index) in product.images"
              :key="index"
              :src="img"
              :alt="product.name + ' ' + index"
            />
          </div>
        </div>
        <div class="product_info">
          <h2>{{ product.name }}</h2>
          <p class="price">{{ product.price }} ₽</p>
          <p>
            <strong>Категория:</strong>
            {{ getCategoryNameUrl(product.categoryUrl) }}
          </p>
          <p><strong>Подкатегория:</strong> {{ product.category }}</p>
          <p><strong>Цвет:</strong> {{ product.color }}</p>
          <p>
            <strong>Доступные цвета:</strong>
            {{ product.availableColors.join(", ") }}
          </p>
          <p><strong>Основной размер:</strong> {{ product.size }}</p>
          <p>
            <strong>Доступные размеры:</strong> {{ product.sizes.join(", ") }}
          </p>
          <p><strong>Общее количество на складе:</strong> {{ product.totalCount }}</p>
          <p><strong>Количество на складах:</strong>
            <ul class="store-quantities">
              <li v-for="(store, index) in storeLocations" :key="index">
                {{ store.name }} - {{ product.storeQuantities[index] }}
              </li>
            </ul>
          </p>
          <p><strong>Заказов:</strong> {{ product.orders }}</p>
          <p><strong>Дата добавления:</strong> {{ product.date }}</p>

          <div class="characteristics">
            <h3>Характеристики:</h3>
            <ul>
              <li v-for="(char, index) in product.characteristic" :key="index">
                {{ char }}
              </li>
            </ul>
          </div>

          <div class="product_care">
            <h3>Уход за изделием:</h3>
            <ul>
              <li v-for="(care, index) in product.product_care" :key="index">
                {{ care }}
              </li>
            </ul>
          </div>

          <div class="product_actions">
            <button @click="startEditing" class="edit_btn">
              Редактировать
            </button>
            <button @click="deleteProduct" class="delete_btn">Удалить</button>
          </div>
        </div>
      </div>

      <div class="edit-container" v-if="isEditing">
        <div class="edit-header">
          <h2>Редактирование товара: {{ product.name }}</h2>
          <div class="edit-actions">
            <button @click="cancelEditing" class="cancel-btn">
              <i class="fas fa-times"></i> Отмена
            </button>
            <button @click="submitEdit" class="save-btn">
              <i class="fas fa-save"></i> Сохранить
            </button>
          </div>
        </div>

        <div class="edit-content">
          <div class="edit-main-info">
            <div class="form-section">
              <h3>Основная информация</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Название товара*</label>
                  <input type="text" v-model="editData.name" required />
                </div>
                <div class="form-group">
                  <label>Цена (₽)*</label>
                  <input type="number" v-model="editData.price" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Категория*</label>
                  <select
                    v-model="editData.categoryUrl"
                    required
                    @change="updateSubcategories"
                  >
                    <option value="women_clothing">ЖЕНСКАЯ ОДЕЖДА</option>
                    <option value="men_clothing">МУЖСКАЯ ОДЕЖДА</option>
                    <option value="women_shoes">ЖЕНСКАЯ ОБУВЬ</option>
                    <option value="men_shoes">МУЖСКАЯ ОБУВЬ</option>
                    <option value="women_accessories">
                      ЖЕНСКИЕ АКСЕССУАРЫ
                    </option>
                    <option value="men_accessories">МУЖСКИЕ АКСЕССУАРЫ</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Подкатегория*</label>
                  <select v-model="editData.category" required>
                    <option
                      v-for="subcat in currentSubcategories"
                      :value="subcat"
                      :key="subcat"
                    >
                      {{ subcat }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-section">
                <h3>Количество на складах</h3>
                <div class="form-row">
                  <div
                    class="form-group"
                    v-for="(store, index) in storeLocations"
                    :key="index"
                  >
                    <label>{{ store.name }}*</label>
                    <input
                      type="number"
                      v-model.number="editData.storeQuantities[index]"
                      @input="calculateTotalCount"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Общее количество</label>
                  <input type="number" v-model="editData.totalCount" readonly />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Характеристики</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Цвет*</label>
                  <select v-model="editData.color" required>
                    <option value="Белый">Белый</option>
                    <option value="Бежевый">Бежевый</option>
                    <option value="Голубой">Голубой</option>
                    <option value="Желтый">Желтый</option>
                    <option value="Зеленый">Зеленый</option>
                    <option value="Коричневый">Коричневый</option>
                    <option value="Красный">Красный</option>
                    <option value="Оранжевый">Оранжевый</option>
                    <option value="Розовый">Розовый</option>
                    <option value="Серый">Серый</option>
                    <option value="Синий">Синий</option>
                    <option value="Фиолетовый">Фиолетовый</option>
                    <option value="Черный">Черный</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Основной размер*</label>
                  <select v-model="editData.size" required>
                    <option v-for="size in allSizes" :value="size" :key="size">
                      {{ size }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Доступные цвета (через запятую)*</label>
                <input
                  type="text"
                  v-model="editData.availableColorsStr"
                  required
                  @input="updateColorImages"
                />
                <div class="tags-preview">
                  <span
                    v-for="(color, index) in availableColorsArray"
                    :key="index"
                    class="tag"
                  >
                    {{ color }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label>Изображения для цветов*</label>
                <div class="color-images-container">
                  <div
                    v-for="color in availableColorsArray"
                    :key="color"
                    class="color-image-item"
                  >
                    <div class="color-name">{{ color }}</div>
                    <div class="color-image-input">
                      <input
                        type="text"
                        v-model="editData.colorsImages[color]"
                        placeholder="URL изображения для цвета"
                        required
                      />
                      <img
                        v-if="editData.colorsImages[color]"
                        :src="editData.colorsImages[color]"
                        class="color-image-preview"
                        @error="handleColorImageError(color)"
                        alt="Превью изображения цвета"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Доступные размеры*</label>
                <div class="sizes-container">
                  <div v-for="size in allSizes" :key="size" class="size-option">
                    <input
                      type="checkbox"
                      :id="'size-' + size"
                      :value="size"
                      v-model="editData.selectedSizes"
                    />
                    <label :for="'size-' + size">{{ size }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="edit-images">
            <div class="form-section">
              <h3>Изображения</h3>
              <div class="form-group">
                <label>Основное изображение (URL)*</label>
                <input type="text" v-model="editData.image" required />
                <img
                  :src="editData.image"
                  class="image-preview"
                  v-if="editData.image"
                  @error="handleImageError('main')"
                  alt="Превью основного изображения"
                />
              </div>

              <div class="form-group">
                <label>Дополнительные изображения</label>
                <div
                  v-for="(img, index) in editData.images"
                  :key="index"
                  class="image-input-group"
                >
                  <input
                    type="text"
                    v-model="editData.images[index]"
                    placeholder="URL изображения"
                    @input="validateImageUrl(index)"
                  />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="remove-image-btn"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addImageField"
                  class="add-image-btn"
                >
                  <i class="fas fa-plus"></i> Добавить изображение
                </button>
                <div class="images-grid">
                  <div
                    v-for="(img, index) in editData.images"
                    :key="index"
                    class="image-preview-container"
                  >
                    <img
                      :src="img"
                      class="thumbnail"
                      @error="handleImageError(index)"
                      alt="Превью дополнительного изображения"
                      v-if="img"
                    />
                    <span class="image-index">Изображение {{ index + 1 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="edit-details">
            <div class="form-section">
              <h3>Детали</h3>
              <div class="form-group">
                <label>Характеристики (каждая с новой строки)</label>
                <div class="textarea-container">
                  <textarea
                    v-model="editData.characteristicStr"
                    rows="5"
                  ></textarea>
                  <div class="hint">
                    Используйте Enter для разделения пунктов
                  </div>
                </div>
                <ul class="preview-list">
                  <li
                    v-for="(item, index) in editData.characteristicStr.split(
                      '\n'
                    )"
                    :key="index"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>

              <div class="form-group">
                <label>Уход за изделием (каждый пункт с новой строки)</label>
                <div class="textarea-container">
                  <textarea
                    v-model="editData.product_careStr"
                    rows="5"
                  ></textarea>
                  <div class="hint">
                    Используйте Enter для разделения пунктов
                  </div>
                </div>
                <ul class="preview-list">
                  <li
                    v-for="(item, index) in editData.product_careStr.split(
                      '\n'
                    )"
                    :key="index"
                  >
                    {{ item.trim() }}
                  </li>
                </ul>
              </div>
            </div>
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
      faqIdProduct: false,
      isAddForm: false,
      isGetForm: false,
      newProductId: 0,
      currentGetProduct: null,
      product: null,
      isEditing: false,
      allSizes: ["XS", "S", "M", "L", "XL", "XXL"],
      storeLocations: [
        { name: "ТЦ “Галерея”, Невский проспект, 65", id: 1 },
        { name: "ТЦ “Мега Дыбенко”, проспект Дыбенко, 1", id: 2 },
        { name: "ТЦ “РИО”, проспект Культуры, 1", id: 3 },
      ],
      subcategories: {
        "ЖЕНСКАЯ ОДЕЖДА": [
          "блузы и рубашки",
          "боди",
          "брюки",
          "верхняя одежда",
          "джемперы, свитера и кардиганы",
          "джинсы",
          "комбинезоны",
          "пиджаки и костюмы",
          "платья",
          "топы и майки",
          "футболки и поло",
          "худи и свитшоты",
          "шорты",
          "юбки",
        ],
        "МУЖСКАЯ ОДЕЖДА": [
          "брюки",
          "верхняя одежда",
          "джемперы, свитера и кардиганы",
          "джинсы",
          "комбинезоны",
          "майки",
          "пиджаки и костюмы",
          "рубашки",
          "футболки и поло",
          "худи и свитшоты",
          "шорты",
        ],
        "ЖЕНСКИЕ АКСЕССУАРЫ": [
          "головные уборы",
          "кошельки и визитницы",
          "очки",
          "ремни и пояса",
          "рюкзаки",
          "сумки",
          "шарфы и платки",
        ],
        "МУЖСКИЕ АКСЕССУАРЫ": [
          "головные уборы",
          "кошельки и визитницы",
          "очки",
          "ремни и пояса",
          "рюкзаки",
          "сумки",
          "шарфы и платки",
        ],
        "ЖЕНСКАЯ ОБУВЬ": [
          "босоножки",
          "ботильоны",
          "ботинки",
          "вечерняя обувь",
          "кроссовки и кеды",
          "сабо",
          "сланцы",
          "туфли",
        ],
        "МУЖСКАЯ ОБУВЬ": [
          "ботинки",
          "кроссовки и кеды",
          "сабо",
          "сандалии",
          "сланцы",
          "туфли",
        ],
      },
      currentSubcategories: [],
      currentAddSubcategories: [],
      editData: {
        name: "",
        price: 0,
        categoryUrl: "",
        subcategory: "",
        color: "",
        availableColorsStr: "",
        size: "",
        selectedSizes: [],
        storeQuantities: [0, 0, 0],
        totalCount: 0,
        image: "",
        images: [],
        colorsImages: {},
        characteristicStr: "",
        product_careStr: "",
      },
      addData: {
        name: "",
        price: 0,
        categoryUrl: "",
        subcategory: "",
        color: "",
        availableColorsStr: "",
        size: "",
        selectedSizes: [],
        storeQuantities: [0, 0, 0],
        totalCount: 0,
        image: "",
        images: [],
        colorsImages: {},
        characteristicStr: "",
        product_careStr: "",
      },
    };
  },
  computed: {
    availableColorsArray() {
      return this.editData.availableColorsStr
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== "");
    },
    addAvailableColorsArray() {
      return this.addData.availableColorsStr
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== "");
    },
  },
  created() {
    this.isAuth();
  },
  methods: {
    getCategoryNameUrl(e) {
      const categoryMap = {
        women_clothing: "ЖЕНСКАЯ ОДЕЖДА",
        men_clothing: "МУЖСКАЯ ОДЕЖДА",
        women_shoes: "ЖЕНСКАЯ ОБУВЬ",
        men_shoes: "МУЖСКАЯ ОБУВЬ",
        women_accessories: "ЖЕНСКИЕ АКСЕССУАРЫ",
        men_accessories: "МУЖСКИЕ АКСЕССУАРЫ",
      };
      return categoryMap[e] || "";
    },
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
        .then(() => {})
        .catch((err) => {
          console.error(err.message);
        });
    },
    fetchProduct() {
      this.cancelEditing();
      fetch(
        "https://ce95524.tw1.ru/api/v2/getProductById/" +
          this.currentGetProduct,
        {
          credentials: "include",
        }
      ).then((response) => {
        if (response.status === 200) {
          return response.json().then((data) => {
            if (data.data.length === 0) {
              alert("Данного товара не существует");
              return;
            }
            this.product = data.data[0];
            this.product.sizes = JSON.parse(this.product.sizes);
            this.product.images = JSON.parse(this.product.images);
            this.product.product_care = JSON.parse(this.product.product_care);
            this.product.characteristic = JSON.parse(
              this.product.characteristic
            );
            this.product.count = Number(this.product.count);
            this.product.availableColors = JSON.parse(
              this.product.availableColors
            );

            try {
              this.product.colorsImages = this.product.colorsImages
                ? JSON.parse(this.product.colorsImages)
                : {};
            } catch (e) {
              console.error("Ошибка парсинга colorsImages:", e);
              this.product.colorsImages = {};
            }

            this.product.storeQuantities = [0, 0, 0];
            this.product.totalCount = 0;

            this.fetchStoreQuantities(this.currentGetProduct).then(() => {
              this.product.totalCount = this.product.storeQuantities.reduce(
                (sum, current) => sum + current,
                0
              );
            });
          });
        } else {
          return response.json().then((data) => {
            alert(data.message);
          });
        }
      });
    },
    fetchStoreQuantities(productId) {
      return fetch(
        "https://ce95524.tw1.ru/api/v1/getStoresProduct/" + productId
      )
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error(
              "Не удалось получить данные о количестве товара на складах"
            );
          }
        })
        .then((data) => {
          const storeData = data.data || [];
          const storeQuantities = Array(this.storeLocations.length).fill(0);

          storeData.forEach((store) => {
            const storeIndex = this.storeLocations.findIndex(
              (s) => s.name === store.name
            );
            if (storeIndex !== -1) {
              storeQuantities[storeIndex] = Number(store.count) || 0;
            }
          });

          if (this.product) {
            this.product.storeQuantities = storeQuantities;
            this.product.totalCount = storeQuantities.reduce(
              (sum, current) => sum + current,
              0
            );
          }

          return storeQuantities;
        })
        .catch((error) => {
          console.error("Ошибка при получении данных о складах:", error);
          if (this.product) {
            this.product.storeQuantities = Array(
              this.storeLocations.length
            ).fill(0);
            this.product.totalCount = 0;
          }
          return Array(this.storeLocations.length).fill(0);
        });
    },
    startEditing() {
      this.isEditing = true;

      if (
        !this.product.colorsImages ||
        typeof this.product.colorsImages === "string"
      ) {
        this.product.colorsImages = {};
      }

      const colorsImages = {};
      this.product.availableColors.forEach((color) => {
        colorsImages[color] = this.product.colorsImages[color] || "";
      });

      this.editData = {
        name: this.product.name,
        price: this.product.price,
        categoryUrl: this.product.categoryUrl || this.product.category,
        subcategory: this.product.subcategory,
        category: this.product.category,
        color: this.product.color,
        availableColorsStr: this.product.availableColors.join(", "),
        size: this.product.size,
        selectedSizes: [...this.product.sizes],
        storeQuantities: [
          ...(this.product.storeQuantities ||
            Array(this.storeLocations.length).fill(0)),
        ],
        totalCount: this.product.totalCount || 0,
        image: this.product.image,
        images: [...this.product.images],
        colorsImages: colorsImages,
        characteristicStr: this.product.characteristic.join("\n"),
        product_careStr: this.product.product_care.join("\n"),
      };

      this.updateSubcategories();
    },
    updateColorImages() {
      const colors = this.availableColorsArray;
      const newColorsImages = { ...this.editData.colorsImages };

      colors.forEach((color) => {
        if (!newColorsImages[color]) {
          newColorsImages[color] = "";
        }
      });

      Object.keys(newColorsImages).forEach((color) => {
        if (!colors.includes(color)) {
          delete newColorsImages[color];
        }
      });

      this.editData.colorsImages = newColorsImages;
    },
    updateAddColorImages() {
      const colors = this.addAvailableColorsArray;
      const newColorsImages = { ...this.addData.colorsImages };

      colors.forEach((color) => {
        if (!newColorsImages[color]) {
          newColorsImages[color] = "";
        }
      });

      Object.keys(newColorsImages).forEach((color) => {
        if (!colors.includes(color)) {
          delete newColorsImages[color];
        }
      });

      this.addData.colorsImages = newColorsImages;
    },
    handleColorImageError(color) {
      this.editData.colorsImages[color] = "";
      alert(`Изображение для цвета "${color}" не найдено. Проверьте URL.`);
    },
    handleAddColorImageError(color) {
      this.addData.colorsImages[color] = "";
      alert(`Изображение для цвета "${color}" не найдено. Проверьте URL.`);
    },
    updateSubcategories() {
      const categoryMap = {
        women_clothing: "ЖЕНСКАЯ ОДЕЖДА",
        men_clothing: "МУЖСКАЯ ОДЕЖДА",
        women_shoes: "ЖЕНСКАЯ ОБУВЬ",
        men_shoes: "МУЖСКАЯ ОБУВЬ",
        women_accessories: "ЖЕНСКИЕ АКСЕССУАРЫ",
        men_accessories: "МУЖСКИЕ АКСЕССУАРЫ",
      };

      const categoryName =
        categoryMap[this.editData.categoryUrl] || this.editData.categoryUrl;
      this.currentSubcategories = this.subcategories[categoryName] || [];

      if (
        this.currentSubcategories.length > 0 &&
        !this.currentSubcategories.includes(this.editData.subcategory)
      ) {
        this.editData.subcategory = this.currentSubcategories[0];
      }
    },
    updateAddSubcategories() {
      const categoryMap = {
        women_clothing: "ЖЕНСКАЯ ОДЕЖДА",
        men_clothing: "МУЖСКАЯ ОДЕЖДА",
        women_shoes: "ЖЕНСКАЯ ОБУВЬ",
        men_shoes: "МУЖСКАя ОБУВЬ",
        women_accessories: "ЖЕНСКИЕ АКСЕССУАРЫ",
        men_accessories: "МУЖСКИЕ АКСЕССУАРЫ",
      };

      const categoryName =
        categoryMap[this.addData.categoryUrl] || this.addData.categoryUrl;
      this.currentAddSubcategories = this.subcategories[categoryName] || [];

      if (
        this.currentAddSubcategories.length > 0 &&
        !this.currentAddSubcategories.includes(this.addData.subcategory)
      ) {
        this.addData.subcategory = this.currentAddSubcategories[0];
      }
    },
    calculateTotalCount() {
      this.editData.totalCount = this.editData.storeQuantities.reduce(
        (sum, current) => sum + Number(current || 0),
        0
      );
    },
    calculateAddTotalCount() {
      this.addData.totalCount = this.addData.storeQuantities.reduce(
        (sum, current) => sum + Number(current || 0),
        0
      );
    },
    cancelEditing() {
      this.isEditing = false;
    },
    cancelAdding() {
      this.isAddForm = false;
      this.resetAddForm();
    },
    resetAddForm() {
      this.addData = {
        name: "",
        price: 0,
        categoryUrl: "",
        subcategory: "",
        color: "",
        availableColorsStr: "",
        size: "",
        selectedSizes: [],
        storeQuantities: [0, 0, 0],
        totalCount: 0,
        image: "",
        images: [],
        colorsImages: {},
        characteristicStr: "",
        product_careStr: "",
      };
    },
    addImageField() {
      this.editData.images.push("");
    },
    addAddImageField() {
      this.addData.images.push("");
    },
    removeImage(index) {
      this.editData.images.splice(index, 1);
    },
    removeAddImage(index) {
      this.addData.images.splice(index, 1);
    },
    handleImageError(type) {
      if (type === "main") {
        this.editData.image = "";
        alert("Не удалось загрузить основное изображение. Проверьте URL.");
      } else if (typeof type === "number") {
        this.editData.images[type] = "";
        alert(`Изображение по индексу ${type + 1} не найдено. Проверьте URL.`);
      }
    },
    handleAddImageError(type) {
      if (type === "main") {
        this.addData.image = "";
        alert("Не удалось загрузить основное изображение. Проверьте URL.");
      } else if (typeof type === "number") {
        this.addData.images[type] = "";
        alert(`Изображение по индексу ${type + 1} не найдено. Проверьте URL.`);
      }
    },
    validateImageUrl(index) {
      if (!this.editData.images[index]) return;

      const img = new Image();
      img.onerror = () => {
        this.editData.images[index] = "";
        alert(`Изображение по индексу ${index + 1} не найдено. Проверьте URL.`);
      };
      img.src = this.editData.images[index];
    },
    validateAddImageUrl(index) {
      if (!this.addData.images[index]) return;

      const img = new Image();
      img.onerror = () => {
        this.addData.images[index] = "";
        alert(`Изображение по индексу ${index + 1} не найдено. Проверьте URL.`);
      };
      img.src = this.addData.images[index];
    },
    submitEdit() {
      const colors = this.availableColorsArray;
      for (const color of colors) {
        if (!this.editData.colorsImages[color]) {
          alert(`Пожалуйста, добавьте изображение для цвета "${color}"`);
          return;
        }
      }

      const formData = new FormData();

      formData.append("name", this.editData.name);
      formData.append("price", Number(this.editData.price));
      formData.append("categoryUrl", this.editData.categoryUrl);
      formData.append("category", this.editData.categoryUrl);
      formData.append("subcategory", this.editData.category);
      formData.append("color", this.editData.color);

      const availableColors = this.availableColorsArray;
      availableColors.forEach((color) => {
        formData.append("availableColors[]", color);
      });

      formData.append(
        "colorsImages",
        JSON.stringify(this.editData.colorsImages)
      );

      formData.append("size", this.editData.size);

      const sizes = this.editData.selectedSizes;
      sizes.forEach((size) => {
        formData.append("sizes[]", size);
      });

      formData.append("count", this.editData.totalCount);

      const storeQuantities = this.editData.storeQuantities.map((qty) =>
        Number(qty || 0)
      );
      storeQuantities.forEach((qty) => {
        formData.append("storeQuantities[]", qty);
      });

      if (this.editData.image) {
        formData.append("image", this.editData.image);
      }

      const images = this.editData.images.filter((img) => img.trim() !== "");
      images.forEach((img) => {
        formData.append("images[]", img);
      });

      const characteristics = this.editData.characteristicStr
        .split("\n")
        .filter((item) => item.trim());
      characteristics.forEach((char) => {
        formData.append("characteristic[]", char);
      });

      const productCare = this.editData.product_careStr
        .split("\n")
        .filter((item) => item.trim());
      productCare.forEach((care) => {
        formData.append("product_care[]", care);
      });

      fetch(`https://ce95524.tw1.ru/api/v2/updateProduct/${this.product.id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw new Error(data.message || "Ошибка при обновлении товара");
            });
          }
        })
        .then(() => {
          return this.updateStoreQuantities(this.product.id, storeQuantities);
        })
        .then(() => {
          alert("Товар успешно обновлен");
          this.isEditing = false;
          this.fetchProduct();
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert(error.message || "Произошла ошибка при обновлении товара");
        });
    },
    submitAdd() {
      const colors = this.addAvailableColorsArray;
      for (const color of colors) {
        if (!this.addData.colorsImages[color]) {
          alert(`Пожалуйста, добавьте изображение для цвета "${color}"`);
          return;
        }
      }

      const formData = new FormData();

      formData.append("name", this.addData.name);
      formData.append("price", Number(this.addData.price));
      formData.append("categoryUrl", this.addData.categoryUrl);
      formData.append("category", this.addData.categoryUrl);
      formData.append("subcategory", this.addData.category);
      formData.append("color", this.addData.color);

      const availableColors = this.addAvailableColorsArray;
      availableColors.forEach((color) => {
        formData.append("availableColors[]", color);
      });

      formData.append(
        "colorsImages",
        JSON.stringify(this.addData.colorsImages)
      );

      formData.append("size", this.addData.size);

      const sizes = this.addData.selectedSizes;
      sizes.forEach((size) => {
        formData.append("sizes[]", size);
      });

      formData.append("count", this.addData.totalCount);

      const storeQuantities = this.addData.storeQuantities.map((qty) =>
        Number(qty || 0)
      );
      storeQuantities.forEach((qty) => {
        formData.append("storeQuantities[]", qty);
      });

      if (this.addData.image) {
        formData.append("image", this.addData.image);
      }

      const images = this.addData.images.filter((img) => img.trim() !== "");
      images.forEach((img) => {
        formData.append("images[]", img);
      });

      const characteristics = this.addData.characteristicStr
        .split("\n")
        .filter((item) => item.trim());
      characteristics.forEach((char) => {
        formData.append("characteristic[]", char);
      });

      const productCare = this.addData.product_careStr
        .split("\n")
        .filter((item) => item.trim());
      productCare.forEach((care) => {
        formData.append("product_care[]", care);
      });

      fetch("https://ce95524.tw1.ru/api/v2/addProduct", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw new Error(data.message || "Ошибка при добавлении товара");
            });
          }
        })
        .then((data) => {
          const productId = data.productId;
          this.newProductId = data.productId;
          return this.updateStoreQuantities(productId, storeQuantities);
        })
        .then(() => {
          alert("Товар успешно добавлен. ID товара: " + this.newProductId);
          this.isAddForm = false;
          this.resetAddForm();
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert(error.message || "Произошла ошибка при добавлении товара");
        });
    },
    updateStoreQuantities(productId, quantities) {
      const formData = new FormData();
      this.storeLocations.forEach((store, index) => {
        formData.append(
          "stores[]",
          JSON.stringify({
            name: store.name,
            quantity: quantities[index],
          })
        );
      });
      return fetch(
        `https://ce95524.tw1.ru/api/v2/updateStoreQuantities/${productId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      ).then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(
              data.message || "Ошибка при обновлении количества на складах"
            );
          });
        }
        return response.json();
      });
    },
    deleteProduct() {
      if (confirm("Вы уверены, что хотите удалить этот товар?")) {
        fetch(
          "https://ce95524.tw1.ru/api/v2/deleteProduct/" + this.product.id,
          {
            method: "DELETE",
            credentials: "include",
          }
        )
          .then((response) => {
            if (response.ok) {
              alert("Товар успешно удален");
              this.product = null;
            } else {
              alert("Ошибка при удалении товара");
            }
          })
          .catch((error) => {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при удалении товара");
          });
      }
    },
  },
};
</script>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelAED.min.css";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
</style>