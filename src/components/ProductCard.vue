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
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
  border-color: rgba(255, 107, 53, 0.2);
}

.card-image {
  position: relative;
  aspect-ratio: 16/10;
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
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.product-card:hover .image-wrapper img {
  transform: scale(1.08);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-surface);
  position: relative;
}

.image-placeholder::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--color-primary) 0.5px, transparent 0.5px);
  background-size: 15px 15px;
  opacity: 0.05;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 1;
}

.placeholder-icon {
  font-size: 56px;
  filter: drop-shadow(0 10px 15px rgba(255, 107, 53, 0.2));
}

.placeholder-text {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-tech-navy);
  color: var(--color-white);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

.card-content {
  padding: 28px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
}

.card-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.card-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-tech-navy);
  line-height: 1.2;
  flex-grow: 1;
  letter-spacing: -0.5px;
}

.card-category {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.card-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.2em;
}

.card-action-area {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-bg-secondary);
}

.card-price {
  color: var(--color-primary);
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 14px;
  font-weight: 700;
  margin-right: 2px;
}

.price-value {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.price-unit {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-left: 4px;
  font-weight: 500;
}

.card-price-placeholder {
  font-size: 15px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.card-tags {
  display: flex;
  gap: 8px;
}

.tag-pill {
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
  background: var(--color-bg-secondary);
  color: var(--color-tech-navy);
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.product-card:hover .tag-pill {
  border-color: var(--color-border);
}

.tag-accent {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .card-content {
    padding: 20px;
  }
  .card-title {
    font-size: 18px;
  }
  .price-value {
    font-size: 24px;
  }
}
</style>
