'use client'
import { useEffect, useState } from "react";

type Item = {
  fileName: string;
  createdAt: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [sortType, setSortType] = useState("created");

  const fetchItems = (sort: string) => {
    fetch(`/api/item?sort=${sort}`)
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Error fetching items:", err));
  };

  useEffect(() => {
    fetchItems(sortType);
  }, [sortType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="mb-6">
        <label htmlFor="sort" className="block text-lg font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sort"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="block w-64 px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="created">Created At</option>
          <option value="filenameasc">Filename ASC</option>
          <option value="filenamedesc">Filename DESC</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6 w-3/4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <div className="font-semibold text-gray-800">{item.fileName}</div>
            <div className="text-sm text-gray-600">{item.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}