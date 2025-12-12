<script setup lang="ts">
import { useCategories,useFormatMoney,useTransactions } from '../composables/useAccounting'

const { transactions, overview, loading, fetchTransactions, fetchOverview } = useTransactions()
const { fetchCategories } = useCategories()
const { formatMoney } = useFormatMoney()

const showForm = ref(false)

onMounted(async () => {
  await fetchCategories()
  await fetchTransactions()
  await fetchOverview()
})

const handleAdded = () => {
  showForm.value = false
}
</script>

<template>
  <div class="home">
    <h1>我的記帳本</h1>
    
    <div class="overview-cards">
      <div class="card income">
        <div class="card-icon">📈</div>
        <div class="card-content">
          <div class="card-label">總收入</div>
          <div class="card-value">{{ formatMoney(overview.totalIncome) }}</div>
        </div>
      </div>
      
      <div class="card expense">
        <div class="card-icon">📉</div>
        <div class="card-content">
          <div class="card-label">總支出</div>
          <div class="card-value">{{ formatMoney(overview.totalExpense) }}</div>
        </div>
      </div>
      
      <div class="card balance">
        <div class="card-icon">💵</div>
        <div class="card-content">
          <div class="card-label">結餘</div>
          <div class="card-value" :class="{ negative: overview.balance < 0 }">
            {{ formatMoney(overview.balance) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 快速記帳 -->
    <div class="quick-add">
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? '✕ 關閉' : '＋ 快速記帳' }}
      </button>
    </div>

    <TransactionForm v-if="showForm" @added="handleAdded" />

    <!-- 最近記錄 -->
    <div class="recent-transactions">
      <h2>最近記錄</h2>
      <div v-if="loading" class="loading">載入中...</div>
      <div v-else-if="transactions.length === 0" class="empty">
        還沒有任何記錄，開始記帳吧！
      </div>
      <div v-else class="transaction-list">
        <div 
          v-for="t in transactions.slice(0, 5)" 
          :key="t.id" 
          class="transaction-item"
        >
          <div class="transaction-icon">{{ t.category_icon || '📁' }}</div>
          <div class="transaction-info">
            <div class="transaction-category">{{ t.category_name }}</div>
            <div class="transaction-desc">{{ t.description || '無備註' }}</div>
          </div>
          <div class="transaction-right">
            <div class="transaction-amount" :class="t.type">
              {{ t.type === 'income' ? '+' : '-' }}{{ formatMoney(t.amount) }}
            </div>
            <div class="transaction-date">{{ t.date }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.card-icon { font-size: 2.5rem; }
.card-label { color: #666; font-size: 0.9rem; }
.card-value { font-size: 1.5rem; font-weight: bold; }
.card.income .card-value { color: #22c55e; }
.card.expense .card-value { color: #ef4444; }
.card.balance .card-value { color: #3b82f6; }
.card-value.negative { color: #ef4444 !important; }

.quick-add {
  text-align: center;
  margin-bottom: 2rem;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 12px;
  cursor: pointer;
}

.recent-transactions {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.recent-transactions h2 { margin-bottom: 1rem; color: #333; }
.loading, .empty { text-align: center; padding: 2rem; color: #666; }

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.transaction-icon { font-size: 1.5rem; }
.transaction-info { flex: 1; }
.transaction-category { font-weight: 500; color: #333; }
.transaction-desc { font-size: 0.85rem; color: #666; }
.transaction-right { text-align: right; }
.transaction-amount { font-weight: bold; font-size: 1.1rem; }
.transaction-amount.income { color: #22c55e; }
.transaction-amount.expense { color: #ef4444; }
.transaction-date { font-size: 0.8rem; color: #999; }
</style>