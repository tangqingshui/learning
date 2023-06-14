<template>
  <div>
    <!-- 表格部分 -->
    <el-table :data="tableData" stripe border :default-sort="{prop: 'date', order: 'descending'}">
      <!-- 表格业务内容列 -->
      <template v-for="(item, index) in tableOption">
        <el-table-column
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overHidden || false"
          :min-width="item.width || '100px'"
          :fixed="item.fixed || true"
          :sortable="item.sortable || false"
          :type="item.type || 'normal'"
        ></el-table-column>
      </template>
      <!-- 表格操作列 -->
      <el-table-column label="操作" v-if="isOperate" min-width="150px">
        <template slot-scope="scope">
          <slot name="operate" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  // 父组件向子组件传值
  props: {
    // 表格显示的数据
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 表格的操作
    tableOption: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 控制操作列是否显示
    isOperate: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {}
};
</script>