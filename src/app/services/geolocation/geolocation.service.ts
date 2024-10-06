import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PlaceLocation } from '../../logic/placeLocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  requestLocation(): Observable<GeolocationCoordinates | null> {
    return new Observable(observer => {
      navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position.coords);
          observer.complete();
        },
        error => {
          // Log error in the system.
          console.error("Error getting geolocation:", error);
          observer.next(null);
          observer.complete();
        }
      );
    });
  }

  getmapLink(location: PlaceLocation): string {
    let query = "";
    if (location.latitude && location.longitude) {
      query = `${location.latitude},${location.longitude}`;
    } else {
      query = `${location.address}, ${location.city}`;
    }
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      return `https://maps.apple.com/?q=${query};`;
    } else {
      return `https://maps.google.com/?q=${query};`;
    }
  }

  constructor() { }
}