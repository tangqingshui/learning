
<script>
import { deepClone, clearObject } from '../commons/utils'
import Vue from 'vue'
// 增加自定义组件的声明，则可以在配置文件中使用该子组件
const formComponents = {}

const getSomeSelectOption = (options, values) => {
  let value = values
  if (Array.isArray(values)) {
    value = values[values.length - 1]
  }
  let queryItem = list => {
    for (let k in list) {
      if (value === list[k].value) {
        return list[k]
      }
      if (list[k].children) {
        let item = queryItem(list[k].children)
        if (item) {
          return item
        }
      }
    }
    return null
  }
  console.log(queryItem(options))
  return queryItem(options)
}
const buildElCol = (h, vModelOption, localSplitOption, VNode) => {
  if (vModelOption.isInCol && vModelOption.$index !== 0) {
    localSplitOption.style || (localSplitOption.style = {})
    if (typeof localSplitOption.style === 'string') {
      localSplitOption.style += ';padding-left:10px'
    } else {
      localSplitOption.style.paddingLeft = '10px'
    }
  }
  if (localSplitOption && localSplitOption.splitColumn !== false) {
    // result = h('el-col', localSplitOption, [result])
    if (vModelOption.model && vModelOption.model.fullCol) {
      localSplitOption.props.span = 24
    }
    if (vModelOption.model && vModelOption.model.cusSpan) {
      localSplitOption.props.span = vModelOption.model.cusSpan
    }
    VNode = h('el-col', localSplitOption, [VNode])
  }
  return VNode
}
const baseFormItemBuild = (that, h, vModelOption, children, splitOption) => {
  let result
  let localSplitOption = splitOption ? deepClone(splitOption) : undefined
  if (vModelOption.isInCol) {
    result = (children && children.length === 1) ? children[0] : children
  } else {
    let thatProp = vModelOption.model.prop
    let boxOptions = { props: {}, attrs: { size: 'mini' } }
    if (typeof vModelOption.label === 'string') {
      boxOptions.props.label = vModelOption.label
    } else if (typeof vModelOption.label === 'object') {
      if (vModelOption.label.slot) {
        let childVNode = Vue.extend({ template: vModelOption.label.html })
        children.push(h(childVNode, { slot: 'label' }))
      }
    }
    // 必填规则指定
    if ((thatProp && that.rules && that.rules.hasOwnProperty(thatProp)) || (typeof vModelOption.model.required === 'string' && vModelOption.model.required)) {
      boxOptions.props.prop = thatProp || vModelOption.model.required
    }
    // 填充显示/隐藏控制，相当于v-show
    // bindVisibles 已经被是否渲染给拦截了，此处不生效
    if (that.bindVisibles.hasOwnProperty(vModelOption.key) && !that.bindVisibles[vModelOption.key]) {
      let baseBox = boxOptions
      if (localSplitOption) baseBox = localSplitOption
      baseBox.directives = [{
        name: 'show',
        value: that.bindVisibles[vModelOption.key]
      }]
    }
    if (vModelOption.label) result = h('el-form-item', boxOptions, children)
    else result = h('div', {}, children)
  }
  return buildElCol(h, vModelOption, localSplitOption, result)
}
/**
 * 默认组件构建器
 */
const defaultBuild = (that, h, vModelOption, children) => {
  let options = {}
  if (vModelOption.options) options = deepClone(vModelOption.options)
  let getParentValue = ($parent, keys) => {
    let item = $parent
    keys.split('.').forEach(key => key && (item = item[key]))
    return item
  }
  let setParentValue = ($parent, keys, value) => {
    let item = $parent
    let _parentItem
    let _key
    keys.split('.').forEach(key => {
      if (key) {
        _key = key
        _parentItem = item
        item = item[key]
      }
    })
    _parentItem[_key] = value
  }
  let parentData = vModelOption.model.bindParentData
  let reWriteVal = null
  // 强制绑定父组件的相关数据
  if (parentData) {
    let text = ''
    if (typeof parentData === 'function') {
      text = parentData.call(that, vModelOption)
    } else if (typeof parentData === 'object') {
      if (parentData.data) {
        text = getParentValue(that.controls.$parent, parentData.data)
        reWriteVal = val => {
          setParentValue(that.controls.$parent, parentData.data, val)
        }
      }
    } else {
      text = parentData
    }
    switch (vModelOption.module) {
      case 'input':
      case 'el-input':
      case 'el-input-number':
      case 'el-switch':
      case 'el-radio':
      case 'el-checkbox':
      case 'el-date-picker':
      case 'el-time-picker':
        options.props || (options.props = { value: text })
        options.props.value = text
        break
      default:
        options.domProps || (options.domProps = {})
        options.domProps.innerText = text
        break
    }
  }
  // 单击事件
  if (vModelOption.onClick) {
    options.on || (options.on = {})
    options.on.click = () => {
      if (typeof vModelOption.onClick === 'string' && that.controls.$parent.hasOwnProperty(vModelOption.onClick)) {
        that.controls.$parent[vModelOption.onClick]({ key: vModelOption.key })
      } else {
        console.error('onClick 目前只能指定methods中的函数名称，不支持其他类型数据！')
      }
    }
  }

  let thatProp = vModelOption.model.prop
  if (thatProp) {
    // 表单组件
    // options: { attrs: { 'clearable': true, 'show-word-limit': true, 'maxlength': 8 } }

    options.props || (options.props = {})
    options.props.value = that.form[thatProp]
    options.attrs || (options.attrs = {})
    if (that.propLabelMap[thatProp].readonly()) {
      options.attrs.placeholder = ''
      options.props.disabled = true
    } else {
      options.attrs.placeholder = vModelOption.placeholder
    }
    if (vModelOption.model.clearable !== false) {
      options.attrs.clearable = true
    }
    if (vModelOption.model.maxlength) {
      options.attrs.maxlength = vModelOption.model.maxlength
      options.attrs['show-word-limit'] = true
    }

    options.on || (options.on = {})
    options.on.input = ($value) => {
      let changeData = { key: thatProp, value: $value }
      if (vModelOption.onBeforeChange && !that.controls.$parent[vModelOption.onBeforeChange](changeData)) {
        return
      }
      that.form[thatProp] = $value
      reWriteVal && reWriteVal($value)
      if (vModelOption.onChange) {
        if (typeof vModelOption.onChange === 'string') {
          that.controls.$parent[vModelOption.onChange] && that.controls.$parent[vModelOption.onChange](changeData)
        } else {
          console.error('onchange 目前只能指定methods中的函数名称，不支持其他类型数据！')
        }
      }
    }
  }
  return h(vModelOption.module, options, children)
}
/**
 * 下拉框构建器
 */
const selectBuild = (that, h, vModelOption) => {
  let childrenModels = []
  let thatProp = vModelOption.model.prop
  let optionsData = []
  if (that.listOptions && that.listOptions.hasOwnProperty(vModelOption.itemsType)) {
    optionsData = that.listOptions[vModelOption.itemsType]
    childrenModels = optionsData.map((option) =>
      h('el-option', { props: { label: option.label, value: option.value } })
    )
    // 下拉框只有一个值时，默认选中
    // if (!that.isUpdate && childrenModels.length === 1 && !that.form[thatProp]) {
    //   that.form[thatProp] = optionsData[0].value
    // }
  }
  // 没有下拉选项时，清空之前的选中值
  // if (childrenModels.length === 0) {
  //   that.form[thatProp] = null
  // }
  let options = {}
  if (vModelOption.options) options = deepClone(vModelOption.options)
  options.props || (options.props = {})
  options.props.value = that.form[thatProp]

  options.on || (options.on = {})
  options.on.input = ($value) => {
    that.form[thatProp] = $value
  }
  options.attrs || (options.attrs = {})
  if (that.propLabelMap[thatProp].readonly()) {
    options.props.disabled = true
    options.attrs.placeholder = ''
  } else {
    options.attrs.placeholder = vModelOption.placeholder
  }
  if (vModelOption.model.clearable !== false) {
    options.attrs.clearable = true
  }
  if (vModelOption.model.maxlength) {
    options.attrs.maxlength = vModelOption.model.maxlength
    options.attrs['show-word-limit'] = true
  }

  if (vModelOption.onChange) {
    options.on.change = () => {
      // change事件回到
      let changeData = { key: thatProp, value: that.form[thatProp], get option() { return getSomeSelectOption(optionsData, that.form[thatProp]) } }
      if (typeof vModelOption.onChange === 'string') {
        that.controls.$parent[vModelOption.onChange] && that.controls.$parent[vModelOption.onChange](changeData)
        // that.$emit(vModelOption.onChange, newVal)
      } else {
        console.error('onchange 目前只能指定methods中的函数名称，不支持其他类型数据！')
      }
    }
  }
  return h('el-select', options, childrenModels)
}

const cascaderBuild = (that, h, vModelOption) => {
  let options = {}
  if (vModelOption.options) options = deepClone(vModelOption.options)
  let thatProp = vModelOption.model.prop
  let optionsData = that.listOptions[vModelOption.itemsType]
  options.props || (options.props = {})
  options.props.value = that.form[thatProp]
  options.props.options = optionsData

  options.attrs || (options.attrs = {})
  if (that.propLabelMap[thatProp].readonly()) {
    options.props.disabled = true
    options.attrs.placeholder = vModelOption.placeholder
  } else {
    options.attrs.placeholder = ''
  }
  if (vModelOption.model.clearable !== false) {
    options.attrs.clearable = true
  }
  if (vModelOption.model.maxlength) {
    options.attrs.maxlength = vModelOption.model.maxlength
    options.attrs['show-word-limit'] = true
  }

  if (vModelOption.model.clearable !== false) {
    options.attrs.clearable = true
  }
  if (vModelOption.model.maxlength) {
    options.attrs.maxlength = vModelOption.model.maxlength
    options.attrs['show-word-limit'] = true
  }

  options.on || (options.on = {})
  options.on.input = ($value) => {
    that.form[thatProp] = $value
  }
  if (vModelOption.onChange) {
    options.on.change = () => {
      let changeData = { key: thatProp, value: that.form[thatProp], get option() { return getSomeSelectOption(optionsData, that.form[thatProp]) } }
      if (typeof vModelOption.onChange === 'string') {
        that.controls.$parent[vModelOption.onChange] && that.controls.$parent[vModelOption.onChange](changeData)
      } else {
        console.error('onchange 目前只能指定methods中的函数名称，不支持其他类型数据！')
      }
    }
  }

  return h(vModelOption.module, options)
}

/**
 * 上传组件构建器
 */
const uploadBuild = (that, h, vModelOption, children) => {
  let thatProp = vModelOption.model.prop
  that.uploadDatas[thatProp].completed = vModelOption.model.completed
  let bindData = vModelOption.model.bindProp || []
  let thatUploadDatas = that.uploadDatas[thatProp].rawData
  let uploadVNodes = []
  if (!that.readonly) {
    let options = (vModelOption.options && deepClone(vModelOption.options)) || {}
    options.attrs || (options.attrs = {})
    options.attrs.action = vModelOption.model.action || (that.baseUrl + 'api/Attachment/upload')
    options.attrs.class || (options.attrs.class = 'upload-demo')
    options.attrs.style = (options.attrs.style ? options.attrs.style : '') + ';padding:0 10px'
    options.attrs.multiple = true
    options.props || (options.props = {})
    options.props['show-file-list'] = false
    // options.props['file-list'] = that.uploadDatas[thatProp].defaultFileList // that.form[vModelOption.model.prop]
    // let rebuildList = () => {
    //   that.form[thatProp] = []
    //   for (let _key in thatUploadDatas) {
    //     let attaObj = thatUploadDatas[_key]
    //     let listAtta = uploadCompleted(attaObj.response, attaObj.file, attaObj.bindDatas)
    //     that.form[thatProp].push(deepClone(listAtta))
    //   }
    // }
    // 文件列表移除文件时的钩子
    if (!options.props.onRemove) {
      options.props.onRemove = () => { }
    }
    // 点击文件列表中已上传的文件时的钩子
    if (!options.props.onPreview) {
      options.props.onPreview = () => { }
    }
    // 文件超出个数限制时的钩子
    if (!options.props.onExceed) {
      options.props.onExceed = () => { }
    }
    // 文件上传成功时的钩子
    if (!options.props.onSuccess) {
      options.props.onSuccess = (res, file, files) => {
        if (res.flag) {
          let objAtta = thatUploadDatas[file.uid]
          let uploadHandle = that.uploadDatas[thatProp]
          objAtta.response = res.data
          objAtta.file = file

          // 转换为待提交的数据格式
          let rawData = that.uploadDatas[thatProp].rawData

          let bindDatas = {}
          let fileTabRow = { uid: file.uid, oldName: file.name, isdelete: false }
          for (let k in objAtta.bindDatas) {
            bindDatas[k] = objAtta.bindDatas[k].value
            fileTabRow[k + 'Name'] = objAtta.bindDatas[k].label
          }
          let postData = that.uploadDatas[thatProp].completed(rawData[file.uid].response, rawData[file.uid].file, bindDatas)
          fileTabRow.url = postData.url
          fileTabRow.postData = postData
          fileTabRow.createTime = postData.createTime
          uploadHandle.appendFileList.push(fileTabRow)
        } else {
          that.$Msg(res.msg, 'error')
          delete thatUploadDatas[file.uid]
        }
      }
    }
    // 文件上传失败时的钩子
    if (!options.props.onError) {
      options.props.onError = (res, file, files) => {
        that.$Msg(res.message, 'error')
        delete thatUploadDatas[file.uid]
      }
    }
    // 文件上传时的钩子
    if (!options.props.onProgress) {
      options.props.onProgress = () => { }
    }
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    if (!options.props.onChange) {
      options.props.onChange = () => { }
    }
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    if (!options.props.beforeUpload) {
      options.props.beforeUpload = (file) => {
        // this.propLabelMap[item.model.prop]
        let newObj = {}
        for (let i = 0; i < bindData.length; i++) {
          let dataValue = that.form[bindData[i]]
          if (dataValue === '' || dataValue === null || dataValue === undefined) {
            that.$Msg('请选择或输入：' + that.propLabelMap[bindData[i]].label, 'error')
            return false
          }
          newObj[bindData[i]] = { label: that.uploadBindProps[bindData[i]].getLabel(), value: dataValue }
        }
        thatUploadDatas[file.uid] = { file: file, bindDatas: newObj }
      }
    }
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    if (!options.props.beforeRemove) {
      options.props.beforeRemove = (file, fileList) => {
        if (thatUploadDatas.hasOwnProperty(file.uid)) {
          return that.$confirm(`确定移除 ${file.name}？`).then(() => {
            delete thatUploadDatas[file.uid]
          })
        } else {
          // that.uploadDatas[thatProp].defaultFileList
          let removeIndex = that.uploadDatas[thatProp].defaultFileList.findIndex(item => item.id === file.id)
          if (removeIndex !== -1) {
            that.uploadDatas[thatProp].defaultFileList.splice(removeIndex, 1)
          }
        }
      }
    }
    // <el-button size="small" type="primary">点击上传</el-button>
    children.push(h('el-button', { attrs: { size: 'mini', type: 'primary' }, domProps: { innerText: '点击上传' } }))
    // children.push(h('i', { attrs: { class: 'el-icon-upload' } }))
    // children.push(h('div', { attrs: { class: 'el-upload__text' } }, ['将文件拖到此处，或', h('em', '点击上传')]))
    // children.push(h('div', { attrs: { class: 'el-upload__tip' }, slot: 'tip' }, [vModelOption.label]))
    uploadVNodes.push(h('el-upload', options, children))
    // uploadVNodes.push(h('el-table-column', [h('el-upload', options, children)]))
  }
  that.uploadDatas[thatProp].defaultFileList.map(item => { if (!item.hasOwnProperty('isdelete')) { item.isdelete = false } })
  let tableData = that.uploadDatas[thatProp].defaultFileList.concat(that.uploadDatas[thatProp].appendFileList)
  tableData.map((item, index) => { item.index = index + 1 })

  let tableColumns = bindData.map(bindProp => h('el-table-column', { props: { prop: bindProp + 'Name', label: that.propLabelMap[bindProp].label } }))
  tableColumns.splice(0, 0, h('el-table-column', { props: { prop: 'index', label: '序号' } }))
  tableColumns.push(h('el-table-column', { props: { prop: 'oldName', label: '附件名称' } }))
  tableColumns.push(h('el-table-column', { props: { prop: 'createTime', label: '时间', formatter: (_, __, field) => that.$ToTimeString(field) } }))
  let oper = h('el-table-column', {
    props: { label: '操作', width: '120' },
    scopedSlots: {
      default: props => {
        let scope = props
        let downBtns = []
        // 构建预览/下载按钮
        if (/(\.png)|(\.jepg)|(\.jpg)|(\.gif)$/.test(scope.row.url.toLowerCase())) {
          let imgNode = h('el-image', {
            // that.baseUrl + 'Attachment/' + scope.row.url
            props: { src: 'static/none.png', 'preview-src-list': [that.baseUrl + 'Attachment/' + scope.row.url] },
            domProps: { style: 'width: 1px; height: 1px;' }
          })
          downBtns.push(h('el-link', {
            attrs: { style: 'margin-right:20px;' },
            domProps: { innerText: '预览' },
            on: {
              click() {
                imgNode.componentInstance.clickHandler()
              }
            }
          }))
          downBtns.push(imgNode)
        } else {
          downBtns.push(h('el-link', {
            attrs: { href: that.baseUrl + 'api/Attachment/' + scope.row.url, target: '_blank', style: 'margin-right:20px;' },
            domProps: { innerText: '下载' }
          }))
        }
        // 非readonly状态,构建删除按钮
        if (!that.readonly) {
          downBtns.push(h('el-link', {
            domProps: { innerText: scope.row.isdelete ? '恢复' : '删除' },
            on: {
              click: function () {
                // scope.row.isdelete = true
                that.$Confirm('确定要删除“' + scope.row.oldName + '”吗？', () => {
                  if (scope.row.id) {
                    let removeIndex = that.uploadDatas[thatProp].defaultFileList.findIndex(item => item.id === scope.row.id)
                    that.uploadDatas[thatProp].defaultFileList.splice(removeIndex, 1)
                  } else {
                    let removeIndex = that.uploadDatas[thatProp].appendFileList.findIndex(item => item.uid === scope.row.uid)
                    that.uploadDatas[thatProp].appendFileList.splice(removeIndex, 1)
                    delete thatUploadDatas[scope.row.uid]
                  }
                  that.$Msg('该附件已标记为删除，点击保存后才会生效。')
                }, () => { })
              }
            }
          }))
        }
        return downBtns
      }
    }
  })
  tableColumns.push(oper)
  // 预览全部，暂时隐藏
  // if (tableData.length === -1) {
  //   uploadVNodes.push(h('el-image', {
  //     props: {
  //       'preview-src-list': tableData.map(item => {
  //         let data
  //         if (item.uid) {
  //           let rawData = that.uploadDatas[thatProp].rawData
  //           data = that.uploadDatas[thatProp].completed(rawData[item.uid].response, rawData[item.uid].file, {})
  //         } else {
  //           data = item
  //         }
  //         return that.baseUrl + 'Attachment/' + data.url
  //       }),
  //       src: 'static/showimg.png'
  //     }
  //   }))
  // }
  let elTable = h('el-table', {
    props: { data: tableData },
    attrs: {
      size: 'mini',
      style: 'padding-top: 10px;',
      'row-style': ({ row }) => {
        if (row.isdelete) {
          return {
            'text-decoration': 'line-through'
          }
        }
      }
    }
  }, tableColumns)
  return [h('div', uploadVNodes), elTable]
  // return h('div', {}, uploadVNodes)
}
/**
 * 面板构建器
 */
const cardBuild = (that, h, vModelOption, children) => {
  debugger
  let options = (vModelOption.options && deepClone(vModelOption.options)) || {}
  options.attrs || (options.attrs = {})
  options.attrs.class = (options.attrs.class || '') + 'box-card form-box-card'
  children.push(h('div', { attrs: { class: 'clearfix' }, slot: 'header' }, [h('span', vModelOption.label)]))
  if (that.bindVisibles.hasOwnProperty(vModelOption.key)) {
    options.directives = [{
      name: 'show',
      value: that.bindVisibles[vModelOption.key]
    }]
  }

  return h('el-card', options, children)
}

const slotBuild = (that, h, vModelOption, children) => {
  if (vModelOption.hasOwnProperty('v-slot')) {
    return that.$slots[vModelOption['v-slot']]
  } else {
    console.error('自定义插槽没有对应的v-slot，请先在配置文件绑定。')
  }
}
export default {
  components: {
    ...formComponents
  },
  data() {
    let allControls = {}
    let formProps = {}
    let propLabelMap = {}
    let uploadDatas = {}
    let bindVisibles = {}
    let uploadBindProps = {}
    let rules = this.formRules ? deepClone(this.formRules) : {}
    let dyWatch = {
      bindTexts: {}
    }
    let formItemCount = 0
    let that = this
    function writeFormProp(controls) {
      for (let i = 0; i < controls.length; i++) {
        let item = controls[i]
        if (item.children && item.children.length > 0) {
          writeFormProp(item.children)
        }
        // if (item.bindText) {
        //   watchComputed.bindTexts[item.bindText] = {
        //     value: '',
        //     watch() {
        //     }
        //   }
        // }
        if (!item.model) {
          continue
        }
        formItemCount++
        if (item.key) {
          if (allControls.hasOwnProperty(item.key)) {
            console.warn('警告，表单中存在多个key为：' + item.key + '的控件，请确保唯一。')
          }
          allControls[item.key] = {
            rawItem: item
          }
        }
        if (item.model.prop) {
          // 添加prop与label的map
          propLabelMap[item.model.prop] = {
            label: item.label,
            propType: item.model.type,
            module: item.module,
            rawOption: item,
            readonly: function () {
              return (that.readonly || this.rawOption.model.readonly || (that.isUpdate && this.rawOption.model.updateOption && this.rawOption.model.updateOption.readonly))
            }
          }
          // 追加简单规则，复杂规则可以自行定义，此处会跳过
          if (item.model.required === true && !rules[item.model.prop]) {
            rules[item.model.prop] = [{ required: true, message: item.label + '为必填项，请' + (item.module === 'el-input' ? '输入' : '选择') + '！', trigger: 'blur' }]
          }
          let controlValue = ''
          if (that.formDefaultData.hasOwnProperty(item.model.prop)) {
            controlValue = that.formDefaultData[item.model.prop]
          }
          switch (item.model.type) {
            case Number:
              formProps[item.model.prop] = controlValue === 0 ? '' : controlValue
              break
            case Array:
              formProps[item.model.prop] = controlValue || []
              break
            case Object:
              formProps[item.model.prop] = controlValue || {}
              break
            default:
              formProps[item.model.prop] = controlValue
              break
          }
        }
        // 关联显示/隐藏的组件
        if (item.model.bindVisible) {
          // && item.model.bindVisible.length > 0
          if (Array.isArray(item.model.bindVisible)) {
            item.model.bindVisible.map(item => {
              if (typeof item === 'string') {
                bindVisibles[item] = true
              } else if (typeof item === 'object') {
                bindVisibles[item.key] = item.value
              } else if (typeof item === 'function') {
                let _ = item.call()
                bindVisibles[_.key] = _.value
              }
            })
          } else if (typeof item.model.bindVisible === 'object') {
            for (let key in item.model.bindVisible) {
              bindVisibles[key] = item.model.bindVisible[key]
            }
          }
        }
        if (item.key && item.model.visible !== undefined) {
          bindVisibles[item.key] = item.model.visible
        }
        // 是否有上传组件,上传数据单独存放
        if (item.module === 'el-upload') {
          // rawData {response, file, bindDatas}, completed, defaultLileList
          // 利用form表单中的对应prop更新的监听来更新defaultFileList
          uploadDatas[item.model.prop] = {
            rawData: {},
            defaultFileList: [],
            appendFileList: [],
            fileCount: function () { return this.defaultFileList.length + this.appendFileList.length },
            prop: item.model.prop,
            watch: function (thatObj, newVal) {
              newVal.map(file => { file.name = file.oldName || file.newName })
              thatObj.defaultFileList = newVal
            },
            isWatch: true
          }
          // 记录该上传组件所绑定的组件有哪些，便于统一隐藏，同时存储其vm，用于一些特殊操作
          item.model.bindProp && item.model.bindProp.map(prop => {
            uploadBindProps[prop] = {
              module: null,
              $VNode: null,
              $vm: function () { return this.$VNode.componentInstance },
              getLabel: function () {
                switch (this.module) {
                  case 'el-select':
                  case 'el-cascader':
                    return this.$vm().hoverOption.label
                  default:
                    return this.$vm().value
                }
              }
            }
          })
        }
      }
    }
    writeFormProp(this.controls.formControls)
    Object.keys(allControls).map(key => (!bindVisibles.hasOwnProperty(key) && (bindVisibles[key] = true)))
    return {
      form: formProps,
      rules: rules,
      propLabelMap: propLabelMap,
      uploadDatas: uploadDatas,
      uploadBindProps: uploadBindProps,
      bindVisibles: bindVisibles,
      baseUrl: '/',
      // 存储需要bind的computed
      dyWatch: dyWatch,
      formItemCount: formItemCount
    }
  },
  computed: {
    newFormRules() {
      return this.rules
      // let newRules = {}
      // for (let key in this.rules) {
      //   if (!this.bindVisibles.hasOwnProperty(key) || this.bindVisibles[key]) {
      //     newRules[key] = this.rules[key]
      //   }
      // }
      // return newRules
    }
  },
  watch: {
    formDefaultData(newVal) {
      for (let key in newVal) {
        let controlValue = newVal[key]
        if (this.propLabelMap.hasOwnProperty(key)) {
          let option = this.propLabelMap[key]
          if (controlValue === 0 && option.rawOption.model.showZero !== true) controlValue = ''
          switch (option.propType) {
            case Number:
              this.form[key] = controlValue
              break
            case Array:
              this.form[key] = controlValue || []
              break
            case Object:
              this.form[key] = controlValue || {}
              break
            default:
              this.form[key] = controlValue
              break
          }
        } else {
          this.form[key] = controlValue
        }
      }
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: () => false
    },
    isUpdate: {
      type: Boolean,
      default: () => false
    },
    /**
     * 所有下拉框选项集合，键与itemsType属性对应
     */
    listOptions: {
      type: Object,
      default: () => { }
    },
    formDefaultData: {},
    controls: {
      type: Object,
      default: () => { }
    },
    formRules: {
      type: Object,
      default: () => { }
    }
  },
  render(h) {
    let that = this
    let vm = h(
      'el-form',
      { props: { model: that.form, 'label-width': '160px', rules: that.newFormRules }, ref: 'mainForm', attrs: { class: 'com-form-box' } },
      that.loadChild(that.controls.formControls, h)
    )
    // 特殊处理，附件的回调渲染监听
    for (let key in that.uploadDatas) {
      let d = that.uploadDatas[key]
      vm.context.$watch('form.' + d.prop, function (newVal, oldVal) {
        d.watch(d, newVal, oldVal)
      })
    }
    // computed 动态监听处理处理
    let bindDyWatch = (obj, parentFullname) => {
      for (let key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          let fullname = parentFullname + '.' + key
          if (item.watch) {
            vm.context.$watch(fullname + '.value', function (newVal, oldVal) {
              item.watch(item, newVal, oldVal)
            })
          }
          bindDyWatch(item, fullname)
        }
      }
    }
    bindDyWatch(that.dyWatch, 'dyWatch')
    return vm
  },
  methods: {
    _getFormClass(that, columnCount) {
      let propCount = that.formItemCount
      if (typeof columnCount === 'number' && columnCount > 0) {
        return { props: { span: Math.ceil(24 / columnCount) } }
      } else {
        if (propCount === 1) {
          return { props: { span: 24 } }
        } else if (propCount < 9) {
          return { props: { span: 12 } }
        } else if (propCount < 19) {
          return { props: { span: 8 } }
        } else {
          return { props: { span: 6 } }
        }
      }
    },
    loadChild(controls, h, callOption) {
      let result = []
      let that = this
      callOption || (callOption = {})
      for (let i = 0; i < controls.length; i++) {
        let control = controls[i]
        control.$index = i
        if (that.isUpdate && control.model && control.model.updateOption && control.model.updateOption.visible === false) {
          continue
        }
        // visible==true 则不渲染
        if (that.bindVisibles.hasOwnProperty(control.key) && !that.bindVisibles[control.key]) {
          continue
        }
        let children = []
        if (control.children && control.children.length > 0) {
          // 多列表单
          let baseAppendOptions
          if (control.module === 'el-card' && (control.splitColumn !== undefined)) {
            baseAppendOptions = that._getFormClass(that, control.splitColumn)
          } else {
            let splitColumn = control.splitColumn || control.children.length
            baseAppendOptions = { props: { span: Math.ceil(24 / splitColumn) } }
            if (control.splitColumn === false || (control.splitColumn !== true && (callOption.appendOptions && callOption.appendOptions.splitColumn === false))) {
              baseAppendOptions.splitColumn = false
            }
          }
          children = that.loadChild(control.children, h, { parent: control, appendOptions: baseAppendOptions })
        }
        let ins = null
        let propVNode = null
        let isHiddenElUploadBind = () => that.readonly && that.uploadBindProps[control.model.prop]
        switch (control.module) {
          case 'el-card':
            if (control.splitColumn !== undefined) {
              children.push(h('div', { attrs: { style: 'clear:both' } }))
            }
            ins = cardBuild(that, h, control, children)
            break
          case 'el-upload':
            let insList = uploadBuild(that, h, control, children)
            result.push(buildElCol(h, control, callOption.appendOptions, insList[0]))
            result.push(buildElCol(h, {}, { props: { span: 24 } }, insList[1]))
            break
          case 'el-select':
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = selectBuild(that, h, control, children)
              ins = baseFormItemBuild(that, h, control, [propVNode], callOption.appendOptions)
            }
            break
          case 'el-cascader':
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = cascaderBuild(that, h, control, children)
              ins = baseFormItemBuild(that, h, control, [propVNode], callOption.appendOptions)
            }
            break
          case 'slot':
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = slotBuild(that, h, control, children)
              ins = baseFormItemBuild(that, h, control, [propVNode], callOption.appendOptions)
            }
            break
          default:
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = defaultBuild(that, h, control, children)
              ins = baseFormItemBuild(that, h, control, [propVNode], callOption.appendOptions)
            }
        }
        if (ins !== null) {
          result.push(ins)
          // 存储 el-upload 所绑定的组件vm，用于获取下拉框的文本，展示到列表
          if (propVNode != null && control.model && control.model.prop && that.uploadBindProps.hasOwnProperty(control.model.prop)) {
            that.uploadBindProps[control.model.prop].module = control.module
            that.uploadBindProps[control.model.prop].$VNode = propVNode
          }
        }
      }
      if (callOption.parent && callOption.parent.splitColumn !== false && (callOption.appendOptions && callOption.appendOptions.splitColumn !== false)) {
        let elRowOption = {}
        if (callOption.parent.gutter) {
          elRowOption.props = { gutter: callOption.parent.gutter }
        }
        return [h('el-row', elRowOption, result)]
      }
      return result
    },
    getFormData() {
      return this.form
    },
    validate(success, error) {
      let that = this
      this.$refs['mainForm'].validate((valid) => {
        if (valid) {
          let resForm = deepClone(that.form)
          // 处理数值类型，暂只处理一层
          for (let key in resForm) {
            if (that.propLabelMap.hasOwnProperty(key)) {
              let info = that.propLabelMap[key]
              switch (that.propLabelMap[key].propType) {
                case Number:
                  resForm[key] = (!resForm[key] || isNaN(resForm[key])) ? 0 : +resForm[key]
                  break
                case Date:
                  resForm[key] = that.$ToTimestamp(resForm[key])
                  break
              }
              if (info.module === 'el-select') {
                resForm[key] = (!resForm[key] || isNaN(resForm[key])) ? 0 : +resForm[key]
              }
            }
          }
          for (let k1 in that.uploadDatas) {
            let item1 = that.uploadDatas[k1]
            resForm[item1.prop] = []
            resForm['Old' + item1.prop] = item1.defaultFileList
            for (let k2 in item1.appendFileList) {
              resForm[item1.prop].push(deepClone(item1.appendFileList[k2].postData))
            }
            // for (let k2 in item1.rawData) {
            //   let fileData = item1.rawData[k2]
            //   let bindDatas = {}
            //   for (let k in fileData.bindDatas) {
            //     bindDatas[k] = fileData.bindDatas[k].value
            //   }
            //   // Object.values(fileData.bindDatas).map(item => item.value)
            //   let listAtta = item1.completed(fileData.response, fileData.file, bindDatas)
            //   resForm[item1.prop].push(deepClone(listAtta))
            // }
          }
          success(resForm)
        } else {
          error()
        }
      })
    },
    resetForm() {
      this.$refs['mainForm'].resetFields()
      return this
    },
    clearFormData(props) {
      let that = this
      if (props) {
        // if(this.propLabelMap[prop].propType === )
        props.forEach(prop => {
          that.form[prop] = null
        })
      } else {
        clearObject(that.form)
        for (let key in that.uploadDatas) {
          that.uploadDatas[key].rawData = {}
          that.uploadDatas[key].appendFileList = []
        }
        that.resetForm()
      }
      return this
    },
    setVisible(options) {
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        let that = this
        for (let key in options) {
          that.bindVisibles[key] = options[key]
        }
      }
      return this
    },
    setVisibleBak(options) {
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        let that = this
        let setChildrenVisible = (children, visibleKey, visibleValue, setOpen) => {
          if (children && Array.isArray(children) && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
              let item = children[i]
              if (setOpen) {
                if (item.key) {
                  that.bindVisibles[item.key] = visibleValue
                }
              } else {
                if (item.key === visibleKey) {
                  setChildrenVisible(item.children, visibleKey, visibleValue, true)
                  return
                }
                setChildrenVisible(item.children, visibleKey, visibleValue, false)
              }
            }
          }
        }
        for (let key in options) {
          that.bindVisibles[key] = options[key]
          setChildrenVisible(that.controls.formControls, key, options[key], false)
        }
      }
      return this
    },
    setReadonly(options) {
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        let that = this
        for (let key in options) {
          if (that.propLabelMap.hasOwnProperty(key)) {
            that.propLabelMap[key].rawOption.model.readonly = options[key]
          }
        }
      }
      return this
    },
    setFormValue(options) {
      let that = this
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        for (let key in options) {
          if (that.form.hasOwnProperty(key)) {
            that.form[key] = options[key]
          }
        }
      }
      return this
    },
    getFormValue(options) {
      let that = this
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        if (Array.isArray(options)) {
          let result = {}
          options.forEach(key => {
            if (that.form.hasOwnProperty(key)) {
              result[key] = that.form[key]
            }
          })
          return result
        } else {
          for (let key in options) {
            if (that.form.hasOwnProperty(key)) {
              options[key] = that.form[key]
            }
          }
          return options
        }
      } else {
        if (that.form.hasOwnProperty(options)) {
          return that.form[options]
        }
      }
      return this
    }
    // setComputedValue(options) {
    //   let that = this
    //   if (typeof options === 'object' && Object.keys(options).length > 0) {
    //     for (let key in options) {
    //       if (that.watchComputed.bindTexts.hasOwnProperty(key)) {
    //         that.watchComputed.bindTexts[key].value = options[key]
    //       }
    //     }
    //   }
    // }
  }
}
</script>
