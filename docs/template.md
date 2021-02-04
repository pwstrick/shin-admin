# 模板组件
#### 1）Prompt.js
&emsp;&emsp;依托[Alert组件](https://3x.ant.design/components/alert-cn/)可配置标题、描述和图标。参数：
* message：标题
* description：描述
* showIcon：图标是否显示，默认是true
```javascript
const promptProps = {
  message: "使用需知",
  description: (
    <span>
      可以选择csv文件上传(<a href="#">点击下载uid的示例</a>
      )或手动输入uid(英文逗号隔开，不允许存在空格)。
    </span>
  )
};
```
![Prompt.js](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/4.png)