export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col} className="p-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {Object.values(row).map((val, j) => (
                <td key={j} className="p-2">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
