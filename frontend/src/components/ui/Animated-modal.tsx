import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { X } from 'lucide-react';
import ProfileCard from '../pages/WorkerPro';

interface BasicModalProps {
  buttonText?: string;
  workerId: string;
  children?: React.ReactNode;
}

export default function BasicModal({ buttonText = 'View profile', workerId, children }: BasicModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {children ? (
        <div onClick={handleOpen}>{children}</div>
      ) : (
        <Button onClick={handleOpen} className='border border-blue-600 text-blue-600 hover:bg-blue-50'>
          {buttonText}
        </Button>
      )}
      <Modal
        open={open}
        onClose={() => { handleClose(); window.location.reload(); }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="max-w-3xl mx-auto mt-20 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-6 relative">
            <button 
              onClick={() => { handleClose(); window.location.reload(); }}
              className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
            <ProfileCard workerId={workerId} />
        </Box>
      </Modal>
    </div>
  );
}
