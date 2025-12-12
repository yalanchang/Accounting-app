<script setup lang="ts">
    import { useCategories,useFormatMoney,useTransactions } from '../composables/useAccounting'

    const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactions()
    const { fetchCategories } = useCategories()
    const { formatMoney } = useFormatMoney()
    
    const showForm = ref(false)
    const editingTransaction = ref<any>(null)
    const filter = ref({ type: '', start_date: '', end_date: '' })
    
    onMounted(async () => {
      await fetchCategories()
      await fetchTransactions()
    })
    
    const applyFilter = () => fetchTransactions(filter.value)
    const clearFilter = () => {
      filter.value = { type: '', start_date: '', end_date: '' }
      fetchTransactions()
    }
    
    const handleEdit = (t: any) => {
      editingTransaction.value = { ...t }
      showForm.value = true
    }
    
    const handleDelete = async (id: number) => {
      if (confirm('確定要刪除這筆記錄嗎？')) {
        await deleteTransaction(id)
      }
    }
    
    const handleFormClose = () => {
      showForm.value = false
      editingTransaction.value = null
    }
    </script>
    
    <template>
      <div class="transactions-page">
        <div class="page-header">
          <h1>📋 交易記錄</h1>
          <button class="add-btn" @click="showForm = !showForm; editingTransaction = null">
            {{ showForm ? '✕ 關閉' : '＋ 新增' }}
          </button>
        </div>
    
        <TransactionForm 
          v-if="showForm" 
          :edit-data="editingTransaction"
          @added="handleFormClose"
          @updated="handleFormClose"
          @cancelled="handleFormClose"
        />
    
        <!-- 篩選 -->
        <div class="filter-section">
          <select v-model="filter.type">
            <option value="">全部類型</option>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
          <input type="date" v-model="filter.start_date">
          <input type="date" v-model="filter.end_date">
          <button class="filter-btn" @click="applyFilter">篩選</button>
          <button class="clear-btn" @click="clearFilter">清除</button>
        </div>
    
        <!-- 列表 -->
        <div class="transaction-list">
          <div v-if="loading" class="loading">載入中...</div>
          <div v-else-if="transactions.length === 0" class="empty">沒有符合條件的記錄</div>
          <div v-else v-for="t in transactions" :key="t.id" class="transaction-item">
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
            <div class="transaction-actions">
              <button @click="handleEdit(t)">✏️</button>
              <button @click="handleDelete(t.id)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <style scoped>
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .page-header h1 { color: #333; }
    
    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      cursor: pointer;
    }
    
    .filter-section {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    
    .filter-section select,
    .filter-section input {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }
    
    .filter-btn { background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
    .clear-btn { background: #f3f4f6; color: #666; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
    
    .transaction-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .loading, .empty { text-align: center; padding: 3rem; color: #666; background: white; border-radius: 12px; }
    
    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .transaction-icon { font-size: 1.5rem; }
    .transaction-info { flex: 1; }
    .transaction-category { font-weight: 500; }
    .transaction-desc { font-size: 0.85rem; color: #666; }
    .transaction-right { text-align: right; margin-right: 1rem; }
    .transaction-amount { font-weight: bold; font-size: 1.1rem; }
    .transaction-amount.income { color: #22c55e; }
    .transaction-amount.expense { color: #ef4444; }
    .transaction-date { font-size: 0.8rem; color: #999; }
    .transaction-actions { display: flex; gap: 0.5rem; }
    .transaction-actions button { background: transparent; border: none; font-size: 1.1rem; cursor: pointer; padding: 0.25rem; border-radius: 6px; }
    .transaction-actions button:hover { background: #f3f4f6; }
    </style>