import { Student, Video } from '../types';

// Mock student data
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    profileUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    styleTag: '#3B82F6', // blue
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Jamie Smith',
    profileUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    styleTag: '#8B5CF6', // purple
    createdAt: new Date('2023-02-10')
  },
  {
    id: '3',
    name: 'Taylor Williams',
    profileUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    styleTag: '#EC4899', // pink
    createdAt: new Date('2023-03-05')
  },
  {
    id: '4',
    name: 'Morgan Davis',
    profileUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    styleTag: '#10B981', // green
    createdAt: new Date('2023-04-20')
  }
];

// Mock video data
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Final Year Project Presentation',
    url: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    studentId: '1',
    category: 'presentation',
    createdAt: new Date('2023-05-10')
  },
  {
    id: '2',
    title: 'Mobile App Demo',
    url: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    studentId: '1',
    category: 'project',
    createdAt: new Date('2023-06-15')
  },
  {
    id: '3',
    title: 'Group Activity - Design Sprint',
    url: 'https://example.com/video3.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    studentId: '2',
    category: 'activity',
    createdAt: new Date('2023-07-22')
  },
  {
    id: '4',
    title: 'Web Portfolio Defense',
    url: 'https://example.com/video4.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    studentId: '3',
    category: 'presentation',
    createdAt: new Date('2023-08-05')
  },
  {
    id: '5',
    title: 'UI/UX Case Study',
    url: 'https://example.com/video5.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/5077047/pexels-photo-5077047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    studentId: '4',
    category: 'project',
    createdAt: new Date('2023-09-18')
  }
];