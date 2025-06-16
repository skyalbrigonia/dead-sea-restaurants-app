'use client';

const FilterControls = ({ activeFilter, onFilterChange, searchTerm, onSearchChange }) => {
  const ratings = [5, 4, 3, 2, 1];
  
  const FilterButton = ({ value, label }) => {
    const isActive = activeFilter === value;
    return (
      <button
        onClick={() => onFilterChange(value)}
        // FIX: Aggiunto 'w-auto' per sovrascrivere lo stile globale e permettere
        // ai pulsanti di disporsi orizzontalmente.
        className={`w-auto p-2 border-2 transition-colors duration-150 ${isActive ? 'bg-green-500 text-black' : 'border-green-500 hover:bg-green-500 hover:text-black'}`}
      >
        [ {label} ]
      </button>
    );
  };

  return (
    <div className="border-2 border-green-500 p-4 mb-10 shadow-[0_0_15px_rgba(51,255,51,0.5)]">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Sezione Filtro per Voto */}
        <div>
          <p className="text-xl mb-4">[ FILTRA PER VOTO ]</p>
          <div className="flex flex-wrap items-center gap-4 text-lg">
            <FilterButton value={null} label="TUTTE" />
            {ratings.map(rating => (
              <FilterButton key={rating} value={rating} label={`${rating} ★`} />
            ))}
          </div>
        </div>

        {/* Sezione Ricerca per Zona */}
        <div>
           <p className="text-xl mb-4">[ CERCA PER ZONA O NOME ]</p>
           <div className="flex items-center border border-green-500 p-2">
                <span className="mr-2 text-lg">{'>'}</span>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Es: Milano, Navigli, Duomo..."
                    className="flex-grow text-lg"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
