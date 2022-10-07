<template>
  <div class="flex justify-evenly">
    <span>
      <input type="checkbox" id="all" @input="changeAll" v-model="checkAll" />
      <label for="all">all</label>
    </span>
    <span v-for="(key, value) in items" :key="key">
      <input type="checkbox" :id="key" :value="key" v-model="modelVal" />
      <label :for="key"> {{ value }}</label>
    </span>
  </div>
</template>

<script>
import { useLocalStorage } from '@vueuse/core';
import { watchEffect } from 'vue';

export default {
  props: ['items', 'modelVal', 'modelValName'],

  setup(props, { emit }){
    const emitUpdate = (() => {
      emit('updateCheckBoxList', props.modelVal, props.modelValName);
    });

    const checkAll = useLocalStorage('checkAll'+props.modelValName,true);

    const changeAll = () => {
      while (props.modelVal.length){
        props.modelVal.pop();
      }
      if (!checkAll.value){
        Object.values(props.items).forEach((val) => {
          props.modelVal.push(val);
        })
      }
    };

    watchEffect(() => {
      emitUpdate();
    })

    return { checkAll, changeAll };
  }
}
</script>