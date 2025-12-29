// "use client";
// import { useState } from "react";
// import { RefreshCw, Trash2, Download, Search } from "lucide-react";

// interface DataTableActionsProps {
//   selectedCount: number;
//   onReload: () => void;
//   onDelete: () => void;
//   onExport: () => void;
//   deleteLoading?: boolean;
//   search: string;
//   setSearch: (value: string) => void;
//   suggestions: Array<{ _id: string; name: string; category: string }>;
//   sortBy: string;
//   setSortBy: (value: string) => void;
//   filterCategory: string;
//   setFilterCategory: (value: string) => void;
//   categories: string[];
// }

// export default function DataTableActions({ 
//   selectedCount, 
//   onReload, 
//   onDelete, 
//   onExport,
//   deleteLoading = false,
//   search,
//   setSearch,
//   suggestions,
//   sortBy,
//   setSortBy,
//   filterCategory,
//   setFilterCategory,
//   categories
// }: DataTableActionsProps) {
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   return (
//     <div className="bg-white p-3 rounded-lg border shadow-sm space-y-2">
//       {/* Search and Filters Row */}
//       <div className="flex flex-wrap gap-2 items-center">
//         <div className="relative flex-1 min-w-[250px]">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setShowSuggestions(true);
//             }}
//             onFocus={() => setShowSuggestions(true)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//             placeholder="Search by name, category or SKU..."
//             className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white"
//           />

//           {search && showSuggestions && suggestions.length > 0 && (
//             <div className="absolute mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
//               {suggestions.slice(0, 5).map((item) => (
//                 <div
//                   key={item._id}
//                   onMouseDown={() => {
//                     setSearch(item.name);
//                     setShowSuggestions(false);
//                   }}
//                   className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between"
//                 >
//                   <span className="font-medium text-gray-800 text-sm">{item.name}</span>
//                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <select
//           value={filterCategory}
//           onChange={(e) => setFilterCategory(e.target.value)}
//           className="px-4 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none bg-white transition-all hover:border-gray-300"
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="px-4 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none bg-white transition-all hover:border-gray-300"
//         >
//           <option value="name">Sort by Name</option>
//           <option value="stock">Sort by Stock</option>
//           <option value="expiry">Sort by Expiry</option>
//           <option value="price">Sort by Price</option>
//         </select>
//       </div>

//       {/* Actions Row */}
//       <div className="flex flex-wrap justify-between items-center gap-2">
//         <div className="flex gap-1.5">
//           <button
//             onClick={onReload}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm"
//           >
//             <RefreshCw size={16} /> Refresh
//           </button>

//           <button
//             onClick={onExport}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm"
//           >
//             <Download size={16} /> Export
//           </button>
//         </div>

//         <button
//           disabled={!selectedCount || deleteLoading}
//           onClick={onDelete}
//           className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-medium transition-all text-sm ${
//             selectedCount && !deleteLoading 
//               ? "bg-red-500 hover:bg-red-600 text-white" 
//               : "bg-gray-200 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {deleteLoading ? (
//             <>
//               <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
//               Deleting...
//             </>
//           ) : (
//             <>
//               <Trash2 size={16} /> 
//               Delete ({selectedCount})
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { RefreshCw, Trash2, Download, Search, Plus, Filter, ChevronDown } from "lucide-react";

interface DataTableActionsProps {
  selectedCount: number;
  onReload: () => void;
  onDelete: () => void;
  onExport: () => void;
  suggestions: Array<{ _id: string; name: string; category: string }>;
  onAdd?: () => void;
  deleteLoading?: boolean;
  search: string;
  setSearch: (value: string) => void;
  // suggestions: Array<{ _id: string; name: string; category: string }> | "any[]";
  sortBy: string;
  setSortBy: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  categories: string[];
  title?: string;
  showAddButton?: boolean;
  extraFilters?: React.ReactNode;
  searchPlaceholder?: string;
  onQuickSale?: () => void;
  onQuickPurchase?: () => void;
  showQuickActions?: boolean;
}

export default function DataTableActions({ 
  selectedCount, 
  onReload, 
  onDelete, 
  onExport,
  onAdd,
  deleteLoading = false,
  search,
  setSearch,
  suggestions,
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  categories,
  title = "Data",
  showAddButton = false,
  extraFilters,
  searchPlaceholder = "Search by name, category or SKU...",
  onQuickSale,
  onQuickPurchase,
  showQuickActions = false
}: DataTableActionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">Manage your {title.toLowerCase()} efficiently</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {showAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              <Plus size={16} /> Add New
            </button>
          )}
          
          {showQuickActions && (
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
              >
                Quick Actions
                <ChevronDown size={16} />
              </button>
              
              {showQuickMenu && (
                <div className="absolute mt-2 right-0 bg-white border rounded-lg shadow-xl z-50 min-w-[180px]">
                  {onQuickSale && (
                    <button
                      onClick={() => {
                        onQuickSale();
                        setShowQuickMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-2 text-green-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Quick Sale
                    </button>
                  )}
                  
                  {onQuickPurchase && (
                    <button
                      onClick={() => {
                        onQuickPurchase();
                        setShowQuickMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-orange-50 flex items-center gap-2 text-orange-700 border-t"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      Quick Purchase
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all bg-gray-50 focus:bg-white"
          />

          {search && showSuggestions && suggestions.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
              {suggestions.slice(0, 5).map((item: any) => (
  <div
    key={item._id}
    onMouseDown={() => {
      setSearch(item.name);
      setShowSuggestions(false);
    }}
    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between"
  >
    <span className="font-medium text-gray-800 text-sm">{item.name}</span>
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
  </div>
))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {extraFilters}
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none bg-white transition-all hover:border-gray-300 min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none bg-white transition-all hover:border-gray-300 min-w-[140px]"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="expiry">Sort by Expiry</option>
            <option value="price">Sort by Price</option>
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </select>
          
          <button
            onClick={onReload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Download size={16} /> Export
          </button>
          
          {selectedCount > 0 && (
            <div className="text-sm text-gray-600 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <span className="font-medium">{selectedCount} selected</span>
            </div>
          )}
        </div>

        {selectedCount > 0 && (
          <button
            disabled={deleteLoading}
            onClick={onDelete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              !deleteLoading 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} /> 
                Delete Selected
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}