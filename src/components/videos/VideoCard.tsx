import React from 'react';
import { motion } from 'framer-motion';
import { Video, Student } from '../../types';
import { Play, Trash2 } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  student?: Student;
  onDelete: (id: string) => void;
  onPlay: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, student, onDelete, onPlay }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(video.id);
  };

  const handlePlay = () => {
    onPlay(video);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'presentation':
        return 'bg-purple-100 text-purple-800';
      case 'activity':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="rounded-lg overflow-hidden shadow-md bg-white"
    >
      <div className="relative group" onClick={handlePlay}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Play className="h-6 w-6 text-blue-600" />
          </motion.div>
        </div>
        <div className="absolute top-2 right-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1.5 text-red-500"
            onClick={handleDelete}
            title="Delete video"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(video.category)}`}>
            {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate" title={video.title}>
          {video.title}
        </h3>
        <div className="flex items-center justify-between">
          {student && (
            <div className="flex items-center space-x-1.5">
              {student.profileUrl ? (
                <img
                  src={student.profileUrl}
                  alt={student.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: student.styleTag }}
                >
                  {student.name.charAt(0)}
                </div>
              )}
              <p className="text-sm text-gray-500 truncate" title={student.name}>
                {student.name}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-400">
            {formatDate(video.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;