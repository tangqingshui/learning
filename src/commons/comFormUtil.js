export const defaultForm = function (options) {
  if (this === undefined) {
    console.warn('由于新增需求，请使用call的方式调用defaultForm ，以免相关功能不能正常响应！')
  }
  // 构建子模块数据
  let buildChildren = (children, isInCol) => children.map((child) => {
    // 声明一个子模块属性对象，子模块存在这个属性则添加进去
    let model = child.model || {}
    // 属性对应的数据类型
    child.propType !== undefined && (model.type = child.propType)
    // 表单绑定的参数名称
    child.prop !== undefined && (model.prop = child.prop)
    // 上传控件使用，上传地址
    child.action !== undefined && (model.action = child.action)
    // 该表单是否必填
    child.required !== undefined && (model.required = child.required)
    // 固定readonly
    child.readonly !== undefined && (model.readonly = child.readonly)
    // visible
    child.visible !== undefined && (model.visible = child.visible)
    // 显示清空按钮
    child.clearable !== undefined && (model.clearable = child.clearable)
    // 表单最大字符数
    child.maxlength !== undefined && (model.maxlength = child.maxlength)
    // update表单时的一些控制项，如修改时某输入框为readonly，则: updateOption: {readonly: true}
    child.updateOption !== undefined && (model.updateOption = child.updateOption)
    // 占一整列
    child.fullCol !== undefined && (model.fullCol = child.fullCol)
    // 自定义col的span属性
    child.cusSpan !== undefined && (model.cusSpan = child.cusSpan)
    // 用于非表单组件，填充innerText
    child.bindText !== undefined && (model.bindParentData = child.bindText)
    // 值为0时，是否显示
    child.showZero !== undefined && (model.showZero = child.showZero)
    // model.bindVisible：绑定需要显示隐藏对应的表单
    let result = {
      // 表单主要属性对象
      model: model,
      // 是否是在一个col内的，如果为true，则该子组件不适用col包装
      isInCol: isInCol === undefined ? false : isInCol
    }
    // 唯一标识当前组件
    child.name !== undefined && (result.key = child.name)
    if (!result.key && child.prop) result.key = child.prop

    // 是否是在一个col内的，如果为true，则该子组件不适用col包装
    result.isInCol = isInCol === undefined ? false : isInCol
    // 表单前显示的label
    child.label !== undefined && (result.label = child.label)
    // 生成什么类型的表单
    child.module !== undefined && (result.module = child.module)
    // 有子集的组件数据源
    child.itemsType !== undefined && (result.itemsType = child.itemsType)
    // 提示
    child.placeholder !== undefined && (result.placeholder = child.placeholder)
    // change事件
    child.onChange !== undefined && (result.onChange = child.onChange)
    // click事件
    child.onClick !== undefined && (result.onClick = child.onClick)
    // change调用时改变value之前的事件，返回true则改变value，否则不改变
    child.onBeforeChange !== undefined && (result.onBeforeChange = child.onBeforeChange)
    // 全局options对象，对应createElement中的对象
    child.options !== undefined && (result.options = child.options)
    // 是否存在
    child.children !== undefined && (result.children = buildChildren(child.children, true))
    // slot
    child['v-slot'] !== undefined && (result['v-slot'] = child['v-slot'])
    // 孙级及以上子集是否进行col拆分
    child.splitColumn !== undefined && (result.splitColumn = child.splitColumn)
    return result
  })

  return {
    $parent: this,
    formControls: options.map((option) => {
      let model = option.model || {}
      option.visible !== undefined && (model.visible = option.visible)
      return {
        module: 'el-card',
        label: option.label,
        key: option.key || option.name,
        splitColumn: option.splitColumn,
        options: {
          attrs: { class: 'box-card' }
        },
        model,
        children: buildChildren(option.children)
      }
    })
  }
}