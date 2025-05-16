export interface Student {
  id: string;
  name: string;
  profileUrl?: string;
  styleTag: string;
  createdAt: Date;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  studentId: string;
  category: 'project' | 'presentation' | 'activity';
  createdAt: Date;
}

export interface StudentFormData {
  name: string;
  profilePhoto: File | null;
  styleTag: string;
}

export interface VideoFormData {
  title: string;
  videoFile: File | null;
  studentId: string;
  category: 'project' | 'presentation' | 'activity';
}