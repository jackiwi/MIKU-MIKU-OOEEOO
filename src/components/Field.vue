<template>
  <div class="my-2 flex flex-col space-around" :class="{ 'sm:flex-row': !forceFlexCol }">
    <div class="py-1 sm:flex-1 sm:grow flex flex-col place-content-center">
      <div class="font-bold">
        <span v-if="tooltip"
          class="help">
          <QuestionMarkCircleIcon class="w-4 h-4 mb-1 inline-block fill-zinc-800 dark:fill-zinc-400 align-middle"></QuestionMarkCircleIcon>
          <span class="tooltip w-64">
            {{ tooltip }}
          </span>
        </span>
        {{ label }}
      </div>
    </div>
    <div class="sm:flex-1 sm:grow-[2] flex flex-col place-content-center">
      <div class="flex justify-center">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid';

import { Options, Vue } from 'vue-class-component';

@Options({
  components: { QuestionMarkCircleIcon },
  props: ['label', 'tooltip', 'forceFlexCol']
})

export default class Field extends Vue {
}
</script>