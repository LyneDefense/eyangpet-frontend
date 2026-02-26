<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>E养宠后台</h2>
      </div>
      <nav class="sidebar-nav">
        <RouterLink
          to="/admin/categories"
          class="nav-item"
          :class="{ active: route.name === 'admin-categories' }"
        >
          分类管理
        </RouterLink>
        <RouterLink
          to="/admin/products"
          class="nav-item"
          :class="{ active: route.name === 'admin-products' }"
        >
          商品管理
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <RouterLink to="/" class="back-link">返回前台</RouterLink>
      </div>
    </aside>
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 220px;
  background: var(--color-accent);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md) 0;
}

.nav-item {
  display: block;
  padding: var(--spacing-sm) var(--spacing-lg);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
}

.nav-item.active {
  background: var(--color-primary);
  color: var(--color-white);
}

.sidebar-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.back-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.back-link:hover {
  color: var(--color-white);
}

.admin-main {
  flex: 1;
  background: var(--color-bg);
  padding: var(--spacing-xl);
  overflow-y: auto;
}
</style>
