import {
  Component,
  Output,
  EventEmitter,
  Input,
  inject,
  OnInit,
  ChangeDetectorRef,
  effect,
} from "@angular/core";
import { JsonPipe } from "@angular/common";
import { CoreService } from "src/app/services/core.service";
import { MatDialog } from "@angular/material/dialog";
import { navItems } from "../sidebar/sidebar-data";
import { TranslateService } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { TablerIconsModule } from "angular-tabler-icons";
import { MaterialModule } from "src/app/material.module";
import { BrandingComponent } from "../sidebar/vertical/branding.component";
import { AppSettings } from "src/app/config";
import { FormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { ImageUrlPipe } from "../../../../core/pipe/image/image-url.pipe";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { EmpresaService } from 'src/app/core/services/empresa/empresa.service';
// import { ImageUrlPipe } from '../../../../core/pipe/image/image-url.pipe';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
  color: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: "app-horizontal-header",
  standalone: true,
  imports: [
    RouterModule,
    TablerIconsModule,
    MaterialModule,
    BrandingComponent,
    NgScrollbarModule,
    ImageUrlPipe,
    JsonPipe,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class CustomAppHorizontalHeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() optionsChange = new EventEmitter<AppSettings>();

  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  private empresaService = inject(EmpresaService);
  hotelActivo = this.empresaService.hotelActivo;

  // 1. Exponemos la señal directamente (SÍ lleva paréntesis en el HTML)
  currentUser = this.authService.currentUser;

  isCollapse: boolean = false;
  showFiller = false;
  fullName: string = "Usuario";

  constructor(
    private settings: CoreService,
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang("en");

    // 2. Usamos effect() para escuchar la señal y actualizar fullName
    effect(() => {
      const user = this.currentUser();
      if (user) {
        const nombre =
          `${user.first_name || ""} ${user.last_name || ""}`.trim();
        this.fullName = nombre || user.email || "Usuario";
      } else {
        this.fullName = "Usuario";
      }
      // Forzamos la detección de cambios
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  toggleCollpase() {
    this.isCollapse = !this.isCollapse;
  }

  public selectedLanguage: any = {
    language: "English",
    code: "en",
    type: "US",
    icon: "/assets/images/flag/icon-flag-en.svg",
  };

  public languages: any[] = [
    {
      language: "English",
      code: "en",
      type: "US",
      icon: "/assets/images/flag/icon-flag-en.svg",
    },
    {
      language: "Español",
      code: "es",
      icon: "/assets/images/flag/icon-flag-es.svg",
    },
    {
      language: "Français",
      code: "fr",
      icon: "/assets/images/flag/icon-flag-fr.svg",
    },
    {
      language: "German",
      code: "de",
      icon: "/assets/images/flag/icon-flag-de.svg",
    },
  ];

  openDialog() {
    const dialogRef = this.dialog.open(AppHorizontalSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  options = this.settings.getOptions();

  private emitOptions() {
    this.optionsChange.emit(this.options);
  }

  setlightDark(theme: string) {
    this.options.theme = theme;
    this.emitOptions();
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(["/auth/login"]),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(["/auth/login"]);
      },
    });
  }

  private terminarSesionLocal() {
    // 2. Limpiamos las señales locales
    this.authService.clearSession();

    // 3. Avisamos al usuario

    // 4. Redirigimos al login
    this.router.navigate(["/auth/login"]);
  }
  showError(statusText: any) {
    throw new Error("Method not implemented.");
  }

  notifications: notifications[] = [
    {
      id: 1,
      img: "/assets/images/profile/user-1.jpg",
      title: "Roman Joined the Team!",
      subtitle: "Congratulate him",
    },
    {
      id: 2,
      img: "/assets/images/profile/user-2.jpg",
      title: "New message received",
      subtitle: "Salma sent you new message",
    },
    {
      id: 3,
      img: "/assets/images/profile/user-3.jpg",
      title: "New Payment received",
      subtitle: "Check your earnings",
    },
    {
      id: 4,
      img: "/assets/images/profile/user-4.jpg",
      title: "Jolly completed tasks",
      subtitle: "Assign her new tasks",
    },
    {
      id: 5,
      img: "/assets/images/profile/user-5.jpg",
      title: "Hitesh Joined the Team!",
      subtitle: "Congratulate him",
    },
  ];

  profiledd: profiledd[] = [];

  apps: apps[] = [
    {
      id: 1,
      img: "/assets/images/svgs/icon-dd-chat.svg",
      title: "Chat Application",
      subtitle: "Messages & Emails",
      link: "/apps/chat",
    },
    {
      id: 2,
      img: "/assets/images/svgs/icon-dd-cart.svg",
      title: "Todo App",
      subtitle: "Completed task",
      link: "/apps/todo",
    },
    {
      id: 3,
      img: "/assets/images/svgs/icon-dd-invoice.svg",
      title: "Invoice App",
      subtitle: "Get latest invoice",
      link: "/apps/invoice",
    },
    {
      id: 4,
      img: "/assets/images/svgs/icon-dd-date.svg",
      title: "Calendar App",
      subtitle: "Get Dates",
      link: "/apps/calendar",
    },
    {
      id: 5,
      img: "/assets/images/svgs/icon-dd-mobile.svg",
      title: "Contact Application",
      subtitle: "2 Unsaved Contacts",
      link: "/apps/contacts",
    },
    {
      id: 6,
      img: "/assets/images/svgs/icon-dd-lifebuoy.svg",
      title: "Tickets App",
      subtitle: "Create new ticket",
      link: "/apps/tickets",
    },
    {
      id: 7,
      img: "/assets/images/svgs/icon-dd-message-box.svg",
      title: "Email App",
      subtitle: "Get new emails",
      link: "/apps/email/inbox",
    },
    {
      id: 8,
      img: "/assets/images/svgs/icon-dd-application.svg",
      title: "Courses",
      subtitle: "Create new course",
      link: "/apps/courses",
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: "Pricing Page",
      link: "/theme-pages/pricing",
    },
    {
      id: 2,
      title: "Authentication Design",
      link: "/authentication/login",
    },
    {
      id: 3,
      title: "Register Now",
      link: "/authentication/side-register",
    },
    {
      id: 4,
      title: "404 Error Page",
      link: "/authentication/error",
    },
    {
      id: 5,
      title: "Notes App",
      link: "/apps/notes",
    },
    {
      id: 6,
      title: "Employee App",
      link: "/apps/employee",
    },
    {
      id: 7,
      title: "Todo Application",
      link: "/apps/todo",
    },
    {
      id: 8,
      title: "Treeview",
      link: "/theme-pages/treeview",
    },
  ];
}

@Component({
  selector: "app-search-dialog",
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule],
  templateUrl: "search-dialog.component.html",
})
export class AppHorizontalSearchDialogComponent {
  searchText: string = "";
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);
}
