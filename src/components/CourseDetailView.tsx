import { ArrowRight, BookOpen, CheckCircle2, Clock, Play, Users } from 'lucide-react';
import { Course, Instructor } from '../types';
import { ResilientImage } from './ResilientImage';

interface CourseDetailViewProps {
  course: Course;
  instructor?: Instructor;
  isEnrolled: boolean;
  completedLessonIds: string[];
  onBack: () => void;
  onEnrollAndStart: (courseId: string, initialLessonId?: string) => void;
}

export function CourseDetailView({
  course,
  instructor,
  isEnrolled,
  completedLessonIds,
  onBack,
  onEnrollAndStart,
}: CourseDetailViewProps) {
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent =
    allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
          <span>العودة إلى البرامج التدريبية</span>
        </button>
      </div>

      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
              <span className="font-semibold text-red-700">{course.category}</span>
              <span aria-hidden="true">·</span>
              <span>المستوى: {course.level}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{course.totalHours} ساعة تدريبية</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{allLessons.length} دروس تفاعلية</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight text-balance">
              {course.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              {course.subtitle}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-700">
                المدرب: <strong className="font-semibold text-slate-900">{instructor?.name}</strong>
              </p>
              <p className="text-xs text-slate-500">
                {instructor?.role} · {instructor?.organization}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onEnrollAndStart(course.id)}
                className="px-6 py-3 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>
                  {isEnrolled
                    ? progressPercent > 0
                      ? `متابعة التدريب (${progressPercent}%)`
                      : 'دخول قاعة التدريب'
                    : 'التسجيل والبدء الآن'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 min-h-[260px] bg-slate-100">
          <ResilientImage
            src={course.image}
            alt={course.imageAlt}
            title={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Course Facts Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <Clock className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>المدة الإجمالية</span>
          </div>
          <p className="font-display text-xl font-bold text-slate-900 tabular-nums">
            {course.totalHours} ساعة تطبيقية
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <BookOpen className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>الوحدات والدروس</span>
          </div>
          <p className="font-display text-xl font-bold text-slate-900 tabular-nums">
            {allLessons.length} دروس واختبارات
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <Users className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>المتدربون المسجلون</span>
          </div>
          <p className="font-display text-xl font-bold text-slate-900 tabular-nums">
            {course.enrolledCount.toLocaleString('ar-EG')} متدرب
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>الاعتماد</span>
          </div>
          <p className="font-display text-xl font-bold text-slate-900">
            شهادة إتمام تفاعلية
          </p>
        </div>
      </section>

      {/* Learning Outcomes + Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            المنهج التدريبي التفصيلي
          </h2>

          <div className="space-y-4">
            {course.modules.map((mod, modIndex) => (
              <div
                key={mod.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {String(modIndex + 1).padStart(2, '0')}. {mod.title}
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums shrink-0">
                    {mod.lessons.length} دروس
                  </span>
                </div>

                <ul className="divide-y divide-slate-100">
                  {mod.lessons.map((lesson) => {
                    const done = completedLessonIds.includes(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => onEnrollAndStart(course.id, lesson.id)}
                          className="w-full px-6 py-4 text-right hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            {done ? (
                              <CheckCircle2
                                className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <Play
                                className="w-4 h-4 text-red-700 shrink-0 mt-1"
                                aria-hidden="true"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                {lesson.summary}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-slate-500 tabular-nums shrink-0">
                            {lesson.durationMinutes} د
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              ماذا ستتقن في هذا البرنامج
            </h2>
            <ul className="space-y-3">
              {course.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2
                    className="w-4 h-4 text-red-700 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {instructor && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <span className="text-xs font-medium text-slate-500 block">عن المدرب</span>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {instructor.name}
              </h3>
              <p className="text-xs text-red-700 font-medium">
                {instructor.role} · {instructor.organization}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{instructor.bio}</p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 tabular-nums">
                خبرة عملية: {instructor.experienceYears} عاماً في {instructor.specialty}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
