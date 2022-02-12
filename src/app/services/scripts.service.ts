import { ElementRef, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  private scripts: any = {};

  constructor(
    private readonly elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    var promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        //load script
        let script:HTMLScriptElement = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.id = name
        script.async = true
        this.scripts[name].loaded = true;
        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({script: name, loaded: true, status: 'Loaded'});
        };
        // resolve({ script: name, loaded: true, status: 'Loaded' });
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('body')[0].appendChild(script);      }
    });
  }
}

interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'wow', src: '../../assets/js/wow.min.js' },
  { name: 'rangeSlider', src: '../../../assets/js/ion.rangeSlider.min.js' }
];