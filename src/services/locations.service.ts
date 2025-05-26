import axios from "axios";

export class LocationsService {
	api;
	constructor() {
		this.api = axios.create({
			baseURL: import.meta.env.VITE_URL_LOCATIONS,
		});
	}

	async getMaritimeLocations(term: string, type: string): Promise<any> {
		try {
			return await this.api.get(
				`/locations/maritime/places?term=${term}&shipment_type=${type}&source=manual`
			);
		} catch (error) {
			return error;
		}
	}

	async getAerialLocations(term: string): Promise<any> {
		return await this.api.get(
			`/locations/aerial/places?term=${term}&source=manual`
		);
	}
}
