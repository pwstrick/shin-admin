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

#### 2）SelectTabs.js
&emsp;&emsp;依托[Tabs组件](https://3x.ant.design/components/tabs-cn/)可配置标题和子组件等。参数：
* categories：键值对数组 [{key:"", value:""}]
* onTabChanges：选择标签时触发的事件
* animated：动画
* initTab：初始化TabPane中组件的函数
* type：标签栏类型，默认为 line
```javascript
const tabsProps = {
  categories: [
    { value: "普通列表", key: 1 },
    { value: "拖拽列表", key: 2 },
    { value: "图像列表", key: 3 }
  ],
  initTab: (category) => {
    switch (category.key) {
      case 1:
        return (
          <>
            <Query {...query1Props}></Query>
            <Batch {...batch1Props}></Batch>
            <List {...list1Props}></List>
          </>
        );
      case 2:
        return (
          <>
            <Query {...query2Props}></Query>
            <List {...list2Props}></List>
          </>
        );
      case 3:
        return (
          <>
            <Query {...query3Props}></Query>
            <Batch {...batch3Props}></Batch>
            <List {...list3Props}></List>
          </>
        );
    }
  }
};
```
![SelectTabs.js](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/5.png)

#### 3）PhotoCard.js
&emsp;&emsp;依托[Card组件](https://3x.ant.design/components/card-cn/)，参数：
* id：组件的唯一标识，用于多选
* url：照片地址
* footer：底部自定义组件（例如图中的举报信息）
* selection：选中的值以及回调事件 onChange(selectedRowKeys)
```javascript
const imgs = [
  { id: 1, url: "http://localhost:6060/img/avatar.png", name: "freedom" },
];
function cardFooter(record) {
  return <>
    <p>被举报人:
      <a>{record.name}</a>
    </p>
    <Popover title="举报详情" content="321" placement="right">
      <Icon type="right-circle" style={{position: "absolute", right: 5, bottom: 10, fontSize: 20}}/>
    </Popover>
  </>;
}
const selection = {
  selectedRowKeys: [],
  onChange: (selected) => {
    console.log("selected", selected)
  }
}
return <div style={{ display: 'flex', flexWrap: 'wrap' }}>
  { imgs.map(item => <PhotoCard key={item.id} id={item.id} url={item.url} footer={cardFooter(item)} selection={selection}/>) }
</div>;
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/6.png" width="300"/>
</p>

#### 4）CreateModal.js
&emsp;&emsp;依托[Modal组件](https://3x.ant.design/components/modal-cn/)和[Form组件](https://3x.ant.design/components/form-cn/)，参数：
* url：与服务端的通信地址
* initUrl：列表初始化地址（用于创建成功后的列表初始化）
* listName：交互的列表名称（当页面出现多个列表时使用）
* attrs：模态窗口的属性（只开放了部分）
* initControls：初始化控件的函数，参数是 record
* btns：窗口底部的按钮回调函数集合
  * onOk()：提交确认方法
  * formatValues()：格式化 values 的值，必须有返回值
* record：当前数据记录（在编辑时使用），声明于models/template.js文件
* form：传递进来的表单，用于关联表单和控件

&emsp;&emsp;在下面的示例中，除了 AntD 提供的组件之外，还可以引入封装的 AddField 和 3个上传组件，都会多一个 type参数 和 initControl() 函数，用于补充组件的属性（就是label、name、params等）。
```javascript
/**
 * 只有当包含返回值时，才会执行成功
 */
function csvImportComplete(data) {
  console.log("complete", data);
}
const modalProps = {
  url: "template/create",
  initUrl: "template/query",
  listName: "list1",
  attrs: {
    name: "add",
    width: 800,
    title: "新建配置"
  },
  btns: {
    // onOk: (errors, values, record) => {
    //     // console.log(errors)
    //     if (errors) return;
    //     const params = { ...values };
    //     if(record.id !== undefined)
    //         params.id = record.id
    //     dispatch({
    //         type: "template/handle",
    //         payload: {
    //             params,
    //             url: "template/create",
    //             initUrl: "template/query",
    //             modalName: "add",
    //             listName: "list1"
    //         }
    //     });
    //     // console.log(values);
    // }
  },
  initControls: (record) => [
    {
      label: "专辑",
      name: "aid",
      params: {
        initialValue: record.id ? String(record.id) : ""
      },
      control: (
        <Select style={{ width: 350 }}>
          {albumList.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      )
    },
    {
      label: "价格",
      name: "price",
      params: {
        rules: [{ required: true, message: "价格不能为空" }],
        initialValue: record.price
      },
      control: (
        <Input
          addonAfter="元"
          disabled={record.price === undefined ? false : true}
        />
      )
    },
    {
      label: "icon",
      name: "icon",
      type: "upload",
      params: {
        // rules: [{ required: true, message: 'icon不能为空' }],
        initialValue: record.icon
      },
      initControl: (props) => <PhotoUpload dir="demo" count={3} {...props} />
    },
    {
      label: "主页",
      name: "urls",
      type: "addfield",
      params: {
        rules: [{ required: true, message: "主页不能为空" }],
        initialValue: record.urls
      },
      control: (index) => (
        <Input
          placeholder={`第 ${index} 条主页地址`}
          style={{ width: "80%" }}
        />
      ),
      initControl: (props) => <AddField {...props}></AddField>
    },
    {
      label: "用户导入",
      name: "csv",
      type: "import",
      params: {
        initialValue: record.csv
      },
      initControl: (props) => (
        <CsvUpload
          onComplete={csvImportComplete}
          prompt={
            <div>
              第一列必须是img，第二列必须是tab<a href="#">点击下载示例</a>
            </div>
          }
          {...props}
        />
      )
    },
    {
      label: "附件",
      name: "file",
      type: "upload",
      params: {
        initialValue: record.file
      },
      initControl: (props) => <FileUpload dir="demo" count={3} {...props} />
    }
  ]
};
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/7.png" width="500"/>
</p>

#### 5）TabModal.js
&emsp;&emsp;带标签栏的模态窗口，可用于展示一些只读信息。参数：
* attrs：模态窗口的属性，只开放了部分：宽度、标题
* type：标签栏类型，默认为 card
* initPanes：标签栏内容回调函数，参数为 record
* effectCallback：useEffect钩子中的回调函数，参数是 record
* formItemLayout：自定义表单项中 label 和 wrapper 的宽度
```javascript
const tabModalProps = {
  type: "card",
  attrs: {
    name: "read",
    width: 600,
    title: "信息阅览"
  },
  initPanes: record => [
    {
      name: "用户信息",
      key: "logout",
      controls: [
        { label: "uid", control: "123" },
        { label: "手机", control: "+186138****00" },
        { label: "性别", control: "男" }
      ]
    },
    {
      name: "账号信息",
      key: "account",
      controls: [
        { label: "微信", control: <Button>解绑</Button> },
        { label: "手机", control: <Button>解绑</Button> }
      ]
    },
    {
      name: "设备信息",
      key: "device"
    }
  ]
};
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/8.png" width="500"/>
</p>

#### 6）AddField.js
&emsp;&emsp;需要注意，在表单提交时，要去除数组中的空元素（可调用 tools.js中的 removeEmptyInArray() ），因为控件的名称是数组，例如“urls[]”。参数：
* name：组件名称
* params：组件属性，[getFieldDecorator()](https://3x.ant.design/components/form-cn/#getFieldDecorator(id,-options)-%E5%8F%82%E6%95%B0)的参数
* label：新增按钮中的文本
* control：动态新增的控件，文本框、选择框等
* form：关联的表单
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/9.png" width="500"/>
</p>

#### 7）CustomForm.js
&emsp;&emsp;与 CreateModal.js 组件的配置类似，参数：
* url：表单提交的地址
* initUrl：列表数据更新的地址
* listName：关联的列表名称
* controls：表单中的控件，特殊控件包括 addfield、upload和csv
* btns：自定义按钮回调对象，包括 onOk()，formatValues()
* form：由 Form.create() 创建的表单对象
```javascript
const customFormProps = {
  url: "template/create",
  initUrl: list1Props.url,
  btns: {
    // onOk: (errors, values) => {
    //   console.log("custom ok");
    // },
  },
  controls: [
    {
      label: "专辑",
      name: "name",
      control: <Input style={{ width: 200 }}></Input>
    },
    {
      label: "主页",
      name: "urls",
      type: "addfield",
      params: {
        rules: [{ required: true, message: "主页不能为空" }],
        initialValue: ["http://www.pwstrick.com", "https://www.cnblogs.com/strick"]
      },
      control: (index) => (
        <Input
          placeholder={`第 ${index} 条主页地址`}
          style={{ width: "80%" }}
        />
      ),
      initControl: (props) => <AddField {...props}></AddField>
    },
    {
      label: "封面",
      name: "covers",
      type: "addfield",
      control: (index) => (
        <Input
          placeholder={`第 ${index} 条封面地址`}
          style={{ width: "80%" }}
        />
      ),
      initControl: (props) => <AddField {...props}></AddField>
    },
    {
      label: "icon",
      name: "icon",
      type: "upload",
      params: {
        rules: [{ required: true, message: "icon不能为空" }],
        initialValue: [
          "http://localhost:6060/img/avatar.png",
          "http://localhost:6060/img/cover.jpg"
        ]
      },
      initControl: (props) => <PhotoUpload dir="demo" count={3} {...props} />
    },
    {
      label: "用户导入",
      name: "csv",
      type: "import",
      params: {
        initialValue: [
          { nick: "justify", uid: "1" },
          { nick: "freedom", uid: "2" }
        ]
      },
      initControl: (props) => (
        <CsvUpload
          onComplete={csvImportComplete}
          prompt={
            <div>
              第一列必须是img，第二列必须是tab<a href="#">点击下载示例</a>
            </div>
          }
          {...props}
        />
      )
    },
    {
      label: "附件",
      name: "file",
      type: "upload",
      params: {
        initialValue: [
          "http://localhost:6060/img/cover.jpg"
        ]
      },
      initControl: (props) => <FileUpload dir="demo" count={3} {...props} />
    }
  ]
};
```

#### 8）Btns.js
&emsp;&emsp;在列表模板中处于顶部的按钮集合，预设了创建和Excel导出两个按钮，可自定义按钮，依托 Button组件。参数：
* btns是一个对象数组，其属性如下：
  * type: 根据按钮类型初始化按钮，默认提供新建（create）和导出两个按钮（export）
  * text：按钮文案
  * data：需要额外传递的参数，例如url、params等
  * onClick：点击事件
  * icon：图标
```javascript
const btnsProps = {
  btns: [
    {
      type: "create",
      data: {
        params: { modalName: modalProps.attrs.name }
      }
    },
    {
      type: "export",
      data: {
        url: "download/appHotRankList",
        params: { type: "anchor_today" }
      }
    },
    {
      type: "text",
      onClick: () => {
        dispatch({
          type: "template/showCreate",
          payload: { modalName: tabModalProps.attrs.name }
        });
      },
      icon: "tags",
      text: "查看"
    }
  ]
};
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/10.png" />
</p>

#### 9）Query.js
&emsp;&emsp;过滤条件组件，有列表和表单形式，参数：
* url：查询的请求地址
* listName：关联的列表名称，当一个页面中包含多个列表时使用
* type：两种类别的过滤条件 list（列表）和form（表单）
* controls：组件集合
* btns：按钮回调事件集合 formatValues()
* callback：自定义的回调函数，参数是列表数据
* form：由 Form.create() 创建
```javascript
/**
 * 列表形式的过滤条件
 * controls 中会将多个需要在一行中显示的组件合并成数组，例如下面是两行组件集合
 * {
 *   [组件1，组件2],
 *   [组件3, "search"]
 * }
 * 其中 search 是一个占位符，会渲染成提交按钮
*/
const query1Props = {
  url: list1Props.url,
  listName: list1Props.name,
  btns: {
    formatValues(values) {
      if (values.dates) {
        values.from = formatDate(values.dates[0]); //改成别名
        values.to = formatDate(values.dates[1]);
      }
      return values;
    }
  },
  controls: [
    [
      {
        name: "name",
        control: <Input placeholder="专辑名称" style={{ width: 200 }}></Input>
      },
      {
        name: "mobile",
        control: <Input placeholder="手机号" style={{ width: 200 }}></Input>
      },
      { name: "dates", control: <RangePicker /> }
    ],
    [
      {
        name: "state",
        control: (
          <Select name="state" style={{ width: 200 }}>
            <Option value="0">状态</Option>
            <Option value="1">永久禁用</Option>
            <Option value="2">正常</Option>
            <Option value="3">警告</Option>
          </Select>
        ),
        params: { initialValue: "0" }
      },
      "search" //查询按钮占位符
    ]
  ],
  callback: (response) => {
    dispatch({
      type: "templateList/callback",
      payload: response
    });
    dispatch({
      type: "templateList/callbackSuccess"
    });
  }
};
```
![query1](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/11.png)
```javascript
/**
 * 表单形式的过滤条件
 * 每个组件占一行，并且不需要 search 占位符
*/
const query2Props = {
  url: list2Props.url,
  listName: list2Props.name,
  type: "form",
  controls: [
    {
      label: "专辑",
      name: "name",
      control: <Input style={{ width: 200 }}></Input>
    },
    {
      label: "手机",
      name: "mobile",
      control: <Input style={{ width: 200 }}></Input>
    },
    {
      label: "状态",
      name: "state",
      control: (
        <Select name="state" style={{ width: 200 }}>
          <Option value="0">全部</Option>
          <Option value="1">永久禁用</Option>
          <Option value="2">正常</Option>
          <Option value="3">警告</Option>
        </Select>
      ),
      params: { initialValue: "0" }
    }
  ]
};
```
![query2](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/12.png)

#### 10）Batch.js
&emsp;&emsp;批处理操作，可固定顶部。
* listName：关联的列表名称
* initControl：控件初始化函数，参数为 selectedItems，其属性包括：
* selectedRowKeys:[] 由id组成的数组
* selectedRows:[] 由记录组成的数组
  * affix：固定位置，参考[Affix组件](https://3x.ant.design/components/affix-cn/)。
```javascript
const batch1Props = {
  listName: list1Props.name,
  initControl: (selectedItem) => (
    <>
      <span>已选择条{selectedItem.length}记录</span>
      <Button
        icon="check"
        style={{ marginLeft: 10 }}
        onClick={() => revoke(selectedItem, list1Props)}
      >
        撤销
      </Button>
      <Button icon="close" style={{ marginLeft: 10 }} type="danger">
        禁用
      </Button>
    </>
  ),
  affix: {
    offsetTop: 0
  }
};
```
![batch](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/13.png)

### 11）List.js
&emsp;&emsp;包含三种列表，普通、拖拽和照片，依托[Table组件](https://3x.ant.design/components/table-cn/)和[SortTable组件](https://github.com/clauderic/react-sortable-hoc)。参数：
* url：列表的请求地址
* name：列表名称
* columns：Table组件的[列信息](https://3x.ant.design/components/table-cn/#Column)
* rowKey：表格行key的取值
* scroll：表格滚动的[配置项](https://3x.ant.design/components/table-cn/#scroll)
* rowSelection：表格的[选择配置](https://3x.ant.design/components/table-cn/#rowSelection)
* page：[分页配置](https://3x.ant.design/components/pagination-cn/#API)
* type：列表类型，包括普通列表、拖拽列表（drag）和图像列表（photo）
* options：组件的其他自定义参数，例如 onChange()、urlPropName、footer等

&emsp;&emsp;示例中的 breakWord()函数用于文本的字段换行，存在于 tools.js 中。
```javascript
const list1Props = {
  url: "template/query",
  name: "list1",
  columns: [
    setColumn("id", "id"),
    setColumn("专辑", "name"),
    setColumn("价格", "price"),
    setColumn("状态", "status", { render: (text) => tags[text] }),
    setColumn("注册日期", "date", { render: (prop) => formatDate(prop) }),
    setColumn("登录日期", "udate", { render: (prop) => formatDate(prop) }),
    setColumn("个人主页", "url", { width: "30%", render: breakWord }),
    setColumn("操作", "id", {
      key: "operate",
      fixed: "right",
      render: (id, record) => {
        return (
          <div>
            {
              <Popover
                placement="left"
                title="详细信息"
                content={showDetail(record)}
              >
                <a>更多</a>
                <Divider type="vertical" />
              </Popover>
            }
            {
              <span>
                <a onClick={() => edit(record)}>编辑</a>
                <Divider type="vertical" />
              </span>
            }
            {
              <span>
                <Popconfirm title="确定要删除吗" onConfirm={() => del(id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            }
          </div>
        );
      }
    })
  ],
  rowSelection: {
    onChange(selectedRowKeys, selectedRows) {
      dispatch({
        type: "template/selected",
        payload: {
          params: {
            selectedRowKeys,
            selectedRows
          },
          listName: list1Props.name
        }
      });
    }
  },
  scroll: { x: true }
};
```
![list](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/14.png)

#### 12）CsvUpload.js
&emsp;&emsp;CSV导入组件，增加了预览和删除，依托[PapaParse组件](https://www.papaparse.com/)。参数：
* name：控件名称
* prompt：提示说明
* onComplete：导入成功后的回调
* params：getFieldDecorator()的参数
* form：关联的表单

<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/15.png" width="300"/>
</p>

#### 13）FileUpload.js
&emsp;&emsp;文件上传组件，可上传多个，依托 Upload组件。参数：
* name：组件名称
* params：getFieldDecorator()的参数
* dir：保存的目录，默认是file
* count：可上传的文件数量
* fileUrl：静态资源的域名，会与得到的文件地址拼接，默认是shin-server
* action：上传地址，默认是shin-server的地址
* form：关联的表单

<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/16.png" width="600"/>
</p>

#### 14）PhotoUpload.js
&emsp;&emsp;图像上传组件，可上传多个。参数：
* name：组件名称
* params：getFieldDecorator()的参数
* dir：保存的目录，默认是img
* count：可上传的图像数量
* fileUrl：静态资源的域名，会与得到的图像地址拼接，默认是shin-server
* action：上传地址，默认是shin-server的地址
* form：关联的表单

<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/17.png" width="600"/>
</p>

#### models/template.js
&emsp;&emsp;在 effects 主要有：
* query：查询
* export：Excel导出
* handle：处理数据，增删改

&emsp;&emsp;reducers 中有多个对外：
* selected：列表中的选择
* setRecordInModal：显示模态窗口，并初始化控件
* showCreate：显示模态窗口

&emsp;&emsp;上述 action 也在 utils/constants.js 做了常量声明，实际使用时可直接调用它们。
```javascript
export const TEMPLATE_MODEL = {
  HANDLE: "template/handle",
  MODAL: "template/setRecordInModal",
  QUERY: "template/query",
  SELECTED: "template/selected",
  CREATE: "template/showCreate",
}
```
&emsp;&emsp;实践中发现 services 层比较冗余，因此改造了 utils/request.js，新增：
* redirect：跳转
* get：GET请求
* post：POST请求

&emsp;&emsp;请求地址统一声明到 api 目录中，预定义了 index.js，将来可做自行扩展。