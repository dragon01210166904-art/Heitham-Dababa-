import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Course, Instructor } from '../types';
import { ResilientImage } from './ResilientImage';

interface CourseCardProps {
  course: Course;
  instructor?: Instructor;
  isEnrolled: boolean;
  progressPercent: number;
  actualLessonsCount: number;
  onSelectCourse: (courseId: string) => void;
  onStartClassroom: (courseId: string) => void;
}

export function CourseCard({
  course,
  instructor,
  isEnrolled,
  progressPercent,
  actualLessonsCount,
  onSelectCourse,
  onStartClassroom,
}: CourseCardProps) {
  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5">
      <div
        onClick={() => onSelectCourse(course.id)}
        className="aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <ResilientImage
          src={course.image}
          alt={course.imageAlt}
          title={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Zero-pill unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2.5">
          <span className="font-medium text-red-700">{course.category}</span>
          <span aria-hidden="true">·</span>
          <span>{course.level}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{course.totalHours} ساعة</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{actualLessonsCount} دروس تفاعلية</span>
        </div>

        <h3 className="font-display text-xl font-bold text-slate-900 leading-snug mb-2">
          <button
            type="button"
            onClick={() => onSelectCourse(course.id)}
            className="text-right hover:text-red-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-red-700 rounded"
          >
            {course.title}
          </button>
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2">
          {course.subtitle}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs text-slate-600">
            <span className="truncate">
              المدرب: <strong className="font-medium text-slate-900">{instructor?.name}</strong>
            </span>
            <span className="tabular-nums whitespace-nowrap shrink-0 text-slate-500">
              {course.enrolledCount.toLocaleString('ar-EG')} متدرب
            </span>
          </div>

          {isEnrolled ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>مفعّل في حسابك</span>
                </span>
                <span className="tabular-nums font-medium text-slate-700">
                  الإنجاز {progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => onStartClassroom(course.id)}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>متابعة البرنامج التدريبي</span>
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-700 truncate">
                {course.priceLabel}
              </span>
              <button
                type="button"
                onClick={() => onSelectCourse(course.id)}
                className="py-2 px-4 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                استعراض المنهج
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
