import { ArrowLeft, Award, BookOpen, CheckCircle2, Mail, MessageCircle, StickyNote } from 'lucide-react';
import { COACH_EMAIL, COACH_PHONE_DISPLAY, COACH_PHONE_RAW } from '../data/courses';
import { Course, Instructor, TrainingProgressState } from '../types';
import { ResilientImage } from './ResilientImage';

interface MyLearningViewProps {
  courses: Course[];
  instructors: Instructor[];
  state: TrainingProgressState;
  onOpenClassroom: (courseId: string) => void;
  onBrowseCatalog: () => void;
  onOpenIntake: () => void;
}

export function MyLearningView({
  courses,
  instructors,
  state,
  onOpenClassroom,
  onBrowseCatalog,
  onOpenIntake,
}: MyLearningViewProps) {
  const enrolledCourses = courses.filter((c) => state.enrolledCourseIds.includes(c.id));

  const earnedCertificatesCount = enrolledCourses.filter((course) => {
    const lessons = course.modules.flatMap((m) => m.lessons);
    return lessons.length > 0 && lessons.every((l) => state.completedLessonIds.includes(l.id));
  }).length;

  const savedNotesCount = Object.values(state.lessonNotes).filter((n) => n.trim().length > 0).length;
  const passedQuizzesCount = Object.values(state.quizScores).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-medium text-red-700 block">لوحة المتدرب الشخصية</span>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            مساحة المتدرب والمتابعة
          </h1>
          <p className="text-sm text-slate-600">
            تابع تقدمك في البرامج التدريبية، راجع ملاحظاتك، وتحقق من استمارة اشتراكك المرسلة للكوتش.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenIntake}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            ملء استمارة اشتراك جديدة
          </button>
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            البرامج التدريبية
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <BookOpen className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>البرامج المفعلة</span>
          </div>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
            {enrolledCourses.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>الدروس والاختبارات</span>
          </div>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
            {state.completedLessonIds.length} درس · {passedQuizzesCount} اختبار
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <StickyNote className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>الملاحظات المدونة</span>
          </div>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
            {savedNotesCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <Award className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>الشهادات المكتملة</span>
          </div>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
            {earnedCertificatesCount}
          </p>
        </div>
      </div>

      {/* Submitted Intake Forms History */}
      {state.submissions.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">
            استمارات الاشتراك المسجلة ({state.submissions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.submissions.map((sub) => {
              const summaryText = `طلب اشتراك - ${sub.fullName}\nالباقة: ${sub.packageTitle}\nالهاتف: ${sub.phone}\nالهدف: ${sub.goal}\nالوزن: ${sub.weightKg} كجم · الطول: ${sub.heightCm} سم`;
              const mailHref = `mailto:${COACH_EMAIL}?subject=${encodeURIComponent(
                `اشتراك ${sub.fullName}`
              )}&body=${encodeURIComponent(summaryText)}`;
              const waHref = `https://wa.me/${COACH_PHONE_RAW}?text=${encodeURIComponent(summaryText)}`;

              return (
                <div
                  key={sub.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-red-700">{sub.packageTitle}</span>
                    <span className="tabular-nums">
                      {new Date(sub.submittedAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {sub.fullName} · {sub.goal}
                  </p>
                  <p className="text-xs text-slate-600 tabular-nums">
                    العمر {sub.age} سنة · الطول {sub.heightCm} سم · الوزن {sub.weightKg} كجم ·{' '}
                    {sub.trainingDays}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={mailHref}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>إعادة إرسال بالبريد</span>
                    </a>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>واتساب ({COACH_PHONE_DISPLAY})</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Enrolled Courses List */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">برامج التمرين والتغذية</h2>
        {enrolledCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              لم تبدأ أي برنامج تدريبي بعد
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              تصفح البرامج التدريبية المتاحة أو املأ استمارة الاشتراك ليضع لك الكوتش برنامجك المخصص.
            </p>
            <button
              type="button"
              onClick={onBrowseCatalog}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer"
            >
              تصفح البرامج التدريبية
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => {
              const lessons = course.modules.flatMap((m) => m.lessons);
              const doneCount = lessons.filter((l) =>
                state.completedLessonIds.includes(l.id)
              ).length;
              const percent = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
              const inst = instructors.find((i) => i.id === course.instructorId);

              return (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="sm:w-44 h-44 sm:h-auto shrink-0 bg-slate-100">
                    <ResilientImage
                      src={course.image}
                      alt={course.imageAlt}
                      title={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="font-medium text-red-700">{course.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{inst?.name}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                        <span>
                          {doneCount} من {lessons.length} دروس
                        </span>
                        <span className="font-semibold text-slate-900">{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-200"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenClassroom(course.id)}
                        className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>{percent === 100 ? 'مراجعة الشهادة والدروس' : 'متابعة التعلم'}</span>
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
