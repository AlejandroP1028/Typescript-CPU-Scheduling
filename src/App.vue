<template>
  <div class="w-full h-screen flex flex-col space-y-8 items-center mt-24 bg-slate-50 font-sans">
    <div class="w-4/5 h-2/8 font-bold text-2xl bg-gray-100 text-center p-4 border-gray-200 shadow-lg rounded-lg">
      Information will be shown here
    </div>
    <div class="flex flex-row w-4/5 h-4/8">
      <div class="flex flex-col space-y-4 h-full min-h-full w-1/4 rounded-lg shadow-lg  p-4">
        <h1 class="font-bold text-4xl text-gray-900 mb-2">
          Input
        </h1>
        <div>
          <label for="algorithm" class="font-medium text-xl">
            Algorithm
          </label>
          <CustomSelect v-model="selectedAlgorithm" :options="algorithmOptions" />
        </div>

        <div v-if="taskSelected">
          <label for="algorithm" class="font-medium text-xl">
            Arrival Times
          </label>
          <!--input box for arrival times-->
        </div>

        <div v-if="taskSelected">
          <label for="algorithm" class="font-medium text-xl">
            CPU Burst
          </label>
          <!--input box for cpu burst-->
        </div>

        <div v-if="taskSelected == 'psp' || taskSelected == 'psnp'">
          <label for="algorithm" class="font-medium text-xl">
            Priority
          </label>
          <!--input box for priority-->
        </div>

        <div v-if="taskSelected == 'rr'">
          <label for="algorithm" class="font-medium text-xl">
            Priority
          </label>
          <!--input box for rr-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CustomSelect from './components/customSelect.vue';
import { Task, Algorithm } from './cpu';

const algo = new Algorithm();

// Test Case 1
const taskSet1 = [
  new Task("a", 0, 12, 2),
  new Task("b", 3, 5, 1),
  new Task("c", 2, 10, 1)
];

console.log(algo.psp(taskSet1));

export default defineComponent({
  name: 'App',
  components: {
    CustomSelect
  },
  setup() {
    const selectedAlgorithm = ref('');
    const algorithmOptions = ref([
      { value: 'rr', label: 'Round Robin' },
      { value: 'fcfs', label: 'First Come First Serve' },
      { value: 'psp', label: 'Priority Scheduling Preemptive' },
      { value: 'psnp', label: 'Priority Scheduling Non-Preemptive' },
      { value: 'srtf', label: 'Shortest Remaining Time First' },
      { value: 'spf', label: 'Shortest Process First' }
    ]);

    return {
      selectedAlgorithm,
      algorithmOptions
    };
  }
});
</script>
