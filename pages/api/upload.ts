import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { parseAndProcessCSV } from '../../utils/csvUtils';  // Adjust the import path as needed
import { withAuth } from '../../utils/authMiddleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsDir = path.join(process.cwd(), '/public/uploads');
const dataDir = path.join(process.cwd(), '/public/data');
const uploadsFilePath = path.join(dataDir, 'uploads.json');

// Ensure the required directories and files exist
const ensureDirectoryExistence = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const ensureFileExistence = (filePath: string, defaultContent: string) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent);
  }
};

// Initialize directories and files
ensureDirectoryExistence(uploadsDir);
ensureDirectoryExistence(dataDir);
ensureFileExistence(uploadsFilePath, JSON.stringify({ files: [] }, null, 2));

const saveUploadRecord = (filename: string, transactionCount: number) => {
  const uploads = JSON.parse(fs.readFileSync(uploadsFilePath, 'utf8'));
  uploads.files.push({ filename, transactionCount });
  fs.writeFileSync(uploadsFilePath, JSON.stringify(uploads, null, 2));
};

const resetUploads = () => {
  fs.writeFileSync(uploadsFilePath, JSON.stringify({ files: [] }, null, 2));
};

const getTotalTransactions = (uploads: { files: { transactionCount: number }[] }) => {
  return uploads.files.reduce((sum, file) => sum + file.transactionCount, 0);
};

const parseFormAsync = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: uploadsDir,
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'DELETE') {
      resetUploads();
      return res.status(200).json({ message: 'Uploads reset successfully', files: [], totalTransactionCount: 0 });
    }

    const { files } = await parseFormAsync(req);
    const uploadedFile = files.file;
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file: File = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    const filename = file.originalFilename || file.newFilename;

    const uploads = JSON.parse(fs.readFileSync(uploadsFilePath, 'utf8'));
    const fileExists = uploads.files.some((upload: { filename: string }) => upload.filename === filename);
    
    if (fileExists) {
      fs.unlinkSync(file.filepath); // Remove the uploaded file to avoid redundancy
      return res.status(400).json({ error: 'File already exists', files: uploads.files, totalTransactionCount: getTotalTransactions(uploads) });
    }

    const { cardReports, invalidTransactions, collections, transactionCount } = await parseAndProcessCSV(file.filepath);
    fs.unlinkSync(file.filepath); // Remove the uploaded file after parsing and processing
    saveUploadRecord(filename, transactionCount);
    const updatedUploads = JSON.parse(fs.readFileSync(uploadsFilePath, 'utf8'));
    
    return res.status(200).json({
      cardReports,
      invalidTransactions,
      collections,
      transactionCount,
      currentFileTransactionCount: transactionCount,
      files: updatedUploads.files,
      totalTransactionCount: getTotalTransactions(updatedUploads)
    });
  } catch (error) {
    console.error('Failed to parse CSV', error);
    return res.status(500).json({ error: 'Failed to parse CSV' });
  }
};

export default withAuth(upload);
