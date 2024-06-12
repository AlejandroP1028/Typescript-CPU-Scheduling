import { AlgoUtil } from "./util";

let task: Task[] = [];

export class Task{
    id: string;
    arrivalTime: number;
    cpuBurst: number;
    cpuBurstNeeded: number;
    waitingTime: number;
    turnaroundTime: number;
    timeExecuted: number[];
    shift: number[];
    constructor(id: string, arrivalTime: number, cpuBurst: number){
        if (id.length !== 1){
            throw new Error("Task ID must be a character");
        }
        if (this.checkID(id)){
            throw new Error("ID is not unique");
        }
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.cpuBurst = cpuBurst;
        this.cpuBurstNeeded = cpuBurst;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.timeExecuted = []; // Time when executed can be 1 or many depending on the process
        this.shift = []; // Time shifted value can be 1 or more depending on the process
        task.push(this);
    }

    checkID(id:string):boolean{
        return task.some((task) => task.id === id);
    }

    toString(): string {
        return `ID: ${this.id}
        Arrival Time: ${this.arrivalTime}
        CPU Burst: ${this.cpuBurst}
        CPU Burst Needed: ${this.cpuBurstNeeded}
        Waiting Time: ${this.waitingTime}
        Turnaround Time: ${this.turnaroundTime}
        Time Executed: ${this.timeExecuted}
        Time Shifted: ${this.shift}`;
        }

    removeTasks(){
        task = []
    }
    }


class AlgoPrinter{
    private util: AlgoUtil 

    constructor() {
        this.util = new AlgoUtil();
      }

}

export class Algorithm{
    private util: AlgoUtil
    constructor(){
        this.util = new AlgoUtil();
    }

    fcfs(taskList: Task[]){
        const n = "fcfs"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length && counter < 50){
            if (copyTaskList.length){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList,counter,queue)
            }

            if (queue.length > 0){
                if(!currentTask)
                    currentTask = this.util.taskExecute(queue.shift(),counter,n)
            }

            if (currentTask){
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0)
                    [currentTask, finishedTask] = this.util.processFinishedTask(currentTask,finishedTask,counter)
            }
            else{
                gantString += "-"
            }
            counter += 1;
        }

        return [gantString, "finished"]
    }

    spf(taskList: Task[]){
        const n = "spf"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length && counter < 50){
            if (copyTaskList.length){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList,counter,queue)
            }

            if (queue.length > 0){
                queue.sort((a,b) => a.cpuBurst - b.cpuBurst)
                if(!currentTask)
                    currentTask = this.util.taskExecute(queue.shift(),counter,n)
            }

            if (currentTask){
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0)
                    [currentTask, finishedTask] = this.util.processFinishedTask(currentTask,finishedTask,counter)
            }
            else{
                gantString += "-"
            }
            counter += 1;
        }

        return [gantString, "finished"]
    }
}

