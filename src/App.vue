<template>
  <div class="w-full h-screen flex flex-col space-y-8 items-center bg-slate-50 font-sans">
    <div class="flex flex-row w-4/5 space-x-6 h-4/8 mt-4">
      <div class="flex flex-col space-y-4 h-fit w-1/4 rounded-lg border-2 border-gray-300 shadow-lg p-4">
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

        <div v-if="['psnp', 'psp'].includes(selectedAlgorithm)">
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
      <div class="flex flex-col w-3/4 h-fit shadow-lg border-2 border-gray-300 rounded-lg p-4">
        <div v-if="taskExecuted">
          <div class="h-1/2 w-full flex flex-col">
          <h1 class="font-bold text-4xl text-gray-900 mb-2">
            Output
          </h1>
          <div class="flex flex-col items-center">
            <h1 class="font-bold text-xl text-gray-700 mb-2">
              Gantt Cart
            </h1>
            <div class="flex flex-row">
              <div v-for="(id,index) in gantChart.id" :key="id" class="w-8 py-1 text-lg font-medium text-center" :class=" index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'  ">
              {{id}}
              </div>
            </div>  
            <div class="flex flex-row ">
              <div v-for="shift in gantChart.shifts" :key="shift" class="w-8 text-sm font-medium text-center text-gray-400">
              {{shift}}
              </div>
            </div>
            
          </div>
        </div>
        <div class="h-1/2 w-full mt-12">
          <table class="border border-collapse w-full table-auto">
              <thead>
                <tr class="border border-gray-400 bg-gray-200 divide-x divide-gray-400 text-gray-600 text-left">
                  <th class="p-2">Task</th>
                  <th class="p-2">Arrival Time</th>
                  <th class="p-2">CPU Burst</th>
                  <th class="p-2">Waiting Time</th>
                  <th class="p-2">Turnaround Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasksInfo" :key="task.id" class="p-4 border border-gray-400 text-gray-700 bg-gray-100 divide-x divide-gray-400 text-left">
                  <td class="p-2">{{ task.id }}</td>
                  <td class="p-2">{{ task.at }}</td>
                  <td class="p-2">{{ task.cb }}</td>
                  <td class="p-2">{{ task.wt }} m/s</td>
                  <td class="p-2">{{ task.tt }} m/s</td>
                </tr>
                <tr class="p-4 border border-gray-400 text-gray-700 bg-gray-100 divide-x divide-gray-400 text-left">
                  <td colspan="3" class="p-2 text-right mr-2">
                    Average:
                  </td>
                  <td class="p-2">
                    {{ average.wt }} m/s
                  </td>
                  <td class="p-2">
                    {{ average.tt }} m/s
                   </td>
                </tr>
              </tbody>
        </table>
        </div>
        </div>
        <div v-else>

            <h1 class="font-bold text-4xl text-gray-900 mb-2">
            Output
            </h1>
            <h1 class="text-gray-600">
              Algorithm output will be shown here
            </h1>

          
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CustomSelect from './components/customSelect.vue';
import { Task, Algorithm, TaskInfo } from './cpu';

export default defineComponent({
  name: 'App',
  components: {
    CustomSelect,

  },
  data() {
    return {
      tasksInfo: null,
      average: null,
      gantChart: null,
      ids: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
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
    const algo = new Algorithm()
    let tasks = [];
    let gant = null; 
    let wtC = 0;
    let ttC = 0;
    let arrivalTimes = this.arrivalTimes.split(" ");
    let cpuBursts = this.cpuBurst.split(" ");
    let priority:number[] = this.priority.split(" ")
    let shift = new Set([0])
    let info = null

    const addTasks = (priority?:number[]) => {
      console.log(priority)
      arrivalTimes.forEach((time, i) => {
        tasks.push([time, cpuBursts[i]]);
      });

      tasks = tasks.map((item, index) => {
        return !priority ? 
        new Task(this.ids[index], Number(item[0]), Number(item[1])) 
          : 
        new Task(this.ids[index], Number(item[0]), Number(item[1]), priority[index])  ;
      });

    };

    switch (this.selectedAlgorithm) {
      case 'fcfs':
        if (this.isListsValid([arrivalTimes, cpuBursts])) {
          addTasks();
          info = algo.fcfs(tasks)
        } 
        break;
      case 'spf':
      if (this.isListsValid([arrivalTimes, cpuBursts])) {
          addTasks();
          info = algo.spf(tasks)
        } 
        break;
      case 'srtf':
      if (this.isListsValid([arrivalTimes, cpuBursts])) {
          addTasks();
          info = (algo.srtf(tasks))
        } 
        break;
      case 'rr':
        if (this.isListsValid([arrivalTimes, cpuBursts]) && this.timeQuantum) {
          addTasks();
          console.log(this.timeQuantum)
          info = algo.rr(tasks,this.timeQuantum)
        } 
        break;
      case 'psnp':
        if (this.isListsValid([arrivalTimes, cpuBursts,priority])) {
          addTasks(priority.map(item=>{return Number(item)}));
          info = algo.psnp(tasks)
        } 
        break;
      case 'psp':
        if (this.isListsValid([arrivalTimes, cpuBursts,priority])) {
          addTasks(priority.map(item=>{return Number(item)}));
          info = algo.psp(tasks)
        } 
        break;
      default:
        break;
    }

    this.taskExecuted = true;
    
    gant = info[0].split("|")
    gant = gant.slice(0,gant.length - 1).map( (item: string) => {
      return item[0]
    })
    this.tasksInfo = info[1]
    this.tasksInfo.forEach( (item:TaskInfo) => {
      wtC += item.wt
      ttC += item.tt
    })

    tasks.forEach( (item:Task) => {
      item.shift.forEach( (item:number) => {
        shift.add(item)
      })
      item.timeExecuted.forEach( (item:number) => {
        shift.add(item)
      })
    })

    shift = new Set([...shift].sort((a:number, b:number) => a - b));

    this.average = {
      wt: (wtC / this.tasksInfo.length).toFixed(3),
      tt: (ttC / this.tasksInfo.length).toFixed(3)
    }

    this.gantChart = {
      id: gant,
      shifts: shift
    }

    console.log(this.gantChart)
    console.log(tasks)
  },

  isListsValid(lists) {
    let len = this.countNum(lists[0]);

    for (let list of lists) {
      if (this.countNum(list) !== len) {
        return false;
      }
    }
    return true;
  },

  countNum(list) {
    let count = 0;
    list.forEach(item => {
      if (item.trim() !== "" && !isNaN(Number(item.trim()))) {
        count++;
      }
    });
    return count;
  }
}

});
</script>
