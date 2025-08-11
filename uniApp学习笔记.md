# uniapp学习笔记

## vscode插件

* uni-app插件

  ```
  uni-create-view			快速创建uni-app页面等
  uni-helper				代码提示等
  uniapp小程序扩展			 鼠标悬停查文档等
  ```



## 统一代码风格

可以尝试 eslint + prettier



## 创建项目

vue3+ts

1. 创建ts工程，在项目文件目录处打开 cmd 运行

   ```
   // my-vue3-project可改为自定义项目名称
   npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project
   ```

2. 下载依赖

   ```
   pnpm install
   ```

3. 安装类型声明文件

   ```
   pnpm i -D @types/wechat-miniprogram @uni-helper/uni-app-types
   ```

4. tsconfig.json文件配置

   ```json
   {
     "extends": "@vue/tsconfig/tsconfig.json",
     "compilerOptions": {
       "verbatimModuleSyntax": true,
       "ignoreDeprecations": "5.0", // 临时忽略"Option 'importsNotUsedAsValues' is deprecated..."警告
       "sourceMap": true,
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       },
       "lib": ["esnext", "dom"],
       "types": [
         "@dcloudio/types",    // uni-app 核心类型
         "@types/wechat-miniprogram",	// 步骤3安装的类型声明
         "@uni-helper/uni-app-types",  // 步骤3安装的类型声明
         "vite/client"         // Vite 环境类型
       ]
     },
     // 解决类型“{ class: string; }”的参数不能赋给类型“ComponentPublicInstanceConstructor...
     "vueCompilerOptions": {
       "nativeTags": [
         "div",
         "img",
         "..."
       ]
     },
     "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
   }
   ```

5. 其它可能需要补充的

   * 安装TS 配置依赖包

     ```
     pnpm install --save-dev @vue/tsconfig
     ```



## 项目结构

```
|-pages			业务页面文件存放目录
|-static		存放静态资源目录（静态资源只能放这
|-
|-
|-
|-pages.json	配置页面路由、导航栏、tabBar等页面类信息
|-manifest.json	配置appid、应用名称、logo、版本等打包信息
|-
```



## 导入 uni-ui

1. 安装 uni-ui

   ```
   pnpm i @dcloudio/uni-ui
   ```

2. 配置 easycom

   ```
   // 在 pages.json 下配置
   "easycom": {
   	"autoscan": true,
   	"custom": {
   		// uni-ui 规则如下配置
   		"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
   	}
   },
   "pages":[
       // ...
   ]
   ```

   注：如未安装 sass 及 sass-loader，需先安装

   ```
   // 安装 sass
   pnpm i sass -D
   // 安装 sass-loader
   pnpm i sass-loader@10.1.1 -D
   ```




## Pinia 持久化

### 文件结构

```
src/
├── stores/                # Pinia 状态管理根目录
│   ├── index.ts           # Pinia 实例初始化文件
│   ├── modules/           # 按功能拆分的状态模块
│   │   ├── user.ts        # 用户相关状态
```

### 添加及配置流程

1. 安装pinia

   ```
   pnpm install pinia
   ```

2. 安装持久化插件

   ```
   pnpm i pinia-plugin-persistedstate
   ```

3. pinia 配置

   ```ts
   // 在 src/stores/index.ts 下配置
   import { createPinia } from 'pinia'
   import persist from 'pinia-plugin-persistedstate'
   
   // 创建 pinia 实例
   const pinia = createPinia()
   // 使用持久化存储插件
   pinia.use(persist)
   
   // 默认导出，供 main.ts 使用
   export default pinia
   
   // 模块统一导出
   export * from './modules/member'
   ```

   ```ts
   // 在 main.ts 下配置
   ...
   
   // 导入 pinia 实例
   import pinia from "./stores"
   
   export function createApp() {
     ...
   
     // 使用 pinia
     app.use(pinia)
   
     return {
       app,
     }
   }
   ```

4. 注：安装后运行如有`[vite]: Rollup failed to resolve import "destr" from...`报错

   需安装两个缺失的依赖

   ```
   pnpm install destr
   pnpm install deep-pick-omit
   ```

### 持久化 demo

```ts
// 在 src/stores/modules/demo.ts 下配置
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
```



## 创建tabBar

1. 在 src\pages.json 页内添加 "tabBar" 属性

2. 填写对应页面及icon路径

   ```json
   {
   	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
   		{
   			"path": "pages/index/index",
   			"style": {
   				"navigationBarTitleText": "首页"
   			}
   		},
   		{
   			"path": "pages/my/index",
   			"style": {
   				"navigationBarTitleText": "我的"
   			}
   		}
   	],
   	"globalStyle": {
   		"navigationBarTextStyle": "black",
   		"navigationBarTitleText": "uni-app",
   		"navigationBarBackgroundColor": "#F8F8F8",
   		"backgroundColor": "#F8F8F8"
   	},
   	"tabBar": {
   		"color": "#333",				// tab 上的文字默认颜色
   		"selectedColor": "#409EFF",		// tab 上的文字选中时的颜色
   		"backgroundColor": "#fff",		// tab 的背景色
   		"borderStyle": "white",			// tabBar 上边框的颜色
   		"list": [
   			{
   				"pagePath": "pages/index/index",	 // 页面路径，必须在前面 pages 中先定义
   				"text": "首页",						// tab 上按钮文字，在 App 和 H5 平台为非必填
   				"iconPath": "/static/tabs/首页.png",	// 图片路径，icon 大小限制为 40 kb，建议尺寸为 81px * 81px
   				"selectedIconPath": "/static/tabs/首页 (1).png"	// 选中时的图片路径
   			},
   			{
   				"pagePath": "pages/my/index",
   				"text": "我的",
   				"iconPath": "/static/tabs/我的.png",
   				"selectedIconPath": "/static/tabs/我的 (1).png"
   			}
   		]
   	}
   }
   ```

   

## 其它

### `<view>` 和 `<div>`

uni-app 中，推荐使用`<view>`，原因如下：

* 跨平台兼容性

  * 小程序：微信、支付宝小程序原生标签是`<view>`，用`<div>`无法渲染
  * App：uni-app 会将`<view>`编译为原生组件（如 iOS 的 UIView）
  * H5：`<view>`会被编译为`<div>`

* 功能扩展

  `<view>`支持平台属性如 `@tap`：跨平台点击事件（编译为 `click` 或 `tap` 取决于平台）

* 性能优化

  UniApp 对 `<view>` 做了**底层优化**（如虚拟 DOM 处理），而 `<div>` 在非 H5 端可能被视为无效标签



### @tap 和 @click

| 特性           | `@tap`                             | `@click`                         |
| :------------- | :--------------------------------- | :------------------------------- |
| **来源**       | 小程序原生事件（如微信、支付宝）   | 标准 HTML DOM 事件               |
| **触发时机**   | 手指触摸屏幕时立即触发（无延迟）   | 通常有 300ms 延迟（兼容移动端）  |
| **跨平台支持** | 所有平台（UniApp 自动适配）        | 主要在 H5 和 Web 环境            |
| **事件对象**   | 包含小程序特有属性（如 `touches`） | 标准 DOM 事件对象（如 `target`） |

uni-app 中，推荐使用 @tap

* 无延迟响应
* 跨平台兼容性



### px、rpx、em、rem用法

* px

  固定像素，不响应屏幕变化

* rpx

  基于屏幕宽度自适应的动态比例单位（微信小程序专业单位），规定屏幕宽为 **750rpx**

* em

  相对长度单位，相对当前对象内文本的字体尺寸

* rem

  相对长度单位，相对根元素`<html>`尺寸，规定屏幕宽为 **20rem**