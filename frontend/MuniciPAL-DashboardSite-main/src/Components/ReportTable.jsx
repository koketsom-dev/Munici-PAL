export default function ReportTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Type</Th>
            <Th>Owner</Th>
            <Th>Created</Th>
            <Th>Resolved</Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-3 text-gray-500" colSpan={6}>
                No results. Adjust filters to see tickets.
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <Td>#{r.id}</Td>
              <Td className="font-medium">{r.title}</Td>
              <Td>{r.status}</Td>
              <Td>{r.type}</Td>
              <Td>{r.owner}</Td>
              <Td>{r.createdAt}</Td>
              <Td>{r.ResolvedAt}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2 font-semibold">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}
