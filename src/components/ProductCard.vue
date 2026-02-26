<script setup lang="ts">
import type { Product } from '@/api/product'

defineProps<{
  product: Product
}>()

const tagLabels: Record<string, string> = {
  meituan: '美团可购',
  reusable: '可存下次用',
  customizable: '可自选组成'
}

const getTagLabel = (tag: string) => tagLabels[tag] || tag

const formatPrice = (price?: number, unit?: string) => {
  if (!price) return null
  return `¥${price}${unit ? '/' + unit : ''}`
}
</script>

<template>
  <div class="product-card">
    <div class="card-image-area">
      <div v-if="product.images && product.images.length > 0" class="image-box">
        <img :src="product.images[0]" :alt="product.name" loading="lazy" />
      </div>
      <div v-else class="image-placeholder">
        <div class="placeholder-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>
      <div v-if="product.isActive" class="card-badge">热销</div>
    </div>
    
    <div class="card-info">
      <div class="card-main-header">
        <div class="category-text" v-if="product.categoryName">{{ product.categoryName }}</div>
        <h3 class="product-name">{{ product.name }}</h3>
      </div>
      
      <p v-if="product.description" class="product-desc">
        {{ product.description }}
      </p>
      
      <div class="card-footer">
        <div class="price-box">
          <div v-if="formatPrice(product.price, product.priceUnit)" class="price-display">
            <span class="currency-symbol">¥</span>
            <span class="amount">{{ product.price }}</span>
            <span class="unit" v-if="product.priceUnit">/{{ product.priceUnit }}</span>
          </div>
          <div v-else class="price-placeholder">咨询客服</div>
        </div>
        
        <div class="tags-row" v-if="product.tags && product.tags.length > 0">
          <span class="tag-pill">
            {{ getTagLabel(product.tags[0]) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border);
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-primary);
}

.card-image-area {
  position: relative;
  aspect-ratio: 16/10;
  background-color: var(--color-bg-alt);
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.image-box {
  width: 100%;
  height: 100%;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .image-box img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: var(--color-black);
  color: var(--color-white);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.card-info {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-main-header {
  margin-bottom: var(--spacing-md);
}

.category-text {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-xs);
}

.product-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.product-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.2em; /* 保持一致的高度 */
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency-symbol {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-black);
}

.amount {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  letter-spacing: -0.02em;
}

.unit {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-left: 2px;
}

.price-placeholder {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
}

.tag-pill {
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background-color: var(--color-bg-alt);
  padding: 4px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .product-name {
    font-size: var(--font-size-lg);
  }
  
  .amount {
    font-size: var(--font-size-xl);
  }
}
</style>
