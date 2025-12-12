<script setup lang="ts">
  interface Overview {
  totalIncome: number
  totalExpense: number
  balance: number
}
    import { useFormatMoney} from '../composables/useAccounting'

    const { formatMoney } = useFormatMoney()
    const overview = ref<Overview>({ totalIncome: 0, totalExpense: 0, balance: 0 })
    const monthlyData = ref<any[]>([])
    const categoryData = ref<any[]>([])
    const selectedYear = ref(new Date().getFullYear())
    const loading = ref(true)
    
    const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    
    const fetchData = async () => {
      loading.value = true
      try {
        overview.value = await $fetch<Overview>('/api/stats/overview')
        monthlyData.value = await $fetch(`/api/stats/monthly?year=${selectedYear.value}`)
        categoryData.value = await $fetch('/api/stats/by-category?type=expense')
      } catch (error) {
        console.error('取得統計失敗:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(fetchData)
    
    const maxMonthlyValue = computed(() => {
      if (!monthlyData.value.length) return 100
      const max = Math.max(...monthlyData.value.flatMap(m => [m.income, m.expense]))
      return max || 100
    })
    
    const totalExpense = computed(() => 
      categoryData.value.reduce((sum, c) => sum + Number(c.total), 0)
    )
    </script>
    
    <template>
      <div class="stats-page">
        <h1>📊 統計分析</h1>
    
        <!-- 總覽 -->
        <div class="overview-cards">
          <div class="card income">
            <div class="card-label">總收入</div>
            <div class="card-value">{{ formatMoney(overview.totalIncome) }}</div>
          </div>
          <div class="card expense">
            <div class="card-label">總支出</div>
            <div class="card-value">{{ formatMoney(overview.totalExpense) }}</div>
          </div>
          <div class="card balance">
            <div class="card-label">結餘</div>
            <div class="card-value" :class="{ negative: overview.balance < 0 }">
              {{ formatMoney(overview.balance) }}
            </div>
          </div>
        </div>
    
        <div v-if="loading" class="loading">載入中...</div>
    
        <template v-else>
          <!-- 月度趨勢（簡易長條圖） -->
          <div class="chart-section">
            <div class="chart-header">
              <h2>📈 月度趨勢</h2>
              <select v-model="selectedYear" @change="fetchData">
                <option v-for="y in [2024, 2025, 2026]" :key="y" :value="y">{{ y }} 年</option>
              </select>
            </div>
            <div class="bar-chart">
              <div v-for="(m, idx) in monthlyData" :key="idx" class="bar-group">
                <div class="bars">
                  <div 
                    class="bar income" 
                    :style="{ height: `${(m.income / maxMonthlyValue) * 150}px` }"
                    :title="`收入: ${formatMoney(m.income)}`"
                  ></div>
                  <div 
                    class="bar expense" 
                    :style="{ height: `${(m.expense / maxMonthlyValue) * 150}px` }"
                    :title="`支出: ${formatMoney(m.expense)}`"
                  ></div>
                </div>
                <div class="bar-label">{{ monthLabels[idx] }}</div>
              </div>
            </div>
            <div class="legend">
              <span class="legend-item"><span class="dot income"></span> 收入</span>
              <span class="legend-item"><span class="dot expense"></span> 支出</span>
            </div>
          </div>
    
          <!-- 支出分佈 -->
          <div class="chart-section">
            <h2>🍩 支出分佈</h2>
            <div v-if="categoryData.filter(c => c.total > 0).length === 0" class="no-data">
              暫無支出資料
            </div>
            <div v-else class="category-list">
              <div v-for="cat in categoryData.filter(c => c.total > 0)" :key="cat.id" class="category-bar">
                <div class="category-info">
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                  <span>{{ formatMoney(cat.total) }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    :style="{ width: `${(cat.total / totalExpense) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    
    <style scoped>
    .stats-page h1 { color: #333; margin-bottom: 1.5rem; }
    
    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .card-label { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .card-value { font-size: 1.5rem; font-weight: bold; }
    .card.income .card-value { color: #22c55e; }
    .card.expense .card-value { color: #ef4444; }
    .card.balance .card-value { color: #3b82f6; }
    .card-value.negative { color: #ef4444 !important; }
    
    .loading { text-align: center; padding: 3rem; color: #666; }
    
    .chart-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .chart-header h2 { margin: 0; color: #333; }
    .chart-header select { padding: 0.5rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; }
    
    .bar-chart {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 180px;
      padding: 1rem 0;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .bar-group { display: flex; flex-direction: column; align-items: center; }
    .bars { display: flex; gap: 4px; align-items: flex-end; height: 150px; }
    .bar { width: 12px; border-radius: 4px 4px 0 0; min-height: 2px; transition: height 0.3s; }
    .bar.income { background: #22c55e; }
    .bar.expense { background: #ef4444; }
    .bar-label { font-size: 0.75rem; color: #666; margin-top: 0.5rem; }
    
    .legend { display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.income { background: #22c55e; }
    .dot.expense { background: #ef4444; }
    
    .no-data { text-align: center; color: #999; padding: 2rem; }
    
    .category-list { display: flex; flex-direction: column; gap: 1rem; }
    
    .category-bar { }
    .category-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; }
    .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .progress { height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px; transition: width 0.3s; }
    </style>