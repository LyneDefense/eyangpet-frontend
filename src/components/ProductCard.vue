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
    <div class="card-tech-id">REF:{{ product.id.toString().padStart(4, '0') }}</div>
    <div class="card-image">
      <div v-if="product.images && product.images.length > 0" class="image-wrapper">
        <img :src="product.images[0]" :alt="product.name" />
      </div>
      <div v-else class="image-placeholder">
        <div class="placeholder-content">
          <span class="placeholder-icon">🐱</span>
          <span class="placeholder-text">SYSTEM ACTIVE</span>
        </div>
      </div>
      <div class="card-badge" v-if="product.isActive">AVAILABLE</div>
    </div>
    <div class="card-content">
      <div class="card-header-info">
        <div class="category-pill" v-if="product.categoryName">{{ product.categoryName }}</div>
        <h3 class="card-title">{{ product.name }}</h3>
      </div>
      <p v-if="product.description" class="card-desc">
        {{ product.description }}
      </p>
      <div class="card-footer">
        <div v-if="formatPrice(product.price, product.priceUnit)" class="card-price-row">
          <span class="price-val">{{ product.price }}</span>
          <span class="price-cur">RMB</span>
          <span class="price-unt" v-if="product.priceUnit">/{{ product.priceUnit }}</span>
        </div>
        <div v-else class="price-placeholder">CONTACT SERVICE</div>

        <div class="card-tags" v-if="product.tags && product.tags.length > 0">
          <span
            v-for="tag in product.tags.slice(0, 1)"
            :key="tag"
            class="tag-tech"
            :class="{ 'tag-highlight': tag === 'meituan' }"
          >
            {{ getTagLabel(tag) }}
          </span>
        </div>
      </div>
    </div>
    <div class="card-hover-border"></div>
  </div>
</template>

<style scoped>
.product-card {
  background: #fff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  cursor: pointer;
}

.card-tech-id {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 10px;
  font-family: monospace;
  color: var(--color-text-muted);
  z-index: 2;
  letter-spacing: 1px;
}

.product-card:hover {
  transform: translateY(-16px) scale(1.02);
  box-shadow: 0 40px 80px rgba(15, 23, 42, 0.15);
  border-color: transparent;
}

.card-hover-border {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-radius: var(--radius-xl);
  pointer-events: none;
  transition: all 0.6s ease;
  z-index: 5;
}

.product-card:hover .card-hover-border {
  border-color: var(--color-primary);
  mask-image: linear-gradient(135deg, black, transparent);
}

.card-image {
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.image-wrapper {
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.product-card:hover .image-wrapper img {
  transform: scale(1.15);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-surface);
}

.placeholder-icon {
  font-size: 64px;
  filter: grayscale(1);
  opacity: 0.2;
}

.placeholder-text {
  position: absolute;
  bottom: 20px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--color-text-muted);
}

.card-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: var(--color-tech-navy);
  color: #fff;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  z-index: 2;
}

.card-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-header-info {
  margin-bottom: 20px;
}

.category-pill {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-tech-navy);
  line-height: 1.2;
  letter-spacing: -1px;
}

.card-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
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
  align-items: flex-end;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}

.card-price-row {
  display: flex;
  align-items: baseline;
}

.price-val {
  font-size: 40px;
  font-weight: 900;
  color: var(--color-tech-navy);
  line-height: 1;
}

.price-cur {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-text-muted);
  margin-left: 8px;
}

.price-unt {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-left: 4px;
}

.price-placeholder {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.card-tags {
  display: flex;
}

.tag-tech {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-tech-navy);
  padding: 6px 14px;
  background: var(--color-bg-secondary);
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.tag-highlight {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .card-content { padding: 24px; }
  .card-title { font-size: 20px; }
  .price-val { font-size: 32px; }
}
</style>
