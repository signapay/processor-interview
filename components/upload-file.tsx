"use client";
import { useToast } from "@/components/ui/use-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Papa from "papaparse";
import { z } from "zod";

const csvSchema = z.object({
  accountName: z.string(),
  cardNumber: z.number().int(),
  amount: z.number(),
  type: z.string(),
  desc: z.string(),
  target: z.number().int().optional(),
});

import { Upload, CloudUpload, X, Eye, Sheet } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { DataTable } from "./tables/data-table";
import { columns } from "./tables/columns";
import { useDataStore } from "@/stores/data-stores";

export default function UploadFile() {
  const { updateData } = useDataStore();

  const {toast} = useToast();

  const [file, setFile] = useState<File>();
  const [showUpload, setShowUpload] = useState<boolean | undefined>(false);

  const [tempBadTransactions, setTempBadTransactions] = useState<any[]>();
  const [tempData, setTempData] = useState<any[]>();

  const [showPreview, setShowPreview] = useState<boolean | undefined>(false);
  const [showAlert, setShowAlert] = useState<boolean | undefined>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: false,
        skipEmptyLines: false,
        complete: (res: any) => {
          //convert the arrays to objects
          const formattedData = res.data.map((data: any) => ({
            accountName: data[0],
            cardNumber: isNaN(+data[1]) ? data[1] : +data[1],
            amount: isNaN(+data[2]) ? data[2] : +data[2],
            type: data[3],
            desc: data[4],
            target: isNaN(+data[5]) ? data[5] : +data[5],
            hasErrors: false,
            badFields: [],
          }));

          //lets check the file for errors
          let errors: string[] = [];
          formattedData.map((data: any) => {
            try {
              //using zod parse lets compare each object and check if the fields are correct (numbers/strings)
              csvSchema.parse(data);
            } catch (error) {
              //if zod returned an error lets mark that record and tag the field..
              if (error instanceof z.ZodError) {
                data.hasErrors = true;
                let fieldNames: string[] = [];
                error.issues.map((err: any) => {
                  fieldNames.push(err.path[0]);
                });
                data.badFields = fieldNames;
                errors.push(data);
              } else {
                console.error("Unexpected error: ", error);
              }
            }
          });
          //filter out any bad records we aren't able to process them correctly..
          let temp = formattedData.filter((f: any) => f.hasErrors == false);
          
          setTempBadTransactions(errors);
          setTempData(temp); //will be used in our preview..
        },
      });
    }
  };

  const handleUploadClick = () => {
    if (tempBadTransactions) return setShowAlert(true);
    handleUpload();
  };

  const handleUpload = () => {
    if(!tempData) return alert("unable to upload file. please try again..")
    updateData(tempData);
    toast({
        title: "Success",
        description: "File uploaded successfully!",
      })
    setShowUpload(false);
    clearVariables()
    

  };

  const handleClick = () => {
    setShowUpload(true);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleCancel = () => {
    clearVariables()
  };

  const clearVariables = () => {
    setFile(undefined);
    setTempBadTransactions(undefined);
    setTempData(undefined);
  }

  return (
    <>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error's detected!</AlertDialogTitle>
            <AlertDialogDescription>
              There were{" "}
              <span className="text-red-500 font-semibold">
                {tempBadTransactions?.length}
              </span>{" "}
              bad records found in the file. Do you wish to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpload}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="min-w-[1200px]"
        >
          <DialogTitle>
            <div className="flex items-center">
              Previewing <span className="underline">{file?.name}</span>
              <Sheet className="h-4 w-4 ml-2" />
            </div>
          </DialogTitle>
          <div className="max-h-[720px] overflow-y-auto">
            {tempData && (
              <DataTable
                data={tempData}
                columns={columns}
                showRecordSize={false}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showUpload}
        onOpenChange={() => {
          setShowUpload(!showUpload);
          handleCancel();
        }}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogTitle>
            <div className="flex flex-col">
              <span className="flex items-center">
                Upload transaction file <Upload className="h-4 w-4 ml-2" />
              </span>
            </div>
          </DialogTitle>

          {!file && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-neutral-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudUpload />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    .CSV files only
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
          {file && (
            <>
              <div className="flex items-center justify-between border rounded-md border-gray-300 p-2">
                <span className="font-semibold">{file?.name}</span>
                <div className="flex space-x-3">
                  <Button onClick={handlePreview}>
                    Preview <Eye className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-red-700 font-semibold">
                {tempBadTransactions && tempBadTransactions?.length > 0 && (
                  <>{tempBadTransactions?.length} bad records detected!</>
                )}
              </div>
              <Button onClick={handleUploadClick}>
                Upload <Upload className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setShowUpload(!showUpload);
                  handleCancel();
                }}
              >
                Cancel <X className="ml-2 w-4 h-4" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Button onClick={handleClick}>
        Upload File
        <Upload className="ml-2 w-4 h-4" />
      </Button>
    </>
  );
}
