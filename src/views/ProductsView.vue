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
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            配件与用品
            <span class="cat-emoji">🐱</span>
          </h1>
          <p class="page-subtitle">为您的猫咪提供更舒适的寄养体验</p>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <button
          class="filter-btn"
          :class="{ active: activeCategory === null }"
          @click="selectCategory(null)"
        >
          全部
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
  background-color: var(--color-bg);
  padding: var(--spacing-3xl) 0;
}

.page-header {
  margin-bottom: var(--spacing-2xl);
}

.header-content {
  max-width: 600px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.cat-emoji {
  font-size: 0.85em;
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* 分类筛选 */
.category-filter {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.filter-btn {
  padding: 8px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-white);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text-primary);
}

.filter-btn.active {
  background: var(--color-text-primary);
  border-color: var(--color-text-primary);
  color: var(--color-white);
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

/* 状态提示 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl) var(--spacing-lg);
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}
</style>
