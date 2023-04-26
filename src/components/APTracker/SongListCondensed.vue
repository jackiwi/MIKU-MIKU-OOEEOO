<template>
  <h1>uhhhhhhhhhhh</h1>
  <syncGrid :dataSource="songListAll">
    <syncColumns>
      <syncCol :field="songDifficulty + ' difficulty'" headerText="level" textAlign="Center"></syncCol>
      <syncCol field="Song title" headerText="song" textAlign="Center" width="300"></syncCol>
      <syncCol field="bestRecord.nonperfs" headerText="np" textAlign="Center"></syncCol>
      <syncCol field="bestRecord.breaks" headerText="cb" textAlign="Center"></syncCol>
      <syncCol field="bestRecord.date" headerText="date" textAlign="Center" width="100"></syncCol>
    </syncColumns>
  </syncGrid>
</template>

<script>
  import { GridComponent as syncGrid, ColumnsDirective as syncColumns, ColumnDirective as syncCol } from '@syncfusion/ej2-vue-grids';

export default {
  props: [ 'songListAll', 'songDifficulty', 'trackerMode', 'key1', 'key2' ],
  components: {
    syncGrid, syncColumns, syncCol
  },

  setup(props){
  }
}
</script>

<style scoped>
  @import "@/../node_modules/@syncfusion/ej2-base/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-buttons/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-calendars/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-dropdowns/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-inputs/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-navigations/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-popups/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-splitbuttons/styles/tailwind.css";
  @import "@/../node_modules/@syncfusion/ej2-vue-grids/styles/tailwind.css";
</style>