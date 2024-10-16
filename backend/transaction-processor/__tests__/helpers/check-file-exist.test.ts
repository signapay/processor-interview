import { checkFileExist } from "../../helpers/check-file-exist";
import fs from "fs/promises";

jest.mock("fs/promises");

describe("checkFileExist", () => {
    it("should return true if file exists", async () => {
        (fs.access as jest.Mock).mockResolvedValue(undefined);

        const result = await checkFileExist("existing-file.txt");

        expect(result).toBe(true);
        expect(fs.access).toHaveBeenCalledWith("existing-file.txt");
    });

    it("should return false if file does not exist", async () => {
        (fs.access as jest.Mock).mockRejectedValue(new Error("File not found"));

        const result = await checkFileExist("non-existent-file.txt");

        expect(result).toBe(false);
        expect(fs.access).toHaveBeenCalledWith("non-existent-file.txt");
    });
});
