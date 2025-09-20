import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Park } from '../../models/park';
import { ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';
import * as L from 'leaflet';

@Component({
  selector: 'app-park-card',
  imports: [CommonModule],
  templateUrl: './park-card.html'
})
export class ParkCard implements AfterViewInit {
  park: Park | null = null;
  loading: boolean = false;
  imagenNoEncontrada = false;
  private map!: L.Map;

  constructor(
    private route: ActivatedRoute,
    private parkService: ParkService,
    private location: Location
  ) {}

  regresar() {
    this.location.back();
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;

    this.parkService.getById(id).subscribe({
      next: (park) => {
        this.park = park;
        this.imagenNoEncontrada = false;
        this.loading = false;

        // Inicializar el mapa después de tener los datos
        setTimeout(() => this.initMap(), 100);
      },
      error: () => {
        this.park = null;
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    // El mapa se inicializa después de obtener park
  }

  getImagenUrl(): string | null {
    if (!this.park?.park_img_uri) return null;

    const finalUrl = `https://azuritaa33.sg-host.com/storage/${this.park.park_img_uri}`;
    if (/\.(jpe?g|png)$/i.test(finalUrl)) return finalUrl;

    return null;
  }

  private initMap() {
    if (!this.park) return;

    const lat = this.park.park_latitude || 0;
    const lng = this.park.park_longitude || 0;

    // Crear mapa
    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 15
    });

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Agregar marcador
    const marker = L.marker([lat, lng]).addTo(this.map);
    marker.bindPopup(`<b>${this.park.park_name}</b>`).openPopup();

    // Abrir Google Maps al hacer clic
    this.map.on('click', () => {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    });
  }
}
