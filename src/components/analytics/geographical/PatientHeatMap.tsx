'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Layers, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

interface PatientHeatMapProps {
  viewType: 'heatmap' | 'cluster' | 'route';
}

interface LocationPoint {
  lat: number;
  lng: number;
  intensity: number;
  area: string;
  patients: number;
  revenue: number;
}

// Mock data for patient locations in Bangalore
const mockLocationData: LocationPoint[] = [
  // Koramangala - High density
  { lat: 12.9352, lng: 77.6245, intensity: 0.9, area: 'Koramangala', patients: 456, revenue: 2850000 },
  { lat: 12.9354, lng: 77.6260, intensity: 0.85, area: 'Koramangala', patients: 234, revenue: 1450000 },
  { lat: 12.9340, lng: 77.6230, intensity: 0.8, area: 'Koramangala', patients: 189, revenue: 1180000 },
  
  // Indiranagar - High density
  { lat: 12.9716, lng: 77.6412, intensity: 0.85, area: 'Indiranagar', patients: 389, revenue: 2340000 },
  { lat: 12.9710, lng: 77.6400, intensity: 0.75, area: 'Indiranagar', patients: 178, revenue: 1050000 },
  
  // Whitefield - Medium-High density
  { lat: 12.9698, lng: 77.7500, intensity: 0.75, area: 'Whitefield', patients: 367, revenue: 2180000 },
  { lat: 12.9700, lng: 77.7510, intensity: 0.7, area: 'Whitefield', patients: 156, revenue: 980000 },
  
  // HSR Layout - Medium-High density
  { lat: 12.9081, lng: 77.6476, intensity: 0.7, area: 'HSR Layout', patients: 334, revenue: 1980000 },
  { lat: 12.9085, lng: 77.6480, intensity: 0.65, area: 'HSR Layout', patients: 145, revenue: 890000 },
  
  // Jayanagar - Medium density
  { lat: 12.9250, lng: 77.5938, intensity: 0.65, area: 'Jayanagar', patients: 312, revenue: 1850000 },
  { lat: 12.9245, lng: 77.5940, intensity: 0.6, area: 'Jayanagar', patients: 134, revenue: 820000 },
  
  // BTM Layout - Medium density
  { lat: 12.9165, lng: 77.6101, intensity: 0.6, area: 'BTM Layout', patients: 298, revenue: 1720000 },
  
  // Marathahalli - Medium density
  { lat: 12.9591, lng: 77.6974, intensity: 0.55, area: 'Marathahalli', patients: 276, revenue: 1650000 },
  
  // Electronic City - Low-Medium density
  { lat: 12.8395, lng: 77.6778, intensity: 0.45, area: 'Electronic City', patients: 234, revenue: 1450000 },
  
  // Bellandur - Low-Medium density
  { lat: 12.9260, lng: 77.6762, intensity: 0.4, area: 'Bellandur', patients: 212, revenue: 1280000 },
  
  // JP Nagar - Low-Medium density
  { lat: 12.8893, lng: 77.5857, intensity: 0.35, area: 'JP Nagar', patients: 198, revenue: 1150000 },
  
  // Yelahanka - Low density (opportunity area)
  { lat: 13.1007, lng: 77.5963, intensity: 0.15, area: 'Yelahanka', patients: 34, revenue: 210000 },
  
  // Kengeri - Low density (opportunity area)
  { lat: 12.9099, lng: 77.4850, intensity: 0.12, area: 'Kengeri', patients: 28, revenue: 175000 },
  
  // Banashankari - Low density (opportunity area)
  { lat: 12.9255, lng: 77.5468, intensity: 0.2, area: 'Banashankari', patients: 67, revenue: 420000 },
];

// Create a simple map visualization without external dependencies
const PatientHeatMap: React.FC<PatientHeatMapProps> = ({ viewType }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  // Calculate color based on intensity
  const getColorForIntensity = (intensity: number) => {
    if (intensity >= 0.8) return '#dc2626'; // red-600
    if (intensity >= 0.6) return '#f97316'; // orange-500
    if (intensity >= 0.4) return '#facc15'; // yellow-400
    if (intensity >= 0.2) return '#84cc16'; // lime-500
    return '#22c55e'; // green-500
  };

  // Calculate circle size based on patient count
  const getCircleSize = (patients: number) => {
    const baseSize = 20;
    const scaleFactor = patients / 100;
    return Math.min(baseSize + scaleFactor * 10, 60);
  };

  // Render the map
  const renderMap = () => {
    const centerLat = 12.9716;
    const centerLng = 77.6412;
    const mapWidth = 800;
    const mapHeight = 500;

    // Convert lat/lng to pixel coordinates
    const latToY = (lat: number) => {
      const latDiff = centerLat - lat;
      return mapHeight / 2 + latDiff * zoomLevel * 100;
    };

    const lngToX = (lng: number) => {
      const lngDiff = lng - centerLng;
      return mapWidth / 2 + lngDiff * zoomLevel * 100;
    };

    return (
      <svg width="100%" height="500" viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="rounded-lg bg-slate-50">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Render based on view type */}
        {viewType === 'heatmap' && (
          <>
            {/* Heat map circles */}
            {mockLocationData.map((location, index) => {
              const x = lngToX(location.lng);
              const y = latToY(location.lat);
              const size = getCircleSize(location.patients);
              const color = getColorForIntensity(location.intensity);

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={size}
                    fill={color}
                    fillOpacity={0.4}
                    stroke={color}
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-opacity-60 transition-all"
                    onClick={() => setSelectedLocation(location)}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={size * 1.5}
                    fill={color}
                    fillOpacity={0.2}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={size * 2}
                    fill={color}
                    fillOpacity={0.1}
                  />
                </g>
              );
            })}
          </>
        )}

        {viewType === 'cluster' && (
          <>
            {/* Cluster visualization */}
            {mockLocationData.map((location, index) => {
              const x = lngToX(location.lng);
              const y = latToY(location.lat);
              const size = getCircleSize(location.patients) / 2;

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={size}
                    fill="#3b82f6"
                    fillOpacity={0.7}
                    stroke="#1e40af"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-opacity-90 transition-all"
                    onClick={() => setSelectedLocation(location)}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="12"
                    fill="white"
                    fontWeight="bold"
                  >
                    {location.patients}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {viewType === 'route' && (
          <>
            {/* Route visualization - connect locations to hospital */}
            {mockLocationData.map((location, index) => {
              const x = lngToX(location.lng);
              const y = latToY(location.lat);
              const hospitalX = lngToX(77.6245); // Hospital location (Koramangala)
              const hospitalY = latToY(12.9352);

              return (
                <g key={index}>
                  <line
                    x1={hospitalX}
                    y1={hospitalY}
                    x2={x}
                    y2={y}
                    stroke={getColorForIntensity(location.intensity)}
                    strokeWidth={Math.max(1, location.intensity * 3)}
                    strokeOpacity={0.5}
                    strokeDasharray={location.intensity < 0.3 ? "5,5" : "0"}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={getColorForIntensity(location.intensity)}
                    stroke="white"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
            {/* Hospital marker */}
            <g>
              <rect
                x={lngToX(77.6245) - 15}
                y={latToY(12.9352) - 15}
                width="30"
                height="30"
                fill="#dc2626"
                stroke="white"
                strokeWidth="3"
                rx="4"
              />
              <text
                x={lngToX(77.6245)}
                y={latToY(12.9352)}
                textAnchor="middle"
                dy=".3em"
                fontSize="16"
                fill="white"
                fontWeight="bold"
              >
                H
              </text>
            </g>
          </>
        )}

        {/* Area labels */}
        {mockLocationData.filter((_, i) => i % 3 === 0).map((location, index) => {
          const x = lngToX(location.lng);
          const y = latToY(location.lat);

          return (
            <text
              key={`label-${index}`}
              x={x}
              y={y - 30}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
              fontWeight="500"
            >
              {location.area}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div ref={mapContainerRef} className="relative rounded-lg overflow-hidden border">
        {renderMap()}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoomLevel(Math.min(zoomLevel + 2, 20))}
            className="bg-white/90 hover:bg-white"
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoomLevel(Math.max(zoomLevel - 2, 8))}
            className="bg-white/90 hover:bg-white"
          >
            <ZoomOut className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoomLevel(12)}
            className="bg-white/90 hover:bg-white"
          >
            <Maximize2 className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setShowLegend(!showLegend)}
            className="bg-white/90 hover:bg-white"
          >
            <Layers className="size-4" />
          </Button>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 bg-white/95 p-3 rounded-lg shadow-lg">
            <h4 className="text-xs font-semibold mb-2">Patient Density</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-xs">Very High (&gt;400)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs">High (300-400)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-xs">Medium (200-300)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-lime-500" />
                <span className="text-xs">Low (100-200)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">Very Low (&lt;100)</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{selectedLocation.area}</h3>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patients:</span>
                <span className="font-medium">{selectedLocation.patients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">₹{(selectedLocation.revenue / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Density:</span>
                <Badge variant={selectedLocation.intensity >= 0.6 ? 'default' : 'secondary'}>
                  {selectedLocation.intensity >= 0.8 ? 'Very High' :
                   selectedLocation.intensity >= 0.6 ? 'High' :
                   selectedLocation.intensity >= 0.4 ? 'Medium' :
                   selectedLocation.intensity >= 0.2 ? 'Low' : 'Very Low'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Statistics Bar */}
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-600">3,847</p>
          <p className="text-xs text-muted-foreground">Total Patients</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">124</p>
          <p className="text-xs text-muted-foreground">Active Pincodes</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-orange-600">6.8 km</p>
          <p className="text-xs text-muted-foreground">Avg Distance</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600">287 km²</p>
          <p className="text-xs text-muted-foreground">Coverage Area</p>
        </div>
      </div>
    </div>
  );
};

export default PatientHeatMap;