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
        <div class="header-decoration-bg"></div>
        <div class="header-content">
          <div class="header-decoration-row">
            <span class="decoration-indicator"></span>
            <span class="decoration-label">PREMIUM SERVICES</span>
          </div>
          <h1 class="main-page-title">
            配件与精品
            <span class="title-accent-dot">.</span>
          </h1>
          <p class="main-page-description">匠心打造高品质爱宠生活，让每一位毛孩子都能享受到科技赋能的温馨呵护。</p>
        </div>
        <div class="header-visual-wrapper">
          <div class="floating-tech-blob"></div>
          <div class="tech-grid-overlay"></div>
          <span class="cat-tech-symbol">🐱</span>
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
  padding: 100px 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center;
  position: relative;
  overflow-x: hidden;
}

.products-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 600px;
  background: radial-gradient(circle at 50% -20%, rgba(255, 107, 53, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
  position: relative;
  min-height: 280px;
}

.header-decoration-bg {
  position: absolute;
  top: -20px;
  left: -40px;
  width: 120px;
  height: 120px;
  background: var(--color-primary-bg);
  filter: blur(60px);
  opacity: 0.6;
}

.header-content {
  max-width: 640px;
  position: relative;
  z-index: 2;
}

.header-decoration-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.decoration-indicator {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 2px;
  transform: rotate(45deg);
}

.decoration-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--color-primary);
  text-transform: uppercase;
}

.main-page-title {
  font-size: 72px;
  font-weight: 800;
  color: var(--color-tech-navy);
  margin-bottom: 24px;
  letter-spacing: -2px;
  line-height: 1.05;
}

.title-accent-dot {
  color: var(--color-primary);
}

.main-page-description {
  font-size: 20px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 520px;
}

.header-visual-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-tech-blob {
  position: absolute;
  width: 280px;
  height: 280px;
  background: var(--gradient-accent);
  filter: blur(60px);
  border-radius: 50%;
  opacity: 0.15;
  animation: tech-float 15s infinite alternate ease-in-out;
}

.tech-grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, var(--color-primary) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
  mask-image: radial-gradient(circle, black, transparent 70%);
}

.cat-tech-symbol {
  font-size: 140px;
  z-index: 1;
  filter: drop-shadow(0 20px 30px rgba(15, 23, 42, 0.1));
  animation: icon-hover 4s ease-in-out infinite;
}

@keyframes tech-float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
  100% { transform: translate(-10px, 10px) scale(0.95); }
}

@keyframes icon-hover {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 56px;
  border-bottom: 2px solid var(--color-bg-secondary);
  padding-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
}

.filter-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-tech-navy);
}

.filter-btn.active {
  background: var(--color-tech-navy);
  color: var(--color-white);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
}

.filter-btn.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--gradient-primary);
}

.grid-stats {
  font-size: 13px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.grid-stats .highlight {
  color: var(--color-tech-navy);
  font-weight: 800;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

/* 状态提示 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 140px 0;
}

.loading-spinner {
  width: 64px;
  height: 64px;
  border: 3px solid var(--color-bg-secondary);
  border-top-color: var(--color-primary);
  border-right-color: var(--color-tech-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 32px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 32px;
  opacity: 0.15;
  filter: contrast(0);
}

@media (max-width: 1100px) {
  .main-page-title { font-size: 60px; }
  .header-visual-wrapper { width: 240px; height: 240px; }
  .cat-tech-symbol { font-size: 100px; }
}

@media (max-width: 991px) {
  .page-header { flex-direction: column; align-items: flex-start; text-align: left; margin-bottom: 60px; }
  .header-visual-wrapper { margin-top: 40px; align-self: center; }
  .main-page-title { font-size: 52px; }
}

@media (max-width: 768px) {
  .products-page { padding: 60px 0; }
  .main-page-title { font-size: 44px; }
  .category-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
}
</style>
