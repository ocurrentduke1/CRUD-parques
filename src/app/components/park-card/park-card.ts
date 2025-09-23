import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Park } from '../../models/park';
import { ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';
import * as L from 'leaflet';
import { ClimaService } from '../../services/clima-service';

@Component({
  selector: 'app-park-card',
  imports: [CommonModule],
  templateUrl: './park-card.html'
})
export class ParkCard implements AfterViewInit {
  // Datos del parque cargado desde el servicio
  park: Park | null = null;

  // Estado de carga
  loading: boolean = false;

  // Control para detectar si hubo error cargando la imagen
  imagenNoEncontrada = false;

  // Instancia del mapa de Leaflet
  private map!: L.Map;

  // Datos del clima
  temperatura: number | null = null;
  humedad: number | null = null;
  viento: number | null = null;
  condicion: string | null = null;

  constructor(
    private route: ActivatedRoute,   // Para obtener parámetros de la ruta (ID del parque)
    private parkService: ParkService, // Servicio para obtener datos del parque
    private climaService: ClimaService, // Servicio para obtener datos del clima
    private location: Location        // Para manejar navegación hacia atrás
  ) {}

  /**
   * Regresa a la página anterior en el historial del navegador.
   */
  regresar() {
    this.location.back();
  }

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta al iniciar el componente.
   * - Obtiene el ID de la ruta.
   * - Carga el parque desde el servicio.
   * - Inicializa el mapa.
   * - Obtiene los datos del clima.
   */
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;

    this.parkService.getById(id).subscribe({
      next: (park) => {
        this.park = park;
        this.imagenNoEncontrada = false;

        // Inicializar el mapa después de cargar los datos
        setTimeout(() => this.initMap(), 150);

        // Obtener clima con latitud/longitud
        if (park.park_latitude && park.park_longitude) {
          this.climaService.getClima(park.park_latitude, park.park_longitude)
            .subscribe(data => {
              this.temperatura = data.main.temp;
              this.humedad = data.main.humidity;
              this.viento = data.wind.speed;
              this.condicion = data.weather[0].description;
            });
        }
        this.loading = false;
      },
      error: () => {
        // Si ocurre error al cargar, se marca como no encontrado
        this.park = null;
        this.loading = false;
      }
    });
  }

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta cuando la vista ya está renderizada.
   * En este caso, el mapa se inicializa después en `initMap()`.
   */
  ngAfterViewInit() {
    // El mapa se inicializa después de obtener park
    this.initMap();
  }

  /**
   * Obtiene la URL de la imagen del parque.
   * Verifica que exista y que tenga una extensión válida (jpg o png).
   */
  getImagenUrl(): string | null {
    if (!this.park?.park_img_uri) return null;

    const finalUrl = `https://azuritaa33.sg-host.com/storage/${this.park.park_img_uri}`;
    if (/\.(jpe?g|png)$/i.test(finalUrl)) return finalUrl;

    return null;
  }

  /**
   * Inicializa el mapa de Leaflet.
   * - Centra en la latitud/longitud del parque.
   * - Agrega capa de OpenStreetMap.
   * - Coloca un marcador con el nombre del parque.
   * - Permite abrir Google Maps al hacer clic.
   */
  private initMap() {
    if (!this.park) return;

    const lat = this.park.park_latitude || 0;
    const lng = this.park.park_longitude || 0;

    // Crear mapa
    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 15
    });

    // Agregar capa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);


    //INICIALIZAR ESTE ICONO SI EL MARKER POR DEFECTO NO CARGA

    /*var myIcon = L.icon({
    iconUrl: 'https://pngimg.com/uploads/google_maps_pin/google_maps_pin_PNG76.png',
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -64],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});*/
    // Agregar marcador en la ubicación del parque con icono personalizado
    //const marker = L.marker([lat, lng], { icon: myIcon }).addTo(this.map);
    //marker.bindPopup(`<b>${this.park.park_name}</b>`).openPopup();

    // Agregar marcador en la ubicación del parque
    const marker = L.marker([lat, lng]).addTo(this.map);
    marker.bindPopup(`<b>${this.park.park_name}</b>`).openPopup();

    // Evento click -> abrir ubicación en Google Maps
    this.map.on('click', () => {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    });
  }

  /**
   * Devuelve true si terminó de cargar y no se encontró parque.
   */
  get noPark(): boolean {
    return !this.loading && !this.park;
  }
}
