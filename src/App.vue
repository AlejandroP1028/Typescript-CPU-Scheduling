<template>
  <div class="w-full h-screen flex items-center justify-center bg-blue-50 font-sans">
    <div class="w-24 h-24 bg-gray-500 flex items-center justify-center">
      Check the console for outputs.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Task, Algorithm } from './cpu';

const algo = new Algorithm();

// Test Case 1
const taskSet1 = [
  new Task("a", 0, 12),
  new Task("b", 3, 5),
  new Task("c", 2, 10)
];

console.log(algo.rr(taskSet1,3))

export default defineComponent({
  name: 'App',
  components: {

  },
});
</script>
