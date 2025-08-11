<template>
  <view>
    <button
      @tap="memberStore.setProfile('信息存入')"
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
  </view>
</template>

<script lang="ts" setup>
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()
</script>

<style scoped></style>