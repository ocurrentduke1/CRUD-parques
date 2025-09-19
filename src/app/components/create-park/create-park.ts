import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';
import { Park } from '../../models/park';

@Component({
  selector: 'app-create-park',
  imports: [RouterModule, FormsModule],
  templateUrl: './create-park.html',
})
export class CreatePark {
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

  constructor(private router: Router, private route: ActivatedRoute, private parkService: ParkService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.modoEdicion = !!id;
      if (id) {
        this.idEditar = +id;
        this.parkService.getById(+id).subscribe(parque => {
          this.parque = { ...parque };
        });
      }
    });
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
    console.log('Enviando al backend:', parqueParaCrear);
    try {
      this.parkService.create(parqueParaCrear as Park).subscribe({
        next: () => {
          this.router.navigate(['/parques']);
        },
        error: (err) => {
          const mensaje = err?.error?.message || err?.message || 'Error desconocido al crear parque';
          window.alert('Error: ' + mensaje);
        }
      });
    } catch (err: any) {
      const mensaje = err?.error?.message || err?.message || 'Error desconocido al crear parque';
      window.alert('Error: ' + mensaje);
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
      try {
        this.parkService.update(this.idEditar, parqueConId).subscribe({
          next: () => {
            this.router.navigate(['/parques']);
          },
          error: (err) => {
            const mensaje = err?.error?.message || err?.message || 'Error desconocido al actualizar parque';
            window.alert('Error: ' + mensaje);
          }
        });
      } catch (err: any) {
        const mensaje = err?.error?.message || err?.message || 'Error desconocido al actualizar parque';
        window.alert('Error: ' + mensaje);
      }
    }
  }
}
