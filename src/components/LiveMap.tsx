import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LiveMapProps {
  onStartPositionSelect: (lat: number, lng: number) => void;
  onEndPositionSelect: (lat: number, lng: number) => void;
  startPosition?: { lat: number; lng: number };
  endPosition?: { lat: number; lng: number };
  pathData?: { lat: number; lng: number }[];
  isActive: boolean;
  onClose: () => void;
}

interface MapEventHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
  mode: 'start' | 'end' | 'none';
}

// Custom hook for handling map events
function MapEventHandler({ onMapClick, mode }: MapEventHandlerProps) {
  useMapEvents({
    click: (e) => {
      if (mode !== 'none') {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Create custom icons for start and end markers
const startIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const endIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EF4444" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LiveMap: React.FC<LiveMapProps> = ({
  onStartPositionSelect,
  onEndPositionSelect,
  startPosition,
  endPosition,
  pathData,
  isActive,
  onClose,
}) => {
  const [selectionMode, setSelectionMode] = useState<'start' | 'end' | 'none'>('none');
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef<L.Map | null>(null);

  // Predefined interesting locations for quick testing
  const presetLocations = [
    { name: 'New York City', lat: 40.7128, lng: -74.0060 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  ];

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(15);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to New York City
        }
      );
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (selectionMode === 'start') {
      onStartPositionSelect(lat, lng);
      setSelectionMode('none');
    } else if (selectionMode === 'end') {
      onEndPositionSelect(lat, lng);
      setSelectionMode('none');
    }
  };

  const jumpToLocation = (lat: number, lng: number) => {
    setCenter([lat, lng]);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 13);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              🗺️ Live Map Pathfinding
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectionMode('start')}
              className={`px-4 py-2 rounded-md font-medium ${
                selectionMode === 'start'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              📍 Select Start Point
            </button>
            
            <button
              onClick={() => setSelectionMode('end')}
              className={`px-4 py-2 rounded-md font-medium ${
                selectionMode === 'end'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              🎯 Select End Point
            </button>
            
            <button
              onClick={() => setSelectionMode('none')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
            >
              Cancel Selection
            </button>
          </div>

          {/* Quick Location Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Quick jump:</span>
            {presetLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => jumpToLocation(location.lat, location.lng)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
              >
                {location.name}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="mt-3 text-sm text-gray-600">
            {selectionMode === 'start' && (
              <p className="text-green-600">🖱️ Click on the map to set start position</p>
            )}
            {selectionMode === 'end' && (
              <p className="text-red-600">🖱️ Click on the map to set end position</p>
            )}
            {selectionMode === 'none' && (
              <p>Select a mode above to place start and end points</p>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapEventHandler onMapClick={handleMapClick} mode={selectionMode} />
            
            {/* Start Position Marker */}
            {startPosition && (
              <Marker position={[startPosition.lat, startPosition.lng]} icon={startIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-green-600">Start Position</strong>
                    <br />
                    <small>
                      {startPosition.lat.toFixed(6)}, {startPosition.lng.toFixed(6)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* End Position Marker */}
            {endPosition && (
              <Marker position={[endPosition.lat, endPosition.lng]} icon={endIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-red-600">End Position</strong>
                    <br />
                    <small>
                      {endPosition.lat.toFixed(6)}, {endPosition.lng.toFixed(6)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Info Panel */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Start:</strong>{' '}
              {startPosition 
                ? `${startPosition.lat.toFixed(4)}, ${startPosition.lng.toFixed(4)}`
                : 'Not selected'
              }
            </div>
            <div>
              <strong>End:</strong>{' '}
              {endPosition 
                ? `${endPosition.lat.toFixed(4)}, ${endPosition.lng.toFixed(4)}`
                : 'Not selected'
              }
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            💡 Tip: Select start and end points, then close this dialog to convert coordinates to grid and run pathfinding algorithms
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
