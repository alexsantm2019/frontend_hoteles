import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.el.nativeElement.value;

    // Reemplaza todo lo que no sea dígito o punto decimal
    this.el.nativeElement.value = initalValue.replace(/[^0-9.]/g, '');

    // Si el valor cambió (se eliminaron letras), forzamos el evento change para que el form lo detecte
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text/plain');
    // Si se pega texto con letras, prevenimos la acción
    if (pastedText && /[^0-9.]/.test(pastedText)) {
      event.preventDefault();
    }
  }
}
