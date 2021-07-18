import { Component, ErrorHandler, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import Task from '../Task';
import { promisify, sleep } from '../util';

class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    console.log(error);
    // do something with the exception
  }
}

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss'],
  providers:  [{provide: ErrorHandler, useClass: MyErrorHandler}]
})
export class TaskManagerComponent implements OnInit {

  tasks: Array<Task> = [];
  message = 'status';
  keyword = 'ping';

  constructor(
    private electronService: ElectronService) {
      if (electronService.isElectron) {
        console.log('Run in electron');
        console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
        console.log('NodeJS childProcess', this.electronService.childProcess);
      } else {
        console.log('Run in browser');
      }
    }

  ngOnInit(): void {
    if (this.electronService.isElectron) {
      try {
        this.init();
      } catch (error) {
        console.log('Init failed, reason: ', error.message);
      }
    }
  }

  async init(): Promise<void> {
    const { spawn } = this.electronService.childProcess;
    // start new ping process
    spawn('ping', ['-t', 'google.com'], { detached: true });
    await sleep(1000);
    this.searchTasksByName(this.keyword);
  }

  async searchTasksByName(taskName: string) {
    const exec = promisify(this.electronService.childProcess.exec);
    // TaskList /fi "ImageName eq ping.exe" (search for all running ping process)
    let cmd = `powershell.exe -Command "& {Get-Process '${taskName}'}"`;
    if (!taskName) {
      cmd = `powershell.exe -Command "& {Get-Process}"`;
    }
    console.log('Getting processes with command:', cmd);
    const stdout = (await exec(cmd)) as string;
    const tasks = stdout.split('\n').slice(3, -3).map(t => t.split(/\s+/).slice(5));
    this.tasks = tasks.map(task => {
      const [cpu,PID,,...imageName] = task;
      return ({
        name: imageName.join(' '),
        cpu,
        pid: PID,
      }) as Task;
    });
  }

  async killTask(pid: string): Promise<void> {
    try {
      const exec = promisify(this.electronService.childProcess.exec);
      this.message = (await exec(`TaskKill /PID ${pid} /F`)) as string;
      this.searchTasksByName(this.keyword);
    } catch (err) {
      this.message = err.message;
    }
  }

}
