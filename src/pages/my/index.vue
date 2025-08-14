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
      @tap="getBanner()"
      type="primary" plain size="mini">
      测试请求
    </button>
  </view>
</template>

<script lang="ts" setup>
import { useMemberStore } from '@/stores'
import { http } from '@/utils/http'

const memberStore = useMemberStore()

interface BannerItem {
  hrefUrl: string
  id: string
  imgUrl: string
  type: string
}
const getBanner = async () => {
  const res = await http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner'
  })

  console.log(`请求成功`, res.result);
}



</script>

<style scoped></style>