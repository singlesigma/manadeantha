import React, { useState, useEffect } from 'react';
import { Plus, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStudents, createStudent, deleteStudent, searchStudents } from '../utils/api';
import { Student, StudentFormData } from '../types';
import Button from '../components/ui/Button';
import StudentCard from '../components/students/StudentCard';
import StudentForm from '../components/students/StudentForm';
import Modal from '../components/ui/Modal';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    try {
      const results = await searchStudents(query);
      setFilteredStudents(results);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  const handleCreateStudent = async (data: StudentFormData) => {
    try {
      setIsSubmitting(true);
      const newStudent = await createStudent(data);
      setStudents(prev => [...prev, newStudent]);
      setFilteredStudents(prev => [...prev, newStudent]);
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      setIsSubmitting(true);
      await deleteStudent(studentToDelete);
      setStudents(prev => prev.filter(student => student.id !== studentToDelete));
      setFilteredStudents(prev => prev.filter(student => student.id !== studentToDelete));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setIsSubmitting(false);
      setStudentToDelete(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">Manage student profiles and portfolios</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Button 
              onClick={() => setIsFormModalOpen(true)}
              icon={<Plus size={16} />}
            >
              Add Student
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-24 animate-pulse">
                <div className="h-2 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredStudents.map(student => (
                <motion.div 
                  key={student.id} 
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <StudentCard
                    student={student}
                    onDelete={handleDeleteClick}
                    onClick={() => {}}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            <motion.div variants={itemVariants} className="flex items-stretch">
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center w-full hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center p-6 text-gray-500">
                  <Plus size={24} className="mb-2" />
                  <span className="text-sm font-medium">Add Student</span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {searchQuery ? (
              <>
                <Search size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-4">No students found for "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </>
            ) : (
              <>
                <User size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-4">No students added yet</p>
                <Button 
                  onClick={() => setIsFormModalOpen(true)}
                  icon={<Plus size={16} />}
                >
                  Add Student
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Add New Student"
        size="md"
      >
        <StudentForm 
          onSubmit={handleCreateStudent}
          isLoading={isSubmitting}
        />
      </Modal>
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete this student? This action cannot be undone and will also delete all videos associated with this student.
        </p>
      </Modal>
    </Layout>
  );
};

export default StudentsPage;