<template>
  <div class="profile">
    <van-nav-bar title="个人中心"></van-nav-bar>
    <div class="profile-info">
      <template v-if="!store.state.user.hasPermission">
        <img src="@/assets/logo.png"
             alt="">
        <van-button size="small"
                    to="/login">登录</van-button>
      </template>
      <template v-else>
        <!-- 头像上传 -->
        <img src="@/assets/logo.png" />
        <span>{{ $store.state.user.username }}</span>
      </template>
    </div>
    
  </div>
</template>