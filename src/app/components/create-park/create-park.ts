import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ParkService } from '../../services/park-service';

@Component({
  selector: 'app-create-park',
  imports: [RouterModule, FormsModule],
  templateUrl: './create-park.html',
})
export class CreatePark {
  parque = {
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

    
  }
}
