import { Pipe, PipeTransform } from '@angular/core';
import { SourceInfo } from './SourceInfo';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: Array<SourceInfo>, args: string): any {
    array.sort((a: SourceInfo, b: SourceInfo) => {
      if (a.score < b.score) {
        return 1;
      } else if (a.score > b.score) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}