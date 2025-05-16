import React from 'react';
import { motion } from 'framer-motion';
import { Student } from '../../types';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface StudentCardProps {
  student: Student;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onDelete, onClick }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(student.id);
  };

  const placeholderInitials = student.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => onClick(student.id)}
    >
      <div className="h-2" style={{ backgroundColor: student.styleTag }} />
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {student.profileUrl ? (
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src={student.profileUrl}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: student.styleTag }}
            >
              <span className="text-lg font-semibold">{placeholderInitials}</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:border-red-200"
            onClick={handleDelete}
            title="Delete student"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard;