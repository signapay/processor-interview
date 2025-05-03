import { ChangeEvent, useRef } from "react";
import FloatingMenu from "@/components/common/FloatingMenu";
import VisuallyHiddenInput from "@/components/common/VisuallyHiddenInput";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface TransactionsFloatingMenuProps {
  hasDelete?: boolean;
  onDelete: () => void;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TransactionsFloatingMenu = ({
  hasDelete,
  onDelete,
  onFileUpload,
}: TransactionsFloatingMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const actions = [
    { icon: <CloudUploadIcon />, name: "Upload", onClick: handleUploadClick },
    ...(hasDelete
      ? [{ icon: <DeleteIcon />, name: "Delete", onClick: onDelete }]
      : []),
  ];

  return (
    <>
      <VisuallyHiddenInput
        ref={fileInputRef}
        type="file"
        accept=".csv, .xml, .json"
        multiple
        onChange={handleFileUpload}
      />
      <FloatingMenu actions={actions} />
    </>
  );
};

export default TransactionsFloatingMenu;
