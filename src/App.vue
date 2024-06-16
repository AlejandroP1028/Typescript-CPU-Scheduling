<template>
  <div class="w-full h-screen flex flex-col space-y-8 items-center bg-slate-50 font-sans">
    <div class="flex flex-row w-4/5 space-x-4 h-4/8 mt-4">
      <div class="flex flex-col space-y-4 h-full min-h-full w-1/4 rounded-lg border-2 border-gray-300 shadow-lg p-4">
        <h1 class="font-bold text-4xl text-gray-900 mb-2">
          Input
        </h1>
        <div>
          <label for="algorithm" class="font-medium text-xl">
            Algorithm
          </label>
          <CustomSelect v-model="selectedAlgorithm" :options="algorithmOptions" />
        </div>

        <div v-if="selectedAlgorithm">
          <label for="arrivalTimes" class="font-medium text-lg">
            Arrival Times
          </label>
          <input type="text" id="arrivalTimes" v-model="arrivalTimes" class="block w-full p-2.5 mt-2 rounded-lg text-gray-600 border-2 bg-gray-100">
        </div>

        <div v-if="selectedAlgorithm">
          <label for="cpuBurst" class="font-medium text-lg">
            CPU Burst
          </label>
          <input type="text" id="cpuBurst" v-model="cpuBurst" class="block w-full p-2.5 mt-2 text-gray-600 rounded-lg border-2 bg-gray-100">
        </div>

        <div v-if="selectedAlgorithm === 'psp' || selectedAlgorithm === 'psnp'">
          <label for="priority" class="font-medium text-lg">
            Priority
          </label>
          <input type="text" id="priority" v-model="priority" class="block w-full p-2.5 mt-2 rounded-lg text-gray-600 border-2 bg-gray-100">
        </div>

        <div v-if="selectedAlgorithm === 'rr'">
          <label for="timeQuantum" class="font-medium text-lg">
            Time Quantum
          </label>
          <input type="text" id="timeQuantum" v-model="timeQuantum" class="block w-full p-2.5 mt-2 text-gray-600 rounded-lg border-2 bg-gray-100">
        </div>

        <button v-if="selectedAlgorithm" @click="executeTask" type="button" class="bg-blue-500 font-bold w-fit self-center py-2 px-4 text-lg rounded-lg text-gray-50 hover:bg-blue-600">
          EXECUTE
        </button>
      </div>
      <div v-if="taskExecuted" class="flex flex-col w-3/4 h-full shadow-lg border-2 border-gray-300 rounded-lg p-4">
        <!-- Result display goes here -->
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CustomSelect from './components/customSelect.vue';


export default defineComponent({
  name: 'App',
  components: {
    CustomSelect,

  },
  data() {
    return {

      selectedAlgorithm: '',
      arrivalTimes: '',
      cpuBurst: '',
      priority: '',
      timeQuantum: '',
      taskExecuted: false,
      algorithmOptions: [
        { value: 'fcfs', label: 'First Come First Serve' },
        { value: 'spf', label: 'Shortest Process First' },
        { value: 'srtf', label: 'Shortest Remaining Time First' },
        { value: 'rr', label: 'Round Robin' },
        { value: 'psnp', label: 'Priority Scheduling Non-Preemptive' },
        { value: 'psp', label: 'Priority Scheduling Preemptive' },
      ]
    };
  },
  methods: {
    executeTask() {
      switch (this.selectedAlgorithm) {
        case 'fcfs':
          console.log(`isnan: ${Number("").valueOf()}`)
          console.log(this.isListsValid([this.arrivalTimes.split(" "),this.cpuBurst.split(" ")]))
          break;
        case 'spf':

          break;
        case 'srtf':

          break;
        case 'rr':

          break;
        case 'psnp':

          break;
        case 'psp':

          break;
        default:

          break;
      }
    },
    isListsValid(list: [[]]): boolean{
      let len = this.countNum(list[0]);

      list.shift()
      for (let li of list){

        if(this.countNum(li) !== len){
          return false
        }
      }
      return true
    },
    countNum(list: string[]): number {

      let count = 0;

      list.forEach(item => {

        if (Number(item) >= 0) {

          count++;
        }
      });


      return count;
    }
  }
});
</script>
