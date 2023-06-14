export const AuditType = {
  noSubmit: 0,
  approvaling: 1,
  finished: 2,
  isFreeze: 1, // 1：冻结
  isThaw: 0 // 0：解冻
}

export const CostType = {
  Zsbck: 1,
  Xmgzjf: 2
}

export const PayStatus = {
  NoPay: 3, // 未支付
  Paying: 2, // 支付中
  finished: 1 // 支付完成
}
export const BankStatus = {
  Fail: 0, // 失败
  Success: 1, // 成功
  UnderPayment: 2, // 支付中
  NotFound: 3, // 未找到该订单
  Other: 99, // 其他
  NoPay: 999 // 未支付
}

export const IncomeType = {
  PublecMoney: 3,
  SpecialMoney: 5
}

// 列支标准计算方式
export const CalculationType = {
  ScopedCalculate: 1, // 区间计算
  Calculate: 2, // 直接计算
  // 对照
  1: '区间计算',
  2: '直接计算'
}
// 列支标准计算方式
export const RatioDataSource = {
  protocol: 1, // 协议
  workcost: 2, // 工作经费
  byCalculationDataSource: 3, // 工作经费
  1: '协议',
  2: '工作经费',
  3: '不指定'
}
// 列支标准数据源
export const CalculationDataSource = {
  protocol: 1, // 协议
  workcost: 2, // 工作经费
  1: '协议',
  2: '工作经费'
}

export const ResourceMap = {
  '后台管理': {
    '编码规则': {
      '编辑': '/api/coderule/update',
      '查询': '/api/coderule/getcoderulelist',
      '删除': '/api/coderule/delete',
      '添加': '/api/coderule/add'
    },
    '单位管理': {
      '删除': '/api/company/delete',
      '修改': '/api/company/update',
      '增加': '/api/company/add'
    },
    '角色管理': {
      '编辑': '/api/role/update',
      '删除': '/api/role/delete',
      '添加': '/api/role/add'
    },
    '权限管理': {
      '删除': '/api/frmapping/delete',
      '添加': '/api/frmapping/add',
      '修改': '/api/frmapping/update'
    },
    '应用配置表': {
      '编辑': '/api/appmodule/update',
      '删除': '/api/appmodule/delete',
      '添加': '/api/appmodule/add'
    },
    '用户管理': {
      '登录': '/api/account/login',
      '删除': '/api/account/delete',
      '锁定': '/api/account/updislocked',
      '修改': '/api/account/update',
      '修改密码': '/api/account/changepwd',
      '增加': '/api/account/add'
    },
    '资源管理': {
      '菜单排序': '/api/resource/updateresourcesort',
      '删除': '/api/resource/delete',
      '添加': '/api/resource/add',
      '修改': '/api/resource/update'
    }
  },
  '业务管理': {
    '财产保全': {
      '删除': '/api/frozencapital/deletefreeze',
      '添加': '/api/frozencapital/addfreeze',
      '修改': '/api/frozencapital/updatefreeze',
      '冻结状态修改': '/api/frozencapital/unfreeze',
      '资金审核': '/api/frozencapital/passapproval',
      '资金提交审批': '/api/frozencapital/startprojectapproval'
    },
    '协议': {
      '导出': '/api/ProtocolInformation/WordIdPI',
      '添加': '/api/protocolinformation/addpi',
      '编辑': '/api/protocolinformation/updatepi',
      '查询': '/api/protocolinformation/selectpi',
      '删除': '/api/protocolinformation/deletepi',
      '删除凭证': '/api/protocolinformation/delexpensecertificate',
      '生成凭证': '/api/protocolinformation/credentials',
      '提交审批': '/api/protocolinformation/changestatuspi',
      '审核': '/api/protocolinformation/carefuleliminationpi',
      '附录添加': '/api/protocolinformation/appendixaddpi',
      '附录编辑': '/api/protocolinformation/appendixthereareupdatepi',
      '协议生成合同号-查询': '/api/protocolinformation/contractno',
      '房屋结构下拉框-下拉列表': '/api/protocolinformation/buildingstructuretype',
      '住宅用房下拉框-下拉列表': '/api/protocolinformation/doormodeltypes',
      '下载合同': '/api/protocolinformation/wordidpi'
    },
    '子协议': {
      '导出': '/api/ProtocolInformation/WordIdPI',
      '添加': '/api/protocolinformation/addpi',
      '编辑': '/api/protocolinformation/updatepi',
      '查询': '/api/protocolinformation/selectpi',
      '删除': '/api/protocolinformation/deletepi',
      '删除凭证': '/api/protocolinformation/delexpensecertificate',
      '生成凭证': '/api/protocolinformation/credentials',
      '提交审批': '/api/protocolinformation/changestatuspi',
      '审核': '/api/protocolinformation/carefuleliminationpi',
      '附录添加': '/api/protocolinformation/appendixaddpi',
      '附录编辑': '/api/protocolinformation/appendixthereareupdatepi',
      '协议生成合同号-查询': '/api/protocolinformation/contractno',
      '房屋结构下拉框-下拉列表': '/api/protocolinformation/buildingstructuretype',
      '住宅用房下拉框-下拉列表': '/api/protocolinformation/doormodeltypes',
      '下载合同': '/api/protocolinformation/wordidpi'
    },
    '收入登记': {
      '编辑': '/api/incomeisregistered/updateiir',
      '前往审批': '/api/incomeisregistered/carefuleliminationincome',
      '删除': '/api/incomeisregistered/deleteiir',
      '删除凭证': '/api/incomeisregistered/delincomeisregistered',
      '生成凭证': '/api/incomeisregistered/credentials',
      '提交审批': '/api/incomeisregistered/changestatusincome',
      '添加': '/api/incomeisregistered/addiir'
    },
    '项目垫支': {
      '编辑': '/api/collectionproject/upatransferprojectfunds',
      '前往审批': '/api/collectionproject/passtransferprojectfundsapproval',
      '删除': '/api/collectionproject/deltransferprojectfunds',
      '提交审批': '/api/collectionproject/starttransferprojectfundsapproval',
      '添加': '/api/collectionproject/addtransferprojectfunds'
    },
    '项目结项': {
      '编辑': '/api/collectionproject/upacollectionprojectextend',
      '前往审批': '/api/collectionproject/passaextendpproval',
      '删除': '/api/collectionproject/delcollectionprojectextend',
      '提交审批': '/api/collectionproject/startprojectextendapproval',
      '添加': '/api/collectionproject/addcollectionprojectextend'
    },
    '项目信息登记': {
      '添加': '/api/collectionproject/add',
      '编辑': '/api/collectionproject/update',
      '删除': '/api/collectionproject/delete',
      '提交审批': '/api/collectionproject/startprojectapproval',
      '审核': '/api/collectionproject/passapproval'
    },
    '支出登记': {
      '查看详情': '/api/payregister/getpayregisteredetails',
      '支付': '/api/payregister/batchbanktransfers',
      '删除': '/api/payregister/deletepayregistere',
      '删除凭证': '/api/payregister/delexpensecertificate',
      '生成凭证': '/api/payregister/addexpensecertificate',
      '提交审批': '/api/payregister/startprojectapproval',
      '添加支付': '/api/payregister/addpayregistere',
      '银行对账单列表查询': '/api/payregister/bankflowlist',
      '修改': '/api/payregister/updatepayregistere',
      '审核': '/api/payregister/passapproval'
    },
    /* 其他工作经费 */
    '追加资金': {
      '查看详情': '/api/documents/documentsdetails',
      '删除': '/api/documents/deletedocuments',
      '审核': '/api/documents/passapproval',
      '提交审批': '/api/documents/startprojectapproval',
      '添加': '/api/documents/adddocuments',
      '修改': '/api/documents/updatedocuments'
    },
    '决算报表': {
      '导出': '/api/PaymentStatistics/derivejuesuanbiao'
    },
    '拨付统计表': {
      '导出': '/api/PaymentStatistics/exportpaymentstatistics'
    },
    '收支明细': {
      '导出': '/api/PaymentStatistics/exportprojectexpenseslist'
    },
    '资金流向记录表': {
      '导出': '/api/MoneyFlows/MoneyList'
    },
    // 原列支标准
    '政策标准': {
      '模板': {
        '新增': '/api/expenditure/addtemplate',
        '修改': '/api/expenditure/updatetemplate',
        '删除': '/api/expenditure/deleteexpendituretemplate',
        '明细列表': '/api/expenditure/expenditurestandardquery',
        '切换状态': '/api/expenditure/updatetemplatestate',
        '查询标准': '/api/expenditure/gettemplatestandardquery',
        '新增标准': '/api/expenditure/addsingleexpenditure',
        '修改标准': '/api/expenditure/updatesingleexpenditure',
        '删除标准': '/api/expenditure/deletestandard'
      },
      '项目': {
        '详情': '/api/expenditure/getprojectdetailsexpenditure',
        '修改': '/api/expenditure/updatetemplatestate'
      }
    }
  }
}

export const BsResource = ResourceMap.业务管理

export const ResourceIdMap = {
  '/api/coderule/update': '143',
  '/api/coderule/getcoderulelist': '113',
  '/api/coderule/delete': '145',
  '/api/coderule/add': '144',
  '/api/frozencapital/deletefreeze': '134',
  '/api/frozencapital/addfreeze': '133',
  '/api/frozencapital/updatefreeze': '135',
  '/api/frozencapital/passapproval': '132',
  '/api/frozencapital/startprojectapproval': '131',
  '/api/company/delete': '187',
  '/api/company/update': '186',
  '/api/company/add': '188',
  '/api/protocolinformation/buildingstructuretype': '123',
  '/api/role/update': '146',
  '/api/role/delete': '148',
  '/api/role/add': '147',
  '/api/frmapping/delete': '190',
  '/api/frmapping/add': '189',
  '/api/frmapping/update': '191',
  '/api/incomeisregistered/updateiir': '137',
  '/api/incomeisregistered/carefuleliminationincome': '140',
  '/api/incomeisregistered/deleteiir': '138',
  '/api/incomeisregistered/delincomeisregistered': '142',
  '/api/incomeisregistered/credentials': '141',
  '/api/incomeisregistered/changestatusincome': '139',
  '/api/incomeisregistered/addiir': '136',
  '/api/collectionproject/upatransferprojectfunds': '178',
  '/api/collectionproject/passtransferprojectfundsapproval': '176',
  '/api/collectionproject/deltransferprojectfunds': '179',
  '/api/collectionproject/starttransferprojectfundsapproval': '175',
  '/api/collectionproject/addtransferprojectfunds': '177',
  '/api/collectionproject/upacollectionprojectextend': '167',
  '/api/collectionproject/passaextendpproval': '170',
  '/api/collectionproject/delcollectionprojectextend': '168',
  '/api/collectionproject/startprojectextendapproval': '169',
  '/api/collectionproject/addcollectionprojectextend': '166',
  '/api/collectionproject/update': '173',
  '/api/collectionproject/delete': '174',
  '/api/collectionproject/startprojectapproval': '171',
  '/api/collectionproject/add': '172',
  '/api/protocolinformation/appendixthereareupdatepi': '127',
  '/api/protocolinformation/appendixaddpi': '125',
  '/api/protocolinformation/updatepi': '116',
  '/api/protocolinformation/selectpi': '118',
  '/api/protocolinformation/deletepi': '117',
  '/api/protocolinformation/delexpensecertificate': '120',
  '/api/protocolinformation/credentials': '119',
  '/api/protocolinformation/changestatuspi': '121',
  '/api/protocolinformation/addpi': '112',
  '/api/protocolinformation/appendixthereareaddpi': '126',
  '/api/protocolinformation/contractno': '122',
  '/api/appmodule/update': '130',
  '/api/appmodule/delete': '129',
  '/api/appmodule/add': '128',
  '/api/account/login': '180',
  '/api/account/delete': '183',
  '/api/account/updislocked': '184',
  '/api/account/update': '182',
  '/api/account/changepwd': '181',
  '/api/account/add': '185',
  '/api/payregister/getpayregisteredetails': '154',
  '/api/payregister/getprojectdroplistpay': '159',
  '/api/payregister/batchbanktransfers': '157',
  '/api/payregister/deletepayregistere': '153',
  '/api/payregister/delexpensecertificate': '156',
  '/api/payregister/addexpensecertificate': '155',
  '/api/payregister/startprojectapproval': '149',
  '/api/payregister/addpayregistere': '151',
  '/api/payregister/bankflowlist': '158',
  '/api/payregister/updatepayregistere': '152',
  '/api/payregister/passapproval': '150',
  '/api/protocolinformation/doormodeltypes': '124',
  '/api/documents/documentsdetails': '165',
  '/api/documents/deletedocuments': '163',
  '/api/documents/passapproval': '161',
  '/api/documents/startprojectapproval': '160',
  '/api/documents/adddocuments': '162',
  '/api/documents/updatedocuments': '164',
  '/api/resource/updateresourcesort': '195',
  '/api/resource/delete': '194',
  '/api/resource/add': '192',
  '/api/resource/update': '193',
  '/api/PaymentStatistics/derivejuesuanbiao': '242', // 决算报表
  '/api/PaymentStatistics/exportpaymentstatistics': '243', // 拨付统计表
  '/api/ProtocolInformation/WordIdPI': '246', // 协议导出
  '/api/PaymentStatistics/exportprojectexpenseslist': '268', // 收支明细导出
  '/api/MoneyFlows/MoneyList': '269', // 资金流向记录表导出
  '/api/Expenditure/updateprojectebdetail': '222',
  '/api/Expenditure/getprojectdetailsexpenditure': '223',
  '/api/Expenditure/addexpenditure': '224',
  '/api/Expenditure/addtemplate': '225',
  '/api/Expenditure/updatetemplatestandard': '226',
  '/api/Expenditure/updatetemplatestate': '227',
  '/api/Expenditure/deletestandard': '228',
  '/api/Expenditure/updatetemplate': '229',
  '/api/Expenditure/deleteexpendituretemplate': '230',
  '/api/Expenditure/addsingleexpenditure': '231',
  '/api/Expenditure/updatesingleexpenditure': '232'
}
