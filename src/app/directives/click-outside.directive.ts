import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  @HostListener('document:click', ['$event.target'])
  @Output() clickOutsideValue = new EventEmitter<boolean>(); // Emit an event when clicked outside

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    console.log("ClickOutsideDirective  onClick  clickedInside:", clickedInside)
    if (!clickedInside) {
      this.hideElement();      
      console.log('close')
      // this.clickOutsideValue.emit(false)
    }
  }

  private hideElement() {
    // Use Renderer2 to hide the element
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }

  showElement() {
    // Use Renderer2 to show the element
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
  }

}
