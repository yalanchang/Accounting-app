<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-brand">💰 記帳本</div>
      <div class="nav-links">
        <NuxtLink to="/">首頁</NuxtLink>
        <NuxtLink to="/transactions">記錄</NuxtLink>
        <NuxtLink to="/stats">統計</NuxtLink>
        <NuxtLink to="/categories">分類</NuxtLink>
      </div>
    </nav>
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>