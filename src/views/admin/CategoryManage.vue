<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminToggleCategory,
  type ProductCategory
} from '@/api/product'

const categories = ref<ProductCategory[]>([])
const loading = ref(false)
const showModal = ref(false)
const editingCategory = ref<ProductCategory | null>(null)
const form = ref({
  name: '',
  description: ''
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await adminGetCategories()
    if (res.data.code === 200) {
      categories.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingCategory.value = null
  form.value = { name: '', description: '' }
  showModal.value = true
}

const openEditModal = (category: ProductCategory) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = null
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    alert('请输入分类名称')
    return
  }

  try {
    if (editingCategory.value) {
      await adminUpdateCategory(editingCategory.value.id, form.value)
    } else {
      await adminCreateCategory(form.value)
    }
    closeModal()
    fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
    alert('保存失败')
  }
}

const handleToggle = async (category: ProductCategory) => {
  try {
    await adminToggleCategory(category.id)
    fetchCategories()
  } catch (error) {
    console.error('Failed to toggle category:', error)
  }
}

const handleDelete = async (category: ProductCategory) => {
  if (!confirm(`确定要删除分类「${category.name}」吗？`)) {
    return
  }

  try {
    const res = await adminDeleteCategory(category.id)
    if (res.data.code === 200) {
      fetchCategories()
    } else {
      alert(res.data.message)
    }
  } catch (error) {
    console.error('Failed to delete category:', error)
    alert('删除失败，该分类下可能存在商品')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="category-manage">
    <div class="page-header">
      <h1>分类管理</h1>
      <button class="btn btn-primary" @click="openCreateModal">+ 新增分类</button>
    </div>

    <div class="category-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="categories.length === 0" class="empty">暂无分类</div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>排序</th>
              <th>分类名称</th>
              <th>描述</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.sortOrder }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.description || '-' }}</td>
              <td>
                <span
                  class="status-tag"
                  :class="category.isActive ? 'active' : 'inactive'"
                >
                  {{ category.isActive ? '启用' : '禁用' }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-link" @click="openEditModal(category)">编辑</button>
                  <button class="btn-link" @click="handleToggle(category)">
                    {{ category.isActive ? '禁用' : '启用' }}
                  </button>
                  <button class="btn-link danger" @click="handleDelete(category)">删除</button>
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
          <h3>{{ editingCategory ? '编辑分类' : '新增分类' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>分类名称 *</label>
            <input v-model="form.name" type="text" class="input" placeholder="请输入分类名称" />
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="form.description" class="input" rows="3" placeholder="请输入描述"></textarea>
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
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
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
}

.table th {
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
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
  max-width: 480px;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}
</style>
