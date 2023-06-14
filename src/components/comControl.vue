
<script>
import { deepClone, clearObject } from '../commons/utils'
// import { config } from '@/axios/config'

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
  return queryItem(options)
}

const baseFormItemBuild = (that, h, vModelOption, children, splitOption) => {
  let result
  let localSplitOption = splitOption ? deepClone(splitOption) : undefined
  if (vModelOption.isInCol) {
    result = (children && children.length === 1) ? children[0] : children
  } else {
    let thatProp = vModelOption.model.prop
    localSplitOption.attrs || (localSplitOption.attrs = {})
    localSplitOption.attrs.style = (localSplitOption.attrs.style || '') + ';width:' + that.propLabelMap[thatProp].width + 'px;'
    let boxOptions = { props: { label: vModelOption.label }, attrs: { size: 'mini' } }
    // 必填规则指定
    if (that.rules && that.rules.hasOwnProperty(thatProp)) {
      boxOptions.props.prop = thatProp
    }
    // 填充显示/隐藏控制，相当于v-show
    if (that.bindVisibles.hasOwnProperty(thatProp)) {
      let baseBox = boxOptions
      if (localSplitOption) baseBox = localSplitOption
      baseBox.directives = [{
        name: 'show',
        value: that.bindVisibles[thatProp]
      }]
    }
    result = h('el-form-item', boxOptions, children)
  }
  if (localSplitOption) {
    result = h('div', localSplitOption, [result])
  }
  return result
}
/**
 * 默认组件构建器
 */
const defaultBuild = (that, h, vModelOption) => {
  let options = {}
  if (vModelOption.options) options = deepClone(vModelOption.options)
  let thatProp = vModelOption.model.prop
  if (thatProp) {
    // 表单组件
    options.props || (options.props = {})
    options.props.value = that.form[thatProp]
    options.props.disabled = that.propLabelMap[thatProp].readonly()
    options.attrs || (options.attrs = {})
    options.attrs.placeholder = vModelOption.placeholder
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
      if (vModelOption.onChange) {
        if (typeof vModelOption.onChange === 'string') {
          that.controls.$parent[vModelOption.onChange](changeData)
        } else {
          console.error('onchange 目前只能指定methods中的函数名称，不支持其他类型数据！')
        }
      }
    }
  } else {
    // 其他展示组件
    let bindText = vModelOption.model.bindText
    options.domProps || (options.domProps = {})
    if (typeof bindText === 'function') {
      options.domProps.innerText = bindText.call(that, vModelOption)
    } else if (typeof bindText === 'object') {
      if (bindText.data) {
        let value = that.controls.$parent
        bindText.data.split('.').map(key => {
          if (key) {
            value = value[key]
          }
        })
        options.domProps.innerText = value
      }
    } else {
      options.domProps.innerText = bindText
    }
  }
  return h(vModelOption.module, options)
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
    // if (childrenModels.length === 1) {
    //   that.form[thatProp] = optionDatas[0].value
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
  options.props.disabled = that.propLabelMap[thatProp].readonly()

  options.on || (options.on = {})
  options.on.input = ($value) => {
    that.form[thatProp] = $value
  }
  options.attrs || (options.attrs = {})
  options.attrs.placeholder = vModelOption.placeholder
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
        that.controls.$parent[vModelOption.onChange](changeData)
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
  options.props.disabled = that.propLabelMap[thatProp].readonly()
  options.props.options = optionsData

  options.attrs || (options.attrs = {})
  options.attrs.placeholder = vModelOption.placeholder
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
        that.controls.$parent[vModelOption.onChange](changeData)
      } else {
        console.error('onchange 目前只能指定methods中的函数名称，不支持其他类型数据！')
      }
    }
  }

  return h(vModelOption.module, options)
}

/**
 * 面板构建器
 */
const cardBuild = (that, h, vModelOption, children) => {
  let options = (vModelOption.options && deepClone(vModelOption.options)) || {}
  options.attrs || (options.attrs = {})
  options.attrs.class = (options.attrs.class || '') + ' box-card'
  let width = 0
  Object.values(that.propLabelMap).map(item => {
    // 根据label字数设置宽度
    width += (item.label.length * 16) + 25 + 151
  })
  options.attrs.style = 'width:' + width + 'px'
  console.log(children)
  return h('div', { attrs: { style: 'width:100%; overflow-x: auto;overflow-y: hidden;' } }, [h('el-card', options, children)])
}

export default {
  data() {
    let formProps = {}
    let propLabelMap = {}
    let uploadDatas = {}
    let bindVisibles = {}
    let uploadBindProps = {}
    let rules = this.formRules ? deepClone(this.formRules) : {}
    let dyWatch = {
      bindTexts: {}
    }
    let that = this
    // 写入表单属性
    function writeFormProp(controls) {
      for (let i = 0; i < controls.length; i++) {
        let item = controls[i]
        // 判断有没有子级数据
        if (item.children && item.children.length > 0) {
          writeFormProp(item.children)
        }
        // if (item.bindText) {
        //   watchComputed.bindTexts[item.bindText] = {
        //     value: '',
        //     watch() {
        //       debugger
        //     }
        //   }
        // }
        // 判断有没有模型数据存在
        if (item.model) {
          // 添加prop与label的map映射
          propLabelMap[item.model.prop] = {
            label: item.label,
            get width() { return (this.label.length * 16) + 25 + 151 },
            propType: item.model.type,
            module: item.module,
            rawOption: item,
            readonly: function () {
              return (that.readonly || this.rawOption.model.readonly || (that.isUpdate && this.rawOption.model.updateOption && this.rawOption.model.updateOption.readonly))
            }
          }
          // 追加简单规则，复杂规则可以自行定义，此处会跳过
          if (item.model.required && !rules[item.model.prop]) {
            rules[item.model.prop] = [{ required: true, message: item.label + '为必填项，请' + (item.module === 'el-input' ? '输入' : '选择') + '！', trigger: 'blur' }]
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
          switch (item.model.type) {
            case Number:
              formProps[item.model.prop] = null
              break
            case Array:
              formProps[item.model.prop] = []
              break
            case Object:
              formProps[item.model.prop] = {}
              break
            default:
              formProps[item.model.prop] = ''
              break
          }
        }
      }
    }
    writeFormProp(this.controls.formControls)
    return {
      form: formProps,
      rules: rules,
      propLabelMap: propLabelMap,
      uploadDatas: uploadDatas,
      uploadBindProps: uploadBindProps,
      bindVisibles: bindVisibles,
      baseUrl: '/', // config.baseUrl()
      // 存储需要bind的computed
      dyWatch: dyWatch
    }
  },
  watch: {
    formDefaultData(newVal) {
      for (let key in newVal) {
        this.form[key] = newVal[key]
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
    hiddenCreate: {
      type: Boolean,
      default: false
    },
    hiddenExport: {
      type: Boolean,
      default: false
    },
    hiddenManual: {
      type: Boolean,
      default: false
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
    },
    /* 查询 */
    onSearch: {
      type: Function,
      default: () => null
    },
    /* 添加 */
    onAdd: {
      type: Function,
      default: null
    },
    /* 导出 */
    onExportExcel: {
      type: Function,
      default: null
    },
    /* 手工录入 */
    onManual: {
      type: Function,
      default: () => null
    }
  },
  render(h) {
    let that = this
    let elForm = h('el-main', [h('el-form', { props: { model: that.form }, ref: 'mainForm', attrs: { size: 'mini' } }, that.loadChild(that.controls.formControls, h))])
    /* 新增一个导出功能的按钮 */
    let btn = h('el-aside', { attrs: { width: '132' } },
      [
        h('el-button', { attrs: { type: 'primary', size: 'mini' }, on: { click() { that.validate(that.onSearch) } } }, '查询'),
        !that.hiddenCreate ? h('el-button', { attrs: { type: 'success', size: 'mini' }, on: { click: that.onAdd } }, '新增') : undefined,
        that.hiddenManual ? h('el-button', { attrs: { type: 'info', size: 'mini' }, on: { click: that.onManual } }, '手工录入') : undefined,
        that.hiddenExport ? h('el-button', { attrs: { type: 'warning', size: 'mini' }, on: { click: that.onExportExcel } }, '导出') : undefined
      ])
    let vm = h('div', { attrs: { class: 'search-box' } }, [h('el-container', [elForm, btn])])
    return vm
  },
  methods: {
    _getFormClass(that) {
      return { attrs: { class: 'search-item-box' } }
    },
    loadChild(controls, h, callOption) {
      let result = []
      let that = this
      callOption || (callOption = {})
      for (let i = 0; i < controls.length; i++) {
        let control = controls[i]
        let children = []
        if (control.children && control.children.length > 0) {
          // 多列表单
          let baseAppendOptions
          if (control.module === 'el-card' && control.splitColumn) {
            baseAppendOptions = that._getFormClass(that)
          } else {
            if (control.children && control.children.length > 0) {
              let childCount = control.children.length
              baseAppendOptions = { props: { span: Math.ceil(24 / childCount) } }
            } else {
              baseAppendOptions = undefined
            }
          }
          children = that.loadChild(control.children, h, { parent: control, appendOptions: baseAppendOptions })
        }
        let ins = null
        let propVNode = null
        let isHiddenElUploadBind = () => that.readonly && that.uploadBindProps[control.model.prop]
        switch (control.module) {
          case 'el-card':
            if (control.splitColumn) {
              children.push(h('div', { attrs: { style: 'clear:both' } }))
            }
            ins = cardBuild(that, h, control, children)
            break
          case 'el-select':
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = selectBuild(that, h, control)
              children.push(propVNode)
              ins = baseFormItemBuild(that, h, control, children, callOption.appendOptions)
            }
            break
          case 'el-cascader':
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = cascaderBuild(that, h, control)
              children.push(propVNode)
              ins = baseFormItemBuild(that, h, control, children, callOption.appendOptions)
            }
            break
          default:
            if (isHiddenElUploadBind()) {
            } else {
              propVNode = defaultBuild(that, h, control)
              children.push(propVNode)
              ins = baseFormItemBuild(that, h, control, children, callOption.appendOptions)
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
      if (callOption.parent) {
        return [h('div', {}, result)]
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
            for (let k2 in item1.rawData) {
              let fileData = item1.rawData[k2]
              let bindDatas = {}
              for (let k in fileData.bindDatas) {
                bindDatas[k] = fileData.bindDatas[k].value
              }
              Object.values(fileData.bindDatas).map(item => item.value)
              let listAtta = item1.completed(fileData.response, fileData.file, bindDatas)
              resForm[item1.prop].push(deepClone(listAtta))
            }
          }
          success(resForm)
        } else {
          error && error()
        }
      })
    },
    resetForm() {
      this.$refs['mainForm'].resetFields()
    },
    clearFormData(props) {
      let that = this
      if (props) {
        // if(this.propLabelMap[prop].propType === )
        props.map(prop => {
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
    },
    setVisible(options) {
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        let that = this
        for (let key in options) {
          if (that.bindVisibles.hasOwnProperty(key)) {
            that.bindVisibles[key] = options[key]
          }
        }
      }
    },
    setReadonly(options) {
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        let that = this
        for (let key in options) {
          if (that.propLabelMap.hasOwnProperty(key)) {
            that.propLabelMap[key] = options[key]
          }
        }
      }
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

<style>
div.search-box {
  /* margin-bottom: 20px; */
  margin-bottom: 5px;
}
div.search-box .el-aside {
  background-color: #fff;
  line-height: 0;
}
div.search-box .el-main {
  padding: 0;
  margin-right: 5px;
}
div.search-box .el-card__body {
  padding: 0;
}
div.search-box .el-form-item {
  margin-bottom: 0;
  /* background: rgb(206, 27, 182); */
}
div.search-box .el-input {
  width: 150px;
}
div.search-box .el-form-item__label {
  padding-left: 10px;
}
.search-item-box {
  float: left;
}
</style>
