export const formOptions = {
  controls: [
    {
      label: '基本信息',
      splitColumn: 3,
      children: [
        {
          // required: true,
          clearable: true,
          label: '所属项目',
          module: 'el-select',
          propType: Number,
          itemsType: 'projectList',
          prop: 'projectId',
          placeholder: '请选择所属项目',
          onChange: 'formSelectChange'
        },
        {
          updateOption: { readonly: true },
          clearable: true,
          // required: true,
          visible: false,
          label: '所属协议',
          module: 'el-select',
          propType: Number,
          itemsType: 'protocolInformationList',
          prop: 'parentId',
          placeholder: '请选择所属协议',
          onChange: 'formSelectChange'
          // model: { bindVisible: { areaId: false, idNumber: false, propertyRightPerson: false, phone: false, address: false, then: false } }
        },
        { // required: true,
          clearable: true, label: '所属片区', module: 'el-cascader', itemsType: 'areaList', propType: Number, prop: 'areaId', onChange: 'formSelectChange', placeholder: '请选择所属片区', model: { bindVisible: { then: false } } },
        { // required: true,
          clearable: true, maxlength: 8, label: '产权人', module: 'el-input', propType: String, prop: 'propertyRightPerson', placeholder: '请输入产权人' },
        { // required: true,
          clearable: true, maxlength: 18, label: '身份证号', module: 'el-input', propType: String, prop: 'idNumber', placeholder: '请输入身份证号' },
        { clearable: true, maxlength: 11, label: '电话', module: 'el-input', propType: String, prop: 'phone', placeholder: '请输入电话' },
        {
          // required: true,
          clearable: true,
          label: '征拆户类型',
          module: 'el-select',
          propType: Number,
          itemsType: 'typeList',
          prop: 'typeId',
          placeholder: '请选择所属征拆户类型',
          onChange: 'formSelectChange'
        },
        {
          label: '合同号',
          fullCol: true,
          splitColumn: false,
          module: 'div',
          // beforeContractNo:前 theContractNo:合同号    afterContractNumber:年份      contractNoMiddle:中
          children: [
            { module: 'span', bindText: { data: 'beforeContractNo' }, options: { attrs: { style: 'text-align:right;float:left;' } } },
            {
              module: 'div',
              options: { attrs: { style: 'width:200px;float:left;' } },
              splitColumn: true,
              children: [
                { cusSpan: 11, required: true, label: '年份', module: 'el-input', propType: String, prop: 'afterContractNumber', placeholder: '年份', clearable: false, maxlength: 4 },
                { cusSpan: 2, module: 'span', bindText: '-' },
                { cusSpan: 11, required: true, label: '编号', module: 'el-input', propType: String, prop: 'areaSerialNumber', placeholder: '编号', clearable: false, maxlength: 2 }
              ]
            },
            { module: 'span', bindText: { data: 'contractNoMiddle' }, options: { attrs: { style: 'text-align:right;float:left;' } } },
            {
              module: 'div',
              options: { attrs: { style: 'width:100px;float:left;' } },
              children: [
                { required: true, label: '合同号', module: 'el-input', propType: String, prop: 'theContractNo', placeholder: '合同号', clearable: false, maxlength: 4 }
              ]
            }
          ]
        },
        { readonly: true, label: '总面积', module: 'el-input', propType: Number, prop: 'zmj', placeholder: '总面积', options: { attrs: { 'clearable': true, type: 'el-input' } } },
        { readonly: true, label: '补偿费用', module: 'el-input', propType: Number, prop: 'bcfyhj', placeholder: '补偿费用', options: { attrs: { 'clearable': true, type: 'el-input' } } },
        { label: '地址', module: 'el-input', propType: String, prop: 'address', fullCol: true, placeholder: '请输入地址', options: { attrs: { 'clearable': true, type: 'textarea', 'show-word-limit': true, 'maxlength': 256 } } }
      ]
    },
    {
      name: 'chengyuanxinxi',
      label: '成员信息',
      splitColumn: true,
      visible: true,
      children: [
        { module: 'slot', 'v-slot': 'familyTable', fullCol: true }
      ]
    },
    {
      label: '土地情况',
      splitColumn: 3,
      children: [
        { clearable: true, label: '土地使用权证面积', module: 'el-input', propType: Number, prop: 'landUseWarrantArea', placeholder: '请输入土地使用权证面积' },
        { clearable: true, maxlength: 16, label: '土地证号', module: 'el-input', propType: String, prop: 'landCardNumber', placeholder: '请输入土地证号' },
        {
          label: '土地性质',
          module: 'div',
          children: [
            { clearable: true, cusSpan: 18, module: 'el-select', itemsType: 'NatureOfTheLandNumber', placeholder: '请选择土地性质', propType: Number, prop: 'natureOfTheLand' },
            {
              name: 'queryBankDetail',
              module: 'el-button',
              cusSpan: 6,
              onClick: 'natureOfClick',
              options: {
                attrs: {
                  icon: 'el-icon-search',
                  type: 'primary',
                  size: 'mini'
                }
              }
            }
          ]
        },
        {
          label: '土地证上用途',
          module: 'div',
          children: [
            { clearable: true, cusSpan: 18, module: 'el-select', itemsType: 'LandCertificateNumber', placeholder: '请选择土地证上用途', propType: Number, prop: 'landCertificatesForUse' },
            {
              cusSpan: 6,
              name: 'queryBankDetail',
              module: 'el-button',
              onClick: 'LandCertificateClick',
              options: {
                attrs: {
                  icon: 'el-icon-search',
                  type: 'primary',
                  size: 'mini'
                }
              }
            }
          ]
        },
        // {
        //   clearable: true,
        //   label: '土地性质',
        //   module: 'el-select',
        //   propType: Number,
        //   itemsType: 'NatureOfTheLandNumber',
        //   prop: 'natureOfTheLand',
        //   placeholder: '请选择土地性质'
        // },
        // { clearable: true, label: '土地证上用途', module: 'el-select', propType: String, itemsType: 'LandCertificateNumber', prop: 'landCertificatesForUse', placeholder: '请选择土地证上用途' },
        { clearable: true, maxlength: 9, label: '土地无证认定面积', module: 'el-input', propType: Number, prop: 'tdwzrdmj', placeholder: '请输入土地无证认定面积' }

      ]
    },
    {
      label: '房屋情况',
      splitColumn: 3,
      children: [
        { clearable: true, label: '房屋结构', module: 'el-select', propType: Number, itemsType: 'buildingList', prop: 'building', placeholder: '请选择房屋结构' },
        { clearable: true, maxlength: 24, label: '房屋证号', module: 'el-input', propType: String, prop: 'houseNumber', placeholder: '请输入房屋证号' },
        { clearable: true, label: '房屋结构楼层', module: 'el-input', propType: Number, prop: 'buildingStructureFloor', placeholder: '请输入房屋结构楼层' }
      ]
    },
    {
      label: '代扣费',
      splitColumn: 3,
      children: [
        { clearable: true, maxlength: 11, label: '扣房款', module: 'el-input', propType: Number, prop: 'buckleHouseMoney', placeholder: '请输入扣房款' },
        { clearable: true, maxlength: 11, label: '扣土地价款', module: 'el-input', propType: Number, prop: 'deductTheLandPrice', placeholder: '请输入扣土地价款' },
        { clearable: true, maxlength: 11, label: '扣罚款补证费', module: 'el-input', propType: Number, prop: 'fkkbzf', placeholder: '请输入扣罚款补证费' },
        { clearable: true, maxlength: 11, label: '扣土地收益金', module: 'el-input', propType: Number, prop: 'deductLandProceeds', placeholder: '请输入扣土地收益金' }
      ]
    },
    {
      label: '其他补偿款',
      splitColumn: 3,
      children: [
        { clearable: true, label: '简易房屋', module: 'el-input', propType: Number, prop: 'simpleHouses', placeholder: '请输入简易房屋' },
        { clearable: true, maxlength: 11, label: '违章建筑按时履约奖', module: 'el-input', propType: Number, prop: 'wzjzasnyj', placeholder: '请输入违章建筑按时履约奖' },
        // { clearable: true, maxlength: 11, label: '空闲土地补偿金额', module: 'el-input', propType: Number, prop: 'kxtdbcje', placeholder: '请输入空闲土地补偿金额' },
        { clearable: true, maxlength: 11, label: '产权调换房屋价值', module: 'el-input', propType: Number, prop: 'cqthfwjz', placeholder: '请输入产权调换房屋价值' },
        { clearable: true, maxlength: 11, label: '购房补助', module: 'el-input', propType: Number, prop: 'housingAllowance', placeholder: '请输入购房补助' },
        { clearable: true, maxlength: 11, label: '其他补偿金额', module: 'el-input', propType: Number, prop: 'qtbcje', placeholder: '请输入其他补偿金额' },
        { clearable: true, maxlength: 11, label: '架空层补偿', module: 'el-input', propType: Number, prop: 'jkbck', placeholder: '请输入架空层补偿' },
        { clearable: true, maxlength: 11, label: '杂物间补偿金额（两证补贴）', module: 'el-input', propType: Number, prop: 'zwjbcje', placeholder: '请输入杂物间补偿金额（两证补贴）' }
      ]
    },
    {
      label: '住房信息',
      splitColumn: 3,
      children: [
        { clearable: true, maxlength: 9, label: '置换套数面积㎡', module: 'el-input', propType: Number, prop: 'zhtsmj', placeholder: '请输入置换套数面积㎡' },
        { clearable: true, label: '置换套数', module: 'el-input', propType: Number, prop: 'hzts', placeholder: '请输入置换套数' },
        { clearable: true, maxlength: 9, label: '可置换面积', module: 'el-input', propType: Number, prop: 'replaceableArea', placeholder: '请输入可置换面积' },
        { clearable: true, maxlength: 11, label: '应交置换房款', module: 'el-input', propType: Number, prop: 'yjzhfd', placeholder: '请输入应交置换房款' },
        { clearable: true, maxlength: 11, label: '月过渡费', module: 'el-input', propType: Number, prop: 'inTheTransitionFee', placeholder: '请输入月过渡费' },
        // { required: true, clearable: true, maxlength: 11, label: '主体评估价值', module: 'el-input', propType: Number, prop: 'ztpgjz', placeholder: '请输入主体评估价值' },
        { clearable: true, maxlength: 11, label: '装修评估价值', module: 'el-input', propType: Number, prop: 'zxpgjz', placeholder: '请输入装修评估价值' },
        { clearable: true, label: '腾房通知单日期', module: 'el-date-picker', propType: Number, prop: 'dateOfVacationNoticeDate', placeholder: '请选择腾房通知单日期' }

      ]
    },
    {
      label: '其他信息',
      splitColumn: true,
      children: [
        { label: '备注', module: 'el-input', propType: String, prop: 'note', placeholder: '请输入备注', cusSpan: 12, options: { attrs: { 'clearable': true, type: 'textarea', 'show-word-limit': true, 'maxlength': 64 } } }

      ]
    },
    {
      label: '资料上传',
      children: [
        {
          module: 'div',
          required: 'attaType',
          label: {
            slot: true,
            html: '<label class="el-form-item__label" style="width: 160px;"><span style="color:#f56c6c">*</span> 资料类型</label>'
          },
          name: 'attaupload',
          children: [
            {
              clearable: true,
              label: '资料类型',
              module: 'el-select',
              itemsType: 'attaTypeList',
              propType: String,
              prop: 'attaType',
              placeholder: '请选择资料类型',
              cusSpan: 4
            },
            {
              label: '只能上传jpg/png文件，且不超过500kb',
              module: 'el-upload',
              propType: Array,
              prop: 'files',
              cusSpan: 20,
              model: {
                bindProp: ['attaType'],
                completed: (res, file, bindDatas) => {
                  if (!res) return
                  return {
                    ...bindDatas,
                    createTime: Math.floor(Date.now() / 1000),
                    oldFileName: file.name,
                    newFileName: res.newName,
                    url: res.relativePath
                  }
                }
              }
            }]
        }
      ]
    }
  ],
  rules: {

  }
}
