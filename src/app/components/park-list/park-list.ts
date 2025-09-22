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
  // Arreglo que contiene todos los parques obtenidos del backend
  parks: Park[] = [];
  
  // Arreglo para almacenar los parques filtrados por ciudad
  filteredParks: Park[] = [];
  
  // Arreglo final que se muestra en la interfaz, considerando filtros y búsqueda
  displayedParks: Park[] = [];
  
  // Ciudad seleccionada en el filtro
  selectedCity: string = '';
  
  // Término de búsqueda ingresado por el usuario
  searchTerm: string = '';
  
  // Indicador de carga para mostrar un spinner mientras se obtienen los datos
  loading: boolean = false;

  constructor(private router: Router, private parkService: ParkService) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loading = true; // activar spinner de carga
    
    // Obtener todos los parques desde el servicio
    this.parkService.getAllParks().subscribe({
      next: (parks) => {
        // Guardar datos en los arreglos correspondientes
        this.parks = parks.data;
        this.filteredParks = [...this.parks];
        this.displayedParks = [...this.parks];
        this.loading = false; // desactivar spinner
      },
      error: (err) => {
        // En caso de error, asegurar que los arreglos estén vacíos
        console.error(err);
        this.parks = [];
        this.filteredParks = [];
        this.displayedParks = [];
        this.loading = false; // ocultar spinner
      },
    });
  }

  /**
   * Filtra los parques según la ciudad seleccionada.
   * Si no hay ciudad seleccionada, se muestran todos los parques.
   * Después de filtrar por ciudad, aplica también la búsqueda por nombre.
   */
  filtrarParques(): void {
    if (!this.selectedCity) {
      this.filteredParks = [...this.parks]; // mostrar todas las ciudades
    } else {
      // Filtrar parques cuyo campo 'park_city' coincide con la ciudad seleccionada
      this.filteredParks = this.parks.filter((p) => p.park_city === this.selectedCity);
    }

    // Aplicar búsqueda sobre el arreglo filtrado
    this.buscarParques();
  }

  /**
   * Filtra los parques según el término de búsqueda ingresado por el usuario.
   * La búsqueda se realiza sobre el nombre del parque (case-insensitive).
   */
  buscarParques(): void {
    const term = this.searchTerm.toLowerCase();
    
    if (!term) {
      // Si no hay término de búsqueda, mostrar todos los filtrados
      this.displayedParks = [...this.filteredParks];
    } else {
      // Filtrar los parques que contienen el término en su nombre
      this.displayedParks = this.filteredParks.filter((p) =>
        p.park_name.toLowerCase().includes(term)
      );
    }
  }

  /**
   * Elimina un parque por su ID.
   * Antes de eliminar, muestra un SweetAlert2 para confirmar la acción.
   * @param id ID del parque a eliminar
   * @param event Evento para detener la propagación del click (evitar abrir detalles)
   */
  eliminar(id: number, event: Event): void {
    event.stopPropagation(); // prevenir que se dispare el click del card
    
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
        // Llamada al servicio para eliminar el parque
        this.parkService.delete(id).subscribe({
          next: () => {
            // Actualizar lista local eliminando el parque
            this.parks = this.parks.filter((p) => p.id !== id);
          },
          error: (err) => {
            // Mostrar error si falla la eliminación
            const mensaje = err?.error?.message || err?.message || 'Error al eliminar parque';
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar parque',
              text: mensaje,
            });
          },
        });

        // Mostrar mensaje de éxito (idealmente, debería ir dentro del subscribe next)
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El parque ha sido eliminado.',
          icon: 'success',
        });
      }
    });
  }

  /**
   * Redirige a la página de edición de un parque
   * @param id ID del parque a editar
   * @param event Evento para detener la propagación del click
   */
  editar(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/parques/editar', id]);
  }

  /**
   * Redirige a la página de detalle de un parque
   * @param id ID del parque
   */
  verDetalle(id: number): void {
    this.router.navigate(['/parques/detalle', id]);
  }

  /**
   * Propiedad computada que indica si no hay parques para mostrar.
   * Se usa para mostrar mensajes de "No hay parques".
   */
  get noParks(): boolean {
    return !this.loading && (!this.displayedParks || this.displayedParks.length === 0);
  }
}
