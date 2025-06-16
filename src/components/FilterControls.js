'use client';

const FilterControls = ({ activeFilter, onFilterChange }) => {
  const ratings = [5, 4, 3, 2, 1];
  
  const FilterButton = ({ value, label }) => {
    const isActive = activeFilter === value;
    return (
      <button
        onClick={() => onFilterChange(value)}
        // Aggiunto 'w-auto' per permettere ai pulsanti di disporsi orizzontalmente.
        className={`w-auto p-2 border-2 transition-colors duration-150 ${isActive ? 'bg-green-500 text-black' : 'border-green-500 hover:bg-green-500 hover:text-black'}`}
      >
        [ {label} ]
      </button>
    );
  };

  return (
    <div className="border-2 border-green-500 p-4 mb-10 shadow-[0_0_15px_rgba(51,255,51,0.5)]">
      <p className="text-xl mb-4">[ FILTRA PER VOTO ]</p>
      <div className="flex flex-wrap items-center gap-4 text-lg">
        <FilterButton value={null} label="TUTTE" />
        {ratings.map(rating => (
          <FilterButton key={rating} value={rating} label={`${rating} ★`} />
        ))}
      </div>
    </div>
  );
};

export default FilterControls;
