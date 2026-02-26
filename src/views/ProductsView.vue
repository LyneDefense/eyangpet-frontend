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
    <div class="main-container">
      <!-- 页面头部 - Builder 风格 -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">配件与精品</h1>
          <p class="page-description">匠心打造高品质爱宠生活，让每一位毛孩子都能享受到专业赋能的温馨呵护。</p>
        </div>
        <div class="header-actions" v-if="!loading">
          <div class="items-counter">
            <span class="count">{{ filteredProducts.length }}</span>
            <span class="label">项产品</span>
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
  padding: 80px 0;
  -webkit-font-smoothing: antialiased;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* 页面头部 */
.page-header {
  margin-bottom: var(--spacing-3xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-content {
  max-width: 600px;
}

.page-title {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
  color: var(--color-black);
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.5;
  font-weight: var(--font-weight-normal);
}

.items-counter {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-variant-numeric: tabular-nums;
}

.items-counter .count {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-black);
}

.items-counter .label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* 分类标签页 */
.category-tabs-container {
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-2xl);
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.category-tabs-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.category-tabs {
  display: flex;
  gap: var(--spacing-xl);
  padding-bottom: 1px;
}

.tab-btn {
  background: none;
  border: none;
  padding: var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: color var(--transition-fast);
}

.tab-btn:hover {
  color: var(--color-black);
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
  background-color: var(--color-primary);
}

/* 内容区域 */
.content-area {
  min-height: 400px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-xl);
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
  background-color: var(--color-bg-alt);
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
