import Table from "../table/table";

export default function Content() {
  return (
    <div className="mt-[32px]">
      <h1>Content</h1>
      <div className='flex flex-col gap-y-[16px] h-screen py-[24px]'>
        <Table />
      </div >
    </div>
  );
}