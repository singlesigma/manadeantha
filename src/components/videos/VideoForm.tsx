import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import { VideoFormData } from '../../types';
import { Upload, FileVideo } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Student } from '../../types';

interface VideoFormProps {
  onSubmit: (data: VideoFormData) => Promise<void>;
  isLoading: boolean;
  students: Student[];
}

const VideoForm: React.FC<VideoFormProps> = ({ onSubmit, isLoading, students }) => {
  const [form, setForm] = useState<VideoFormData>({
    title: '',
    videoFile: null,
    studentId: '',
    category: 'project'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/mp4': [],
      'video/quicktime': []
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setForm(prev => ({ ...prev, videoFile: acceptedFiles[0] }));
        simulateProgress();
      }
    },
    onDropRejected: fileRejections => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        setErrors(prev => ({ ...prev, videoFile: 'File is larger than 100MB' }));
      } else if (error?.code === 'file-invalid-type') {
        setErrors(prev => ({ ...prev, videoFile: 'Only MP4 and MOV files are accepted' }));
      }
    }
  });

  // Simulate upload progress for demo purposes
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!form.videoFile) {
      newErrors.videoFile = 'Video file is required';
    }
    
    if (!form.studentId) {
      newErrors.studentId = 'Student is required';
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
      setForm({
        title: '',
        videoFile: null,
        studentId: '',
        category: 'project'
      });
      setProgress(0);
    } catch (error) {
      console.error('Error creating video:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const studentOptions = students.map(student => ({
    value: student.id,
    label: student.name
  }));

  const categoryOptions = [
    { value: 'project', label: 'Project' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'activity', label: 'Activity' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        id="title"
        name="title"
        placeholder="Enter video title"
        value={form.title}
        onChange={handleInputChange}
        error={errors.title}
        required
      />
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Video File
        </label>
        <div {...getRootProps()} className="cursor-pointer">
          <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.videoFile ? 'border-red-400' : 'border-gray-300 hover:border-blue-400'}`}>
            <input {...getInputProps()} />
            {form.videoFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <FileVideo className="h-8 w-8 text-blue-500 mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {form.videoFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(form.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                
                <p className="text-sm text-blue-600">Click or drag to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drag & drop a video file or click to select</p>
                <p className="text-xs text-gray-400 mt-1">MP4 or MOV, max 100MB</p>
              </div>
            )}
          </div>
          {errors.videoFile && (
            <p className="text-xs text-red-500 mt-1">{errors.videoFile}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropdown
          label="Student"
          options={studentOptions}
          value={form.studentId}
          onChange={(value) => {
            setForm(prev => ({ ...prev, studentId: value }));
            if (errors.studentId) {
              setErrors(prev => {
                const { studentId, ...rest } = prev;
                return rest;
              });
            }
          }}
          placeholder="Select a student"
          error={errors.studentId}
          searchable
        />
        
        <Dropdown
          label="Category"
          options={categoryOptions}
          value={form.category}
          onChange={(value) => setForm(prev => ({ ...prev, category: value as 'project' | 'presentation' | 'activity' }))}
          placeholder="Select a category"
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          Upload Video
        </Button>
      </div>
    </form>
  );
};

export default VideoForm;