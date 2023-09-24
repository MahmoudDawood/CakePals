import { getDistance } from "geolib";

export const calculateDistance = (
	lat1: string,
	lon1: string,
	lat2: string,
	lon2: string
) => {
	const distance = getDistance(
		{ latitude: lat1, longitude: lon1 },
		{ latitude: lat2, longitude: lon2 }
	);
	return distance; // Distance in meters
};
