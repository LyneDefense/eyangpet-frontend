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
    <div class="card-image-container">
      <div v-if="product.images && product.images.length > 0" class="image-box">
        <img :src="product.images[0]" :alt="product.name" />
        <div class="scanline"></div>
      </div>
      <div v-else class="image-fallback">
        <div class="fallback-code">ERR_NULL_IMG</div>
      </div>
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span class="status-text">ACTIVE</span>
      </div>
    </div>
    <div class="card-details">
      <div class="detail-header">
        <div class="tech-label">[ CAT_{{ product.categoryId }} ]</div>
        <h3 class="product-name">{{ product.name }}</h3>
      </div>
      <p v-if="product.description" class="product-info">
        {{ product.description }}
      </p>
      <div class="card-specs">
        <div class="spec-group">
          <div class="spec-label">VAL_UNIT</div>
          <div v-if="formatPrice(product.price, product.priceUnit)" class="spec-value">
            <span class="currency">¥</span>
            <span class="amount">{{ product.price }}</span>
            <span class="unit" v-if="product.priceUnit">/{{ product.priceUnit }}</span>
          </div>
          <div v-else class="spec-value dimmed">PENDING_PRICE</div>
        </div>
        <div class="spec-footer">
          <div class="tag-box" v-if="product.tags && product.tags.length > 0">
            {{ getTagLabel(product.tags[0]) }}
          </div>
          <div class="serial-no">SN_{{ product.id.toString().padStart(5, '0') }}</div>
        </div>
      </div>
    </div>
    <div class="corner-accents">
      <div class="accent tl"></div>
      <div class="accent br"></div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
}

.product-card:hover {
  border-color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.card-image-container {
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
  overflow: hidden;
}

.image-box {
  width: 100%;
  height: 100%;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.1);
  transition: all 0.5s ease;
  opacity: 0.8;
}

.product-card:hover .image-box img {
  filter: grayscale(0) contrast(1);
  opacity: 1;
  transform: scale(1.05);
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0, 240, 255, 0.2);
  box-shadow: 0 0 10px var(--color-tech-accent);
  z-index: 2;
  opacity: 0;
  pointer-events: none;
}

.product-card:hover .scanline {
  animation: scan-move 2s linear infinite;
  opacity: 1;
}

@keyframes scan-move {
  0% { top: 0; }
  100% { top: 100%; }
}

.image-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
}

.fallback-code {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.status-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  z-index: 3;
}

.status-dot {
  width: 4px;
  height: 4px;
  background: var(--color-tech-accent);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--color-tech-accent);
}

.status-text {
  font-family: var(--font-mono);
  font-size: 8px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 1px;
}

.card-details {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.detail-header {
  margin-bottom: 16px;
}

.tech-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.product-name {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: -1px;
}

.product-info {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-specs {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.spec-group {
  margin-bottom: 20px;
}

.spec-label {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.spec-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.amount {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 900;
  color: var(--color-text-primary);
}

.unit {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-muted);
}

.dimmed {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 12px;
}

.spec-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-box {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
  padding: 4px 8px;
  text-transform: uppercase;
}

.serial-no {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

.corner-accents .accent {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--color-text-primary);
  opacity: 0;
  transition: all 0.3s ease;
}

.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.br { bottom: 0; right: 0; border-left: none; border-top: none; }

.product-card:hover .accent {
  opacity: 1;
}

@media (max-width: 640px) {
  .product-name { font-size: 20px; }
  .amount { font-size: 24px; }
}
</style>
