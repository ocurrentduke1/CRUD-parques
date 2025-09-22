import { AfterViewInit, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';
import { Park } from '../../models/park';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-create-park',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './create-park.html',
})
export class CreatePark implements AfterViewInit {
  /**
   * Estructura para almacenar errores provenientes del backend.
   * La clave es el campo y el valor es un arreglo de mensajes de error.
   */
  backendErrors: { [key: string]: string[] } = {};

  /** Bandera que indica si hay operaciones cargando. */
  loading: boolean = false;

  /**
   * Objeto del parque que se está creando o editando.
   * Partial<Park> permite que no todos los campos sean obligatorios.
   */
  parque: Partial<Park> = {
    id: undefined,
    park_name: '',
    park_abbreviation: '',
    park_img_uri: '',
    park_address: '',
    park_city: '',
    park_state: 'Jalisco',
    park_zip_code: 0,
    park_latitude: 0,
    park_longitude: 0,
  };

  /** Indica si el componente está en modo edición. */
  modoEdicion = false;

  /** Guarda el id del parque que se está editando (si aplica). */
  idEditar: number | null = null;

  /** Indica si la imagen no fue encontrada. */
  imagenNoEncontrada = false;

  /** Referencia al mapa de Leaflet. */
  private map!: L.Map;

  /** Referencia al marcador del mapa. */
  private marker!: L.Marker;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkService: ParkService,
    private ngZone: NgZone
  ) {}

  /**
   * Hook de inicialización.
   * - Verifica si existe un `id` en la ruta.
   * - Si hay id → activa modo edición y obtiene el parque del backend.
   * - Si no hay id → prepara para crear un nuevo parque.
   */
  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.modoEdicion = !!id;
      if (id) {
        this.idEditar = +id;
        this.parkService.getById(+id).subscribe((parque) => {
          this.parque = { ...parque };
          this.loading = false;
          this.updateMap();
        });
      } else {
        this.loading = false;
      }
    });
  }

  /**
   * Hook que se ejecuta después de que la vista ha sido inicializada.
   * Se asegura de que el contenedor del mapa exista antes de inicializar Leaflet.
   */
  ngAfterViewInit() {
    console.log('ngAfterViewInit ejecutado ✅');

    setTimeout(() => {
      const el = document.getElementById('map');
      if (el) {
        console.log('Contenedor #map encontrado ✅');
        this.initMap();
      } else {
        console.error('❌ No se encontró el contenedor #map');
      }
    }, 300);
  }

  /**
   * Hook que destruye el mapa al destruir el componente
   * para liberar memoria y recursos.
   */
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  /**
   * Inicializa el mapa de Leaflet con las coordenadas del parque actual.
   */
  private initMap() {
    this.map = L.map('map').setView(
      [this.parque.park_latitude!, this.parque.park_longitude!],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([
      this.parque.park_latitude!,
      this.parque.park_longitude!,
    ]).addTo(this.map);
  }

  /**
   * Actualiza la posición del mapa y el marcador
   * con las coordenadas actuales del parque.
   */
  updateMap() {
    if (this.map && this.marker) {
      const lat = Number(this.parque.park_latitude);
      const lng = Number(this.parque.park_longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.marker.setLatLng([lat, lng]);
        this.map.setView([lat, lng], 13);
      }
    }
  }

  /**
   * Evento disparado al cambiar coordenadas manualmente en el formulario.
   * Actualiza el mapa fuera del ciclo de Angular para optimizar rendimiento.
   */
  onCoordinatesChange() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.updateMap(), 0);
    });
  }

  /**
   * Obtiene la URL final de la imagen del parque validando extensión
   * y agregando prefijo de storage en caso de edición.
   */
  getImagenUrl(): string | null {
    const url = this.parque.park_img_uri || '';
    const finalUrl = this.modoEdicion
      ? `https://azuritaa33.sg-host.com/storage/${url}`
      : url;

    if (/\.(jpe?g|png)$/i.test(finalUrl)) {
      return finalUrl;
    }

    return null;
  }

  /**
   * Decide si se debe crear un parque nuevo o actualizar uno existente.
   */
  guardarParque() {
    if (this.modoEdicion) {
      this.actualizarParque();
    } else {
      this.crearParque();
    }
  }

  /**
   * Crea un nuevo parque en el backend usando el servicio.
   * Muestra alertas de éxito o error con SweetAlert2.
   */
  crearParque() {
    const { id, park_img_uri, ...rest } = this.parque;
    const parqueParaCrear = {
      ...rest,
      park_img_url: this.parque.park_img_uri ?? '',
    };
    this.backendErrors = {};
    try {
      this.parkService.create(parqueParaCrear as Park).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Parque creado',
            text: 'El parque ha sido creado exitosamente',
          });
          this.router.navigate(['/parques']);
        },
        error: (err) => {
          if (err?.error?.errors) {
            this.backendErrors = err.error.errors;
          }
          const mensaje =
            err?.error?.message ||
            err?.message ||
            'Error desconocido al crear parque';
          Swal.fire({
            icon: 'error',
            title: 'Error al crear parque',
            text: mensaje,
          });
        },
      });
    } catch (err: any) {
      if (err?.error?.errors) {
        this.backendErrors = err.error.errors;
      }
      const mensaje =
        err?.error?.message ||
        err?.message ||
        'Error desconocido al crear parque';
      Swal.fire({
        icon: 'error',
        title: 'Error al crear parque',
        text: mensaje,
      });
    }
  }

  /**
   * Actualiza un parque existente en el backend.
   * - Pide confirmación al usuario antes de enviar los cambios.
   * - Maneja errores y respuestas con SweetAlert2.
   */
  actualizarParque() {
    if (this.idEditar !== null) {
      const parqueConId = {
        id: this.idEditar,
        park_name: this.parque.park_name ?? '',
        park_abbreviation: this.parque.park_abbreviation ?? '',
        park_img_uri: this.parque.park_img_uri ?? '',
        park_address: this.parque.park_address ?? '',
        park_city: this.parque.park_city ?? '',
        park_state: this.parque.park_state ?? '',
        park_zip_code: this.parque.park_zip_code ?? 0,
        park_latitude: this.parque.park_latitude ?? 0,
        park_longitude: this.parque.park_longitude ?? 0,
      };
      console.log('Actualizando parque, datos enviados:', parqueConId);
      this.backendErrors = {};
      try {
        Swal.fire({
          title: '¿Quieres guardar los cambios?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: 'No guardar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.parkService.update(this.idEditar!, parqueConId).subscribe({
              next: () => {
                Swal.fire('¡Guardado!', '', 'success');
                this.router.navigate(['/parques']);
              },
              error: (err) => {
                if (err?.error?.errors) {
                  this.backendErrors = err.error.errors;
                }
                const mensaje =
                  err?.error?.message ||
                  err?.message ||
                  'Error desconocido al actualizar parque';
                Swal.fire({
                  icon: 'error',
                  title: 'Error al actualizar parque',
                  text: mensaje,
                });
              },
            });
          } else if (result.isDenied) {
            Swal.fire('Los cambios no se guardaron', '', 'info');
            this.router.navigate(['/parques']);
          }
        });
      } catch (err: any) {
        if (err?.error?.errors) {
          this.backendErrors = err.error.errors;
        }
        const mensaje =
          err?.error?.message ||
          err?.message ||
          'Error desconocido al actualizar parque';
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar parque',
          text: mensaje,
        });
      }
    }
  }

  /**
   * Regresa al listado de parques sin guardar cambios.
   */
  regresar() {
    this.router.navigate(['/parques']);
  }
}
