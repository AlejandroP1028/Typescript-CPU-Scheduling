import { AlgoUtil } from "./util";

let task: Task[] = [];

export class Task{
    id: string;
    priority: number;
    arrivalTime: number;
    cpuBurst: number;
    cpuBurstNeeded: number;
    waitingTime: number;
    turnaroundTime: number;
    timeExecuted: number[];
    shift: number[];
    constructor(id: string, arrivalTime: number, cpuBurst: number, priority?: number){
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
        this.priority = priority;
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
    //spf and psnp are similar the only difference is queue sort after queue check
    //same with srtf and psp the only difference is queue sort and what is prioritized
    
    private util: AlgoUtil
    constructor(){
        this.util = new AlgoUtil();
    }

    fcfs(taskList: Task[]){
        const n = "nonpreemptive"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length){
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
        const n = "nonpreemptive"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length){
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

    srtf(taskList: Task[]){
        const n = "preemptive"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length ){
            if (copyTaskList.length){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList,counter,queue)
            }

            if (queue.length > 0){
                queue.sort((a,b) => a.cpuBurstNeeded - b.cpuBurstNeeded)
                const shortest = queue[0]
                if(!currentTask || shortest.cpuBurstNeeded < currentTask.cpuBurstNeeded){
                    if(currentTask){
                        //if there is a task currently executing then shift current task
                        currentTask.shift.push(counter);
                        queue.push(currentTask);
                        gantString += "|"
                    }
                    currentTask = this.util.taskExecute(queue.shift() as Task,counter,n)

                }
                    
            }

            if (currentTask){
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    [currentTask, finishedTask] = this.util.processFinishedTask(currentTask,finishedTask,counter)
                }
                   
            }
            else{
                gantString += "-"
            }

            console.log(`Queue: ${queue.map(t => t.id).join(", ")}`);
            counter += 1;

        }
        
        return [gantString, "finished"]
    }

    rr(taskList: Task[],timeSlice: number){
        let currentSlice = timeSlice
        const revertSlice = () => {currentSlice = timeSlice}
        const n = "preemptive"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length ){
            if (copyTaskList.length){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList,counter,queue)
            }

            if (queue.length > 0){
                if(!currentTask){
                    currentTask = this.util.taskExecute(queue.shift(),counter,n)
                    revertSlice()
                }    
            }
            if(currentSlice === 0){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList, counter+1, queue);
                gantString += "|";
                [currentTask,queue] = this.util.onSliceEnd(currentTask,counter,queue)
                revertSlice()
            }
            else  if (currentTask){
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                currentSlice -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    [currentTask, finishedTask] = this.util.processFinishedTask(currentTask,finishedTask,counter)
                    gantString += "|";
                    revertSlice()
                }
            }
            else{
                gantString += "-"
            }
            counter += 1;
        }
        return [gantString, "finished"]

    }

    psnp(taskList: Task[]){
        const n = "nonpreemptive"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length){
            if (copyTaskList.length){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList,counter,queue)
            }

            if (queue.length > 0){
                //sort by priority
                queue.sort((a,b) => a.priority - b.priority)
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
    
    psp(taskList: Task[]){
        const n = "preemptive"
        let counter = 0;
        let queue:Task[] = [];
        let gantString = "";
        let currentTask:Task | null = null
        let finishedTask: Task[] = []
        taskList = this.util.sortList(taskList)
        let copyTaskList = [...taskList];

        while(finishedTask.length !== taskList.length ){
            if (copyTaskList.length){
                [queue, copyTaskList] = this.util.addToQueue(copyTaskList,counter,queue)
            }

            if (queue.length > 0){
                queue.sort((a,b) => a.priority - b.priority)
                const key = queue[0]
                if(!currentTask || key.priority < currentTask.priority){
                    if(currentTask){
                        //if there is a task currently executing then shift current task
                        currentTask.shift.push(counter);
                        gantString += "|"
                        queue.push(currentTask);
                    }
                    currentTask = this.util.taskExecute(queue.shift() as Task,counter,n)

                }
                    
            }

            if (currentTask){
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    gantString += "|";
                    [currentTask, finishedTask] = this.util.processFinishedTask(currentTask,finishedTask,counter)
                }
                   
            }
            else{
                gantString += "-"
            }

            console.log(`Queue: ${queue.map(t => t.id).join(", ")}`);
            counter += 1;

        }
        
        return [gantString, "finished"]
    }
    
}

