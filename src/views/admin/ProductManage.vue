<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  adminGetProducts,
  adminGetCategories,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminToggleProduct,
  type Product,
  type ProductCategory
} from '@/api/product'

const products = ref<Product[]>([])
const categories = ref<ProductCategory[]>([])
const loading = ref(false)
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

// 筛选条件
const filterCategory = ref<number | ''>('')
const filterStatus = ref<'' | 'true' | 'false'>('')
const filterKeyword = ref('')

const form = ref({
  categoryId: null as number | null,
  name: '',
  description: '',
  price: null as number | null,
  priceUnit: '',
  tags: [] as string[]
})

const availableTags = [
  { value: 'meituan', label: '美团可购' },
  { value: 'reusable', label: '可存下次用' },
  { value: 'customizable', label: '可自选组成' }
]

const fetchCategories = async () => {
  try {
    const res = await adminGetCategories()
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
    const params: any = {}
    if (filterCategory.value) params.categoryId = filterCategory.value
    if (filterStatus.value) params.isActive = filterStatus.value === 'true'
    if (filterKeyword.value) params.keyword = filterKeyword.value

    const res = await adminGetProducts(params)
    if (res.data.code === 200) {
      products.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingProduct.value = null
  form.value = {
    categoryId: null,
    name: '',
    description: '',
    price: null,
    priceUnit: '',
    tags: []
  }
  showModal.value = true
}

const openEditModal = (product: Product) => {
  editingProduct.value = product
  form.value = {
    categoryId: product.categoryId,
    name: product.name,
    description: product.description || '',
    price: product.price || null,
    priceUnit: product.priceUnit || '',
    tags: product.tags || []
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    alert('请输入商品名称')
    return
  }
  if (!form.value.categoryId) {
    alert('请选择分类')
    return
  }

  try {
    const data = {
      ...form.value,
      price: form.value.price || undefined,
      priceUnit: form.value.priceUnit || undefined
    }

    if (editingProduct.value) {
      await adminUpdateProduct(editingProduct.value.id, data)
    } else {
      await adminCreateProduct(data)
    }
    closeModal()
    fetchProducts()
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('保存失败')
  }
}

const handleToggle = async (product: Product) => {
  try {
    await adminToggleProduct(product.id)
    fetchProducts()
  } catch (error) {
    console.error('Failed to toggle product:', error)
  }
}

const handleDelete = async (product: Product) => {
  if (!confirm(`确定要删除商品「${product.name}」吗？`)) {
    return
  }

  try {
    await adminDeleteProduct(product.id)
    fetchProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
    alert('删除失败')
  }
}

const toggleTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag)
  if (index === -1) {
    form.value.tags.push(tag)
  } else {
    form.value.tags.splice(index, 1)
  }
}

const formatPrice = (price?: number, unit?: string) => {
  if (!price) return '-'
  return `¥${price}${unit ? '/' + unit : ''}`
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="product-manage">
    <div class="page-header">
      <h1>商品管理</h1>
      <button class="btn btn-primary" @click="openCreateModal">+ 新增商品</button>
    </div>

    <!-- 筛选 -->
    <div class="filters">
      <select v-model="filterCategory" class="input filter-input" @change="fetchProducts">
        <option value="">全部分类</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <select v-model="filterStatus" class="input filter-input" @change="fetchProducts">
        <option value="">全部状态</option>
        <option value="true">已上架</option>
        <option value="false">已下架</option>
      </select>
      <input
        v-model="filterKeyword"
        type="text"
        class="input filter-input"
        placeholder="搜索商品名称"
        @keyup.enter="fetchProducts"
      />
      <button class="btn btn-soft" @click="fetchProducts">搜索</button>
    </div>

    <!-- 商品列表 -->
    <div class="product-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="products.length === 0" class="empty">暂无商品</div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 60px">排序</th>
              <th>商品名称</th>
              <th>分类</th>
              <th>价格</th>
              <th>标签</th>
              <th>状态</th>
              <th style="width: 150px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.sortOrder }}</td>
              <td>
                <div class="product-name">{{ product.name }}</div>
                <div v-if="product.description" class="product-desc">{{ product.description }}</div>
              </td>
              <td>{{ product.categoryName }}</td>
              <td>{{ formatPrice(product.price, product.priceUnit) }}</td>
              <td>
                <div class="tags">
                  <span
                    v-for="tag in product.tags"
                    :key="tag"
                    class="tag"
                    :class="{ 'tag-meituan': tag === 'meituan' }"
                  >
                    {{ tag === 'meituan' ? '美团可购' : tag === 'reusable' ? '可存下次用' : '可自选组成' }}
                  </span>
                  <span v-if="!product.tags?.length" class="no-tags">-</span>
                </div>
              </td>
              <td>
                <span
                  class="status-tag"
                  :class="product.isActive ? 'active' : 'inactive'"
                >
                  {{ product.isActive ? '已上架' : '已下架' }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-link" @click="openEditModal(product)">编辑</button>
                  <button class="btn-link" @click="handleToggle(product)">
                    {{ product.isActive ? '下架' : '上架' }}
                  </button>
                  <button class="btn-link danger" @click="handleDelete(product)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingProduct ? '编辑商品' : '新增商品' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>商品名称 *</label>
            <input v-model="form.name" type="text" class="input" placeholder="请输入商品名称" />
          </div>
          <div class="form-group">
            <label>所属分类 *</label>
            <select v-model="form.categoryId" class="input">
              <option :value="null">请选择分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>商品描述</label>
            <textarea v-model="form.description" class="input" rows="3" placeholder="请输入商品描述"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>价格</label>
              <input v-model.number="form.price" type="number" class="input" placeholder="价格" />
            </div>
            <div class="form-group">
              <label>单位</label>
              <select v-model="form.priceUnit" class="input">
                <option value="">请选择</option>
                <option value="套">套</option>
                <option value="天">天</option>
                <option value="小时">小时</option>
                <option value="次">次</option>
                <option value="小时/猫">小时/猫</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>标签</label>
            <div class="tag-options">
              <label
                v-for="tag in availableTags"
                :key="tag.value"
                class="tag-option"
                :class="{ selected: form.tags.includes(tag.value) }"
              >
                <input
                  type="checkbox"
                  :checked="form.tags.includes(tag.value)"
                  @change="toggleTag(tag.value)"
                />
                {{ tag.label }}
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="handleSubmit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
}

.filters {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.filter-input {
  width: auto;
  min-width: 150px;
}

.table-wrapper {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.table th {
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.product-name {
  font-weight: var(--font-weight-medium);
}

.product-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  padding: 2px var(--spacing-sm);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-full);
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.tag-meituan {
  background: var(--color-border);
  color: var(--color-text-secondary);
}

.no-tags {
  color: var(--color-text-muted);
}

.status-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-tag.active {
  background: #d4edda;
  color: #155724;
}

.status-tag.inactive {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-link.danger {
  color: var(--color-error);
}

.loading,
.empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-muted);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-group textarea.input {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.form-row .form-group {
  flex: 1;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-option input {
  display: none;
}

.tag-option.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}
</style>
