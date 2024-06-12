let task: Task[] = [];

class Task{
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
    }

class AlgoUtil {
    getTotalBurst(taskList: Task[]): number {
        return taskList.reduce((totalBurst, task) => totalBurst + task.cpuBurst, 0);
    }

    avg(list:number[]){
         return (list.reduce((num,i)=> num += i,0))/list.length;
    }

    removeTasks(){
        task = [];
    }
}

class AlgoPrinter{
    private util: AlgoUtil 

    constructor() {
        this.util = new AlgoUtil();
      }
}
