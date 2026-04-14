import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'square',
})
export class SquarePipe implements PipeTransform {
  transform(value:number,pow:number=2):number {
    return Math.pow(value,pow)
  }
}
