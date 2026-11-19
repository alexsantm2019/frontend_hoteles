import { Component, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { isPlatformBrowser } from "@angular/common"; // <-- IMPORTANTE
import { CoreService } from "src/app/services/core.service";
import { AppSettings } from "src/app/config";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { MaterialModule } from "src/app/material.module";

@Component({
  selector: "app-blank",
  templateUrl: "./blank.component.html",
  styleUrls: [],
  imports: [RouterOutlet, MaterialModule, CommonModule],
})
export class BlankComponent implements OnInit {
  private htmlElement!: HTMLHtmlElement;
  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    @Inject(PLATFORM_ID) private platformId: Object, // <-- Inyectamos PLATFORM_ID
  ) {}

  ngOnInit() {
    // ✅ SOLO ejecutamos esto si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.htmlElement = document.querySelector("html")!;
      this.receiveOptions(this.options);
    }
  }

  receiveOptions(options: AppSettings): void {
    // Verificación extra por si acaso
    if (!this.htmlElement) return;

    this.toggleDarkTheme(options);
    this.toggleColorsTheme(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === "dark") {
      this.htmlElement.classList.add("dark-theme");
      this.htmlElement.classList.remove("light-theme");
    } else {
      this.htmlElement.classList.remove("dark-theme");
      this.htmlElement.classList.add("light-theme");
    }
  }

  toggleColorsTheme(options: AppSettings) {
    this.htmlElement.classList.forEach((className) => {
      if (className.endsWith("_theme")) {
        this.htmlElement.classList.remove(className);
      }
    });

    this.htmlElement.classList.add(options.activeTheme);
  }
}
