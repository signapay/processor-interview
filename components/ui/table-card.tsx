export default function TableCard({ title, desc, children }) {
  return (
    <>
      <div className="border border-gray-300 p-4 rounded-lg">
        <div className="text-2xl font-semibold pb-2">{title}</div>
        <div className="text-md font-medium text-gray-400">{desc}</div>
        <hr className="pb-4"/>
        <div className="">{children}</div>
      </div>
    </>
  );
}
