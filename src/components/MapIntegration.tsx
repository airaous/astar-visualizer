import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import LiveMap from './LiveMap';
import RealWorldRouting from './RealWorldRouting';
import { GridDimensions, Position } from '../types';
import { 
  mapToGrid, 
  calculateBounds, 
  calculateMapDistance,
  generateMapObstacles,
  MapCoordinate,
  MapBounds 
} from '../utils/mapUtils';
import { TrafficRoute } from '../utils/trafficRouting';

interface MapIntegrationProps {
  gridDimensions: GridDimensions;
  onStartPositionChange: (position: Position) => void;
  onEndPositionChange: (position: Position) => void;
  onObstaclesGenerate: (obstacles: Position[]) => void;
  currentStartPos: Position;
  currentEndPos: Position;
}

const MapIntegration: React.FC<MapIntegrationProps> = ({
  gridDimensions,
  onStartPositionChange,
  onEndPositionChange,
  onObstaclesGenerate,
  currentStartPos,
  currentEndPos,
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapStartPos, setMapStartPos] = useState<MapCoordinate | undefined>();
  const [mapEndPos, setMapEndPos] = useState<MapCoordinate | undefined>();
  const [currentBounds, setCurrentBounds] = useState<MapBounds | undefined>();
  const [isMapModeActive, setIsMapModeActive] = useState(false);
  const [mode, setMode] = useState<'simulate' | 'realworld'>('simulate');
  const [routes, setRoutes] = useState<TrafficRoute[]>([]);
  const [isRealWorldOpen, setIsRealWorldOpen] = useState(false);

  const handleStartPositionSelect = (lat: number, lng: number) => {
    const newPos = { lat, lng };
    setMapStartPos(newPos);
    
    // If we have both positions, calculate bounds and convert to grid
    if (mapEndPos) {
      const bounds = calculateBounds(newPos, mapEndPos);
      setCurrentBounds(bounds);
      
      const gridPos = mapToGrid(newPos, bounds, gridDimensions);
      onStartPositionChange(gridPos);
      
      toast.success(`Start position set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleEndPositionSelect = (lat: number, lng: number) => {
    const newPos = { lat, lng };
    setMapEndPos(newPos);
    
    // If we have both positions, calculate bounds and convert to grid
    if (mapStartPos) {
      const bounds = calculateBounds(mapStartPos, newPos);
      setCurrentBounds(bounds);
      
      const gridPos = mapToGrid(newPos, bounds, gridDimensions);
      onEndPositionChange(gridPos);
      
      toast.success(`End position set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const activateMapMode = () => {
    if (!mapStartPos || !mapEndPos) {
      toast.error('Please select both start and end positions on the map first');
      return;
    }

    const bounds = calculateBounds(mapStartPos, mapEndPos);
    setCurrentBounds(bounds);

    // Convert map positions to grid positions
    const startGridPos = mapToGrid(mapStartPos, bounds, gridDimensions);
    const endGridPos = mapToGrid(mapEndPos, bounds, gridDimensions);

    onStartPositionChange(startGridPos);
    onEndPositionChange(endGridPos);

    // Generate map-based obstacles
    const obstacles = generateMapObstacles(bounds, gridDimensions, 0.15);
    onObstaclesGenerate(obstacles);

    setIsMapModeActive(true);
    setIsMapOpen(false);

    const distance = calculateMapDistance(mapStartPos, mapEndPos);
    toast.success(
      `Map mode activated! Distance: ${(distance / 1000).toFixed(2)} km`
    );
  };

  const deactivateMapMode = () => {
    setIsMapModeActive(false);
    setMapStartPos(undefined);
    setMapEndPos(undefined);
    setCurrentBounds(undefined);
    toast.success('Switched back to grid mode');
  };

  const openMapForNewSelection = () => {
    setIsMapOpen(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          🗺️ Live Map Integration
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isMapModeActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">
            {isMapModeActive ? 'Map Mode' : 'Grid Mode'}
          </span>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode('simulate')}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              mode === 'simulate'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎮 Grid Simulation
          </button>
          <button
            onClick={() => setMode('realworld')}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              mode === 'realworld'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌍 Real-World Traffic
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      {mode === 'simulate' ? (
        <div className="space-y-3">
          {/* Map Status */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Start:</span>
              <span className="font-mono text-xs">
                {mapStartPos ? `${mapStartPos.lat.toFixed(4)}, ${mapStartPos.lng.toFixed(4)}` : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End:</span>
              <span className="font-mono text-xs">
                {mapEndPos ? `${mapEndPos.lat.toFixed(4)}, ${mapEndPos.lng.toFixed(4)}` : 'Not set'}
              </span>
            </div>
            
            {mapStartPos && mapEndPos && (
              <div className="flex justify-between text-blue-600">
                <span>Distance:</span>
                <span className="font-medium">
                  {(calculateMapDistance(mapStartPos, mapEndPos) / 1000).toFixed(2)} km
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {!isMapModeActive ? (
              <>
                <button
                  onClick={openMapForNewSelection}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  📍 Select Map Locations
                </button>
                
                {mapStartPos && mapEndPos && (
                  <button
                    onClick={activateMapMode}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    🚀 Activate Map Mode
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={openMapForNewSelection}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  📍 Change Locations
                </button>
                
                <button
                  onClick={deactivateMapMode}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  ⬅️ Back to Grid Mode
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
            <div className="font-medium mb-1">💡 How it works:</div>
            <ul className="text-xs space-y-1">
              <li>1. Select real-world start and end locations</li>
              <li>2. Activate map mode to convert to grid coordinates</li>
              <li>3. Run pathfinding algorithms on real geography</li>
              <li>4. See how algorithms perform on actual distances</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">
            <div className="font-medium mb-2">🚦 Real-World Traffic Routing</div>
            <p className="text-xs mb-3">
              Experience actual road networks with live traffic simulation and multiple routing algorithms.
            </p>
            <button
              onClick={() => setIsRealWorldOpen(true)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              🌍 Open Traffic Router
            </button>
          </div>
          
          {routes.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              <div className="font-medium mb-1">📊 Route Results:</div>
              <div className="text-xs space-y-1">
                {routes.map((route, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Route {index + 1}:</span>
                    <span>{(route.distance / 1000).toFixed(2)} km, {Math.round(route.duration / 60)} min</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Mode Info */}
      {mode === 'simulate' && isMapModeActive && currentBounds && (
        <div className="bg-green-50 p-3 rounded-md text-sm text-green-700">
          <div className="font-medium">🌍 Active Map Area:</div>
          <div className="text-xs mt-1 space-y-1">
            <div>North: {currentBounds.north.toFixed(4)}°</div>
            <div>South: {currentBounds.south.toFixed(4)}°</div>
            <div>East: {currentBounds.east.toFixed(4)}°</div>
            <div>West: {currentBounds.west.toFixed(4)}°</div>
          </div>
        </div>
      )}

      <div className="space-y-3">{/* spacer for consistent layout */}</div>

      {/* Live Map Modal */}
      <LiveMap
        isActive={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onStartPositionSelect={handleStartPositionSelect}
        onEndPositionSelect={handleEndPositionSelect}
        startPosition={mapStartPos}
        endPosition={mapEndPos}
      />

      {/* Real-World Routing Modal */}
      <RealWorldRouting
        isActive={isRealWorldOpen}
        onClose={() => setIsRealWorldOpen(false)}
        onRouteCalculated={(route: TrafficRoute) => setRoutes([route])}
      />
    </div>
  );
};

export default MapIntegration;
