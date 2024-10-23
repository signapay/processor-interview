import Button from "../button/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-yellow content-bottom flex flex-col justify-between pb-4 pl-4 pr-6 sm:flex-row">
      <p className="italic text-center text-md">
        © {currentYear} Jacob Sexton All rights reserved.
      </p>
      <p className="italic text-center text-xs sm:mt-1">
        Site design by
        <span className="font-bold text-red">
          {" "}
          <a href="https://jacobsexton.cool" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Jacob Sexton
          </a>
        </span>
      </p>
    </div>
  );
}
