import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDataStore } from "@/stores/data-stores";

export default function ClearStore() {
    const {reset} = useDataStore();

    const handleClick = () => {
        reset();
    }
    
    return (
        <Button onClick={handleClick} variant={"destructive"}>Clear Records <Trash2 className="ml-2 h-4 w-4"/></Button>
    )
}