import { Position, GridDimensions } from '../types';

/**
 * Convert geographic coordinates (lat, lng) to grid coordinates
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapCoordinate {
  lat: number;
  lng: number;
}

/**
 * Convert latitude/longitude to grid position based on bounds
 */
export const mapToGrid = (
  mapCoord: MapCoordinate,
  bounds: MapBounds,
  gridDimensions: GridDimensions
): Position => {
  // Normalize coordinates to 0-1 range
  const normalizedLat = (mapCoord.lat - bounds.south) / (bounds.north - bounds.south);
  const normalizedLng = (mapCoord.lng - bounds.west) / (bounds.east - bounds.west);
  
  // Convert to grid coordinates (flip lat because grid Y increases downward)
  const row = Math.floor((1 - normalizedLat) * gridDimensions.rows);
  const col = Math.floor(normalizedLng * gridDimensions.cols);
  
  // Clamp to grid bounds
  return {
    row: Math.max(0, Math.min(gridDimensions.rows - 1, row)),
    col: Math.max(0, Math.min(gridDimensions.cols - 1, col)),
  };
};

/**
 * Convert grid position to latitude/longitude based on bounds
 */
export const gridToMap = (
  gridPos: Position,
  bounds: MapBounds,
  gridDimensions: GridDimensions
): MapCoordinate => {
  // Normalize grid coordinates to 0-1 range
  const normalizedRow = gridPos.row / (gridDimensions.rows - 1);
  const normalizedCol = gridPos.col / (gridDimensions.cols - 1);
  
  // Convert to lat/lng (flip row because grid Y increases downward)
  const lat = bounds.south + (1 - normalizedRow) * (bounds.north - bounds.south);
  const lng = bounds.west + normalizedCol * (bounds.east - bounds.west);
  
  return { lat, lng };
};

/**
 * Calculate bounds from two points with some padding
 */
export const calculateBounds = (
  start: MapCoordinate,
  end: MapCoordinate,
  paddingPercent: number = 0.1
): MapBounds => {
  const minLat = Math.min(start.lat, end.lat);
  const maxLat = Math.max(start.lat, end.lat);
  const minLng = Math.min(start.lng, end.lng);
  const maxLng = Math.max(start.lng, end.lng);
  
  const latPadding = (maxLat - minLat) * paddingPercent;
  const lngPadding = (maxLng - minLng) * paddingPercent;
  
  return {
    north: maxLat + latPadding,
    south: minLat - latPadding,
    east: maxLng + lngPadding,
    west: minLng - lngPadding,
  };
};

/**
 * Calculate distance between two map coordinates (in meters, approximate)
 */
export const calculateMapDistance = (coord1: MapCoordinate, coord2: MapCoordinate): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Generate obstacles based on real-world features (simplified simulation)
 * In a real implementation, this would use actual map data
 */
export const generateMapObstacles = (
  bounds: MapBounds,
  gridDimensions: GridDimensions,
  density: number = 0.15
): Position[] => {
  const obstacles: Position[] = [];
  const totalCells = gridDimensions.rows * gridDimensions.cols;
  const targetObstacles = Math.floor(totalCells * density);
  
  // Generate random obstacles (in a real implementation, this would be based on actual map data)
  for (let i = 0; i < targetObstacles; i++) {
    const row = Math.floor(Math.random() * gridDimensions.rows);
    const col = Math.floor(Math.random() * gridDimensions.cols);
    
    // Create clusters to simulate buildings/terrain
    if (Math.random() > 0.7) {
      // Add cluster around this point
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (
            newRow >= 0 && newRow < gridDimensions.rows &&
            newCol >= 0 && newCol < gridDimensions.cols &&
            Math.random() > 0.3
          ) {
            obstacles.push({ row: newRow, col: newCol });
          }
        }
      }
    } else {
      obstacles.push({ row, col });
    }
  }
  
  return obstacles;
};

/**
 * Predefined city bounds for quick testing
 */
export const cityBounds: Record<string, MapBounds> = {
  'new-york': {
    north: 40.7829,
    south: 40.7489,
    east: -73.9441,
    west: -74.0059,
  },
  'san-francisco': {
    north: 37.8199,
    south: 37.7349,
    east: -122.3999,
    west: -122.5161,
  },
  'london': {
    north: 51.5287,
    south: 51.4861,
    east: -0.0757,
    west: -0.1681,
  },
  'tokyo': {
    north: 35.7061,
    south: 35.6462,
    east: 139.6917,
    west: 139.6103,
  },
};
