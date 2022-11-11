import { Component, OnInit } from '@angular/core';
import { Icon, LatLng, Map, marker, Popup, popup, tileLayer } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  map!: Map;
  trimble = { lat: -23.3168889, long: -51.1492404 };
  title = 'consolidacao-rota';

  ngOnInit(): void {
    this.leafletMap();
  }

  async leafletMap() {
    this.map = new Map('map').setView(
      [this.trimble.lat, this.trimble.long],
      18
    );

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 14,
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }
}
