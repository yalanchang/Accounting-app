<script setup lang="ts">
import { useCategories } from '../composables/useAccounting'
const { 
      categories, 
      incomeCategories, 
      expenseCategories, 
      fetchCategories, 
      addCategory, 
      updateCategory, 
      deleteCategory 
    } = useCategories()
    
    const showForm = ref(false)
    const editingId = ref<number | null>(null)
    const form = ref({ name: '', type: 'expense', icon: '📁' })
    
    const commonIcons = ['💰', '💵', '💸', '🎁', '📈', '💼', '🍔', '🚗', '🛒', '🎮', '🏠', '🏥', '📚', '📱', '✈️', '🎬', '💊', '📦']
    
    onMounted(fetchCategories)
    
    const openForm = (category: any = null) => {
      if (category) {
        editingId.value = category.id
        form.value = { ...category }
      } else {
        editingId.value = null
        form.value = { name: '', type: 'expense', icon: '📁' }
      }
      showForm.value = true
    }
    
    const closeForm = () => {
      showForm.value = false
      editingId.value = null
    }
    
    const handleSubmit = async () => {
      if (!form.value.name) {
        alert('請輸入分類名稱')
        return
      }
    
      const success = editingId.value 
        ? await updateCategory(editingId.value, form.value)
        : await addCategory(form.value)
    
      if (success) closeForm()
    }
    
    const handleDelete = async (id: number) => {
      if (confirm('確定要刪除這個分類嗎？')) {
        await deleteCategory(id)
      }
    }
    </script>
    
    <template>
      <div class="categories-page">
        <div class="page-header">
          <h1>分類管理</h1>
          <button class="add-btn" @click="openForm()">+ 新增分類</button>
        </div>
    
        <!-- Modal -->
        <div v-if="showForm" class="form-modal" @click.self="closeForm">
          <div class="form-card">
            <h3>{{ editingId ? '編輯分類' : '新增分類' }}</h3>
            
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>分類名稱</label>
                <input type="text" v-model="form.name" placeholder="輸入分類名稱" required>
              </div>
    
              <div class="form-group">
                <label>類型</label>
                <div class="type-switch">
                  <button type="button" :class="['type-btn', { active: form.type === 'expense' }]" @click="form.type = 'expense'">
                    支出
                  </button>
                  <button type="button" :class="['type-btn', { active: form.type === 'income' }]" @click="form.type = 'income'">
                    收入
                  </button>
                </div>
              </div>
    
              <div class="form-group">
                <label>圖示</label>
                <div class="icon-picker">
                  <button 
                    type="button"
                    v-for="icon in commonIcons" 
                    :key="icon"
                    :class="['icon-btn', { active: form.icon === icon }]"
                    @click="form.icon = icon"
                  >{{ icon }}</button>
                </div>
              </div>
    
              <div class="form-actions">
                <button type="submit" class="submit-btn">{{ editingId ? '更新' : '新增' }}</button>
                <button type="button" class="cancel-btn" @click="closeForm">取消</button>
              </div>
            </form>
          </div>
        </div>
    
        <div class="category-section">
          <h2>支出分類</h2>
          <div class="category-grid">
            <div v-for="cat in expenseCategories" :key="cat.id" class="category-card expense">
              <div class="category-icon">{{ cat.icon }}</div>
              <div class="category-name">{{ cat.name }}</div>
              <div class="category-actions">
                <button @click="openForm(cat)">✏️</button>
                <button @click="handleDelete(cat.id)">🗑️</button>
              </div>
            </div>
          </div>
        </div>
    
        <div class="category-section">
          <h2>收入分類</h2>
          <div class="category-grid">
            <div v-for="cat in incomeCategories" :key="cat.id" class="category-card income">
              <div class="category-icon">{{ cat.icon }}</div>
              <div class="category-name">{{ cat.name }}</div>
              <div class="category-actions">
                <button @click="openForm(cat)">✏️</button>
                <button @click="handleDelete(cat.id)">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <style scoped>
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h1 { color: #333; }
    .add-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; }
    
    .form-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }
    
    .form-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      width: 90%;
      max-width: 450px;
    }
    
    .form-card h3 { margin-bottom: 1.5rem; color: #333; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
    .form-group input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 1rem; }
    .form-group input:focus { outline: none; border-color: #667eea; }
    
    .type-switch { display: flex; gap: 1rem; }
    .type-btn { flex: 1; padding: 0.75rem; border: 2px solid #e5e7eb; background: white; border-radius: 10px; cursor: pointer; }
    .type-btn.active { border-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    
    .icon-picker { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .icon-btn { width: 40px; height: 40px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; font-size: 1.2rem; cursor: pointer; }
    .icon-btn.active { border-color: #667eea; background: #f0f4ff; }
    
    .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .submit-btn { flex: 1; padding: 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; }
    .cancel-btn { padding: 0.75rem 1.5rem; background: #f3f4f6; color: #666; border: none; border-radius: 10px; cursor: pointer; }
    
    .category-section { margin-bottom: 2rem; }
    .category-section h2 { margin-bottom: 1rem; color: #333; }
    .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
    
    .category-card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      position: relative;
    }
    
    .category-card.expense { border-top: 3px solid #ef4444; }
    .category-card.income { border-top: 3px solid #22c55e; }
    .category-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .category-name { font-weight: 500; color: #333; }
    
    .category-actions {
      position: absolute;
      top: 0.5rem; right: 0.5rem;
      display: flex; gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .category-card:hover .category-actions { opacity: 1; }
    .category-actions button { background: white; border: none; padding: 0.25rem; cursor: pointer; font-size: 0.9rem; border-radius: 4px; }
    </style>