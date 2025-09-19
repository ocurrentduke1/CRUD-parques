import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Park } from '../../models/park';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ParkService } from '../../services/park-service';

@Component({
  selector: 'app-park-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './park-list.html'
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
    this.parks = this.parks.filter((p) => p.id !== id);
  }

  editar(id: number): void {
    this.router.navigate(['/parques/editar', id]);
  }

}
