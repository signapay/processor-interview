import { Button, Modal } from '@mantine/core';
import type { ReactNode } from 'react';

export function ConfirmModal({ title, message, opened, onClose }: ConfirmModalProps) {
  const confirm = () => onClose(true);
  const cancel = () => onClose();

  return (
    <Modal
      title={title}
      opened={opened}
      centered
      onClose={cancel}
      radius="md"
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 3,
      }}
    >
      <div>{message}</div>
      <div style={{ display: 'flex', justifyContent: 'end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
        <Button variant="default" onClick={cancel}>
          Close
        </Button>
        <Button variant="light" onClick={confirm}>
          OK
        </Button>
      </div>
    </Modal>
  );
}

interface ConfirmModalProps {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  opened: boolean;
  onClose: (confirmed?: boolean) => void;
}
