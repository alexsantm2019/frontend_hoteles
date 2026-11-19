import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCedula]',
  standalone: true,
})
export class CedulaDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.el.nativeElement.value;

    // 1. Reemplaza todo lo que no sea número
    let newValue = initalValue.replace(/[^0-9]/g, '');

    // 2. Corta el string a 10 caracteres máximo
    if (newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }

    this.el.nativeElement.value = newValue;

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text/plain');
    // Si se pega texto que no sean números puros, prevenimos la acción
    if (pastedText && /[^0-9]/.test(pastedText)) {
      event.preventDefault();
    }
  }
}
