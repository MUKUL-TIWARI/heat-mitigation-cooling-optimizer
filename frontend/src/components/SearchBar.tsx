import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onLocationSelect: (bbox: [number, number, number, number], name: string) => void;
}

const SearchBar: React.FC<Props> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const loc = data[0];
          // Nominatim returns boundingbox as [minLat, maxLat, minLon, maxLon] strings
          // We need [minLon, minLat, maxLon, maxLat] for our backend
          const minLat = parseFloat(loc.boundingbox[0]);
          const maxLat = parseFloat(loc.boundingbox[1]);
          const minLon = parseFloat(loc.boundingbox[2]);
          const maxLon = parseFloat(loc.boundingbox[3]);
          
          onLocationSelect([minLon, minLat, maxLon, maxLat], loc.display_name);
        } else {
          alert("Location not found");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error searching location");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="absolute top-6 right-6 z-50 pointer-events-auto w-80">
      <form onSubmit={handleSearch} className="flex items-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl transition-all hover:bg-black/80 focus-within:bg-black/80">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, village, or area..." 
          className="bg-transparent border-none outline-none text-white px-4 py-2 w-full text-sm placeholder:text-slate-400"
        />
        <button 
          type="submit" 
          className="p-2 bg-emerald-500 rounded-full text-white hover:bg-emerald-400 transition-colors"
          disabled={isSearching}
        >
          <Search size={16} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
