import { ToolsService } from "./tools.service";
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { add, format, isWithinInterval, parse, parseISO } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor(
    private tools: ToolsService
  ) { }

  async exportToExcel(data: any[], filename: string) {
    if (data.length > 0  &&  filename != '' ){
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), filename);
      XLSX.writeFile(wb, filename + '.xlsx');
    }else{
      this.tools.showAlert({
        header:'Alerta',
        subHeader:'Al parecer no hay datos en este rango de tiempo',
        cssClass:'alert-danger',
        buttons:['ok']
      })
    }
  }

  

  public async exportExcelToDate(exportExcelToDateOptions: exportExcelToDateOptions) {
    this.tools.showAlert({
      header:'Generar Excel ✔',
      subHeader:'Seleciona un intervalo de tiempo para generar un informe de Excel',
      cssClass:'alert-success',
      inputs: [{
        disabled:true,
        type:'text',
        value:'Fecha de Inicio',
      },{
        type: 'date',
        value: format(new Date(Date.now()), 'yyyy-MM-dd'),
        name: 'date_init',
      },{
        disabled:true,
        type:'text',
        value:'Fecha de Exclusion'
      },{
        type: 'date',
        value: format(new Date(Date.now()), 'yyyy-MM-dd'),
        name: 'date_finish',
        label:'dasdas'
      }],
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Exportar',
        handler: (val) => {
          if (val.date_init == val.date_finish) {
            this.exportToExcel(exportExcelToDateOptions.data.filter(element => format(parse(element['date'], 'M/d/yy - h:mm a', new Date(Date.now())), 'yyyy-MM-dd') == val.date_init), exportExcelToDateOptions.filename)
          } else {
            this.exportToExcel(exportExcelToDateOptions.data.filter((element) => {
              if (isWithinInterval(parse(element['date'], 'M/d/yy - h:mm a', new Date(Date.now())), {
                start: parse(val.date_init, 'yyyy-MM-dd', new Date(Date.now())),
                end: parse(val.date_finish, 'yyyy-MM-dd', new Date(Date.now()))
              })) {
                return element
              }
            }), exportExcelToDateOptions.filename)
          }

        }
      }]
    })
  }

}

export interface exportExcelToDateOptions {
  data: any[],
  filename: string
}