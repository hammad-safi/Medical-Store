// "use client";
// import { useState } from "react";
// import { Search, Boxes, Plus, Filter, SortAsc, ShoppingCart } from "lucide-react";

// interface DataTableHeaderProps {
//   title: string;
//   subtitle?: string;
//   search: string;
//   setSearch: (value: string) => void;
//   suggestions: any[];
//   onAdd?: () => void;
//   sortBy: string;
//   setSortBy: (value: string) => void;
//   filterCategory: string;
//   setFilterCategory: (value: string) => void;
//   categories: string[];
//   showAddButton?: boolean;
//   onExport?: () => void;
//   onQuickSale?: () => void;
//   onQuickPurchase?: () => void;
//   onBulkSale?: () => void; // NEW: Bulk sale handler
//   selectedCount?: number; // NEW: For showing selected count
// }

// export default function DataTableHeader({
//   title,
//   subtitle,
//   search,
//   setSearch,
//   suggestions,
//   onAdd,
//   sortBy,
//   setSortBy,
//   filterCategory,
//   setFilterCategory,
//   categories,
//   showAddButton = true,
//   onExport,
//   onQuickSale,
//   onQuickPurchase,
//   onBulkSale,
//   selectedCount = 0,
// }: DataTableHeaderProps) {
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
//         <div className="flex items-center gap-4">
//           <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
//             <Boxes size={32} />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">{title}</h1>
//             {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
//             <p className="text-blue-100 mt-1">Manage and track your {title.toLowerCase()} efficiently</p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           {/* Bulk Sale Button - Shows when items are selected */}
//           {selectedCount > 0 && onBulkSale && (
//             <button
//               onClick={onBulkSale}
//               className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-green-700 relative"
//             >
//               <ShoppingCart size={20} />
//               Sell Selected ({selectedCount})
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
//                 {selectedCount}
//               </span>
//             </button>
//           )}
          
//           {onQuickSale && (
//             <button
//               onClick={onQuickSale}
//               className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-green-600"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Quick Sale
//             </button>
//           )}
          
//           {onQuickPurchase && (
//             <button
//               onClick={onQuickPurchase}
//               className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-orange-600"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//               Quick Purchase
//             </button>
//           )}
          
//           {showAddButton && onAdd && (
//             <button
//               onClick={onAdd}
//               className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
//             >
//               <Plus size={20} /> Add New
//             </button>
//           )}
          
//           {onExport && (
//             <button
//               onClick={onExport}
//               className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-green-600"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               Export
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl p-4 border shadow-sm">
//         <div className="flex flex-col md:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//             <input
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setShowSuggestions(true);
//               }}
//               onFocus={() => setShowSuggestions(true)}
//               placeholder="Search by name, category, or SKU..."
//               className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
//             />

//             {search && showSuggestions && suggestions.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
//                 {suggestions.slice(0, 5).map((item) => (
//                   <div
//                     key={item._id}
//                     onClick={() => {
//                       setSearch(item.name);
//                       setShowSuggestions(false);
//                     }}
//                     className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between"
//                   >
//                     <span className="font-medium text-gray-800">{item.name}</span>
//                     <span className="text-xs text-gray-500">{item.category}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <div className="relative">
//               <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white min-w-[180px]"
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="stock">Sort by Stock</option>
//                 <option value="expiry">Sort by Expiry</option>
//                 <option value="price">Sort by Price</option>
//                 <option value="profit">Sort by Profit Margin</option>
//               </select>
//             </div>

//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <select
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//                 className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white min-w-[180px]"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { DataTableHeader };

"use client";
import { useState } from "react";
import { Search, Boxes, Plus, Filter, SortAsc, ShoppingCart, RefreshCw, Trash2 } from "lucide-react";

interface DataTableHeaderProps {
  title: string;
  subtitle?: string;
  search: string;
  setSearch: (value: string) => void;
  suggestions: any[];
  onAdd?: () => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  categories: string[];
  showAddButton?: boolean;
  onExport?: () => void;
  onQuickSale?: () => void;
  onQuickPurchase?: () => void;
  onBulkSale?: () => void;
  onBulkDelete?: () => void; // Added
  onRefresh?: () => void; // Added
  isRefreshing?: boolean; // Added
  selectedCount?: number;
  sortOptions?: { value: string; label: string }[]; // Added
}

export default function DataTableHeader({
  title,
  subtitle,
  search,
  setSearch,
  suggestions,
  onAdd,
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  categories,
  showAddButton = true,
  onExport,
  onQuickSale,
  onQuickPurchase,
  onBulkSale,
  onBulkDelete,
  onRefresh,
  isRefreshing = false,
  selectedCount = 0,
  sortOptions = [
    { value: "name", label: "Sort by Name" },
    { value: "stock", label: "Sort by Stock" },
    { value: "expiry", label: "Sort by Expiry" },
    { value: "price", label: "Sort by Price" },
    { value: "profit", label: "Sort by Profit Margin" }
  ],
}: DataTableHeaderProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="space-y-4">
      {/* HEADER CARD */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        {/* Title Section */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
            <Boxes size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
            <p className="text-blue-100 mt-1 text-sm lg:text-base">
              Manage and track your {title.toLowerCase()} efficiently
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-wrap gap-2 justify-end items-center">
          {/* Bulk Delete */}
          {selectedCount > 0 && onBulkDelete && (
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-red-700 relative text-sm sm:text-base"
            >
              <Trash2 size={18} />
              Delete Selected
              <span className="ml-1 font-bold">({selectedCount})</span>
            </button>
          )}

          {/* Bulk Sale */}
          {selectedCount > 0 && onBulkSale && (
            <button
              onClick={onBulkSale}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-green-700 relative text-sm sm:text-base"
            >
              <ShoppingCart size={18} />
              Sell Selected
              <span className="ml-1 font-bold">({selectedCount})</span>
            </button>
          )}

          {/* Quick Sale */}
          {onQuickSale && (
            <button
              onClick={onQuickSale}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-green-600 text-sm sm:text-base"
            >
              Quick Sale
            </button>
          )}

          {/* Quick Purchase */}
          {onQuickPurchase && (
            <button
              onClick={onQuickPurchase}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-orange-600 text-sm sm:text-base"
            >
              Quick Purchase
            </button>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-white/30 disabled:opacity-50 text-sm sm:text-base"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          )}

          {/* Add New */}
          {showAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base min-w-[180px] justify-center"
            >
              <Plus size={18} /> Add New
            </button>
          )}

          {/* Export */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-green-600 text-sm sm:text-base"
            >
              Export
            </button>
          )}
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search by name, category, or SKU..."
              className="w-full md:w-[300px] pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />

            {search && showSuggestions && suggestions.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                {suggestions.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSearch(item.name);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort & Filter */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white min-w-[150px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {categories.length > 0 && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white min-w-[150px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { DataTableHeader };
