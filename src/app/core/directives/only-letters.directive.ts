import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]',
  standalone: true,
})
export class OnlyLettersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.el.nativeElement.value;
    // Solo permite letras, espacios y acentos
    this.el.nativeElement.value = initalValue.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
      '',
    );

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
