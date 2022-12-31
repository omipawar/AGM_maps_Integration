import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { type } from 'os';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  lat: any;
  lng: any;
  markers = [];
  zoom: number = 6;
  map: any
  mapClickListener: any;
  zone: any;

  address: string;
  private geoCoder: any;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private dialogRef: MatDialogRef<MapViewComponent>, private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.lat = 20.5937;
    this.lng = 78.9629;
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location?.lat();
          this.lng = place.geometry.location?.lng();
          this.zoom = 12;
        });
      });
    });
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    // this.getAddress(this.lat, this.lng);
  }

  save() {
    let data = {
      lat: this.lat,
      lng: this.lng
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

  // getAddress(latitude: any, longitude: any) {
  //   console.log("inside getaddress");

  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
  //     console.log(results);
  //     console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.address = results[0].formatted_address;
  //         console.log(this.address);

  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }

  //   });
  // }


  // (mapReady)="mapReadyHandler($event)"
  // public mapReadyHandler(map: google.maps.Map): void {
  //   this.map = map;
  //   this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
  //     console.log(e.latLng.lat(), e.latLng.lng());
  //     this.lat = e.latLng.lat();
  //     this.lng = e.latLng.lng();
  //   });
  // }

  // public ngOnDestroy(): void {
  //   if (this.mapClickListener) {
  //     this.mapClickListener.remove();
  //   }
  // }


}
