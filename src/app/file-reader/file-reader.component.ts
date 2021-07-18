import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss']
})
export class FileReaderComponent implements OnInit {
  fileContent: string = null;
  message = 'status';

  constructor(private electronService: ElectronService) {

    }

  ngOnInit(): void {

  }

  async openFile() {
    if (this.electronService.isElectron) {
      try {
        const ipcRenderer = this.electronService.ipcRenderer;

      // calling remote service defined in $root/app/main.ts
      // more about ipcRenderer: https://www.electronjs.org/docs/api/ipc-renderer
      const selectedFile = await ipcRenderer.invoke('select-file', ['openFile', 'multiSelections']);
      this.fileContent = selectedFile.fileContent;
      this.message = 'opened file ' + selectedFile.filePaths[0];
      } catch (err) {
        this.message = err.message;
      }
    }
  }

}
