import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { MulterFile } from 'multer';
import { isNil } from 'lodash';

@Injectable()
export class UtilService {
  constructor() {}

  async readExcelBuffer(files: Array<MulterFile>, excelOptions) {
    let {
      startDate = new Date().setHours(0, 0, 0, 0),
      endDate = new Date().setHours(23, 59, 59, 999),
      deviceName,
    } = excelOptions;

    const data = [];
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (isNil(deviceName)) deviceName = 'Sensor';
    files.forEach((file, index) => {
      const buffer = file.buffer;
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonXlx = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const filtered = jsonXlx.filter((item) => {
        const dateSample = new Date((item[0] - 25569) * 86400 * 1000);
        if (dateSample >= startDate && dateSample <= endDate) {
          return dateSample >= startDate && dateSample <= endDate;
        }
      });
      data.push({
        name: `${deviceName} ${index + 1}`,
        values: filtered,
      });
    });

    console.log(data);
    const sensor1Values = data[0]?.values || [];

    const sensorValuesLegible = sensor1Values.map((item) => {
      const dateSeries = item[0];
      const hourNumberSeries = item[1];
      const date = new Date((dateSeries - 25569) * 86400 * 1000);
      const legibleDate = date.toISOString().split('T')[0];
      const hour = new Date((hourNumberSeries - 25569) * 86400 * 1000);
      const legibleHour = hour.toISOString().split('T')[1];
      return [legibleDate, legibleHour, item[2]];
    });

    const output = {
      name: `${deviceName} 1`,
      values: sensorValuesLegible.map((sensor1Value, index) => {
        const otherSensorsValues = data.map((sensor) => sensor.values[index].slice(2));
        return [...sensor1Value.slice(0, 2), ...otherSensorsValues.flat()];
      }),
    };

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['Fecha', 'Hora', ...data.map((sensor) => sensor.name)]]);

    output.values.forEach(([fecha, hora, ...valores]) => {
      const fila = [fecha, hora];
      fila.push(...valores);
      XLSX.utils.sheet_add_aoa(worksheet, [fila], { origin: -1 });
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    /*const filename = `excelFiles/${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filename);
    const file = fs.createReadStream(join(process.cwd(), filename));*/

    return excelBuffer;
  }

  converterExcelDate(excelNumber: number) {
    return new Date((excelNumber - 25569) * 86400 * 1000);
  }

  roundUpToSecond(date: Date) {
    date.setSeconds(date.getSeconds() + 1);
    date.toString();
    if (date.toString().endsWith('999Z')) {
      return new Date(date.toString().slice(0, -3) + 'Z');
    }
    return new Date(date.toString());
  }
}
/*
{
  "name" : 'Sensor 1',
  "values" : [
    [ 45272.40277777778, 45272.40277777778, 14.9, 14.9 ... ],
    [ 45272.40347222222, 45272.40347222222, 14.6, 14.6 ... ],
    [ 45272.40416666667, 45272.40416666667, 14.3, 14.3 ... ],
    [ 45272.404861111114, 45272.404861111114, 14, 14 ... ],
    [ 45272.40555555555, 45272.40555555555, 13.8, 13.8 ... ]
  ]
}
{
  "name" : 'Sensor 2',
  "values" : [
    [ 45272.40277777778, 45272.40277777778, 14.9 ],
    [ 45272.40347222222, 45272.40347222222, 14.6 ],
    [ 45272.40416666667, 45272.40416666667, 14.3 ],
    [ 45272.404861111114, 45272.404861111114, 14 ],
    [ 45272.40555555555, 45272.40555555555, 13.8 ]
  ]
}

[{
  name: 'Sensor 1',
  values: [
    [ 45272.40277777778, 45272.40277777778, 14.9 ],
    [ 45272.40347222222, 45272.40347222222, 14.6 ],
    [ 45272.40416666667, 45272.40416666667, 14.3 ],
    [ 45272.404861111114, 45272.404861111114, 14 ],
    [ 45272.40555555555, 45272.40555555555, 13.8 ]
  ]
}
{
  name: 'Sensor 2',
  values: [
    [ 45272.40277777778, 45272.40277777778, 14.9 ],
    [ 45272.40347222222, 45272.40347222222, 14.6 ],
    [ 45272.40416666667, 45272.40416666667, 14.3 ],
    [ 45272.404861111114, 45272.404861111114, 14 ],
    [ 45272.40555555555, 45272.40555555555, 13.8 ]
  ]
}] */
