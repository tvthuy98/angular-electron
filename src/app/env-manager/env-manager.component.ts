import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { buildPowerShellCmd, promisify } from '../util';

interface ENV {
  envName: string;
  envValue: string;
}

@Component({
  selector: 'app-env-manager',
  templateUrl: './env-manager.component.html',
  styleUrls: ['./env-manager.component.scss']
})
export class EnvManagerComponent implements OnInit {

  envVars: Array<ENV> = [];
  message = 'status';
  newEvnName = '';
  newEnvValue = '';

  constructor(private electronService: ElectronService) {
  }

  ngOnInit(): void {
    this.loadEnvVariables();
  }

  async loadEnvVariables() {
    if (this.electronService.isElectron) {
      try {
        const exec = promisify(this.electronService.childProcess.exec);
        const targetEnv = '[System.EnvironmentVariableTarget]::User';
        const cmd = buildPowerShellCmd(`[System.Environment]::GetEnvironmentVariables(${targetEnv})`);
        const res = (await exec(cmd)) as string;
        const rows = res.split('\n').slice(3, -3);
        const envs: Array<ENV> = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < rows.length; i ++) {
          const [envName, ...values] = rows[i].split(/\s+/);
          envs.push(({envName, envValue: values.join(' ')}) as ENV);
        }
        console.log(envs);
        this.envVars = envs;
      } catch(err) {
        console.log(err);
        this.message = err.message;
      }
    } else {
      console.log('Not electron');
    }
  }

  async setEnvVariable(envName: string, envValue: string) {
    if (this.electronService.isElectron) {
      try {
        const exec = promisify(this.electronService.childProcess.exec);
        const targetEnv = '[System.EnvironmentVariableTarget]::User';
        const cmd = `[System.Environment]::SetEnvironmentVariable('${envName}', '${envValue}', ${targetEnv})`;
        this.message = (await exec(buildPowerShellCmd(cmd))) as string;
        this.loadEnvVariables();
      } catch(err) {
        this.message = err.message;
      }
    }
  }
}
