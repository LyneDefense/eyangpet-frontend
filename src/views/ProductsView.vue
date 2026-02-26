<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getActiveCategories, getActiveProducts, type ProductCategory, type Product } from '@/api/product'
import ProductCard from '@/components/ProductCard.vue'

const categories = ref<ProductCategory[]>([])
const products = ref<Product[]>([])
const activeCategory = ref<number | null>(null)
const loading = ref(false)

const filteredProducts = computed(() => {
  if (activeCategory.value === null) {
    return products.value
  }
  return products.value.filter(p => p.categoryId === activeCategory.value)
})

const fetchCategories = async () => {
  try {
    const res = await getActiveCategories()
    if (res.data.code === 200) {
      categories.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await getActiveProducts()
    if (res.data.code === 200) {
      products.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const selectCategory = (categoryId: number | null) => {
  activeCategory.value = categoryId
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="products-page">
    <div class="container">
      <!-- 页面标题 -->
      <header class="page-header">
        <div class="header-lines">
          <div class="line-h"></div>
          <div class="line-v"></div>
        </div>
        <div class="header-content">
          <div class="header-meta">
            <span class="meta-tag">01 // PREMIUM</span>
            <span class="meta-divider"></span>
            <span class="meta-tag">ACTIVE_SERVICES</span>
          </div>
          <h1 class="main-page-title">
            配件与精品
          </h1>
          <p class="main-page-description">
            匠心打造高品质爱宠生活，让每一位毛孩子都能享受到科技赋能的温馨呵护。
          </p>
        </div>
        <div class="header-aside">
          <div class="stats-card">
            <div class="stats-header">SYSTEM_STATS</div>
            <div class="stats-row">
              <div class="stats-item">
                <span class="stats-label">COUNT</span>
                <span class="stats-value">{{ filteredProducts.length }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">TYPE</span>
                <span class="stats-value">{{ categories.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 分类筛选 -->
      <nav class="category-nav">
        <div class="filter-group">
          <button
            class="filter-btn"
            :class="{ active: activeCategory === null }"
            @click="selectCategory(null)"
          >
            全部服务
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            class="filter-btn"
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
        <div class="grid-stats" v-if="!loading">
          共找到 <span class="highlight">{{ filteredProducts.length }}</span> 项服务
        </div>
      </nav>

      <!-- 商品列表 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">🐾</div>
        <p>暂无商品</p>
      </div>
      <div v-else class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  background-color: var(--color-white);
  padding: 140px 0;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
}

.products-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-border);
  z-index: 10;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 120px;
  position: relative;
}

.header-lines {
  position: absolute;
  top: -140px;
  left: 0;
  width: 100%;
  height: 400px;
  pointer-events: none;
  z-index: -1;
}

.line-h {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, var(--color-border), transparent);
}

.line-v {
  position: absolute;
  top: -140px;
  left: 10%;
  width: 1px;
  height: 600px;
  background: linear-gradient(to bottom, var(--color-border), transparent);
}

.header-content {
  max-width: 720px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--color-text-muted);
}

.meta-divider {
  width: 40px;
  height: 1px;
  background: var(--color-border);
}

.main-page-title {
  font-size: 110px;
  font-weight: 900;
  line-height: 0.9;
  color: var(--color-text-primary);
  margin-bottom: 40px;
  letter-spacing: -6px;
  text-transform: uppercase;
}

.main-page-description {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 480px;
  font-weight: 500;
  border-left: 2px solid var(--color-text-primary);
  padding-left: 32px;
}

.header-aside {
  width: 280px;
}

.stats-card {
  padding: 32px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.stats-header {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.stats-row {
  display: flex;
  gap: 40px;
}

.stats-item {
  display: flex;
  flex-direction: column;
}

.stats-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.stats-value {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

/* 分类导航 - 结构化设计 */
.category-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
  border-top: 1px solid var(--color-text-primary);
  padding-top: 32px;
}

.filter-group {
  display: flex;
  gap: 48px;
}

.filter-btn {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 8px 0;
  position: relative;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.filter-btn:hover {
  color: var(--color-text-primary);
}

.filter-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-text-primary);
  transition: width 0.3s ease;
}

.filter-btn.active {
  color: var(--color-text-primary);
}

.filter-btn.active::after {
  width: 100%;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
}

/* 状态提示 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200px 0;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 4px;
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 2px;
  height: 60px;
  background: var(--color-text-primary);
  animation: loading-line 1.5s infinite ease-in-out;
  margin-bottom: 40px;
}

@keyframes loading-line {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  50.1% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 1200px) {
  .main-page-title { font-size: 80px; }
  .header-aside { display: none; }
}

@media (max-width: 768px) {
  .products-page { padding: 100px 0; }
  .main-page-title { font-size: 60px; letter-spacing: -3px; }
  .filter-group { gap: 24px; flex-wrap: wrap; }
  .products-grid { grid-template-columns: 1fr; }
}
</style>
