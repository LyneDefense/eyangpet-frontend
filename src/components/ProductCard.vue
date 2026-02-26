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
        <div class="image-overlay"></div>
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
      <div v-if="product.isActive" class="card-badge">HOT</div>
      <div class="hover-indicator">
        <span>VIEW DETAILS</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>

    <div class="card-info">
      <div class="card-main-header">
        <div class="category-pill" v-if="product.categoryName">{{ product.categoryName }}</div>
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
          <div v-else class="price-placeholder">REQUEST QUOTE</div>
        </div>

        <div class="tag-label" v-if="product.tags && product.tags.length > 0">
          <span class="tag-dot"></span>
          {{ getTagLabel(product.tags[0]) }}
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
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border);
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.card-image-area {
  position: relative;
  aspect-ratio: 16/10;
  background-color: var(--color-bg-subtle);
  overflow: hidden;
}

.image-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 60%, rgba(15, 23, 42, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.product-card:hover .image-box img {
  transform: scale(1.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  background: var(--color-bg-subtle);
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--gradient-main);
  color: var(--color-white);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hover-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 3;
}

.product-card:hover .hover-indicator {
  transform: translateY(0);
}

.hover-indicator span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.card-info {
  padding: 32px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-pill {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-primary-bg);
  padding: 4px 12px;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--color-border-strong);
}

.product-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-black);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.product-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 16px 0 32px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.2em;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency-symbol {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-black);
}

.amount {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-black);
  letter-spacing: -0.02em;
}

.unit {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-left: 4px;
  font-weight: 500;
}

.price-placeholder {
  font-size: 14px;
  color: var(--color-text-tertiary);
  font-weight: 600;
}

.tag-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.tag-dot {
  width: 6px;
  height: 6px;
  background: var(--color-border-strong);
  border-radius: 50%;
}

@media (max-width: 640px) {
  .product-name { font-size: 20px; }
  .amount { font-size: 28px; }
  .card-info { padding: 24px; }
}
</style>
