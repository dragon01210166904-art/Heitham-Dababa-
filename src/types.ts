export type CourseCategory =
  | 'التضخيم وبناء العضلات'
  | 'التنشيف وحرق الدهون'
  | 'التغذية والمكملات'
  | 'تكنيك الأداء والوقاية';

export type CourseLevel = 'مبتدئ' | 'متوسط' | 'متقدم';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  keyTakeaways: string[];
  transcriptSegments: {
    timeLabel: string;
    atPercent: number;
    text: string;
  }[];
  slideFocusTitle: string;
  slideCodeOrFormula?: string;
  resourceFileName: string;
  resourceContent: string;
  quiz: QuizQuestion;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  organization: string;
  experienceYears: number;
  specialty: string;
  bio: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  level: CourseLevel;
  totalHours: number;
  lessonsCount: number;
  enrolledCount: number;
  priceLabel: string;
  image: string;
  imageAlt: string;
  instructorId: string;
  outcomes: string[];
  modules: CourseModule[];
}

export interface CoachingPackage {
  id: string;
  orderNumber: string;
  title: string;
  durationLabel: string;
  priceEgp: number;
  priceNote: string;
  summary: string;
  features: string[];
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  courseTitle: string;
  statement: string;
}

export interface IntakeSubmission {
  id: string;
  submittedAt: string;
  fullName: string;
  phone: string;
  email: string;
  packageId: string;
  packageTitle: string;
  age: string;
  heightCm: string;
  weightKg: string;
  goal: string;
  experience: string;
  trainingDays: string;
  trainingPlace: string;
  notes: string;
}

export interface TrainingProgressState {
  traineeName: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  lessonNotes: Record<string, string>;
  quizScores: Record<string, boolean>;
  submissions: IntakeSubmission[];
}
