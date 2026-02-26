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
        <div class="placeholder-text">NO_IMAGE_DATA</div>
      </div>
      <div class="card-id-tag">#{{ product.id.toString().padStart(3, '0') }}</div>
    </div>
    <div class="card-body">
      <div class="card-header">
        <div class="product-category" v-if="product.categoryName">{{ product.categoryName }}</div>
        <h3 class="product-title">{{ product.name }}</h3>
      </div>
      <p v-if="product.description" class="product-description">
        {{ product.description }}
      </p>
      <div class="card-footer">
        <div class="price-section">
          <div v-if="formatPrice(product.price, product.priceUnit)" class="price-display">
            <span class="price-amount">{{ product.price }}</span>
            <span class="price-unit">{{ product.priceUnit ? ' / ' + product.priceUnit : '' }}</span>
          </div>
          <div v-else class="price-inquiry">REQUEST_QUOTE</div>
        </div>
        <div class="action-tag" v-if="product.tags && product.tags.length > 0">
          {{ getTagLabel(product.tags[0]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  border: 1px solid transparent;
  padding: 32px;
}

.product-card:hover {
  background: var(--color-bg-secondary);
}

.card-image {
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: var(--color-bg-tertiary);
  margin-bottom: 32px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
  transition: filter 0.6s ease;
}

.product-card:hover img {
  filter: grayscale(0);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--color-text-muted);
}

.card-id-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  background: var(--color-white);
  padding: 4px 8px;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-header {
  margin-bottom: 24px;
}

.product-category {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.product-title {
  font-size: 28px;
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-text-primary);
  letter-spacing: -1px;
}

.product-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.price-display {
  display: flex;
  align-items: baseline;
}

.price-amount {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.price-unit {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-left: 8px;
  font-weight: 700;
}

.price-inquiry {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.action-tag {
  font-size: 10px;
  font-weight: 900;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 1px solid var(--color-text-primary);
  padding: 6px 12px;
}

@media (max-width: 640px) {
  .product-card { padding: 24px; }
  .product-title { font-size: 24px; }
}
</style>
