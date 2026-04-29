import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper: React.FC<ModalProps> = ({
  title,
  children,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] relative shadow-lg">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;