import { Student, StudentFormData, Video, VideoFormData } from '../types';
import { mockStudents, mockVideos } from './mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Student API functions
export const fetchStudents = async (): Promise<Student[]> => {
  await delay(800);
  return [...mockStudents];
};

export const searchStudents = async (name: string): Promise<Student[]> => {
  await delay(500);
  return mockStudents.filter(student => 
    student.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const createStudent = async (data: StudentFormData): Promise<Student> => {
  await delay(1000);
  const newStudent: Student = {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    profileUrl: data.profilePhoto ? URL.createObjectURL(data.profilePhoto) : undefined,
    styleTag: data.styleTag,
    createdAt: new Date()
  };
  mockStudents.push(newStudent);
  return newStudent;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await delay(800);
  const index = mockStudents.findIndex(student => student.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
  }
};

// Video API functions
export const fetchVideos = async (studentId?: string): Promise<Video[]> => {
  await delay(800);
  if (studentId) {
    return mockVideos.filter(video => video.studentId === studentId);
  }
  return [...mockVideos];
};

export const createVideo = async (data: VideoFormData): Promise<Video> => {
  await delay(1200);
  const newVideo: Video = {
    id: Math.random().toString(36).substring(2, 9),
    title: data.title,
    url: data.videoFile ? URL.createObjectURL(data.videoFile) : '',
    thumbnailUrl: 'https://images.pexels.com/photos/3585047/pexels-photo-3585047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    studentId: data.studentId,
    category: data.category,
    createdAt: new Date()
  };
  mockVideos.push(newVideo);
  return newVideo;
};

export const deleteVideo = async (id: string): Promise<void> => {
  await delay(800);
  const index = mockVideos.findIndex(video => video.id === id);
  if (index !== -1) {
    mockVideos.splice(index, 1);
  }
};