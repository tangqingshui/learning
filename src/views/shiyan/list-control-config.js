export const formOptions = {
  controls: [
    {
      label: '',
      splitColumn: true,
      children: [
        {
          required: true,
          clearable: true,
          label: '审批状态',
          module: 'el-select',
          itemsType: 'statusList',
          propType: String,
          prop: 'Approval',
          placeholder: '请选择'
        },
        {
          clearable: true,
          required: true,
          label: '项目名称',
          module: 'el-input',
          propType: String,
          prop: 'ProjectName',
          placeholder: '请输入项目名称'
        },
        {
          clearable: true,
          required: true,
          label: '合同号',
          module: 'el-input',
          propType: String,
          prop: 'TheContractNo',
          placeholder: '请输入合同号'
        },
        {
          clearable: true,
          required: true,
          label: '产权人',
          module: 'el-input',
          propType: String,
          prop: 'PropertyRightPerson',
          placeholder: '请输入产权人'
        },
        {
          clearable: true,
          required: true,
          label: '身份证号码',
          module: 'el-input',
          propType: String,
          prop: 'IdNumber',
          placeholder: '请输入你的身份证号码'
        },
        {
          required: true,
          clearable: true,
          label: '是否生成凭证',
          module: 'el-select',
          itemsType: 'certificateList',
          propType: String,
          prop: 'DealWithCertificatesState',
          placeholder: '请选择'
        },

        {
          required: true,
          clearable: true,
          label: '开始时间',
          module: 'el-date-picker',
          propType: String,
          prop: 'Start',
          placeholder: '请选择开始时间'
        },
        {
          required: true,
          clearable: true,
          label: '结束时间',
          module: 'el-date-picker',
          propType: String,
          prop: 'End',
          placeholder: '请选择结束时间'
        }

      ]
    }
  ]
}