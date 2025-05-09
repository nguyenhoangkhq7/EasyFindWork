// JobCard.jsx
export function JobCard({ job }) {
  return (
    <div
      className="p-2 border rounded-lg shadow cursor-pointer hover:bg-indigo-50"
      onClick={() => window.open(job.url, "_blank")}
    >
      <h4 className="font-semibold">{job.title}</h4>
      <p className="text-sm text-gray-500">{job.location}</p>
    </div>
  );
}
