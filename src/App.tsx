import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react';
import {
  COACH_NAME,
  COACH_PHONE_DISPLAY,
  COACH_PHONE_RAW,
  COACHING_PACKAGES,
  COURSES,
  HERO_IMAGE,
  INSTRUCTORS,
  TESTIMONIALS,
} from './data/courses';
import { CourseCategory, CourseLevel } from './types';
import { useTrainingState } from './hooks/useTrainingState';
import { ActivePage, Header } from './components/Header';
import { Footer } from './components/Footer';
import { ResilientImage } from './components/ResilientImage';
import { CourseCard } from './components/CourseCard';
import { CourseDetailView } from './components/CourseDetailView';
import { ClassroomView } from './components/ClassroomView';
import { MyLearningView } from './components/MyLearningView';
import { SubscriptionIntakeForm } from './components/SubscriptionIntakeForm';

const CATEGORIES: ('الكل' | CourseCategory)[] = [
  'الكل',
  'التضخيم وبناء العضلات',
  'التنشيف وحرق الدهون',
  'التغذية والمكملات',
  'تكنيك الأداء والوقاية',
];

const LEVELS: ('الكل' | CourseLevel)[] = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'];

export default function App() {
  const {
    state,
    enrollInCourse,
    toggleLessonComplete,
    markLessonComplete,
    saveLessonNote,
    recordQuizResult,
    updateTraineeName,
    addSubmission,
  } = useTrainingState();

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
  const [initialLessonId, setInitialLessonId] = useState<string | undefined>(undefined);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(COACHING_PACKAGES[1].id);

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'الكل' | CourseCategory>('الكل');
  const [selectedLevel, setSelectedLevel] = useState<'الكل' | CourseLevel>('الكل');

  const navigateTo = (page: ActivePage, sectionId?: string) => {
    setActivePage(page);
    if (page === 'home' && sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChoosePackageAndFillForm = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    navigateTo('home', 'intake-form');
  };

  const handleOpenCourseDetail = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActivePage('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterClassroom = (courseId: string, lessonId?: string) => {
    enrollInCourse(courseId);
    setSelectedCourseId(courseId);
    setInitialLessonId(lessonId);
    setActivePage('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COURSES.filter((course) => {
      const matchesCat = selectedCategory === 'الكل' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'الكل' || course.level === selectedLevel;
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.subtitle.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      return matchesCat && matchesLevel && matchesQuery;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const selectedInstructor = INSTRUCTORS.find((i) => i.id === selectedCourse.instructorId);

  const getCourseProgress = (courseId: string) => {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return { total: 0, completed: 0, percent: 0 };
    const lessons = course.modules.flatMap((m) => m.lessons);
    const completed = lessons.filter((l) => state.completedLessonIds.includes(l.id)).length;
    const percent = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
    return { total: lessons.length, completed, percent };
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activePage={activePage}
        onNavigate={navigateTo}
        onOpenIntake={() => navigateTo('home', 'intake-form')}
      />

      <main className="flex-1">
        {activePage === 'classroom' && (
          <ClassroomView
            course={selectedCourse}
            instructor={selectedInstructor}
            initialLessonId={initialLessonId}
            traineeName={state.traineeName}
            completedLessonIds={state.completedLessonIds}
            lessonNotes={state.lessonNotes}
            quizScores={state.quizScores}
            onBack={() => setActivePage('course-detail')}
            onToggleLessonComplete={toggleLessonComplete}
            onMarkLessonComplete={markLessonComplete}
            onSaveNote={saveLessonNote}
            onRecordQuizResult={recordQuizResult}
            onUpdateTraineeName={updateTraineeName}
          />
        )}

        {activePage === 'course-detail' && (
          <CourseDetailView
            course={selectedCourse}
            instructor={selectedInstructor}
            isEnrolled={state.enrolledCourseIds.includes(selectedCourse.id)}
            completedLessonIds={state.completedLessonIds}
            onBack={() => navigateTo('home', 'catalog')}
            onEnrollAndStart={handleEnterClassroom}
          />
        )}

        {activePage === 'my-learning' && (
          <MyLearningView
            courses={COURSES}
            instructors={INSTRUCTORS}
            state={state}
            onOpenClassroom={(courseId) => handleEnterClassroom(courseId)}
            onBrowseCatalog={() => navigateTo('home', 'catalog')}
            onOpenIntake={() => navigateTo('home', 'intake-form')}
          />
        )}

        {activePage === 'home' && (
          <>
            {/* Hero Section: 2-column split + 4-column KPI strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-8 sm:p-12 flex flex-col justify-between space-y-8 border border-slate-800">
                  <div className="space-y-5">
                    <p className="text-sm font-semibold text-red-400">
                      التدريب الأونلاين لكمال الأجسام والتغذية · {COACH_NAME}
                    </p>
                    <h1
                      className="font-display font-extrabold text-white leading-[1.2] text-balance"
                      style={{ fontSize: 'clamp(2.1rem, 3.6vw, 3.25rem)' }}
                    >
                      ابْنِ جسمك بقوة وعلم مع {COACH_NAME}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                      برامج تضخيم عضلي صافي وتنشيف وحرق دهون مصممة على مقاسات جسمك وميزانيتك، مع متابعة أسبوعية وتصحيح تكنيك التمرين أونلاين.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => navigateTo('home', 'intake-form')}
                        className="px-6 py-3.5 text-sm font-bold text-white bg-red-700 hover:bg-red-600 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <span>املأ استمارة الاشتراك الآن</span>
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('home', 'packages')}
                        className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white underline underline-offset-8 decoration-slate-600 hover:decoration-white transition-colors whitespace-nowrap cursor-pointer"
                      >
                        عرض الباقات والأسعار
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
                      <span>اشترك معنا مباشرة على رقم {COACH_NAME}:</span>
                      <a
                        href={`https://wa.me/${COACH_PHONE_RAW}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className="font-mono font-bold text-white hover:text-red-400 transition-colors"
                      >
                        {COACH_PHONE_DISPLAY}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt="صالة كمال أجسام مجهزة لتمارين القوة والسكوات"
                    title={COACH_NAME}
                    className="w-full h-full lg:h-full object-cover"
                  />
                </div>
              </div>

              {/* 4-column KPI strip below hero split */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    +١,٢٥٠
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    متدرب ملتزم في التضخيم والتنشيف
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    ١٢ عاماً
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    خبرة عملية في كمال الأجسام
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    ٤٥٠ ج.م
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    بداية الباقات الشهرية المناسبة للجميع
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p
                    dir="ltr"
                    className="font-mono text-xl sm:text-2xl font-extrabold text-red-700 tabular-nums text-right"
                  >
                    {COACH_PHONE_DISPLAY}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    رقم الاشتراك المباشر مع الكوتش
                  </p>
                </div>
              </div>
            </section>

            {/* Affordable Packages & Pricing Section */}
            <section
              id="packages"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200 space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    باقات التدريب الأونلاين وأسعار الاشتراك
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600">
                    أسعار مناسبة مصممة لتناسب الطلاب والموظفين مع متابعة حقيقية ونتائج ملموسة. اضغط على أي باقة لملء استمارة الاشتراك فوراً.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${COACH_PHONE_RAW}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>اشترك عبر واتساب: {COACH_PHONE_DISPLAY}</span>
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {COACHING_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl p-7 flex flex-col justify-between space-y-6 border ${
                      pkg.highlighted
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-900 border-slate-200'
                    }`}
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-mono font-bold ${
                            pkg.highlighted ? 'text-red-400' : 'text-red-700'
                          }`}
                        >
                          {pkg.orderNumber}. {pkg.durationLabel}
                        </span>
                        {pkg.highlighted && (
                          <span className="font-semibold text-emerald-400">الأكثر طلباً</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-display text-2xl font-bold">{pkg.title}</h3>
                        <p
                          className={`text-sm leading-relaxed ${
                            pkg.highlighted ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {pkg.summary}
                        </p>
                      </div>

                      <div
                        className={`py-4 border-y ${
                          pkg.highlighted ? 'border-slate-800' : 'border-slate-100'
                        }`}
                      >
                        <p className="font-display text-3xl font-extrabold tabular-nums">
                          {pkg.priceEgp.toLocaleString('ar-EG')} ج.م
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            pkg.highlighted ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {pkg.priceNote}
                        </p>
                      </div>

                      <ul className="space-y-3">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-1 ${
                                pkg.highlighted ? 'text-emerald-400' : 'text-red-700'
                              }`}
                              aria-hidden="true"
                            />
                            <span className={pkg.highlighted ? 'text-slate-200' : 'text-slate-700'}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChoosePackageAndFillForm(pkg.id)}
                      className={`w-full py-3 px-4 text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        pkg.highlighted
                          ? 'bg-red-700 hover:bg-red-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      اختر الباقة واملأ الاستمارة
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Bodybuilding Programs & Technique Library */}
            <section
              id="catalog"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200 space-y-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    البرامج والشروحات التطبيقية لـ {COACH_NAME}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600">
                    استعرض مكتبة الدروس المصورة والاختبارات السريعة في التضخيم والتنشيف والتغذية لتتعرف على أسلوبنا العلمي قبل وبعد الاشتراك.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full lg:w-80">
                  <Search
                    className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن برنامج أو تمرين..."
                    aria-label="ابحث في البرامج التدريبية"
                    className="w-full bg-white border border-slate-300 rounded-lg pr-10 pl-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>
              </div>

              {/* Filter Bars */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div
                  role="group"
                  aria-label="تصفية حسب التخصص"
                  className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg w-fit"
                >
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedCategory === category
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div
                  role="group"
                  aria-label="تصفية حسب المستوى"
                  className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit"
                >
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedLevel === level
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {level === 'الكل' ? 'كل المستويات' : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses Grid */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
                  <p className="font-display text-lg font-bold text-slate-900">
                    لا توجد برامج مطابقة لخيارات البحث الحالية
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('الكل');
                      setSelectedLevel('الكل');
                    }}
                    className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredCourses.map((course) => {
                    const inst = INSTRUCTORS.find((i) => i.id === course.instructorId);
                    const isEnrolled = state.enrolledCourseIds.includes(course.id);
                    const prog = getCourseProgress(course.id);
                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        instructor={inst}
                        isEnrolled={isEnrolled}
                        progressPercent={prog.percent}
                        actualLessonsCount={prog.total}
                        onSelectCourse={handleOpenCourseDetail}
                        onStartClassroom={(id) => handleEnterClassroom(id)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* Transformations & Testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    تجارب المشتركين مع {COACH_NAME}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600">
                    نتائج حقيقية لمتدربين التزموا بالجدول والتغذية الاقتصادية دون مكملات مكلفة.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('home', 'intake-form')}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  ابدأ قصتك واملأ الاستمارة
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((item) => (
                  <blockquote
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">
                      &ldquo;{item.statement}&rdquo;
                    </p>
                    <footer className="pt-4 border-t border-slate-100 space-y-0.5">
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-600">
                        {item.role} · {item.organization}
                      </p>
                      <p className="text-xs text-red-700 pt-1">{item.courseTitle}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>

            {/* Intake Form & Direct Subscription Section */}
            <section
              id="intake-form"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-red-700 block">
                      خطوة واحدة تفصلك عن خطتك المخصصة
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 text-balance">
                      اشترك الآن وأرسل استمارة بياناتك للكوتش هيثم دبابة
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      بمجرد ملء الاستمارة وإرسالها عبر البريد، نراجع طولك ووزنك وهدفك وإصاباتك لنجهز لك جدول التمرين والنظام الغذائي المناسب في أسرع وقت.
                    </p>
                  </div>

                  {/* Direct Phone & WhatsApp Callout Box */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs text-red-400 font-semibold">
                        الاشتراك والتواصل المباشر
                      </p>
                      <h3 className="font-display text-lg font-bold">
                        اشترك معنا على رقم {COACH_NAME}
                      </h3>
                      <p
                        dir="ltr"
                        className="font-mono text-2xl font-extrabold text-white text-right pt-1"
                      >
                        {COACH_PHONE_DISPLAY}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={`https://wa.me/${COACH_PHONE_RAW}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                        <span>مراسلة واتساب مباشرة</span>
                      </a>

                      <a
                        href={`tel:+${COACH_PHONE_RAW}`}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        <span>اتصال هاتفي</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <SubscriptionIntakeForm
                    selectedPackageId={selectedPackageId}
                    onSelectPackage={setSelectedPackageId}
                    onSubmitIntake={addSubmission}
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
