/**
 * Community Filters Component
 * Displays filter and search controls for communities using Tailwind CSS
 */

interface CommunityFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  visibility: 'all' | 'public' | 'private';
  searchTerm: string;
  onCategoryChange: (category: string | null) => void;
  onVisibilityChange: (visibility: 'all' | 'public' | 'private') => void;
  onSearchChange: (term: string) => void;
}

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({
  categories,
  selectedCategory,
  visibility,
  searchTerm,
  onCategoryChange,
  onVisibilityChange,
  onSearchChange,
}) => {
  return (
    <div className="glass-card p-8 rounded-2xl space-y-10 sticky top-24 border border-gray-100 dark:border-gray-700">
      {/* Search */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Search Communities
        </label>
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-md"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Categories
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === null
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === category
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Visibility
        </label>
        <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          {(['all', 'public', 'private'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onVisibilityChange(v)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${visibility === v
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
