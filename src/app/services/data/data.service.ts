import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Coffee } from '../../logic/coffee';
import { PlaceLocation } from '../../logic/placeLocation';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	public endpoint = 'http://localhost:3000';
	public coffeeentity = '/coffees';

	constructor(private http: HttpClient) { }

	getList(): Observable<Coffee[]> {
		return this.http.get<Coffee[]>(`${this.endpoint}${this.coffeeentity}`);
	}

	get(coffeeId: string): Observable<any> {
		return this.http.get(`${this.endpoint}${this.coffeeentity}/${coffeeId}`);
	}

	save(coffee: Coffee): Observable<any> {
		if (coffee._id) {
			// It's an update
			return this.http.put(`${this.endpoint}${this.coffeeentity}/${coffee._id}`, coffee);
		} else {
			// it's a new item
			return this.http.post(`${this.endpoint}${this.coffeeentity}`, coffee);
		}
	}

	delete(coffeeId: string): Observable<any> {
		return this.http.delete(`${this.endpoint}${this.coffeeentity}/${coffeeId}`);
	}
}