<template>
  <main class="boxMainAdminPanelReport">
    <div class="max-container">
      <nav class="is-kroshki no-print">
        <router-link to="/">Главная</router-link>
        <router-link to="/admin/panel">Админ-панель</router-link>
        <a class="is-end">Отчет</a>
      </nav>
      <h1>Отчет</h1>

      <!-- Фильтры для отчета -->
      <div class="report-filters">
        <div class="filter-group">
          <label>Тип отчета:</label>
          <select v-model="reportType" @change="loadReport">
            <option value="general">Общая статистика</option>
            <option value="daily">По дням</option>
            <option value="weekly">По неделям</option>
            <option value="monthly">По месяцам</option>
          </select>
        </div>

        <div class="filter-group date-filters" v-if="reportType !== 'general'">
          <div>
            <label>С: </label>
            <input type="date" v-model="startDate" @change="loadReport" />
          </div>
          <div>
            <label>По: </label>
            <input type="date" v-model="endDate" @change="loadReport" />
          </div>
        </div>
      </div>

      <!-- Loader -->
      <div class="loader-container" v-if="loading">
        <div class="loader"></div>
      </div>

      <!-- Общая статистика -->
      <div
        class="report-section general-stats"
        v-if="!loading && reportType === 'general' && reportData"
      >
        <h2>Общая статистика</h2>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-value">{{ reportData.total_orders }}</div>
            <div class="stat-label">Всего заказов</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ formatPrice(reportData.total_amount) }}
            </div>
            <div class="stat-label">Общая сумма</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ reportData.unique_customers }}</div>
            <div class="stat-label">Уникальных клиентов</div>
          </div>
        </div>

        <div class="status-distribution">
          <h3>Распределение по статусам</h3>
          <div class="status-bars">
            <div class="status-bar">
              <div class="status-label">Выполненные</div>
              <div class="bar-container">
                <div
                  class="bar success"
                  :style="{
                    width:
                      getStatusPercentage(
                        reportData.completed_orders,
                        reportData.total_orders
                      ) + '%',
                  }"
                ></div>
              </div>
              <div class="status-count">
                {{ reportData.completed_orders }} ({{
                  getStatusPercentage(
                    reportData.completed_orders,
                    reportData.total_orders
                  )
                }}%)
              </div>
            </div>
            <div class="status-bar">
              <div class="status-label">Оплаченные</div>
              <div class="bar-container">
                <div
                  class="bar success"
                  :style="{
                    width:
                      getStatusPercentage(
                        reportData.success_orders,
                        reportData.total_orders
                      ) + '%',
                  }"
                ></div>
              </div>
              <div class="status-count">
                {{ reportData.success_orders }} ({{
                  getStatusPercentage(
                    reportData.success_orders,
                    reportData.total_orders
                  )
                }}%)
              </div>
            </div>
            <div class="status-bar">
              <div class="status-label">В ожидании</div>
              <div class="bar-container">
                <div
                  class="bar pending"
                  :style="{
                    width:
                      getStatusPercentage(
                        reportData.pending_orders,
                        reportData.total_orders
                      ) + '%',
                  }"
                ></div>
              </div>
              <div class="status-count">
                {{ reportData.pending_orders }} ({{
                  getStatusPercentage(
                    reportData.pending_orders,
                    reportData.total_orders
                  )
                }}%)
              </div>
            </div>
            <div class="status-bar">
              <div class="status-label">Созданные</div>
              <div class="bar-container">
                <div
                  class="bar created"
                  :style="{
                    width:
                      getStatusPercentage(
                        reportData.created_orders,
                        reportData.total_orders
                      ) + '%',
                  }"
                ></div>
              </div>
              <div class="status-count">
                {{ reportData.created_orders }} ({{
                  getStatusPercentage(
                    reportData.created_orders,
                    reportData.total_orders
                  )
                }}%)
              </div>
            </div>
            <div class="status-bar">
              <div class="status-label">Не оплаченные</div>
              <div class="bar-container">
                <div
                  class="bar default"
                  :style="{
                    width:
                      getStatusPercentage(
                        reportData.default_orders,
                        reportData.total_orders
                      ) + '%',
                  }"
                ></div>
              </div>
              <div class="status-count">
                {{ reportData.default_orders }} ({{
                  getStatusPercentage(
                    reportData.default_orders,
                    reportData.total_orders
                  )
                }}%)
              </div>
            </div>
          </div>
        </div>

        <div
          class="top-products"
          v-if="reportData.top_products && reportData.top_products.length"
        >
          <h3>Топ продуктов</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Кол-во заказов</th>
                <th>Общее кол-во</th>
                <th>Общая сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in reportData.top_products"
                :key="product.product_id"
              >
                <td>{{ product.product_name }}</td>
                <td>{{ product.total_count }}</td>
                <td>{{ product.total_quantity }}</td>
                <td>{{ formatPrice(product.total_price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Статистика по периодам (дни, недели, месяцы) -->
      <div
        class="report-section period-stats"
        v-if="!loading && reportType !== 'general' && reportItems.length"
      >
        <h2>
          Статистика
          <span v-if="reportType === 'daily'">по дням</span>
          <span v-else-if="reportType === 'weekly'">по неделям</span>
          <span v-else-if="reportType === 'monthly'">по месяцам</span>
        </h2>

        <table class="period-table">
          <thead>
            <tr>
              <th>
                <span v-if="reportType === 'daily'">Дата</span>
                <span v-else-if="reportType === 'weekly'">Неделя</span>
                <span v-else-if="reportType === 'monthly'">Месяц</span>
              </th>
              <th>Заказов</th>
              <th>Сумма</th>
              <th>Выполненные</th>
              <th>Оплаченные</th>
              <th>В ожидании</th>
              <th>Созданные</th>
              <th>Не оплаченные</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in reportItems" :key="index">
              <tr>
                <td>
                  <span v-if="reportType === 'daily'">{{
                    formatDate(item.day)
                  }}</span>
                  <span v-else-if="reportType === 'weekly'"
                    >{{ formatDate(item.week_start) }} -
                    {{ formatDate(item.week_end) }}</span
                  >
                  <span v-else-if="reportType === 'monthly'">{{
                    formatMonth(item.month)
                  }}</span>
                </td>
                <td>{{ item.total_orders }}</td>
                <td>{{ formatPrice(item.total_amount) }}</td>
                <td>{{ item.completed_orders }}</td>
                <td>{{ item.success_orders }}</td>
                <td>{{ item.pending_orders }}</td>
                <td>{{ item.created_orders }}</td>
                <td>{{ item.default_orders }}</td>
                <td>
                  <button @click="toggleDetails(index)" class="details-button">
                    {{ expandedRows.includes(index) ? "Скрыть" : "Детали" }}
                  </button>
                </td>
              </tr>
              <tr v-if="expandedRows.includes(index)" class="details-row">
                <td colspan="8">
                  <div class="products-details">
                    <h4>Продукты</h4>
                    <table class="products-table">
                      <thead>
                        <tr>
                          <th>Название</th>
                          <th>Кол-во заказов</th>
                          <th>Общее кол-во</th>
                          <th>Общая сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="product in item.products_info"
                          :key="product.product_id"
                        >
                          <td>{{ product.product_name }}</td>
                          <td>{{ product.total_count }}</td>
                          <td>{{ product.total_quantity }}</td>
                          <td>{{ formatPrice(product.total_price) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Сообщение об отсутствии данных -->
      <div
        class="no-data"
        v-if="
          !loading &&
          ((reportType === 'general' && !reportData) ||
            (reportType !== 'general' && !reportItems.length))
        "
      >
        <p>Нет данных для отображения за выбранный период</p>
      </div>

      <!-- Экспорт данных -->
      <div
        class="export-section"
        v-if="
          !loading &&
          ((reportType === 'general' && reportData) ||
            (reportType !== 'general' && reportItems.length))
        "
      >
        <button @click="exportToCsv" class="export-button no-print">
          Экспорт в CSV
        </button>
        <button @click="printReport" class="print-button no-print">
          Печать отчета
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../../../../assets/styles/admin/dist/min/IsPanelReport.min.css";
</style>

<script>
export default {
  data() {
    return {
      userAdmin: false,
      loading: false,
      reportType: "general",
      startDate: this.getDefaultStartDate(),
      endDate: this.getDefaultEndDate(),
      reportData: null,
      reportItems: [],
      expandedRows: [],
    };
  },
  created() {
    this.isAuth();
  },
  mounted() {
    this.loadReport();
  },
  methods: {
    isAuth() {
      fetch("https://delice-spb.ru/api/v2/checkAuth", {
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
        .then((data) => {
          this.userAdmin = data.type === "admin" || false;
          if (!this.userAdmin) {
            this.$router.replace("/");
          }
        })
        .catch((err) => {
          console.error(err.message);
          this.$router.replace("/");
        });
    },

    loadReport() {
      this.loading = true;

      let url = "https://delice-spb.ru/api/v2/report?type=" + this.reportType;

      if (this.reportType !== "general") {
        url += `&start_date=${this.startDate}&end_date=${this.endDate}`;
      }

      fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка загрузки отчета");
          }
          return res.json();
        })
        .then((data) => {
          if (this.reportType === "general") {
            this.reportData = data.data;
            this.reportItems = [];
          } else {
            this.reportData = null;
            this.reportItems = data.data || [];
          }
          this.expandedRows = [];
          this.loading = false;
        })
        .catch((err) => {
          console.error(err.message);
          this.loading = false;
          this.reportData = null;
          this.reportItems = [];
        });
    },

    formatPrice(price) {
      if (!price) return "0 ₽";
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
      }).format(price);
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    },

    formatMonth(monthString) {
      if (!monthString) return "";
      const [year, month] = monthString.split("-");
      const date = new Date(year, month - 1);
      return new Intl.DateTimeFormat("ru-RU", {
        month: "long",
        year: "numeric",
      }).format(date);
    },

    getStatusPercentage(statusCount, totalCount) {
      if (!totalCount) return 0;
      return Math.round((statusCount / totalCount) * 100);
    },
    toggleDetails(index) {
      const position = this.expandedRows.indexOf(index);
      if (position !== -1) {
        this.expandedRows.splice(position, 1);
      } else {
        this.expandedRows.push(index);
      }
    },

    exportToCsv() {
      const BOM = "\uFEFF";

      const formatCsvValue = (value) => {
        if (value === null || value === undefined) return '""';
        const strValue = String(value);
        return `"${strValue.replace(/"/g, '""')}"`;
      };

      const createCsvRow = (values) => {
        return values.map(formatCsvValue).join(";") + "\n";
      };

      let csvContent = BOM;

      if (this.reportType === "general" && this.reportData) {
        csvContent += createCsvRow(["Общая статистика"]);
        csvContent += createCsvRow([
          "Всего заказов",
          "Общая сумма",
          "Уникальных клиентов",
          "Выполненные",
          "Оплаченные",
          "В ожидании",
          "Созданные",
          "Не оплаченные",
        ]);

        csvContent += createCsvRow([
          this.reportData.total_orders,
          this.reportData.total_amount,
          this.reportData.unique_customers,
          this.reportData.completed_orders,
          this.reportData.success_orders,
          this.reportData.pending_orders,
          this.reportData.created_orders,
          this.reportData.default_orders,
        ]);

        csvContent += createCsvRow([]);

        if (
          this.reportData.top_products &&
          this.reportData.top_products.length
        ) {
          csvContent += createCsvRow(["Топ продуктов"]);
          csvContent += createCsvRow([
            "Название",
            "Кол-во заказов",
            "Общее кол-во",
            "Общая сумма",
          ]);

          this.reportData.top_products.forEach((product) => {
            csvContent += createCsvRow([
              product.product_name,
              product.total_count,
              product.total_quantity,
              product.total_price,
            ]);
          });
        }
      } else if (this.reportItems.length) {
        let periodHeader = "";
        if (this.reportType === "daily") periodHeader = "Дата";
        else if (this.reportType === "weekly") periodHeader = "Неделя";
        else if (this.reportType === "monthly") periodHeader = "Месяц";

        csvContent += createCsvRow([
          `Статистика по ${
            this.reportType === "daily"
              ? "дням"
              : this.reportType === "weekly"
              ? "неделям"
              : "месяцам"
          }`,
        ]);

        csvContent += createCsvRow([
          periodHeader,
          "Заказов",
          "Сумма",
          "Выполненные",
          "Оплаченные",
          "В ожидании",
          "Созданные",
          "Не оплаченные",
        ]);

        this.reportItems.forEach((item) => {
          let periodValue = "";
          if (this.reportType === "daily")
            periodValue = this.formatDate(item.day);
          else if (this.reportType === "weekly")
            periodValue = `${this.formatDate(
              item.week_start
            )} - ${this.formatDate(item.week_end)}`;
          else if (this.reportType === "monthly")
            periodValue = this.formatMonth(item.month);

          csvContent += createCsvRow([
            periodValue,
            item.total_orders,
            item.total_amount,
            item.completed_orders,
            item.success_orders,
            item.pending_orders,
            item.created_orders,
            item.default_orders,
          ]);
        });

        if (this.expandedRows.length > 0) {
          csvContent += createCsvRow([]);
          csvContent += createCsvRow(["Детальная информация о продуктах"]);

          this.expandedRows.forEach((index) => {
            const item = this.reportItems[index];
            let periodValue = "";
            if (this.reportType === "daily")
              periodValue = this.formatDate(item.day);
            else if (this.reportType === "weekly")
              periodValue = `${this.formatDate(
                item.week_start
              )} - ${this.formatDate(item.week_end)}`;
            else if (this.reportType === "monthly")
              periodValue = this.formatMonth(item.month);

            csvContent += createCsvRow([`Период: ${periodValue}`]);
            csvContent += createCsvRow([
              "Название",
              "Кол-во заказов",
              "Общее кол-во",
              "Общая сумма",
            ]);

            if (item.products_info && item.products_info.length) {
              item.products_info.forEach((product) => {
                csvContent += createCsvRow([
                  product.product_name,
                  product.total_count,
                  product.total_quantity,
                  product.total_price,
                ]);
              });
            }

            csvContent += createCsvRow([]);
          });
        }
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `report_${this.reportType}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    printReport() {
      window.print();
    },

    getDefaultStartDate() {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString().slice(0, 10);
    },

    getDefaultEndDate() {
      return new Date().toISOString().slice(0, 10);
    },
  },
};
</script>