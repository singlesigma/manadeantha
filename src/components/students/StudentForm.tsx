import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { StudentFormData } from '../../types';
import { Upload, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => Promise<void>;
  isLoading: boolean;
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' }
];

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<StudentFormData>({
    name: '',
    profilePhoto: null,
    styleTag: '#3B82F6'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setForm(prev => ({ ...prev, profilePhoto: acceptedFiles[0] }));
        setPreview(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    onDropRejected: fileRejections => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        setErrors(prev => ({ ...prev, profilePhoto: 'File is larger than 2MB' }));
      } else if (error?.code === 'file-invalid-type') {
        setErrors(prev => ({ ...prev, profilePhoto: 'Only JPG and PNG files are accepted' }));
      }
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(form);
      // Reset form on success
      setForm({ name: '', profilePhoto: null, styleTag: '#3B82F6' });
      setPreview(null);
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleColorSelect = (color: string) => {
    setForm(prev => ({ ...prev, styleTag: color }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        id="name"
        name="name"
        placeholder="Enter student name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Profile Photo (Optional)
        </label>
        <div {...getRootProps()} className="cursor-pointer">
          <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.profilePhoto ? 'border-red-400' : 'border-gray-300 hover:border-blue-400'}`}>
            <input {...getInputProps()} />
            {preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-full mb-2"
                />
                <p className="text-sm text-blue-600">Click or drag to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drag & drop an image or click to select</p>
                <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 2MB</p>
              </div>
            )}
          </div>
          {errors.profilePhoto && (
            <p className="text-xs text-red-500 mt-1">{errors.profilePhoto}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Style Tag</label>
        <div className="flex items-center space-x-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              type="button"
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                form.styleTag === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorSelect(color.value)}
              title={color.label}
            >
              {form.styleTag === color.value && (
                <span className="text-white">
                  <Plus size={16} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          Create Student
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;