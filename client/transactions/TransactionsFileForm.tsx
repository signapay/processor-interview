import { Button, Group, Progress, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { isNotEmpty, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import type { AppResponseError } from 'server/shared/exception.js';
import type { ResourceFileBody } from '../shared/const.js';
import type { Transaction } from '../shared/entity.js';
import '@mantine/dropzone/styles.css';
import s from './TransactionsFileForm.module.css';

export default function TransactionsFileForm({ onClose }: { onClose: (transactions?: Transaction[]) => void }) {
  const [progress, setProgress] = useState<number>();

  const form = useForm<ResourceFileBody>({
    mode: 'uncontrolled',
    initialValues: {
      file: '' as any,
    },
    validate: {
      file: isNotEmpty('File is required'),
    },
  });

  const uploadFile = (formData: FormData, url: string) => {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new TypeError(`HTTP Error: ${xhr.status}`));
        }
      };
      xhr.onerror = () => {
        reject(new TypeError('Network Error'));
      };
      xhr.send(formData);
    });
  };

  const createMutation = useMutation<void, AppResponseError, ResourceFileBody>({
    mutationFn: (body) => {
      const fd = new FormData();
      fd.append('file', body.file);
      return uploadFile(fd, '/api/transactions/file')
        .then((res) => JSON.parse(res))
        .then((transactions: Transaction[]) => {
          onClose(transactions);
        });
    },
  });

  const submit = form.onSubmit((resourceFile) => {
    if (!resourceFile.file) {
      showNotification({ message: 'You should select a file.', color: 'var(--color-warning)' });
      return;
    }
    createMutation.mutate(resourceFile);
  });

  return (
    <form onSubmit={submit} encType="multipart/form-data" autoComplete="off" className={s.container}>
      <Dropzone
        disabled={createMutation.isPending}
        loading={createMutation.isPending}
        multiple={false}
        accept={['application/xml', 'text/xml', 'text/csv', 'application/json', 'text/json']}
        onDrop={(files) => {
          form.setFieldValue('file', files[0]);
        }}
        name="file"
        {...form.getInputProps('file')}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <UploadCloudIcon style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XIcon style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <FileIcon style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} />
          </Dropzone.Idle>
          <div>
            <h6>Select a XML, JSON, or CSV file</h6>
            <span className="dimmed">Choose or drag & drop a file to be uploaded</span>
          </div>
        </Group>
      </Dropzone>

      <Progress value={progress} />

      <div className="actions">
        <Button variant="default" onClick={() => onClose()}>
          Close
        </Button>
        <Button variant="light" type="submit" disabled={!form.isValid() || createMutation.isPending}>
          Add
        </Button>
      </div>
    </form>
  );
}
