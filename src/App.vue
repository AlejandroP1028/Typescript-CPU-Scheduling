<template>
  <div class="w-full h-screen flex items-center justify-center bg-blue-50 font-sans">
    <div class="w-24 h-24 bg-gray-500 flex items-center justify-center">
      tite
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import  {Task, Algorithm} from './cpu';

const algo = new Algorithm()
const task1 = new Task("a",0,12)
const task2 = new Task("b",3,12)
const task3 = new Task("c",2,12)

console.log(algo.fcfs([task1,task2,task3]))


export default defineComponent({
  name: 'App',
  components: {

  }
});
</script>
