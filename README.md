# fusion-to-antd 工具包使用说明
## 命令

### plugin
```
npx fusion-to-antd plugin
```
当前目录为ice+fusion脚手架时，fusion-to-antd 会为当前项目添加antd依赖及相关插件，并自动补全antd全局样式配置。
此命令适合基于**ice.js**的组件迁移。
如果该工程为ice-script，请**手动添加**antd依赖及相关插件，步骤如下：
1. ```tnpm i antd @ant-design/icons ice-plugin-antd --save-dev```
2. 在ice.config.js中找到属性plugin，新增
```
    ['ice-plugin-antd', {
      themeConfig: {
        "primary-color": "#5050E6",
        "border-radius-base": "4px",
        "font-size-base": "12px",
        "text-color": "#333",
        "text-color-secondary": "#999",
      },
    }],
```

### replace

```
npx fusion-to-antd replace
```
当前项目目录使用的是fusion时，fusion-to-antd 会做以下事情
 - 检索当前项目路径下所有的ts,js,tsx,jsx文件，不包含node_module、.umi、.ice目录。
 - 将文件内包含fusion组件的引入替换为antd组件引入，包含fusion物料。
 - 将文件内含有fusion组件（含fusion物料）进行antd(版本4.9.1)替换，替换顺序如下：
 	1. 替换 fusion及物料包引用 -> antd引用
 	2. 过滤 fusion组件不被antd支持的api
 	3. 替换 fusion组件api -> antd组件相关api
 	4. 补全 基于步骤2补全antd关联的属性和键值（通常在fusion某个api对应antd多个api时触发）
 	5. 销毁 原有fusion组件api（只销毁已完全被antd支持的api，保留尚未完全被支持的api）。
 - 返回替换结果，差异及冲突输出在当前目录下的fta.log日志中。

你也可以指定路径深度，可以深度到指定某个文件，如
```
npx fusion-to-antd replace src/components
或
npx fusion-to-antd replace src/components/layout/layout.ts
```

## fusion-to-antd 
### 支持替换的组件列表
1. affix
2. avatar
3. badge
4. breadcrumb
5. button
6. calendar
7. card
8. cascader
9. checkbox
10. collapse
11. ~~datepicker~~
12. divider
13. drawer
14. ~~dropdown~~
15. form
16. grid
17. input
18. list
19. ~~menu~~
20. message
21. modal
22. ~~notification~~
23. ~~inputnumber~~
24. ~~pagination~~
25. progress
26. popover
27. radio
28. row
29. rate
30. ~~slider~~
31. steps
32. switch
33. Select
34. spin
35. tooltip
36. typography
37. tabs
38. ~~table~~
39. tag
40. ~~timepicker~~
41. timeline
42. ~~transfer~~
43. ~~tree~~
44. ~~upload~~


### 其它
![fusion-2-antd.gif](https://intranetproxy.alipay.com/skylark/lark/0/2021/gif/343872/1615996833918-d79cacb0-b21d-4088-8bdb-2a0d19504abb.gif) 
