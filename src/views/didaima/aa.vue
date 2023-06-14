<template>
    <div class="vueFile">
    <zx-form
        ref="mForm"
        :formData="formData"
        :formCols="formCols"
        :rules="rules"
        @event=a>
    </zx-form>
  </div>
  </template>

<script type="text/ecmascript-6">
export default {
  name: "vueFile",
  data() {
    return {
      formData: {},
      formCols: [[{"eType":"Button","value":"提交","type":"primary","prop":"prop101","span":5,"plain":true,"loading":false},{"eType":"Input","label":"单行文本","prop":"prop102","span":24}]],
      rules:{},
    }
  },
  methods: {
    a(a) {
      this.$refs['mForm'].submit().then(res=>{
        console.log(res)
      })
    }
  }
}
</script>