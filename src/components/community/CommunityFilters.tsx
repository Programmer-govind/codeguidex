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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8 sticky top-24">
      {/* Search */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Search Communities
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === null
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-500/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-500/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility Filter */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Visibility
        </label>
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {(['all', 'public', 'private'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onVisibilityChange(v)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${visibility === v
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
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
