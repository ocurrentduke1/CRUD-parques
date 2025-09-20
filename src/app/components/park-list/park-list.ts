import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Park } from '../../models/park';
import { Router, RouterModule } from '@angular/router';
import { ParkService } from '../../services/park-service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-park-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './park-list.html',
})
export class ParkList {
  parks: Park[] = [];
  filteredParks: Park[] = [];
  displayedParks: Park[] = [];
  selectedCity: string = '';
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private router: Router, private parkService: ParkService) {}

  ngOnInit(): void {
    this.loading = true; // inicio de carga
    this.parkService.getAllParks().subscribe({
      next: (parks) => {
        this.parks = parks.data;
        this.filteredParks = [...this.parks];
        this.displayedParks = [...this.parks];
        this.loading = false; // fin de carga
      },
      error: (err) => {
        console.error(err);
        this.loading = false; // ocultar spinner aunque haya error
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar parques',
          text: 'No se pudieron obtener los datos.',
        });
      },
    });
  }

  filtrarParques(): void {
    if (!this.selectedCity) {
      this.filteredParks = [...this.parks]; // todas las ciudades
    } else {
      this.filteredParks = this.parks.filter((p) => p.park_city === this.selectedCity);
    }
    this.buscarParques();
  }

  buscarParques(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.displayedParks = [...this.filteredParks];
    } else {
      this.displayedParks = this.filteredParks.filter((p) =>
        p.park_name.toLowerCase().includes(term)
      );
    }
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
      cancelButtonText: 'Cancelar',
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

  verDetalle(id: number): void {
    this.router.navigate(['/parques/detalle', id]);
  }
}
