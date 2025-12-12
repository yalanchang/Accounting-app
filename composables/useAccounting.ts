interface Transaction {
  id: number
  amount: number
  category_id: string
  description?: string
  date: string
}

interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  icon?: string
}

interface Overview {
  totalIncome: number
  totalExpense: number
  balance: number
}

export const useFormatMoney = () => {
    const formatMoney = (amount: number) => {
      return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0
      }).format(amount)
    }
    return { formatMoney }
  }

  // 交易相關
  export const useTransactions = () => {
    const transactions = ref<any[]>([])
    const overview = ref<Overview>({ totalIncome: 0, totalExpense: 0, balance: 0 })
    const loading = ref(false)
  
    const fetchTransactions = async (params = {}) => {
      loading.value = true
      try {
        const query = new URLSearchParams(params as any).toString()
        transactions.value = await $fetch<Transaction[]>(`/api/transactions?${query}`)
      } catch (error) {
        console.error('取得交易失敗:', error)
      } finally {
        loading.value = false
      }
    }
  
    const fetchOverview = async () => {
      try {
        overview.value = await $fetch<Overview>('/api/stats/overview')
      } catch (error) {
        console.error('取得統計失敗:', error)
      }
    }
  
    const addTransaction = async (data: any) => {
      try {
        await $fetch('/api/transactions', { method: 'POST', body: data })
        await fetchTransactions()
        await fetchOverview()
        return true
      } catch (error) {
        console.error('新增失敗:', error)
        return false
      }
    }
  
    const updateTransaction = async (id: number, data: any) => {
      try {
        await $fetch(`/api/transactions/${id}`, { method: 'PUT', body: data })
        await fetchTransactions()
        await fetchOverview()
        return true
      } catch (error) {
        console.error('更新失敗:', error)
        return false
      }
    }
  
    const deleteTransaction = async (id: number) => {
      try {
        await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
        await fetchTransactions()
        await fetchOverview()
        return true
      } catch (error) {
        console.error('刪除失敗:', error)
        return false
      }
    }
  
    return {
      transactions,
      overview,
      loading,
      fetchTransactions,
      fetchOverview,
      addTransaction,
      updateTransaction,
      deleteTransaction
    }
  }
  
  // 分類相關
  export const useCategories = () => {
    const categories = ref<Category[]>([])
    const loading = ref(false)
  
    const incomeCategories = computed(() => 
      categories.value.filter(c => c.type === 'income')
    )
    
    const expenseCategories = computed(() => 
      categories.value.filter(c => c.type === 'expense')
    )
  
    const fetchCategories = async () => {
      loading.value = true
      try {
        categories.value = await $fetch<Category[]>('/api/categories')
      } catch (error) {
        console.error('取得分類失敗:', error)
      } finally {
        loading.value = false
      }
    }
  
    const addCategory = async (data: any) => {
      try {
        await $fetch('/api/categories', { method: 'POST', body: data })
        await fetchCategories()
        return true
      } catch (error: any) {
        alert(error.data?.message || '新增失敗')
        return false
      }
    }
  
    const updateCategory = async (id: number, data: any) => {
      try {
        await $fetch(`/api/categories/${id}`, { method: 'PUT', body: data })
        await fetchCategories()
        return true
      } catch (error: any) {
        alert(error.data?.message || '更新失敗')
        return false
      }
    }
  
    const deleteCategory = async (id: number) => {
      try {
        await $fetch(`/api/categories/${id}`, { method: 'DELETE' })
        await fetchCategories()
        return true
      } catch (error: any) {
        alert(error.data?.message || '刪除失敗')
        return false
      }
    }
  
    return {
      categories,
      incomeCategories,
      expenseCategories,
      loading,
      fetchCategories,
      addCategory,
      updateCategory,
      deleteCategory
    }
  }