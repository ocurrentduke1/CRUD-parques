import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Park } from '../../models/park';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ParkService } from '../../services/park-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-park-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './park-list.html',
})
export class ParkList {
  parks: Park[] = [];

  constructor(private router: Router, private parkService: ParkService) {}

  ngOnInit(): void {
    this.parkService.getAllParks().subscribe((parks) => {
      this.parks = parks.data;
      console.log(this.parks);
    });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Seguro que desea eliminar este parque?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4BA6A5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.parkService.delete(id).subscribe({
          next: () => {
            this.parks = this.parks.filter((p) => p.id !== id);
          },
          error: (err) => {
            const mensaje = err?.error?.message || err?.message || 'Error al eliminar parque';
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar parque',
              text: mensaje,
            });
          },
        });
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El parque ha sido eliminado.',
          icon: 'success',
        });
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/parques/editar', id]);
  }
}
