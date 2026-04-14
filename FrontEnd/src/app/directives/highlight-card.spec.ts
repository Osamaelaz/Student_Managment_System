import { ElementRef } from '@angular/core';
import { HighlightCard } from './highlight-card';

describe('HighlightCard', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('div') } as ElementRef;
    const directive = new HighlightCard(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
