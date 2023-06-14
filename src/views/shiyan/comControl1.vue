<template>
    <div>
       <com-control :controls="searchBox.searchControls" :listOptions="searchBox.listOptions"
        :hiddenCreate="!canCreate" :hiddenExport="canExport">
      </com-control> 
    </div>
</template>

<script>
import comControl from '@/components/comControl'
import { defaultForm } from '@/commons/comFormUtil'
import { formOptions } from './list-control-config'

export default {
    data () {
        return {
            searchBox: {
                listOptions: {
                statusList: [],
                certificateList: []
                },
                searchControls: defaultForm.call(this, formOptions.controls)
            },
            canExport: false,
            canCreate: false,
        }
    },
    components: {
        comControl
    }
}
</script>