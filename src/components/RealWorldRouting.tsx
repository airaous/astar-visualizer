import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import TrafficAwareRouting, { TrafficRoute, RoutingOptions } from '../utils/trafficRouting';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface RealWorldRoutingProps {
  isActive: boolean;
  onClose: () => void;
  onRouteCalculated?: (route: TrafficRoute) => void;
}

interface MapEventHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
  mode: 'start' | 'end' | 'none';
}

function MapEventHandler({ onMapClick, mode }: MapEventHandlerProps) {
  useMapEvents({
    click: (e: any) => {
      if (mode !== 'none') {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

const RealWorldRouting: React.FC<RealWorldRoutingProps> = ({
  isActive,
  onClose,
  onRouteCalculated,
}) => {
  const [startPosition, setStartPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [endPosition, setEndPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [routes, setRoutes] = useState<TrafficRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<TrafficRoute | null>(null);
  const [mode, setMode] = useState<'start' | 'end' | 'none'>('none');
  const [isCalculating, setIsCalculating] = useState(false);
  const [routingOptions, setRoutingOptions] = useState<RoutingOptions>({
    profile: 'driving-car',
    avoidTraffic: false,
    includeAlternatives: true,
  });

  const trafficRouter = new TrafficAwareRouting({
    // Add your API keys here for production use
    // openRouteService: 'your-api-key',
    // graphHopper: 'your-api-key',
  });

  const handleMapClick = (lat: number, lng: number) => {
    if (mode === 'start') {
      setStartPosition({ lat, lng });
      toast.success(`Start position set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setMode('none');
    } else if (mode === 'end') {
      setEndPosition({ lat, lng });
      toast.success(`End position set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setMode('none');
    }
  };

  const calculateRoute = async () => {
    if (!startPosition || !endPosition) {
      toast.error('Please select both start and end positions');
      return;
    }

    setIsCalculating(true);
    try {
      const start: [number, number] = [startPosition.lng, startPosition.lat];
      const end: [number, number] = [endPosition.lng, endPosition.lat];

      toast('Calculating routes with real-time traffic...', { icon: 'ℹ️' });

      if (routingOptions.includeAlternatives) {
        // Get multiple route options
        const multipleRoutes = await trafficRouter.getMultipleRoutes(start, end, routingOptions);
        setRoutes(multipleRoutes);
        if (multipleRoutes.length > 0) {
          setSelectedRoute(multipleRoutes[0]);
          onRouteCalculated?.(multipleRoutes[0]);
        }
        toast.success(`Found ${multipleRoutes.length} route${multipleRoutes.length > 1 ? 's' : ''} with traffic data!`);
      } else {
        // Get single route
        const route = await trafficRouter.getOptimalRoute(start, end, routingOptions);
        setRoutes([route]);
        setSelectedRoute(route);
        onRouteCalculated?.(route);
        toast.success('Route calculated with real-time traffic!');
      }
    } catch (error) {
      console.error('Route calculation failed:', error);
      toast.error('Failed to calculate route. Using demo data.');
      
      // Fallback demo route
      try {
        const fallbackStart: [number, number] = [startPosition.lng, startPosition.lat];
        const fallbackEnd: [number, number] = [endPosition.lng, endPosition.lat];
        const demoRoute = await trafficRouter.getMultipleRoutes(fallbackStart, fallbackEnd, routingOptions);
        if (demoRoute.length > 0) {
          setRoutes([demoRoute[0]]);
          setSelectedRoute(demoRoute[0]);
          onRouteCalculated?.(demoRoute[0]);
        }
      } catch (demoError) {
        console.error('Demo route failed:', demoError);
        toast.error('Failed to generate even demo route');
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setRoutes([]);
    setSelectedRoute(null);
    setStartPosition(null);
    setEndPosition(null);
    setMode('none');
    toast.success('Route cleared');
  };

  const selectRoute = (route: TrafficRoute, index: number) => {
    setSelectedRoute(route);
    onRouteCalculated?.(route);
    toast.success(`Selected route ${index + 1}`);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-7xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              🚦 Real-World Traffic Routing
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Location Selection */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">📍 Select Locations</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setMode('start')}
                  className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                    mode === 'start'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {startPosition ? '✓ Start Set' : 'Set Start Position'}
                </button>
                <button
                  onClick={() => setMode('end')}
                  className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                    mode === 'end'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {endPosition ? '✓ End Set' : 'Set End Position'}
                </button>
              </div>
            </div>

            {/* Routing Options */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">⚙️ Route Options</h3>
              <select
                value={routingOptions.profile}
                onChange={(e) => setRoutingOptions(prev => ({ ...prev, profile: e.target.value as any }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="driving-car">🚗 Driving</option>
                <option value="cycling-regular">🚴 Cycling</option>
                <option value="foot-walking">🚶 Walking</option>
              </select>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={routingOptions.avoidTraffic}
                  onChange={(e) => setRoutingOptions(prev => ({ ...prev, avoidTraffic: e.target.checked }))}
                  className="rounded"
                />
                <span>Avoid Heavy Traffic</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={routingOptions.includeAlternatives}
                  onChange={(e) => setRoutingOptions(prev => ({ ...prev, includeAlternatives: e.target.checked }))}
                  className="rounded"
                />
                <span>Show Alternatives</span>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">🚀 Actions</h3>
              <button
                onClick={calculateRoute}
                disabled={!startPosition || !endPosition || isCalculating}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculating ? '⏳ Calculating...' : '🔍 Calculate Route'}
              </button>
              <button
                onClick={clearRoute}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>

          {/* Current Selection Info */}
          {(startPosition || endPosition) && (
            <div className="bg-blue-50 p-3 rounded-md text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-green-600">Start:</span>
                  <span className="ml-2 text-gray-700">
                    {startPosition ? `${startPosition.lat.toFixed(4)}, ${startPosition.lng.toFixed(4)}` : 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-red-600">End:</span>
                  <span className="ml-2 text-gray-700">
                    {endPosition ? `${endPosition.lat.toFixed(4)}, ${endPosition.lng.toFixed(4)}` : 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapEventHandler onMapClick={handleMapClick} mode={mode} />
              
              {/* Start Marker */}
              {startPosition && (
                <Marker position={[startPosition.lat, startPosition.lng]}>
                  <Popup>
                    <div>
                      <strong>Start Position</strong><br />
                      {startPosition.lat.toFixed(4)}, {startPosition.lng.toFixed(4)}
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* End Marker */}
              {endPosition && (
                <Marker position={[endPosition.lat, endPosition.lng]}>
                  <Popup>
                    <div>
                      <strong>End Position</strong><br />
                      {endPosition.lat.toFixed(4)}, {endPosition.lng.toFixed(4)}
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Route Lines */}
              {routes.map((route, index) => (
                <Polyline
                  key={index}
                  positions={route.coordinates.map(coord => [coord[1], coord[0]])}
                  color={route === selectedRoute ? '#ff4444' : '#4444ff'}
                  weight={route === selectedRoute ? 6 : 4}
                  opacity={route === selectedRoute ? 0.8 : 0.5}
                />
              ))}
            </MapContainer>
            
            {/* Map Instructions Overlay */}
            {mode !== 'none' && (
              <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
                <div className="text-sm font-medium text-gray-800">
                  {mode === 'start' && '🎯 Click on the map to set START position'}
                  {mode === 'end' && '🏁 Click on the map to set END position'}
                </div>
              </div>
            )}
          </div>

          {/* Route Results Panel */}
          {routes.length > 0 && (
            <div className="w-80 border-l border-gray-200 p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-800 mb-4">🛣️ Route Options</h3>
              
              <div className="space-y-3">
                {routes.map((route, index) => (
                  <div
                    key={index}
                    onClick={() => selectRoute(route, index)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      route === selectedRoute
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">
                        Route {index + 1}
                        {route === selectedRoute && ' ✓'}
                      </h4>
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {route.trafficLevel}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{(route.distance / 1000).toFixed(2)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{Math.round(route.duration / 60)} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Speed:</span>
                        <span className="font-medium">{Math.round((route.distance / route.duration) * 3.6)} km/h</span>
                      </div>
                    </div>
                    
                    {route.durationTraffic && route.duration && (
                      <div className="mt-2 text-xs text-gray-500">
                        Traffic delay: +{Math.round((route.durationTraffic - route.duration) / 60)} min
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedRoute && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">📊 Route Details</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Profile: {routingOptions.profile}</div>
                    <div>Traffic: {selectedRoute.trafficLevel}</div>
                    <div>Segments: {selectedRoute.segments.length}</div>
                    {selectedRoute.segments[0]?.speedLimit && (
                      <div>Speed Limit: {selectedRoute.segments[0].speedLimit} km/h</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealWorldRouting;