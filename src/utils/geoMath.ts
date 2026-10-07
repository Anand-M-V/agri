import { LandUnit } from '../types';

// Area conversion factors relative to 1 Square Meter (m²)
export const SQ_METERS_PER_UNIT: Record<LandUnit, number> = {
  sq_meters: 1,
  acres: 4046.8564224,
  hectares: 10000,
  bigha: 2529.289,     // Standard Pucca Bigha (~0.625 Acre)
  guntha: 101.17141,   // 1 Acre = 40 Guntha
  biswa: 126.46445,    // 1 Bigha = 20 Biswa
  cent: 40.46856,      // 1 Acre = 100 Cent
  sq_yards: 0.836127,  // 1 m² = 1.19599 sq yd
};

export const UNIT_LABELS: Record<LandUnit, { name: string; symbol: string; region: string }> = {
  acres: { name: 'Acres', symbol: 'Ac', region: 'Global / Standard' },
  hectares: { name: 'Hectares', symbol: 'Ha', region: 'SI / Metric Standard' },
  bigha: { name: 'Bigha', symbol: 'Bigha', region: 'Central & North India' },
  guntha: { name: 'Guntha', symbol: 'Gth', region: 'Karnataka, Maha, Guj' },
  biswa: { name: 'Biswa', symbol: 'Biswa', region: 'UP, Punjab, Haryana' },
  cent: { name: 'Cent', symbol: 'Ct', region: 'Tamil Nadu, Kerala, AP' },
  sq_meters: { name: 'Square Meters', symbol: 'm²', region: 'Engineering GIS' },
  sq_yards: { name: 'Square Yards', symbol: 'Gaj', region: 'Urban & Revenue' },
};

export const UNIT_LABELS_KN: Record<LandUnit, { name: string; symbol: string; region: string }> = {
  acres: { name: 'ಎಕರೆ', symbol: 'ಎಕರೆ', region: 'ಜಾಗತಿಕ ಮಾನದಂಡ' },
  guntha: { name: 'ಗುಂಟೆ', symbol: 'ಗುಂಟೆ', region: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಅಳತೆ' },
  hectares: { name: 'ಹೆಕ್ಟೇರ್', symbol: 'ಹೆಕ್ಟೇರ್', region: 'ಮೆಟ್ರಿಕ್ ಮಾನದಂಡ' },
  bigha: { name: 'ಬಿಘಾ', symbol: 'ಬಿಘಾ', region: 'ಮಧ್ಯ ಭಾರತ' },
  biswa: { name: 'ಬಿಸ್ವಾ', symbol: 'ಬಿಸ್ವಾ', region: 'ಉತ್ತರ ಭಾರತ' },
  cent: { name: 'ಸೆಂಟ್', symbol: 'ಸೆಂಟ್', region: 'ದಕ್ಷಿಣ ಭಾರತ' },
  sq_meters: { name: 'ಚದರ ಮೀಟರ್', symbol: 'ಚ.ಮೀ', region: 'ಜಿಐಎಸ್ ಇಂಜಿನಿಯರಿಂಗ್' },
  sq_yards: { name: 'ಚದರ ಗಜ', symbol: 'ಗಜ', region: 'ಕಂದಾಯ ಅಳತೆ' },
};

export function getUnitLabel(unit: LandUnit, lang: 'en' | 'kn' = 'en') {
  return lang === 'kn' ? UNIT_LABELS_KN[unit] : UNIT_LABELS[unit];
}


/**
 * Convert area in square meters to any target land unit
 */
export function convertFromSqMeters(sqMeters: number, toUnit: LandUnit): number {
  const factor = SQ_METERS_PER_UNIT[toUnit];
  return sqMeters / factor;
}

/**
 * Convert area from any land unit into square meters
 */
export function convertToSqMeters(value: number, fromUnit: LandUnit): number {
  const factor = SQ_METERS_PER_UNIT[fromUnit];
  return value * factor;
}

/**
 * Format land measurement with correct decimal precision
 */
export function formatArea(sqMeters: number, unit: LandUnit): string {
  const val = convertFromSqMeters(sqMeters, unit);
  if (unit === 'acres' || unit === 'hectares') {
    return val.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  }
  if (unit === 'sq_meters' || unit === 'sq_yards') {
    return Math.round(val).toLocaleString('en-IN');
  }
  return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Great-circle distance between two GPS coordinates using Haversine formula (meters)
 */
export function haversineDistanceM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate polygon perimeter from vertices in meters
 */
export function calculatePerimeterMeters(vertices: { lat: number; lng: number }[]): number {
  if (vertices.length < 2) return 0;
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const nextIdx = (i + 1) % vertices.length;
    perimeter += haversineDistanceM(
      vertices[i].lat,
      vertices[i].lng,
      vertices[nextIdx].lat,
      vertices[nextIdx].lng
    );
  }
  return perimeter;
}

/**
 * Calculate polygon area on spherical earth projection (m²)
 */
export function calculateGeodesicAreaSqM(vertices: { lat: number; lng: number }[]): number {
  if (vertices.length < 3) return 0;
  const R = 6378137; // WGS84 major radius
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const lat1Rad = (p1.lat * Math.PI) / 180;
    const lat2Rad = (p2.lat * Math.PI) / 180;
    const dLonRad = ((p2.lng - p1.lng) * Math.PI) / 180;
    area += (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad)) * dLonRad;
  }
  area = (Math.abs(area) * R * R) / 2;
  return area;
}

/**
 * Format coordinates into DMS (Degrees, Minutes, Seconds)
 */
export function formatDms(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${degrees}°${minutes}'${seconds}"${direction}`;
}
