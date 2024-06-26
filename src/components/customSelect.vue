<template>
  <div class="relative inline-block w-full custom-select">
    <div class="flex justify-between items-center border text-gray-600 border-gray-300 rounded-lg bg-gray-100 p-2.5 cursor-pointer" @click="toggleDropdown">
      <span>{{ selectedLabel }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
    <div v-if="isOpen" class="custom-select__dropdown">
      <ul class="max-h-60 overflow-auto">
        <li v-for="option in options" :key="option.value" @click="selectOption(option)" class="p-[0.5rem] cursor-pointer hover:bg-gray-200 text-gray-700">
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'CustomSelect',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    options: {
      type: Array as () => Array<{ value: string, label: string }>,
      required: true
    }
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const selectedLabel = ref('');

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectOption = (option: { value: string, label: string }) => {
      emit('update:modelValue', option.value);
      selectedLabel.value = option.label;
      isOpen.value = false;

      console.log(`option: ${option.value}`)
    };

    watch(() => props.modelValue, (newVal) => {
      const selectedOption = props.options.find(option => option.value === newVal);
      if (selectedOption) {
        selectedLabel.value = selectedOption.label;
      }
    }, { immediate: true });

    return {
      isOpen,
      selectedLabel,
      toggleDropdown,
      selectOption
    };
  }
});
</script>
<style scoped>
.custom-select {
  cursor: pointer;
  position: relative;
}

.custom-select__dropdown {
  margin-top: .5rem;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.custom-select__option {
  padding: 0.5rem;
  cursor: pointer;
}

.custom-select__option:hover {
  background-color: #f1f1f1;
}
</style>
