/**
 * 添加拦截器
 *    拦截 request 请求
 *    拦截 uploadFile 文件上传
 * 
 * TODO：
 *    1.非 http 开头需拼接地址
 *    2.请求超时时间设置
 *    3.添加小程序端请求头标识
 *    4.添加 token 请求头标识
 */
import { useMemberStore } from "@/stores"

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1.非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2.请求超时，默认60s
    options.timeout = 10000
    // 3.添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp'
    }
    // 4.添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    // token 存在则在请求头上添加 token，无则不添加
    if (token) {
      options.header.Authorization = token
    }

    console.log(options);
  }
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param UniApp.RequestOptions
 * @returns Promise
 * 1.返回 Promise 对象
 * 2.请求成功
 *    2.1 提取数据 res.data
 *    2.2 添加类型，支持泛型
 * 3.请求失败
 *    3.1 网络错误
 *    3.2 401错误
 *    3.3 其它错误
 */
interface Data<T> {
  code: string
  msg: string
  result: T
}
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1.返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 2.请求成功
      success: (res) => {
        // 状态码 2xx
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1提取数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 3.2 401错误
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({url: '/pages/login/index'})
          reject(res)
        } else {
          // 3.3其它错误
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误'
          })
          reject(res)
        }
      },
      // 3.请求失败
      fail(err) {
        // 3.1 网络错误
        uni.showToast({
          icon: 'none',
          title: '网络错误，请更换网络！'
        })
        reject(err)
      }
    })
  })
}