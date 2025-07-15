import axios from 'axios';
import polyline from '@mapbox/polyline';

export interface TrafficRoute {
  coordinates: [number, number][]; // [lng, lat] format
  distance: number; // meters
  duration: number; // seconds
  durationTraffic?: number; // seconds with traffic
  trafficLevel: 'low' | 'moderate' | 'heavy' | 'severe';
  segments: RouteSegment[];
}

export interface RouteSegment {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  trafficDelay?: number;
  roadType: 'highway' | 'arterial' | 'local' | 'residential';
  speedLimit?: number;
  currentSpeed?: number;
}

export interface RoutingAPI {
  name: string;
  getRoute: (start: [number, number], end: [number, number], options?: RoutingOptions) => Promise<TrafficRoute>;
  requiresApiKey: boolean;
}

export interface RoutingOptions {
  profile?: 'driving-car' | 'driving-hgv' | 'cycling-regular' | 'foot-walking';
  avoidTraffic?: boolean;
  includeAlternatives?: boolean;
  radiusType?: 'distance' | 'time';
}

// OpenRouteService API (Free tier: 2000 requests/day)
class OpenRouteServiceAPI implements RoutingAPI {
  name = 'OpenRouteService';
  requiresApiKey = true;
  private apiKey: string;
  private baseUrl = 'https://api.openrouteservice.org/v2';

  constructor(apiKey: string = 'demo-key') {
    this.apiKey = apiKey;
  }

  async getRoute(
    start: [number, number], 
    end: [number, number], 
    options: RoutingOptions = {}
  ): Promise<TrafficRoute> {
    const { profile = 'driving-car' } = options;
    
    try {
      const response = await axios.get(`${this.baseUrl}/directions/${profile}`, {
        params: {
          api_key: this.apiKey,
          start: `${start[0]},${start[1]}`,
          end: `${end[0]},${end[1]}`,
          format: 'json',
          instructions: 'false',
          geometry: 'true',
          elevation: 'false',
          extra_info: 'steepness|surface|waytype|tollways',
        },
        timeout: 10000,
      });

      const route = response.data.routes[0];
      const coordinates = polyline.decode(route.geometry).map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
      
      // Simulate traffic data (in real implementation, this would come from traffic APIs)
      const trafficLevel = this.simulateTrafficLevel(route.summary.distance, route.summary.duration);
      const durationTraffic = this.calculateTrafficDuration(route.summary.duration, trafficLevel);
      
      return {
        coordinates,
        distance: route.summary.distance,
        duration: route.summary.duration,
        durationTraffic,
        trafficLevel,
        segments: this.parseSegments(coordinates, route),
      };
    } catch (error) {
      console.error('OpenRouteService API error:', error);
      throw new Error('Failed to get route from OpenRouteService');
    }
  }

  private simulateTrafficLevel(distance: number, duration: number): 'low' | 'moderate' | 'heavy' | 'severe' {
    const averageSpeed = distance / duration; // m/s
    const kmh = averageSpeed * 3.6;
    
    if (kmh > 60) return 'low';
    if (kmh > 40) return 'moderate';
    if (kmh > 20) return 'heavy';
    return 'severe';
  }

  private calculateTrafficDuration(baseDuration: number, trafficLevel: string): number {
    const multipliers = {
      low: 1.1,
      moderate: 1.3,
      heavy: 1.6,
      severe: 2.2,
    };
    return Math.round(baseDuration * multipliers[trafficLevel as keyof typeof multipliers]);
  }

  private parseSegments(coordinates: [number, number][], route: any): RouteSegment[] {
    const segments: RouteSegment[] = [];
    const segmentSize = Math.max(1, Math.floor(coordinates.length / 10));
    
    for (let i = 0; i < coordinates.length - 1; i += segmentSize) {
      const endIndex = Math.min(i + segmentSize, coordinates.length - 1);
      const segmentCoords = coordinates.slice(i, endIndex + 1);
      
      segments.push({
        coordinates: segmentCoords,
        distance: this.calculateSegmentDistance(segmentCoords),
        duration: route.summary.duration / 10, // Rough estimate
        roadType: this.inferRoadType(segmentCoords),
        speedLimit: this.inferSpeedLimit(segmentCoords),
        currentSpeed: this.simulateCurrentSpeed(),
      });
    }
    
    return segments;
  }

  private calculateSegmentDistance(coords: [number, number][]): number {
    let distance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      distance += this.haversineDistance(coords[i], coords[i + 1]);
    }
    return distance;
  }

  private haversineDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private inferRoadType(coords: [number, number][]): 'highway' | 'arterial' | 'local' | 'residential' {
    // Simple heuristic based on segment length and location
    const distance = this.calculateSegmentDistance(coords);
    if (distance > 5000) return 'highway';
    if (distance > 1000) return 'arterial';
    if (distance > 200) return 'local';
    return 'residential';
  }

  private inferSpeedLimit(coords: [number, number][]): number {
    const roadType = this.inferRoadType(coords);
    const speedLimits = {
      highway: 110,
      arterial: 60,
      local: 50,
      residential: 30,
    };
    return speedLimits[roadType];
  }

  private simulateCurrentSpeed(): number {
    // Simulate current traffic speed (70-95% of speed limit)
    return Math.floor(Math.random() * 25) + 70;
  }
}

// GraphHopper API (Free tier: 2500 requests/day)
class GraphHopperAPI implements RoutingAPI {
  name = 'GraphHopper';
  requiresApiKey = true;
  private apiKey: string;
  private baseUrl = 'https://graphhopper.com/api/1';

  constructor(apiKey: string = 'demo-key') {
    this.apiKey = apiKey;
  }

  async getRoute(
    start: [number, number], 
    end: [number, number], 
    options: RoutingOptions = {}
  ): Promise<TrafficRoute> {
    const { profile = 'driving' } = options;
    
    try {
      const response = await axios.get(`${this.baseUrl}/route`, {
        params: {
          key: this.apiKey,
          point: [`${start[1]},${start[0]}`, `${end[1]},${end[0]}`],
          vehicle: profile.replace('-car', '').replace('-regular', '').replace('-walking', ''),
          points_encoded: true,
          details: 'road_class,surface,max_speed',
          instructions: false,
        },
        timeout: 10000,
      });

      const route = response.data.paths[0];
      const coordinates = polyline.decode(route.points).map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
      
      const trafficLevel = this.simulateTrafficLevel(route.distance, route.time / 1000);
      const durationTraffic = this.calculateTrafficDuration(route.time / 1000, trafficLevel);
      
      return {
        coordinates,
        distance: route.distance,
        duration: route.time / 1000,
        durationTraffic,
        trafficLevel,
        segments: this.parseSegments(coordinates, route),
      };
    } catch (error) {
      console.error('GraphHopper API error:', error);
      throw new Error('Failed to get route from GraphHopper');
    }
  }

  private simulateTrafficLevel(distance: number, duration: number): 'low' | 'moderate' | 'heavy' | 'severe' {
    const averageSpeed = distance / duration;
    const kmh = averageSpeed * 3.6;
    
    if (kmh > 60) return 'low';
    if (kmh > 40) return 'moderate';
    if (kmh > 20) return 'heavy';
    return 'severe';
  }

  private calculateTrafficDuration(baseDuration: number, trafficLevel: string): number {
    const multipliers = { low: 1.1, moderate: 1.3, heavy: 1.6, severe: 2.2 };
    return Math.round(baseDuration * multipliers[trafficLevel as keyof typeof multipliers]);
  }

  private parseSegments(coordinates: [number, number][], route: any): RouteSegment[] {
    // Similar implementation to OpenRouteService
    return [];
  }
}

// Offline/Demo routing for areas without API coverage
class OfflineRoutingAPI implements RoutingAPI {
  name = 'Offline Demo';
  requiresApiKey = false;

  async getRoute(
    start: [number, number], 
    end: [number, number], 
    options: RoutingOptions = {}
  ): Promise<TrafficRoute> {
    // Generate a realistic route using simple pathfinding
    const coordinates = this.generateRealisticRoute(start, end);
    const distance = this.calculateTotalDistance(coordinates);
    const baseDuration = distance / 15; // ~54 km/h average
    const trafficLevel = this.simulateTrafficLevel();
    const durationTraffic = this.calculateTrafficDuration(baseDuration, trafficLevel);
    
    return {
      coordinates,
      distance,
      duration: baseDuration,
      durationTraffic,
      trafficLevel,
      segments: this.generateSegments(coordinates),
    };
  }

  private generateRealisticRoute(start: [number, number], end: [number, number]): [number, number][] {
    const points: [number, number][] = [start];
    const steps = 20;
    
    for (let i = 1; i < steps; i++) {
      const progress = i / steps;
      const lng = start[0] + (end[0] - start[0]) * progress + (Math.random() - 0.5) * 0.001;
      const lat = start[1] + (end[1] - start[1]) * progress + (Math.random() - 0.5) * 0.001;
      points.push([lng, lat]);
    }
    
    points.push(end);
    return points;
  }

  private calculateTotalDistance(coordinates: [number, number][]): number {
    let total = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      total += this.haversineDistance(coordinates[i], coordinates[i + 1]);
    }
    return total;
  }

  private haversineDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private simulateTrafficLevel(): 'low' | 'moderate' | 'heavy' | 'severe' {
    const levels = ['low', 'moderate', 'heavy', 'severe'] as const;
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private calculateTrafficDuration(baseDuration: number, trafficLevel: string): number {
    const multipliers = { low: 1.1, moderate: 1.3, heavy: 1.6, severe: 2.2 };
    return Math.round(baseDuration * multipliers[trafficLevel as keyof typeof multipliers]);
  }

  private generateSegments(coordinates: [number, number][]): RouteSegment[] {
    return [];
  }
}

// Traffic-aware routing manager
export class TrafficAwareRouting {
  private apis: RoutingAPI[];
  private currentApiIndex = 0;

  constructor(apiKeys: { openRouteService?: string; graphHopper?: string } = {}) {
    this.apis = [
      new OpenRouteServiceAPI(apiKeys.openRouteService),
      new GraphHopperAPI(apiKeys.graphHopper),
      new OfflineRoutingAPI(),
    ];
  }

  async getOptimalRoute(
    start: [number, number], 
    end: [number, number], 
    options: RoutingOptions = {}
  ): Promise<TrafficRoute> {
    const maxRetries = this.apis.length;
    
    for (let retry = 0; retry < maxRetries; retry++) {
      const api = this.apis[this.currentApiIndex];
      
      try {
        console.log(`Attempting to get route using ${api.name}...`);
        const route = await api.getRoute(start, end, options);
        console.log(`✅ Successfully got route from ${api.name}`);
        return route;
      } catch (error) {
        console.warn(`❌ ${api.name} failed:`, error);
        this.currentApiIndex = (this.currentApiIndex + 1) % this.apis.length;
      }
    }
    
    throw new Error('All routing APIs failed');
  }

  async getMultipleRoutes(
    start: [number, number], 
    end: [number, number], 
    options: RoutingOptions = {}
  ): Promise<TrafficRoute[]> {
    const routes: TrafficRoute[] = [];
    
    // Try to get routes from different APIs for comparison
    for (const api of this.apis.slice(0, 2)) { // Skip offline for multiple routes
      try {
        const route = await api.getRoute(start, end, options);
        routes.push(route);
      } catch (error) {
        console.warn(`Failed to get route from ${api.name}:`, error);
      }
    }
    
    if (routes.length === 0) {
      // Fallback to offline routing
      routes.push(await this.apis[2].getRoute(start, end, options));
    }
    
    return routes;
  }

  getTrafficColor(level: string): string {
    const colors = {
      low: '#22C55E',     // green
      moderate: '#F59E0B', // yellow
      heavy: '#EF4444',    // red
      severe: '#7C2D12',   // dark red
    };
    return colors[level as keyof typeof colors] || '#6B7280';
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  formatDistance(meters: number): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  }
}

export default TrafficAwareRouting;
