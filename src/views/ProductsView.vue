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
        <div class="header-content">
          <div class="header-decoration">
            <span class="decoration-line"></span>
            <span class="decoration-text">OUR SERVICES</span>
          </div>
          <h1 class="page-title">
            配件与精品
            <span class="title-paw">🐾</span>
          </h1>
          <p class="page-subtitle">让每一位猫咪访客都能享受到家一般的温馨与高品质的呵护服务。</p>
        </div>
        <div class="header-illustration">
          <!-- 这里可以通过CSS背景图或者装饰性元素增强 -->
          <div class="blob-bg"></div>
          <span class="cat-silhouette">🐱</span>
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
  padding: 80px 0;
  background-image: radial-gradient(#ff6b35 0.5px, transparent 0.5px);
  background-size: 40px 40px;
  background-position: 0 0;
  background-attachment: fixed;
  background-color: #ffffff;
  opacity: 1;
}

.products-page::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 20%, rgba(255, 107, 53, 0.03) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(255, 107, 53, 0.03) 0%, transparent 40%);
  pointer-events: none;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64px;
  position: relative;
}

.header-content {
  max-width: 700px;
  z-index: 2;
}

.header-decoration {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.decoration-line {
  width: 40px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
}

.decoration-text {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--color-primary);
  opacity: 0.8;
}

.page-title {
  font-size: 56px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  letter-spacing: -1.5px;
  line-height: 1.1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-paw {
  font-size: 0.7em;
  transform: rotate(15deg);
  display: inline-block;
}

.page-subtitle {
  font-size: 20px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-weight: 400;
  opacity: 0.9;
}

.header-illustration {
  position: relative;
  width: 300px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob-bg {
  position: absolute;
  width: 260px;
  height: 260px;
  background: var(--color-primary-bg);
  filter: blur(40px);
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  animation: blob-animate 10s ease-in-out infinite alternate;
}

.cat-silhouette {
  font-size: 120px;
  z-index: 1;
  filter: drop-shadow(0 10px 20px rgba(255, 107, 53, 0.2));
  animation: float 4s ease-in-out infinite;
}

@keyframes blob-animate {
  from { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  to { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 24px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 12px 24px;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.filter-btn:hover {
  background: #fff;
  color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 8px 16px rgba(255, 107, 53, 0.25);
}

.grid-stats {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.grid-stats .highlight {
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 1.1em;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
}

/* 状态提示 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-primary-bg);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  margin-bottom: 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  filter: grayscale(1);
  opacity: 0.3;
}

@media (max-width: 1024px) {
  .page-title { font-size: 44px; }
  .header-illustration { display: none; }
}

@media (max-width: 768px) {
  .category-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  .page-title { font-size: 36px; }
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
}
</style>
