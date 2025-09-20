"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddMaterialForm, MaterialFormData } from "@/components/materials/add-material-form";
import { Material } from "@/lib/types/materials";

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (materialData: MaterialFormData) => Promise<void>;
  editingMaterial?: Material | null;
}

export function AddMaterialModal({ isOpen, onClose, onSubmit, editingMaterial }: AddMaterialModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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

  if (!shouldRender) return null;

  const handleSubmit = async (materialData: MaterialFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(materialData);
      onClose();
    } catch (error) {
      console.error('Error adding material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-200 ease-out ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingMaterial ? 'Edit Material' : 'Add New Material'}
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
          <AddMaterialForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={isLoading}
            editingMaterial={editingMaterial}
          />
        </div>
      </div>
    </div>
  );
}