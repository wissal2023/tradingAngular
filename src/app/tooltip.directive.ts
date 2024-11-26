import { Directive, ElementRef, Input, OnDestroy, HostListener } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipContent: string = '';
  private tooltip: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.tooltip) return;
    
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'custom-tooltip';
    this.tooltip.textContent = this.tooltipContent;
    document.body.appendChild(this.tooltip);

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    this.tooltip.style.top = `${hostPos.top - this.tooltip.offsetHeight - 10}px`;
    this.tooltip.style.left = `${hostPos.left + (hostPos.width / 2) - (this.tooltip.offsetWidth / 2)}px`;
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  ngOnDestroy() {
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }
}