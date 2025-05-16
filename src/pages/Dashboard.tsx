import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Film, Plus, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchStudents, fetchVideos } from '../utils/api';
import { Student, Video } from '../types';
import Button from '../components/ui/Button';
import StudentCard from '../components/students/StudentCard';
import VideoCard from '../components/videos/VideoCard';
import VideoPlayer from '../components/videos/VideoPlayer';
import Layout from '../components/layout/Layout';

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingStudents(true);
        setIsLoadingVideos(true);
        
        const [studentsData, videosData] = await Promise.all([
          fetchStudents(),
          fetchVideos()
        ]);
        
        setStudents(studentsData);
        setVideos(videosData);
        setFilteredVideos(videosData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoadingStudents(false);
        setIsLoadingVideos(false);
      }
    };
    
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredVideos(videos);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = videos.filter(video => {
      const matchesTitle = video.title.toLowerCase().includes(lowerQuery);
      const student = students.find(s => s.id === video.studentId);
      const matchesStudent = student?.name.toLowerCase().includes(lowerQuery);
      
      return matchesTitle || matchesStudent;
    });
    
    setFilteredVideos(filtered);
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
  };

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <Layout onSearch={handleSearch}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-2">
            <Link to="/students">
              <Button variant="outline" size="sm" icon={<User size={16} />}>
                Manage Students
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Students section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Students</h2>
            <Link to="/students" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoadingStudents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
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
          ) : students.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {students.slice(0, 4).map(student => (
                <motion.div key={student.id} variants={itemVariants}>
                  <StudentCard
                    student={student}
                    onDelete={() => {}}
                    onClick={() => {}}
                  />
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants} className="flex items-stretch">
                <Link
                  to="/students"
                  className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center w-full hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center p-6 text-gray-500">
                    <Plus size={24} className="mb-2" />
                    <span className="text-sm font-medium">Add Student</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <User size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-4">No students found</p>
              <Link to="/students">
                <Button icon={<Plus size={16} />}>Add Student</Button>
              </Link>
            </div>
          )}
        </section>
        
        {/* Videos section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Videos</h2>
            <div className="flex items-center space-x-2">
              {searchQuery && (
                <div className="text-sm text-gray-500 hidden sm:block">
                  {filteredVideos.length} results for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
          
          {isLoadingVideos ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVideos.map(video => (
                <motion.div key={video.id} variants={itemVariants}>
                  <VideoCard
                    video={video}
                    student={getStudentById(video.studentId)}
                    onDelete={() => {}}
                    onPlay={handlePlayVideo}
                  />
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants} className="flex items-stretch">
                <Link
                  to="/"
                  className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center w-full hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center p-6 text-gray-500">
                    <Plus size={24} className="mb-2" />
                    <span className="text-sm font-medium">Upload Video</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              {searchQuery ? (
                <>
                  <Search size={40} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No videos found for "{searchQuery}"</p>
                </>
              ) : (
                <>
                  <Film size={40} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-4">No videos uploaded yet</p>
                  <Button icon={<Plus size={16} />}>Upload Video</Button>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          student={getStudentById(selectedVideo.studentId)}
          isOpen={!!selectedVideo}
          onClose={handleClosePlayer}
        />
      )}
    </Layout>
  );
};

export default Dashboard;