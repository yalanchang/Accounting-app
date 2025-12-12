<script setup lang="ts">
import { useCategories,useFormatMoney,useTransactions } from '../composables/useAccounting'

const { transactions, overview, loading, fetchTransactions, fetchOverview } = useTransactions()
const { fetchCategories } = useCategories()
const { formatMoney } = useFormatMoney()

const showForm = ref(false)
const showAll = ref(false)  


onMounted(async () => {
  await fetchCategories()
  await fetchTransactions()
  await fetchOverview()
})

const handleAdded = async () => {
  showForm.value = false
  await fetchTransactions() 
  await fetchOverview()      
}

const displayedTransactions = computed(() => {
  return showAll.value ? transactions.value : transactions.value.slice(0, 5)
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-center text-gray-800 text-2xl font-bold mb-8">我的記帳本</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md">
        <div class="text-4xl">📈</div>
        <div>
          <div class="text-gray-500 text-sm">總收入</div>
          <div class="text-xl font-bold text-green-500">{{ formatMoney(overview.totalIncome) }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md">
        <div class="text-4xl">📉</div>
        <div>
          <div class="text-gray-500 text-sm">總支出</div>
          <div class="text-xl font-bold text-red-500">{{ formatMoney(overview.totalExpense) }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md">
        <div class="text-4xl">💵</div>
        <div>
          <div class="text-gray-500 text-sm">結餘</div>
          <div 
            class="text-xl font-bold"
            :class="overview.balance < 0 ? 'text-red-500' : 'text-blue-500'"
          >
            {{ formatMoney(overview.balance) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 快速記帳按鈕 -->
    <div class="text-center mb-8">
      <button 
        class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 text-lg rounded-xl hover:opacity-90 transition"
        @click="showForm = !showForm"
      >
        {{ showForm ? '✕ 關閉' : '＋ 快速記帳' }}
      </button>
    </div>

    <TransactionForm v-if="showForm" @added="handleAdded" />

    <div class="bg-white rounded-2xl p-6 shadow-md">
      <h2 class="text-gray-800 font-bold text-xl mb-4">最近記錄</h2>
      
      <div v-if="loading" class="text-center py-8 text-gray-500">載入中...</div>
      
      <div v-else-if="transactions.length === 0" class="text-center py-8 text-gray-500">
        還沒有任何記錄，開始記帳吧！
      </div>
      
      <template v-else>
        <div class="flex flex-col gap-3">
          <div 
            v-for="t in displayedTransactions" 
            :key="t.id" 
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
          >
            <div class="text-2xl">{{ t.category_icon || '📁' }}</div>
            <div class="flex-1">
              <div class="font-medium text-gray-800">{{ t.category_name }}</div>
              <div class="text-sm text-gray-500">{{ t.description || '無備註' }}</div>
            </div>
            <div class="text-right">
              <div 
                class="font-bold text-lg"
                :class="t.type === 'income' ? 'text-green-500' : 'text-red-500'"
              >
                {{ t.type === 'income' ? '+' : '-' }}{{ formatMoney(t.amount) }}
              </div>
              <div class="text-xs text-gray-400">{{ t.date }}</div>
            </div>
          </div>
        </div>

        <button 
          v-if="transactions.length > 5" 
          class="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 text-sm transition"
          @click="showAll = !showAll"
        >
          {{ showAll ? '收起 ▲' : `展開全部 (${transactions.length} 筆) ▼` }}
        </button>
      </template>
    </div>
  </div>
</template>