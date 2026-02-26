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
    <!-- 背景装饰 -->
    <div class="bg-decorations">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="main-container">
      <!-- 页面头部 -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-pill">
            <span class="pill-dot"></span>
            <span class="pill-text">E-PET COLLECTIONS</span>
          </div>
          <h1 class="page-title">配件与精品</h1>
          <p class="page-description">匠心打造高品质爱宠生活，让每一位毛孩子都能享受到专业赋能的温馨呵护。</p>
        </div>
        <div class="header-status" v-if="!loading">
          <div class="status-card">
            <div class="status-label">当前库存</div>
            <div class="status-value">
              <span class="number">{{ filteredProducts.length }}</span>
              <span class="unit">SKUs</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 分类筛选 - 标签页风格 -->
      <nav class="category-tabs-container">
        <div class="category-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeCategory === null }"
            @click="selectCategory(null)"
          >
            全部
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            class="tab-btn"
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </nav>

      <!-- 内容区域 -->
      <main class="content-area">
        <div v-if="loading" class="loading-state">
          <div class="loading-bar-container">
            <div class="loading-bar"></div>
          </div>
          <span class="loading-text">正在同步数据...</span>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <div class="empty-message">
            <h3>暂无相关产品</h3>
            <p>我们正在不断更新我们的收藏，请稍后再来。</p>
          </div>
        </div>

        <div v-else class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  background-color: var(--color-white);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  padding: 100px 0;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* 背景装饰 */
.bg-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--color-border-strong);
  top: -200px;
  right: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--color-primary-bg);
  top: 20%;
  left: -150px;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(var(--color-border-strong) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  margin-bottom: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  max-width: 640px;
}

.header-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--color-primary-bg);
  border-radius: 100px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border-strong);
}

.pill-dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.pill-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.1em;
}

.page-title {
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 24px;
  color: var(--color-black);
}

.page-description {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-weight: 450;
}

.status-card {
  padding: 24px 32px;
  background: var(--color-white);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.status-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.status-value .number {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-black);
}

.status-value .unit {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-tertiary);
}

/* 分类标签页 */
.category-tabs-container {
  margin-bottom: 64px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.category-tabs {
  display: flex;
  gap: 40px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 20px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--color-text-primary);
}

.tab-btn.active {
  color: var(--color-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  box-shadow: 0 0 10px rgba(24, 24, 27, 0.2);
}

/* 内容区域 */
.content-area {
  min-height: 400px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 32px;
}

/* 状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.loading-bar-container {
  width: 200px;
  height: 2px;
  background-color: var(--color-bg-subtle);
  border-radius: 1px;
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.loading-bar {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary);
  animation: loading-slide 1.5s infinite ease-in-out;
  transform-origin: left;
}

@keyframes loading-slide {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.7); transform-origin: left; }
  100% { transform: scaleX(0); transform-origin: right; }
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  text-align: center;
}

.empty-message h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-black);
}

.empty-message p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

@media (max-width: 768px) {
  .products-page {
    padding: 40px 0;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .items-counter {
    align-items: flex-start;
  }
  
  .category-tabs {
    gap: var(--spacing-lg);
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
