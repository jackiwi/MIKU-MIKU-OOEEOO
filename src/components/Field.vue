<template>
  <div class="my-2 flex flex-col space-around" :class="{ 'sm:flex-row': !forceFlexCol }">
    <div class="py-1 sm:flex-1 sm:grow flex flex-col place-content-center">
      <div class="font-bold">
        <span v-if="tooltip"
          class="help">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-4 h-4 mb-1 inline-block fill-zinc-800 align-middle">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
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

<script>
export default {
  props: ['label', 'tooltip', 'forceFlexCol']
}
</script>