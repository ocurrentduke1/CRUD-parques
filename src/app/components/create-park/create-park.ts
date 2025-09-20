import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';
import { Park } from '../../models/park';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-park',
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './create-park.html',
})
export class CreatePark {

  backendErrors: { [key: string]: string[] } = {};
  loading: boolean = false;

  parque: Partial<Park> = {
    id: undefined,
    park_name: '',
    park_abbreviation: '',
    park_img_uri: '',
    park_address: '',
    park_city: '',
    park_state: '',
    park_zip_code: 0,
    park_latitude: 0,
    park_longitude: 0,
  };

  modoEdicion = false;
  idEditar: number | null = null;
  imagenNoEncontrada = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkService: ParkService
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
        });
      } else {
        this.loading = false;
      }
    });
  }

  getImagenUrl(): string | null {
  const url = this.parque.park_img_uri || '';

  // En modo edición, concatenamos el storage
  const finalUrl = this.modoEdicion
    ? `https://azuritaa33.sg-host.com/storage/${url}`
    : url;

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
