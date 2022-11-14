import { Component, OnInit } from '@angular/core';
import { geoJson, Map, tileLayer } from 'leaflet';

import * as geoJsonPoints from '../app/mock/geojson.json';
import { Feature } from './feature.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  map!: Map;
  trimble = { lat: -23.3168889, long: -51.1492404 };

  geoJsonStringifyed = JSON.stringify(geoJsonPoints);
  pointJSON = JSON.parse(this.geoJsonStringifyed);

  datetimeList = this.pointJSON.features.map((e: { properties: any }) =>
    new Date(e.properties.datetime).toLocaleString()
  );
  coordenates = this.pointJSON.features.map(
    (e: { geometry: { coordinates: any } }) => e.geometry.coordinates
  );

  rota = this.pointJSON.features.map(
    (e: { geometry: { coordinates: any } }) => `[${e.geometry.coordinates}]`
  );

  mainRouteLine =
    '[{"type": "LineString", "coordinates": [' + this.rota + ']}]';
  myLineJSON = JSON.parse(this.mainRouteLine);
  myStyleMainRoute = {
    color: '#6495ed',
    weight: 5,
    opacity: 0.8,
  };

  myStyleFilteredRoute = {
    color: '#fc0303',
    weight: 8,
    opacity: 1,
  };

  initialDate = new Date('2022-11-10T13:33:00Z');
  finalDate = new Date('2022-11-10T13:39:59Z');

  ngOnInit(): void {
    this.leafletMap();

    // this.dateTimeFilter(
    //   this.initialDate,
    //   this.finalDate,
    //   this.pointJSON.features
    // );

    // console.log(this.datetimeList);
    // console.log(this.mainRouteLine);
    // console.log(geoJsonPoints.type);
    // console.log(this.geoJsonStringifyed);
    // console.log('pointJSON', this.pointJSON);
    // console.log('this.pointJSON.features', this.pointJSON.features);
    // console.log('featuresCollection', this.featuresCollection);
    // console.log('Rota ', this.rota);
  }

  leafletMap() {
    this.map = new Map('map').setView(
      [this.trimble.lat, this.trimble.long],
      18
    );
    {
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14,
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      geoJson(this.pointJSON).addTo(this.map);

      geoJson(this.myLineJSON, {
        style: this.myStyleMainRoute,
      }).addTo(this.map);

      this.dateTimeFilter(
        this.initialDate,
        this.finalDate,
        this.pointJSON.features
      );
    }
  }

  dateTimeFilter(initial: Date, final: Date, collection: Feature[]): void {
    let featuresFiltradas = collection.filter(
      (feature) =>
        new Date(feature.properties.datetime).getTime() >= initial.getTime() &&
        new Date(feature.properties.datetime).getTime() <= final.getTime()
    );
    let filteredCoordenates = featuresFiltradas.map(
      (feature) => `[${feature.geometry.coordinates}]`
    );
    let filteredRoute =
      '[{"type": "LineString", "coordinates": [' + filteredCoordenates + ']}]';
    let filteredLineJson = JSON.parse(filteredRoute);
    geoJson(filteredLineJson, {
      style: this.myStyleFilteredRoute,
    }).addTo(this.map);
  }
}
