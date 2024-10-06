import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Coffee } from '../logic/coffee';
import { TastingRating } from '../logic/tastingRating';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { GeolocationService } from '../services/geolocation/geolocation.service';
import { DataService } from '../services/data/data.service';

@Component({
	selector: 'app-coffee',
	standalone: true,
	imports: [
		JsonPipe,
		FormsModule,
		MatCardModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSliderModule,
		MatSlideToggleModule,
	],
	templateUrl: './coffee.component.html',
	styleUrl: './coffee.component.scss',
})
export class CoffeeComponent implements OnInit{
	coffee = new Coffee();
	coffeeTypes: string[] = [
		'Espresso',
		'Cappuccino',
		'Latte',
		'Macchiato',
		'Americano',
		'Flat White',
		'Mocha',
		'Affogato',
		'Irish Coffee',
		'Turkish Coffee',
		'Vietnamese Coffee',
		'Greek Frappé',
		'Ristretto',
		'Long Black',
		'Breve',
		'Red Eye',
		'Doppio',
		'Cortado',
		'Piccolo Latte',
		'Eggnog Latte',
	];
	tastingEnabled: boolean = false;
	formType: "editing" | "inserting" = "inserting";

	constructor(
		private geolocation: GeolocationService,
		private dataService: DataService,
		public router: Router,
		public activateRoute: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.activateRoute.params.subscribe(params => {
			if (params['id']) {
				this.formType = 'editing';
				const coffeeId = params['id'];
				this.loadCoffee(coffeeId);
			} else {
				this.formType = 'inserting';
			}
		})
	}

	loadCoffee(coffeeId: string): void {
		this.dataService.get(coffeeId).subscribe({
			next: (coffee: Coffee) => {
				this.coffee = coffee;
				console.log('Loaded coffee:', coffee);
				if(this.coffee.tastingRating) {
					this.tastingEnabled = true;
				}
			},
			error: (error) => {
				console.error('Error loading coffee:', error);
			},
		});
	};

	accquiredLocation = () => {
		this.geolocation.requestLocation().subscribe({
			next: (location: GeolocationCoordinates | null) => {
				if (location) {
					this.coffee.location!.latitude = location.latitude;
					this.coffee.location!.longitude = location.longitude;
				}
			},
		});
	};

	tastingRatingChanged = (checked: boolean) => {
		if (checked) {
			this.coffee.tastingRating = new TastingRating();
		} else {
			this.coffee.tastingRating = null;
		}
	};

	discard = () => {
		this.router.navigate(['/']);
	};

	resultFunction = (result: boolean) => {
		result ? this.router.navigate(['/']) : console.error('Render Error msg TODO');
	};

	save = () => {
		if (this.formType == 'inserting') {
			let {_id, ...insertedCoffee} = this.coffee as any;
			this.dataService.save(insertedCoffee).subscribe({
				next: (res) => {
					console.log('Save response:', res);
					this.resultFunction(true);
				},
				error: (err) => {
					console.error('Save error:', err);
					this.resultFunction(false);
				}
			});
		} else {
			this.dataService.save(this.coffee).subscribe({
				next: (res) => {
					console.log('Update response:', res);
					this.resultFunction(true);
				},
				error: (err) => {
					console.error('Update error:', err);
					this.resultFunction(false);
				}
			});
		}
	};
}