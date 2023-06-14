<template>
  <div>
     <com-form ref='mainForm' :controls="controls" :listOptions="listOptions" :formDefaultData="formDefaultData"
      @formSelectChange="formSelectChange" :formRules="formRules">
    </com-form>
  </div>
</template>

<script>
import comForm from '@/components/comForm'
import { defaultForm } from '@/commons/comFormUtil'
import { formOptions } from './protocol-detail-edit.config'
export default {
  name: 'protocol-detail-edit',
  components: {
    comForm
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      controls: defaultForm.call(this, formOptions.controls),
      formRules: formOptions.rules,
      listOptions: {
        buildingList: [],
        areaList: [],
        projectList: [],
        NatureOfTheLandNumber: [],
        LandCertificateNumber: [],
        // CertificateNumber: [],
        // DoorModelTypesNumber: [],
        // HousingTypesNumber: [],
        attaTypeList: [],
        // familyList: [], // 家庭关系
        protocolInformationList: [],
        typeList: [] // 征拆户类型
      },
      // 选中的费用类型
      selectedCostType: null,
      // 费用详情列表
      formDefaultData: {},
      formUploadfile: {},
      contractNoText: '',
      theContractNo: '',
      beforeContractNo: '',
      contractNoMiddle: ''
    }
  },
  methods: {
    formSelectChange(data) {
      console.log(111);
    }
  }
}
</script>

<style>
.virtual-label {
  color: #f56c6c;
  margin-right: 4px;
}
</style>