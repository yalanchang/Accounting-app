
<script setup lang="ts">
import { useCategories,useTransactions } from '../composables/useAccounting'

    const props = defineProps<{
      editData?: any
    }>()
    
    const emit = defineEmits(['added', 'updated', 'cancelled'])
    
    const { incomeCategories, expenseCategories, fetchCategories } = useCategories()
    const { addTransaction, updateTransaction, loading } = useTransactions()
    
    const form = ref({
      type: 'expense',
      amount: '',
      category_id: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    
    const isEdit = computed(() => !!props.editData)
    
    const filteredCategories = computed(() => {
      return form.value.type === 'income' ? incomeCategories.value : expenseCategories.value
    })
    
    onMounted(async () => {
      await fetchCategories()
      if (props.editData) {
        form.value = { ...props.editData }
      }
    })
    
    const handleSubmit = async () => {
      if (!form.value.amount || !form.value.category_id) {
        alert('請填寫金額和分類')
        return
      }
    
      let success
      if (isEdit.value) {
        success = await updateTransaction(props.editData.id, form.value)
        if (success) emit('updated')
      } else {
        success = await addTransaction(form.value)
        if (success) {
          emit('added')
          form.value = {
            type: 'expense',
            amount: '',
            category_id: '',
            description: '',
            date: new Date().toISOString().split('T')[0]
          }
        }
      }
    }
    </script>
    
    <template>
      <div class="transaction-form">
        <h3>{{ isEdit ? '編輯記錄' : '新增記錄' }}</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group type-switch">
            <button 
              type="button"
              :class="['type-btn', { active: form.type === 'expense' }]"
              @click="form.type = 'expense'; form.category_id = ''"
            >
              💸 支出
            </button>
            <button 
              type="button"
              :class="['type-btn', { active: form.type === 'income' }]"
              @click="form.type = 'income'; form.category_id = ''"
            >
              💰 收入
            </button>
          </div>
    
          <div class="form-group">
            <label>金額</label>
            <input type="number" v-model="form.amount" placeholder="請輸入金額" min="0" required>
          </div>
    
          <div class="form-group">
            <label>分類</label>
            <select v-model="form.category_id" required>
              <option value="">請選擇分類</option>
              <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>
    
          <div class="form-group">
            <label>日期</label>
            <input type="date" v-model="form.date" required>
          </div>
    
          <div class="form-group">
            <label>備註（選填）</label>
            <input type="text" v-model="form.description" placeholder="輸入備註...">
          </div>
    
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? '處理中...' : (isEdit ? '更新' : '新增') }}
            </button>
            <button type="button" class="cancel-btn" @click="emit('cancelled')" v-if="isEdit">
              取消
            </button>
          </div>
        </form>
      </div>
    </template>
    
    <style scoped>
    .transaction-form {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    
    .transaction-form h3 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 1rem;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .type-switch {
      display: flex;
      gap: 1rem;
    }
    
    .type-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .type-btn.active {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .submit-btn {
      flex: 1;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
    }
    
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .cancel-btn {
      padding: 0.75rem 1.5rem;
      background: #f3f4f6;
      color: #666;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
    </style>