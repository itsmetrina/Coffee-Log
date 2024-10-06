import { TastingRating } from "./tastingRating";
import { PlaceLocation } from "./placeLocation";

export class Coffee {
    //Properties
    
    // _id: string | null = null;
    type: string = "";
    rating: number = 0;
    notes: string = "";
    tastingRating: TastingRating | null;

    constructor(
        public _id: string | null = null,
        public name: string = "",
        public place: string = "",
        public location: PlaceLocation | null = null
    ) {
        this.tastingRating = new TastingRating();
        if (location == null) {
            this.location = new PlaceLocation();
        }
    }
}