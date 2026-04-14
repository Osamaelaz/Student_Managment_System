import { Directive, ElementRef, HostListener, input, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]',
})
export class HighlightCard implements OnChanges {

  @Input() externalColor: string = 'black';
  @Input('appHighlightCard') defaultColor: string = 'lightblue';

  constructor(private ele:ElementRef) {
        // this.ele.nativeElement.style.backgroundColor = this.defaultColor;
  }
  ngOnChanges(){
    this.ele.nativeElement.style.backgroundColor = this.defaultColor;
  }

 @HostListener('mouseover') over(){
    this.ele.nativeElement.style.backgroundColor = this.externalColor;
  }
  @HostListener('mouseout') out(){
    this.ele.nativeElement.style.backgroundColor = this.defaultColor;
  }
}
