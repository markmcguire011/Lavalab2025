"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditAccountForm } from "@/components/account/edit-account-form";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditAccountModal({ isOpen, onClose, onSave }: EditAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Use setTimeout to ensure the element is rendered before applying animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  if (!shouldRender || !isMounted) return null;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave();
    handleClose();
  };

  const modalContent = (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-200 ease-out ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Account
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <EditAccountForm
            onCancel={handleClose}
            onSave={handleSave}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}