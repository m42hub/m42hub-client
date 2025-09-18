import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaks',
})
export class LinebreaksPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
  }
}
