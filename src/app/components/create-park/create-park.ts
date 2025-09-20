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
  backendErrors: { [key: string]: string[] } = {};
  loading: boolean = false;

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

  modoEdicion = false;
  idEditar: number | null = null;
  imagenNoEncontrada = false;
  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkService: ParkService,
    private ngZone: NgZone
  ) {}

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

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    this.map = L.map('map').setView(
      [this.parque.park_latitude!, this.parque.park_longitude!],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([this.parque.park_latitude!, this.parque.park_longitude!]).addTo(
      this.map
    );
  }

  // Actualizar posición del mapa cuando cambie lat/lng
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

  // 🔹 Llamar updateMap() cuando se escriban coordenadas
  onCoordinatesChange() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.updateMap(), 0);
    });
  }

  getImagenUrl(): string | null {
    const url = this.parque.park_img_uri || '';

    // En modo edición, concatenamos el storage
    const finalUrl = this.modoEdicion ? `https://azuritaa33.sg-host.com/storage/${url}` : url;

    // Validar que sea una URL con extensión de imagen
    if (/\.(jpe?g|png)$/i.test(finalUrl)) {
      return finalUrl;
    }

    return null;
  }

  guardarParque() {
    if (this.modoEdicion) {
      this.actualizarParque();
    } else {
      this.crearParque();
    }
  }

  crearParque() {
    // Remove 'id' from the object before creating, since it's not required for new parks
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
            err?.error?.message || err?.message || 'Error desconocido al crear parque';
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
      const mensaje = err?.error?.message || err?.message || 'Error desconocido al crear parque';
      Swal.fire({
        icon: 'error',
        title: 'Error al crear parque',
        text: mensaje,
      });
    }
  }

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
          /* Read more about isConfirmed, isDenied below */
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
                  err?.error?.message || err?.message || 'Error desconocido al actualizar parque';
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
          err?.error?.message || err?.message || 'Error desconocido al actualizar parque';
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar parque',
          text: mensaje,
        });
      }
    }
  }

  regresar() {
    this.router.navigate(['/parques']);
  }
}
