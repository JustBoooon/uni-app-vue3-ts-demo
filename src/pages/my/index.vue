<template>
  <view>
    <button
      @tap="memberStore.setProfile({token: '123456'})"
      type="primary" plain size="mini">
      保存信息
    </button>
    <button
      @tap="memberStore.clearProfile()"
      type="warn" plain size="mini">
      清除信息
    </button>
    <view>
      用户信息：{{ memberStore.profile }}
    </view>
    <button
      @tap="getTest()"
      type="primary" plain size="mini">
      测试请求
    </button>
  </view>
</template>

<script lang="ts" setup>
import { useMemberStore } from '@/stores'
import '@/utils/http'

const memberStore = useMemberStore()

const getTest = () => {
  uni.request({
    method: 'GET',
    url: '/home/banner'
  })
}

</script>

<style scoped></style>