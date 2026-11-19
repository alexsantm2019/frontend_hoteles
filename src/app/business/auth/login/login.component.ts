import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../../core/services/auth/auth.service";
import { EmpresaService } from "../../../core/services/empresa/empresa.service";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MaterialModule } from "../../../material.module";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"], // Si tienes estilos, asegúrate que el nombre coincida
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private empresaService = inject(EmpresaService);

  // Formulario reactivo que coincide con los formControlName del HTML
  form = new FormGroup({
    uname: new FormControl("", [Validators.required, Validators.minLength(3)]),
    password: new FormControl("", [Validators.required]),
  });

  // Signals para manejar el estado de la UI
  loading = signal(false);
  error = signal<string | null>(null);

  // Getter para facilitar el acceso a los errores en el HTML
  get f() {
    return this.form.controls;
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Mapeamos 'uname' (que es el input del HTML) al 'email' que espera Django
    const credentials = {
      username: this.form.value.uname as string,
      password: this.form.value.password as string,
    };

    this.auth.login(credentials).subscribe({
      next: () => {
        this.loading.set(false);

        // Cargar los hoteles a los que tiene acceso
        this.empresaService.cargarMisHoteles().subscribe({
          next: (hoteles) => {
            console.log("Antes de hoteles: " + hoteles.length)
            if (hoteles.length === 1) {
              // Si solo tiene 1 hotel, lo seleccionamos automáticamente
              this.empresaService.seleccionarHotel(hoteles[0]);
              this.router.navigate(['/business/dashboard']);
            } else if (hoteles.length > 1) {
              console.log('Tengo  que seleccionar hote: ');
              // Si tiene varios, lo mandamos al selector
              this.router.navigate(['/auth/selector-hotel']);
            } else {
              // Si no tiene hoteles, va al dashboard (o muestra error)
              this.router.navigate(['/business/dashboard']);
            }
          },
          error: () => {
            this.router.navigate(['/business/dashboard']);
          },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail || 'Error al iniciar sesión.');
      },
    });
  }
}
