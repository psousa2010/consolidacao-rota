import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { geoJson, Layer, Map, tileLayer } from 'leaflet';
import { TimerHandle } from 'rxjs/internal/scheduler/timerHandle';

import * as geoJsonPoints from '../app/mock/geojson.json';
import { Feature } from './feature.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  map!: Map;
  trimble = { lat: -23.3168889, long: -51.1492404 };
  tile = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 14,
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

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

  startDateTimeForm!: FormGroup;
  endDateTimeForm!: FormGroup;

  ngOnInit(): void {
    this.leafletMap();
    this.startDateTimeForm = this.fb.group({
      startDate: ['2022-11-10T13:30:00Z', [Validators.required]],
      startTime: ['13:30:01', [Validators.required]],
    });
    this.endDateTimeForm = this.fb.group({
      endDate: ['2022-11-10T13:31:59Z', [Validators.required]],
      endTime: ['13:31:59', [Validators.required]],
    });
  }

  consultar() {
    let startDate = new Date(this.startDateTimeForm.value.startDate);
    let startTime = this.startDateTimeForm.value.startTime;

    let endDate = new Date(this.endDateTimeForm.value.endDate);
    let endTime = this.endDateTimeForm.value.endTime;

    let startDateFormated = new Date(
      `${startDate.getFullYear()}-${
        startDate.getMonth() + 1
      }-${startDate.getDate()}T${startTime}Z`
    );
    let endDateFormated = new Date(
      `${endDate.getFullYear()}-${
        endDate.getMonth() + 1
      }-${endDate.getDate()}T${endTime}Z`
    );

    this.dateTimeFilter(
      startDateFormated,
      endDateFormated,
      this.pointJSON.features
    );

    // console.log(startDate.getFullYear());
    // console.log('initialDate', this.initialDate);
    // console.log('startDateFormated', startDateFormated);
    // console.log('endDateFormated', endDateFormated);
  }

  leafletMap() {
    this.map = new Map('map').setView(
      [this.trimble.lat, this.trimble.long],
      16
    );
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 14,
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  rotaInteira() {
    geoJson(this.myLineJSON, {
      style: this.myStyleMainRoute,
    }).addTo(this.map);
  }

  dateTimeFilter(start: Date, end: Date, collection: Feature[]): void {
    let featuresFiltradas = collection.filter(
      (feature) =>
        new Date(feature.properties.datetime).getTime() >= start.getTime() &&
        new Date(feature.properties.datetime).getTime() <= end.getTime()
    );
    let featuresFiltradasString = JSON.stringify(featuresFiltradas);
    let filteredCoordenates = featuresFiltradas.map(
      (feature) => `[${feature.geometry.coordinates}]`
    );
    let filteredRoute =
      '[{"type": "LineString", "coordinates": [' + filteredCoordenates + ']}]';
    let filteredLineJson = JSON.parse(filteredRoute);
    let filteredPointJson = JSON.parse(featuresFiltradasString);

    let lineFiltered = geoJson(filteredLineJson, {
      style: this.myStyleFilteredRoute,
    }).addData(filteredPointJson);

    this.atualizaLayer(lineFiltered);
  }

  atualizaLayer(layer: Layer) {
    this.map.eachLayer((layerMap) => {
      this.map.removeLayer(layerMap);
    });
    this.map.addLayer(this.tile);
    this.map.addLayer(layer);
  }

  removePontos(layer: Layer) {
    this.map.eachLayer((layerMap) => {
      this.map.removeLayer(layerMap);
    });
    this.map.addLayer(this.tile);
  }

  todosPontos(event: MatSlideToggleChange) {
    let pontos = geoJson(this.pointJSON);
    event.checked ? this.map.addLayer(pontos) : this.removePontos(pontos);
  }
}
