import { useState } from "react";
import { LocationsService } from "../services/locations.service";

interface QueryType {
	searchType: string;
	term: string;
	type: string;
}

interface LocationType {
	cities: any[];
	ports: any[];
}

export function useLocations() {
	const [locations, setLocations] = useState<LocationType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const locationService = new LocationsService();

	const findLocation = async (query: QueryType) => {
		setLoading(true);
		setError(null);
		try {
			setTimeout(async () => {
				let result = [];
				if (query.searchType === "maritimo")
					result = await locationService.getMaritimeLocations(
						query.term,
						query.type
					);
				else result = await locationService.getAerialLocations(query.term);

				setLocations(result.data.data);

				setLoading(false);
			}, 500);
		} catch (err: any) {
			console.log(err);
			setError("Error searching location");
		}
	};

	return { locations, loading, error, findLocation };
}
