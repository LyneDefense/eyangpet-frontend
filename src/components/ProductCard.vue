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
    <div class="card-image">
      <div v-if="product.images && product.images.length > 0" class="image-wrapper">
        <img :src="product.images[0]" :alt="product.name" />
      </div>
      <div v-else class="image-placeholder">
        <div class="placeholder-content">
          <span class="placeholder-icon">🐱</span>
          <span class="placeholder-text">E养宠 · 贴心守护</span>
        </div>
      </div>
      <div class="card-badge" v-if="product.isActive">热销中</div>
    </div>
    <div class="card-content">
      <div class="card-header-info">
        <h3 class="card-title">{{ product.name }}</h3>
        <div class="card-category" v-if="product.categoryName">{{ product.categoryName }}</div>
      </div>
      <p v-if="product.description" class="card-desc">
        {{ product.description }}
      </p>
      <div class="card-action-area">
        <div v-if="formatPrice(product.price, product.priceUnit)" class="card-price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ product.price }}</span>
          <span class="price-unit" v-if="product.priceUnit">/{{ product.priceUnit }}</span>
        </div>
        <div v-else class="card-price-placeholder">咨询客服</div>

        <div class="card-tags" v-if="product.tags && product.tags.length > 0">
          <span
            v-for="tag in product.tags.slice(0, 2)"
            :key="tag"
            class="tag-pill"
            :class="{ 'tag-accent': tag === 'meituan' }"
          >
            {{ getTagLabel(tag) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(255, 107, 53, 0.1);
}

.card-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #fdfcfb;
}

.image-wrapper {
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff5f2 0%, #fffbf0 100%);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  opacity: 0.6;
}

.placeholder-icon {
  font-size: 48px;
  filter: grayscale(0.2);
}

.placeholder-text {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  letter-spacing: 1px;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: var(--color-primary);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-sm);
  z-index: 1;
}

.card-content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xs);
  gap: var(--spacing-sm);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1.3;
  flex-grow: 1;
}

.card-category {
  font-size: 11px;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.2em; /* Ensure consistent spacing */
}

.card-action-area {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-price {
  color: var(--color-primary);
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.price-symbol {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.price-value {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.price-unit {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-left: 2px;
}

.card-price-placeholder {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.card-tags {
  display: flex;
  gap: var(--spacing-xs);
}

.tag-pill {
  padding: 4px 10px;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-md);
  background: #f0f2f5;
  color: #5f6368;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-accent {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .card-content {
    padding: var(--spacing-md);
  }
  .price-value {
    font-size: var(--font-size-xl);
  }
}
</style>
