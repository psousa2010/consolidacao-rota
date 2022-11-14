export interface Feature {
  geometry: Geometry;
  properties: Datetime;
}

export interface Geometry {
  coordinates: number[];
}

export interface Datetime {
  datetime: Date;
}
