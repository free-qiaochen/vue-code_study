<template>
  <div>
    <header>
      <div>hello nuxt</div>
      <nav>
        <nuxt-link to="/">首页</nuxt-link>
        <nuxt-link to="/about">我的</nuxt-link>
        <nuxt-link to="/category">分类</nuxt-link>
      </nav>
    </header>

    <Nuxt />
  </div>
</template>

<style >
header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
