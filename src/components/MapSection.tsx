import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'motion/react';
import { Home, Utensils } from 'lucide-react';

// Custom icons for Accommodation and Food
const accommodationIcon = L.divIcon({
  html: `<div class="bg-gold p-2 rounded-full shadow-lg border-2 border-white text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const foodIcon = L.divIcon({
  html: `<div class="bg-ink p-2 rounded-full shadow-lg border-2 border-white text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const locations = [
  {
    name: "Colombo",
    position: [6.9271, 79.8612],
    type: "accommodation",
    message: "Available accommodations and food options here"
  },
  {
    name: "Malabe",
    position: [6.9061, 79.9696],
    type: "food",
    message: "Available accommodations and food options here"
  },
  {
    name: "Kottawa",
    position: [6.8412, 79.9654],
    type: "accommodation",
    message: "Available accommodations and food options here"
  },
  {
    name: "Maharagama",
    position: [6.8511, 79.9212],
    type: "food",
    message: "Available accommodations and food options here"
  }
];

export const MapSection: React.FC = () => {
  const center: [number, number] = [6.88, 79.91];

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Location Explorer
          </div>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight text-ink">
            Explore Nearby <br />
            <span className="italic">Locations.</span>
          </h2>
          <p className="text-lg text-ink/60 max-w-xl mx-auto leading-relaxed">
            Find the best places to stay and eat around the campus. Our verified locations are just a click away.
          </p>
        </div>

        <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 z-0">
          <MapContainer 
            center={center} 
            zoom={12} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc, i) => (
              <Marker 
                key={i} 
                position={loc.position as [number, number]}
                icon={loc.type === 'accommodation' ? accommodationIcon : foodIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-2 space-y-2">
                    <div className="flex items-center gap-2">
                      {loc.type === 'accommodation' ? (
                        <Home size={14} className="text-gold" />
                      ) : (
                        <Utensils size={14} className="text-ink" />
                      )}
                      <h3 className="font-bold text-sm text-ink">{loc.name}</h3>
                    </div>
                    <p className="text-xs text-ink/60 leading-relaxed">
                      {loc.message}
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-ink transition-colors">
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gold" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Accommodation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-ink" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Food Options</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
