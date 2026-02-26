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
        <div class="header-bg-blobs">
          <div class="blob-1"></div>
          <div class="blob-2"></div>
          <div class="blob-3"></div>
        </div>
        <div class="header-content">
          <div class="header-pre-title">
            <span class="pulse-dot"></span>
            E-Pet Premium Collection
          </div>
          <h1 class="main-page-title">
            <span class="text-outline">配件</span>与精品
          </h1>
          <p class="main-page-description">匠心打造高品质爱宠生活，让每一位毛孩子都能享受到科技赋能的温馨呵护。</p>
          <div class="header-stats-row">
            <div class="stat-item">
              <span class="stat-val">{{ filteredProducts.length }}</span>
              <span class="stat-lbl">ITEMS FOUND</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-val">{{ categories.length }}</span>
              <span class="stat-lbl">CATEGORIES</span>
            </div>
          </div>
        </div>
        <div class="header-illustration">
          <div class="cat-scanner-effect">
            <span class="cat-symbol">🐱</span>
            <div class="scanner-line"></div>
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
  background-color: #fff;
  padding: 120px 0;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-family);
}

.products-page::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 40%);
  z-index: 0;
  pointer-events: none;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 100px;
  position: relative;
  min-height: 400px;
  z-index: 1;
}

.header-bg-blobs {
  position: absolute;
  inset: 0;
  overflow: visible;
  z-index: -1;
}

.blob-1, .blob-2, .blob-3 {
  position: absolute;
  filter: blur(80px);
  border-radius: 50%;
  opacity: 0.2;
}

.blob-1 { width: 300px; height: 300px; background: var(--color-primary); top: -100px; left: -100px; }
.blob-2 { width: 400px; height: 400px; background: var(--color-tech-blue); bottom: -100px; right: -50px; }
.blob-3 { width: 200px; height: 200px; background: var(--color-tech-purple); top: 50%; left: 30%; }

.header-content {
  max-width: 680px;
}

.header-pre-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 4px;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 24px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  position: relative;
}

.pulse-dot::after {
  content: "";
  position: absolute;
  inset: -4px;
  border: 1px solid var(--color-primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(3); opacity: 0; }
}

.main-page-title {
  font-size: 96px;
  font-weight: 900;
  line-height: 1;
  color: var(--color-tech-navy);
  margin-bottom: 32px;
  letter-spacing: -4px;
}

.text-outline {
  -webkit-text-stroke: 2px var(--color-tech-navy);
  color: transparent;
}

.main-page-description {
  font-size: 22px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 560px;
  margin-bottom: 48px;
  font-weight: 500;
}

.header-stats-row {
  display: flex;
  align-items: center;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-tech-navy);
  line-height: 1;
}

.stat-lbl {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-text-muted);
  letter-spacing: 2px;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

.header-illustration {
  position: relative;
}

.cat-scanner-effect {
  position: relative;
  font-size: 200px;
  filter: drop-shadow(0 30px 50px rgba(15, 23, 42, 0.1));
}

.scanner-line {
  position: absolute;
  top: 0;
  left: -20px;
  right: -20px;
  height: 4px;
  background: var(--gradient-primary);
  box-shadow: 0 0 20px var(--color-primary);
  z-index: 2;
  animation: scan 3s infinite ease-in-out;
}

@keyframes scan {
  0%, 100% { top: 10%; }
  50% { top: 90%; }
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64px;
  padding: 24px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--glass-shadow);
  z-index: 2;
  position: relative;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-btn {
  padding: 12px 28px;
  border-radius: var(--radius-lg);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.filter-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-tech-navy);
}

.filter-btn.active {
  background: var(--color-tech-navy);
  color: #fff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 48px;
  z-index: 1;
  position: relative;
}

/* 状态提示 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160px 0;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 4px solid var(--color-bg-secondary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 40px;
}

@media (max-width: 1200px) {
  .main-page-title { font-size: 80px; }
  .cat-scanner-effect { font-size: 160px; }
}

@media (max-width: 991px) {
  .page-header { flex-direction: column; text-align: center; }
  .header-content { max-width: 100%; margin-bottom: 60px; }
  .header-stats-row { justify-content: center; }
  .main-page-title { font-size: 64px; letter-spacing: -2px; }
  .main-page-description { max-width: 100%; margin: 0 auto 40px; }
}

@media (max-width: 768px) {
  .products-page { padding: 80px 0; }
  .main-page-title { font-size: 48px; }
  .category-nav {
    flex-direction: column;
    gap: 24px;
  }
  .filter-group {
    flex-wrap: wrap;
    justify-content: center;
  }
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 32px;
  }
}
</style>
