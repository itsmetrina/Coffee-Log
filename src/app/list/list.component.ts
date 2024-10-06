import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Coffee } from '../logic/coffee';

import { DataService } from '../services/data/data.service';
import { GeolocationService } from '../services/geolocation/geolocation.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-list',
	standalone: true,
	imports: [MatCardModule, MatButtonModule, MatIconModule],
	templateUrl: './list.component.html',
	styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
	list: Coffee[] = [];

	constructor(
		private data: DataService,
		private geoLocation: GeolocationService,
		public router: Router,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.fetchCoffeeList();
	}

	fetchCoffeeList(): void {
		this.data.getList().subscribe({
			next: (list: Coffee[]) => {
				this.list = list;
				console.log(this.list)
			},
			error: (error) => {
				console.error('Error fetching coffee list:', error);
			}
		});
	};

	createCoffe = () => {
		this.router.navigate(['/coffee']);
	};

	coffeeDetails = (coffee: Coffee) => {
		this.router.navigate([`/coffee/${coffee._id}`]);
	};

	goMap = (coffee: Coffee) => {
		const mapURL = this.geoLocation.getmapLink(coffee.location!);
		window.open(mapURL, "_blank");
	};

	share = (coffee: Coffee) => {
		const text = `I had this coffee at ${coffee.place} and for me it's ${coffee.rating} stars.`;
		const info = {
			title: coffee.name,
			text: text,
			url: window.location.href
		};

		if (navigator.share && navigator.canShare(info)) {
			navigator.share(info)
		} else {
			console.error('Web Share API not supported');
			this.snackBar.open('Sharing Coffee Failed!', 'Dismiss', {
				duration: 3000,
				verticalPosition: 'bottom'
			});
		}
	};

	deleteCoffee(coffeeId: string | null): void {
		if (coffeeId) {
			if (confirm('Are you sure you want to delete this coffee?')) {
				this.data.delete(coffeeId).subscribe({
					next: () => {
						console.log('Coffee deleted successfully');
						this.snackBar.open('Coffee deleted successfully', 'Dismiss', {
							duration: 3000,
							verticalPosition: 'top'
						});
						this.fetchCoffeeList();
					},
					error: (err) => {
						console.error('Delete error:', err);
						this.snackBar.open('Error deleting coffee', 'Dismiss', {
							duration: 3000,
							verticalPosition: 'top'
						});
					}
				});
			}
		} else {
			console.error('Coffee ID is null.', coffeeId);
			this.snackBar.open('Invalid coffee ID', 'Dismiss', {
				duration: 3000,
				verticalPosition: 'top'
			});
		}
	}
}