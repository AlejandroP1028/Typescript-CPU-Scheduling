import { Task } from "./cpu";

export class AlgoUtil {
    taskWaitingTime(timeExecuted: number, arrivalTime: number): number {
        // waiting time = time executed - arrival time
        return timeExecuted - arrivalTime;
      }

      taskTurnaroundTime(timeOfCompletion:number, arrivalTime:number):number {
        // time of completion - arrival time
        return timeOfCompletion - arrivalTime;
      }
    getTotalBurst(taskList: Task[]): number {
        return taskList.reduce((totalBurst, task) => totalBurst + task.cpuBurst, 0);
    }

    avg(list:number[]){
         return (list.reduce((num,i)=> num += i,0))/list.length;
    }

    sortList(taskList:Task[],choice = 0):Task[]{
        // sort by remaining time
        if (choice === 1){
            return taskList.sort((a, b) => a.cpuBurstNeeded - b.cpuBurstNeeded);
        }
        return taskList.sort((a, b) => a.arrivalTime - b.arrivalTime);
    }

    addToQueue(taskList:Task[], counter:number, queue:Task[],algorithmSteps:string ): [Task[], Task[],string]{
        while (taskList.length > 0 && taskList[0].arrivalTime <= counter){
            const shifted = taskList.shift()
            if (shifted){
                queue.push(shifted);
                algorithmSteps += `${shifted.id}>~-`
            }

        }
        return [queue, taskList,algorithmSteps]
    }

    // add time
    taskExecute(task: Task, counter: number, type:string, as: string): [Task,string]{
        as += `${task.id}>*-`
        if(type === "nonpreemptive"){
            task.timeExecuted.push(counter)
            task.waitingTime = this.taskWaitingTime(counter,task.arrivalTime)
        }else if(type === "preemptive"){
            task.timeExecuted.push(counter);
            if (task.timeExecuted.length > 1) {
              const waitingTimeY = this.taskWaitingTime(task.timeExecuted[task.timeExecuted.length - 1], task.shift[task.shift.length - 1]) ;
              task.waitingTime += waitingTimeY;
            } else {
              task.waitingTime = this.taskWaitingTime(counter, task.arrivalTime);
            }
        }
        return [task,as]
    }

    processFinishedTask(task: Task, finishedTasks: Task[], counter: number, as: string): [Task, Task[],string]{
        as += `${task.id}<*-${task.id}>_-`
        const shifted = counter + 1
        task.shift.push(shifted);
        task.turnaroundTime = this.taskTurnaroundTime(shifted,task.arrivalTime)
        finishedTasks.push(task);
        return [null,finishedTasks,as]
    }

    onSliceEnd(task: Task,counter: number,queue: Task[],as: string): [null,Task[],string]{
        as += `${task.id}<*-${task.id}>~-`
        task.shift.push(counter)
        queue.push(task)
        return [null,queue,as]
    }
    }

    