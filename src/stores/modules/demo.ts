import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberStore = defineStore(
  'member',
  () => {
    const profile = ref()

    const setProfile = (val: any) => {
      profile.value = val
    }

    const clearProfile = () => {
      profile.value = undefined
    }

    return {
      profile,
      setProfile,
      clearProfile
    }
  },
  // 持久化
  {
    // 网页端写法
    // persist: true
    persist: {
      storage: {
        getItem(key) {
          // 网页端写法
          // localStorage.setItem()
          // 多端兼容写法
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      }
    }
  }
)