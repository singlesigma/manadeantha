import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Video, Student } from '../../types';

interface VideoPlayerProps {
  video: Video;
  student?: Student;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, student, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white rounded-lg overflow-hidden max-w-4xl w-full shadow-xl"
        ref={modalRef}
      >
        <div className="relative">
          <div className="aspect-video bg-gray-900">
            {/* Normally we would use a video element here. For the demo, we're using an image. */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {/* This would be the actual video player in a real implementation */}
            {/* <video 
              src={video.url} 
              controls 
              className="w-full h-full" 
              autoPlay
            /> */}
            
            {/* Play button overlay for the image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-80 rounded-full p-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{video.title}</h2>
          
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              {student && (
                <>
                  {student.profileUrl ? (
                    <img
                      src={student.profileUrl}
                      alt={student.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: student.styleTag }}
                    >
                      {student.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-gray-700">{student.name}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{formatDate(video.createdAt)}</span>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 capitalize">
                {video.category}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600">
            This is a placeholder for the video description. In a real application, this would contain details about the video content, context, and other relevant information.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoPlayer;