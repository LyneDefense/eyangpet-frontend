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
      <img
        v-if="product.images && product.images.length > 0"
        :src="product.images[0]"
        :alt="product.name"
      />
      <div v-else class="image-placeholder">
        <span class="placeholder-icon">🐱</span>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ product.name }}</h3>
      <p v-if="product.description" class="card-desc">
        {{ product.description }}
      </p>
      <div class="card-footer">
        <div v-if="formatPrice(product.price, product.priceUnit)" class="card-price">
          {{ formatPrice(product.price, product.priceUnit) }}
        </div>
        <div v-if="product.tags && product.tags.length > 0" class="card-tags">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="tag"
            :class="{ 'tag-meituan': tag === 'meituan' }"
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
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.product-card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.card-image {
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .card-image img {
  transform: scale(1.03);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
}

.placeholder-icon {
  font-size: 40px;
  opacity: 0.3;
}

.card-body {
  padding: var(--spacing-md);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-tight);
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.tag-meituan {
  background: var(--color-bg-tertiary);
  color: var(--color-text-muted);
}
</style>
