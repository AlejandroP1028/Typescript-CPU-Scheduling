import { AlgoUtil } from "./util";

export type TaskInfo = {
    id: string,
    at: number,
    cb: number,
    wt: number,
    tt: number,
}
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
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.cpuBurst = cpuBurst;
        this.cpuBurstNeeded = cpuBurst;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.priority = priority;
        this.timeExecuted = []; // Time when executed can be 1 or many depending on the process
        this.shift = []; // Time shifted value can be 1 or more depending on the process
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
        let algorithmSteps = ""
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
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList,counter,queue,algorithmSteps)
            }

            if (queue.length > 0){
                if(!currentTask){
                    if (gantString[gantString.length - 1] === "-"){
                        gantString += "|"
                    }
                    [currentTask,algorithmSteps] = this.util.taskExecute(queue.shift(),counter,n,algorithmSteps)
                }
                    
            }

            if (currentTask){
                algorithmSteps += `${currentTask.id}^-`
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    gantString += "|";
                    [currentTask, finishedTask,algorithmSteps] = this.util.processFinishedTask(currentTask,finishedTask,counter,algorithmSteps)
                }
                    
            }
            else{
                algorithmSteps += `@^-`
                gantString += "-"
            }
            counter += 1;
            algorithmSteps += `|`
        }

        const info = taskList.map( (item: Task): TaskInfo=> {
            return {
                id: item.id,
                at: item.arrivalTime,
                cb: item.cpuBurst,
                wt: item.waitingTime,
                tt: item.turnaroundTime,
            }
        }
        )
        

        return [gantString, info,algorithmSteps]
    }

    spf(taskList: Task[]){
        let algorithmSteps = ""
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
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList,counter,queue,algorithmSteps)
            }

            if (queue.length > 0){
                queue.sort((a,b) => a.cpuBurst - b.cpuBurst)
                if(!currentTask){
                    if (gantString[gantString.length - 1] === "-"){
                        gantString += "|"
                    }
                    [currentTask,algorithmSteps] = this.util.taskExecute(queue.shift(),counter,n,algorithmSteps)
                }
            }

            if (currentTask){
                algorithmSteps += `${currentTask.id}^-`
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    gantString += "|";
                    [currentTask, finishedTask,algorithmSteps] = this.util.processFinishedTask(currentTask,finishedTask,counter,algorithmSteps)
                }

            }
            else{
                algorithmSteps += "@^-"
                gantString += "-"
            }
            counter += 1;
        }

        const info = taskList.map( (item: Task): TaskInfo=> {
            return {
                id: item.id,
                at: item.arrivalTime,
                cb: item.cpuBurst,
                wt: item.waitingTime,
                tt: item.turnaroundTime
            }
        }
        )
        return [gantString, info]
    }

    srtf(taskList: Task[]){
        let algorithmSteps = ""
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
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList,counter,queue,algorithmSteps)
            }

            if (queue.length > 0){
                queue.sort((a,b) => a.cpuBurstNeeded - b.cpuBurstNeeded)
                const shortest = queue[0]
                if(!currentTask || shortest.cpuBurstNeeded < currentTask.cpuBurstNeeded){
                    if (gantString[gantString.length - 1] === "-"){
                        gantString += "|"
                    }
                    if(currentTask){
                        //if there is a task currently executing then shift current task
                        algorithmSteps += `${currentTask.id}<*-${currentTask.id}>~-`
                        currentTask.shift.push(counter);
                        queue.push(currentTask);
                        gantString += "|"
                    }
                    [currentTask,algorithmSteps] = this.util.taskExecute(queue.shift() as Task,counter,n,algorithmSteps)

                }
                    
            }

            if (currentTask){
                algorithmSteps += `${currentTask.id}^-`
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    gantString += "|";
                    [currentTask, finishedTask,algorithmSteps] = this.util.processFinishedTask(currentTask,finishedTask,counter,algorithmSteps)
                }
                   
            }
            else{
                algorithmSteps += "@^-"
                gantString += "-"
            }
            algorithmSteps += "|"
            counter += 1;

        }
        const info = taskList.map( (item: Task): TaskInfo=> {
            return {
                id: item.id,
                at: item.arrivalTime,
                cb: item.cpuBurst,
                wt: item.waitingTime,
                tt: item.turnaroundTime
            }
        }
        )
        return [gantString, info, algorithmSteps]
    }

    rr(taskList: Task[],timeSlice: number){
        let algorithmSteps = ""
        console.log(timeSlice)
        let bol = false
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
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList,counter,queue,algorithmSteps)
            }

            if (queue.length > 0){
                if(!currentTask){
                    if(gantString[gantString.length-1] === "-")
                        gantString += "|";
                    [currentTask,algorithmSteps] = this.util.taskExecute(queue.shift(),counter,n,algorithmSteps)
                    revertSlice()
                }    
            }
            if(currentSlice === 0){
                bol = true;
                
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList, counter, queue,algorithmSteps);
                gantString += "|";
                [currentTask,queue,algorithmSteps] = this.util.onSliceEnd(currentTask,counter,queue,algorithmSteps)
                algorithmSteps += "|"
                revertSlice()
            }
            else  if (currentTask){
                algorithmSteps += `${currentTask.id}^-`
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                currentSlice -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    [currentTask, finishedTask,algorithmSteps] = this.util.processFinishedTask(currentTask,finishedTask,counter,algorithmSteps)
                    gantString += "|";
                    revertSlice()
                }
            }
            else{
                gantString += "-"
            }
            if (bol == false){
                counter += 1;
                algorithmSteps += "|"
            }

            bol = false
        }
        const info = taskList.map( (item: Task): TaskInfo=> {
            return {
                id: item.id,
                at: item.arrivalTime,
                cb: item.cpuBurst,
                wt: item.waitingTime,
                tt: item.turnaroundTime
            }
        }
        )
        return [gantString, info]

    }

    psnp(taskList: Task[]){
        let algorithmSteps = ""
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
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList,counter,queue,algorithmSteps)
            }

            if (queue.length > 0){
                //sort by priority
                queue.sort((a,b) => a.priority - b.priority)
                if(!currentTask){
                    if (gantString[gantString.length - 1] === "-"){
                        gantString += "|"
                    }
                    [currentTask,algorithmSteps] = this.util.taskExecute(queue.shift(),counter,n,algorithmSteps)
                }
                    
            }

            if (currentTask){
                algorithmSteps += `${currentTask.id}^-`
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                        [currentTask, finishedTask,algorithmSteps] = this.util.processFinishedTask(currentTask,finishedTask,counter,algorithmSteps)
                        gantString += "|"
                    
                }
                    
            }
            else{
                algorithmSteps += "@^-"
                gantString += "-"
            }
            algorithmSteps += "|"
            counter += 1;
        }
        

        const info = taskList.map( (item: Task): TaskInfo=> {
            return {
                id: item.id,
                at: item.arrivalTime,
                cb: item.cpuBurst,
                wt: item.waitingTime,
                tt: item.turnaroundTime
            }
        }
        )
        return [gantString, info]
    }
    
    psp(taskList: Task[]){
        let algorithmSteps = ""
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
                [queue, copyTaskList,algorithmSteps] = this.util.addToQueue(copyTaskList,counter,queue,algorithmSteps)
            }

            if (queue.length > 0){
                queue.sort((a,b) => a.priority - b.priority)
                const key = queue[0]
                if(!currentTask || key.priority < currentTask.priority){
                    if (gantString[gantString.length - 1] === "-"){
                        gantString += "|"
                    }
                    if(currentTask){
                        //if there is a task currently executing then shift current task
                        algorithmSteps += `${currentTask.id}<*-${currentTask.id}>~-`
                        currentTask.shift.push(counter);
                        gantString += "|"
                        queue.push(currentTask);
                    }
                    [currentTask,algorithmSteps] = this.util.taskExecute(queue.shift() as Task,counter,n,algorithmSteps)

                }
                    
            }

            if (currentTask){
                gantString += currentTask.id
                currentTask.cpuBurstNeeded -= 1;
                if (currentTask.cpuBurstNeeded === 0){
                    gantString += "|";
                    [currentTask, finishedTask,algorithmSteps] = this.util.processFinishedTask(currentTask,finishedTask,counter,algorithmSteps)
                }
                   
            }
            else{
                algorithmSteps += "@^-"
                gantString += "-"
            }


            counter += 1;
            algorithmSteps += "|"

        }
        const info = taskList.map( (item: Task): TaskInfo=> {
            return {
                id: item.id,
                at: item.arrivalTime,
                cb: item.cpuBurst,
                wt: item.waitingTime,
                tt: item.turnaroundTime
            }
        }
        )
        
        return [gantString, info]
    }
    
}

