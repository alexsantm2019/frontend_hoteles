import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cedulaEcuatorianaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cedula = control.value;
    if (!cedula) return null; // Dejamos que 'required' maneje los vacíos

    if (cedula.length !== 10) {
      return { cedulaInvalida: 'La cédula debe tener 10 dígitos' };
    }

    // Algoritmo de validación de cédula ecuatoriana (Módulo 10)
    const digitoRegion = parseInt(cedula.substring(0, 2), 10);
    if ((digitoRegion < 1 || digitoRegion > 24) && digitoRegion !== 30) {
      return { cedulaInvalida: 'Código de provincia inválido' };
    }

    const tercerDigito = parseInt(cedula.substring(2, 3), 10);
    if (tercerDigito >= 6) {
      return { cedulaInvalida: 'Tercer dígito inválido' };
    }

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }

    const digitoVerificador = parseInt(cedula.charAt(9), 10);
    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const resultado = decenaSuperior - suma;

    if (resultado !== digitoVerificador) {
      return { cedulaInvalida: 'Cédula incorrecta' };
    }

    return null; // Es válida
  };
}
