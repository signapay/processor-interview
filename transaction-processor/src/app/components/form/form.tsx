import Button from "../button/button";
import Input from "../input/input";

export default function Form() {
  const handleSubmit = () => {
    console.log('submit form');
  }

  const handleReset = () => {
    console.log('reset form');
  }

  return (
    <form className="border-4 border-red-500 flex flex-col">
      <Input label="Upload Transaction Data:" />
      <Button label="Submit Form" onClick={handleSubmit} />
      <Button label="Reset Form" onClick={handleReset} />
    </form>
  )
}