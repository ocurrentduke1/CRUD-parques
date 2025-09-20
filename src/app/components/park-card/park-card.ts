import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Park } from '../../models/park';
import { ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';

@Component({
  selector: 'app-park-card',
  imports: [CommonModule],
  templateUrl: './park-card.html'
})
export class ParkCard {
  park: Park | null = null;
  loading: boolean = false;
  imagenNoEncontrada = false;

  constructor(private route: ActivatedRoute, private parkService: ParkService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true; // Activamos el loader al iniciar la petición

    this.parkService.getById(id).subscribe({
      next: (park) => {
        this.park = park;
        this.imagenNoEncontrada = false; // Resetear por si hubo error previo
        this.loading = false; // Ocultar loader al recibir datos
      },
      error: () => {
        this.park = null;
        this.loading = false; // Ocultar loader si ocurre un error
      }
    });
  }

  getImagenUrl(): string | null {
    if (!this.park?.park_img_uri) return null;

    const finalUrl = `https://azuritaa33.sg-host.com/storage/${this.park.park_img_uri}`;

    // Validar que sea una URL de imagen válida
    if (/\.(jpe?g|png)$/i.test(finalUrl)) {
      return finalUrl;
    }

    return null;
  }
}
