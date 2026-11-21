import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  StickyNote,
} from 'lucide-react';
import { Course, Instructor, Lesson } from '../types';

interface ClassroomViewProps {
  course: Course;
  instructor?: Instructor;
  initialLessonId?: string;
  traineeName: string;
  completedLessonIds: string[];
  lessonNotes: Record<string, string>;
  quizScores: Record<string, boolean>;
  onBack: () => void;
  onToggleLessonComplete: (lessonId: string) => void;
  onMarkLessonComplete: (lessonId: string) => void;
  onSaveNote: (lessonId: string, note: string) => void;
  onRecordQuizResult: (lessonId: string, passed: boolean) => void;
  onUpdateTraineeName: (name: string) => void;
}

type ClassroomTab = 'summary' | 'quiz' | 'notes' | 'certificate';

export function ClassroomView({
  course,
  instructor,
  initialLessonId,
  traineeName,
  completedLessonIds,
  lessonNotes,
  quizScores,
  onBack,
  onToggleLessonComplete,
  onMarkLessonComplete,
  onSaveNote,
  onRecordQuizResult,
  onUpdateTraineeName,
}: ClassroomViewProps) {
  const allLessons = useMemo(
    () => course.modules.flatMap((m) => m.lessons),
    [course.modules]
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    if (initialLessonId && allLessons.some((l) => l.id === initialLessonId)) {
      return initialLessonId;
    }
    return allLessons[0]?.id || '';
  });

  const activeLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson: Lesson | undefined = allLessons[activeLessonIndex] || allLessons[0];

  const [activeTab, setActiveTab] = useState<ClassroomTab>('summary');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Quiz state for active lesson
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Note input synced to active lesson
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  const totalSeconds = (activeLesson?.durationMinutes || 15) * 60;
  const progressPercentPlayback = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

  useEffect(() => {
    setElapsedSeconds(0);
    setIsPlaying(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
    if (activeLesson) {
      setNoteDraft(lessonNotes[activeLesson.id] || '');
    }
  }, [activeLesson?.id]);

  // Simulated lecture playback loop
  useEffect(() => {
    if (!isPlaying || !activeLesson) return;
    const intervalMs = Math.max(150, Math.round(1000 / playbackSpeed));
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 15; // Advances smoothly by 15s per tick for responsive training simulation
        if (next >= totalSeconds) {
          setIsPlaying(false);
          onMarkLessonComplete(activeLesson.id);
          return totalSeconds;
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSeconds, activeLesson, onMarkLessonComplete]);

  if (!activeLesson) {
    return null;
  }

  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const courseProgressPercent =
    allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const isCourseCompleted = completedCount === allLessons.length && allLessons.length > 0;
  const isActiveLessonDone = completedLessonIds.includes(activeLesson.id);

  const activeTranscriptIndex = activeLesson.transcriptSegments.reduce((acc, seg, idx) => {
    return progressPercentPlayback >= seg.atPercent ? idx : acc;
  }, 0);

  const formatClock = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleDownloadResource = () => {
    const blob = new Blob([activeLesson.resourceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeLesson.resourceFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCertificate = () => {
    const certHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><title>شهادة إتمام - ${course.title}</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 48px; color: #0f172a; }
  .card { max-width: 780px; margin: 0 auto; background: #fff; border: 2px solid #1d4ed8; padding: 48px; border-radius: 12px; }
  h1 { font-size: 28px; margin-bottom: 8px; }
  .name { font-size: 32px; color: #1d4ed8; font-weight: 800; margin: 24px 0; }
  .meta { color: #475569; font-size: 14px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
</style>
</head>
<body>
  <div class="card">
    <p>أكاديمية كوتش هيثم دبابة لكمال الأجسام</p>
    <h1>شهادة إتمام برنامج تدريبي</h1>
    <p>تشهد الأكاديمية بأن المتدرب:</p>
    <div class="name">${traineeName || 'بطل فريق دبابة'}</div>
    <p>قد أتم بنجاح جميع وحدات ومتطلبات البرنامج التطبيقي:</p>
    <h2>${course.title}</h2>
    <div class="meta">
      المدة التدريبية: ${course.totalHours} ساعة · المدرب: ${instructor?.name || 'هيئة تدريب مدار'} · التاريخ: ${new Date().toLocaleDateString('ar-EG')}
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([certHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madar-certificate-${course.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    const passed = selectedOption === activeLesson.quiz.correctIndex;
    onRecordQuizResult(activeLesson.id, passed);
    if (passed) {
      onMarkLessonComplete(activeLesson.id);
    }
  };

  const handleSaveNotes = () => {
    onSaveNote(activeLesson.id, noteDraft);
    setNoteSavedToast(true);
    window.setTimeout(() => setNoteSavedToast(false), 2000);
  };

  const handleInsertTimestamp = () => {
    const stamp = `[${formatClock(elapsedSeconds)}] `;
    const updated = noteDraft ? `${noteDraft}\n${stamp}` : stamp;
    setNoteDraft(updated);
    onSaveNote(activeLesson.id, updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Classroom Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            <span>خروج من القاعة</span>
          </button>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs font-medium text-slate-600 tabular-nums">
            تم إتمام {completedCount} من {allLessons.length} ({courseProgressPercent}%)
          </span>
          <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-200"
              style={{ width: `${courseProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-Zone Classroom Sandbox: Main Stage (~65%) + Curriculum Deck (~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Stage */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Lecture Stage */}
          <div className="bg-slate-900 text-white rounded-xl overflow-hidden border border-slate-800">
            <div className="aspect-video p-6 sm:p-10 flex flex-col justify-between relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950">
              <div className="flex items-center justify-between gap-4 text-xs text-slate-300">
                <span>{course.category}</span>
                <span className="font-mono tabular-nums">
                  {formatClock(elapsedSeconds)} / {formatClock(totalSeconds)}
                </span>
              </div>

              <div className="my-auto py-4 space-y-5 max-w-2xl">
                <p className="text-xs font-medium text-blue-300">
                  الدرس الحالي · {activeLesson.title}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug text-balance">
                  {activeLesson.slideFocusTitle}
                </h2>
                {activeLesson.slideCodeOrFormula && (
                  <div
                    dir="ltr"
                    className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-4 py-3 font-mono text-xs sm:text-sm text-blue-200 overflow-x-auto"
                  >
                    {activeLesson.slideCodeOrFormula}
                  </div>
                )}
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 border border-slate-800 rounded-lg p-4">
                  {activeLesson.transcriptSegments[activeTranscriptIndex]?.text}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>المحاضر: {instructor?.name}</span>
                <span>سرعة التشغيل: {playbackSpeed}x</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="bg-slate-950 px-5 py-4 space-y-3 border-t border-slate-800">
              {/* Scrubber bar in LTR so timeline progresses predictably left-to-right */}
              <div dir="ltr" className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400 tabular-nums w-12">
                  {formatClock(elapsedSeconds)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={totalSeconds}
                  value={elapsedSeconds}
                  aria-label="شريط تقدم الدرس"
                  onChange={(e) => setElapsedSeconds(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="font-mono text-xs text-slate-400 tabular-nums w-12 text-right">
                  {formatClock(totalSeconds)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" aria-hidden="true" />
                        <span>إيقاف مؤقت</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                        <span>{elapsedSeconds > 0 ? 'متابعة الشرح' : 'تشغيل الدرس'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setElapsedSeconds(0)}
                    aria-label="إعادة الدرس من البداية"
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                    {[1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                          playbackSpeed === spd
                            ? 'bg-slate-700 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleLessonComplete(activeLesson.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      isActiveLessonDone
                        ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>{isActiveLessonDone ? 'تم إتمام الدرس' : 'تحديد كمكتمل'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Action Header + Prev/Next */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5">
            <div>
              <span className="text-xs text-slate-500 block mb-1">
                الدرس {activeLessonIndex + 1} من {allLessons.length}
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeLessonIndex <= 0}
                onClick={() => {
                  if (activeLessonIndex > 0) {
                    setActiveLessonId(allLessons[activeLessonIndex - 1].id);
                  }
                }}
                className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                <span>الدرس السابق</span>
              </button>
              <button
                type="button"
                disabled={activeLessonIndex >= allLessons.length - 1}
                onClick={() => {
                  if (activeLessonIndex < allLessons.length - 1) {
                    setActiveLessonId(allLessons[activeLessonIndex + 1].id);
                  }
                }}
                className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>الدرس التالي</span>
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Interactive Workspace Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="border-b border-slate-200 px-4 pt-3 flex flex-wrap gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'summary'
                    ? 'border-blue-700 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>ملخص الدرس والمصادر</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'quiz'
                    ? 'border-blue-700 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                <span>اختبار الفهم السريع</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'notes'
                    ? 'border-blue-700 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <StickyNote className="w-4 h-4" aria-hidden="true" />
                <span>ملاحظاتي</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('certificate')}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'certificate'
                    ? 'border-blue-700 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>شهادة الإتمام</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 mb-2">
                      نظرة عامة على الدرس
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{activeLesson.summary}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      النقاط التطبيقية الأساسية
                    </h4>
                    <ul className="space-y-2.5">
                      {activeLesson.keyTakeaways.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                        >
                          <CheckCircle2
                            className="w-4 h-4 text-blue-700 shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        دليل المراجعة السريعة للدرس
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {activeLesson.resourceFileName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadResource}
                      className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>تحميل ملخص الدرس</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      تحقق من فهمك للدرس
                    </h3>
                    {quizScores[activeLesson.id] !== undefined && (
                      <span
                        className={`text-xs font-semibold ${
                          quizScores[activeLesson.id] ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {quizScores[activeLesson.id] ? 'تم الاجتياز بنجاح' : 'محاولة سابقة مسجلة'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {activeLesson.quiz.question}
                  </p>

                  <div className="space-y-2.5">
                    {activeLesson.quiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === activeLesson.quiz.correctIndex;
                      let optionStyle =
                        'border-slate-200 bg-white hover:border-slate-300 text-slate-800';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'border-red-600 bg-red-50 text-red-900';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-blue-700 bg-blue-50 text-blue-950';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!quizSubmitted) setSelectedOption(idx);
                          }}
                          className={`w-full text-right p-4 rounded-lg border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          <span className="text-xs font-mono text-slate-400 shrink-0">
                            {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={selectedOption === null || quizSubmitted}
                      onClick={handleQuizSubmit}
                      className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      تحقق من الإجابة
                    </button>

                    {quizSubmitted && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedOption(null);
                        }}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        إعادة المحاولة
                      </button>
                    )}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`p-4 rounded-lg border text-sm leading-relaxed ${
                        selectedOption === activeLesson.quiz.correctIndex
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <strong className="block mb-1">
                        {selectedOption === activeLesson.quiz.correctIndex
                          ? 'إجابة صحيحة — تم تسجيل الدرس كمكتمل.'
                          : 'إجابة غير دقيقة — راجع التوضيح التالي:'}
                      </strong>
                      <span>{activeLesson.quiz.explanation}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      ملاحظاتك على: {activeLesson.title}
                    </h3>
                    <button
                      type="button"
                      onClick={handleInsertTimestamp}
                      className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      إدراج التوقيت الحالي ({formatClock(elapsedSeconds)})
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="دوّن أفكارك أو النقاط التي ترغب في تطبيقها لاحقاً..."
                    className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                  />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                      تُحفظ الملاحظات تلقائياً على جهازك للعودة إليها في أي وقت.
                    </span>
                    <div className="flex items-center gap-3">
                      {noteSavedToast && (
                        <span className="text-xs font-medium text-emerald-700">تم الحفظ</span>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        حفظ الملاحظات
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'certificate' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1 flex-1 max-w-sm">
                      <label
                        htmlFor="trainee-name-input"
                        className="block text-xs font-medium text-slate-600"
                      >
                        الاسم الكامل كما سيظهر في الشهادة
                      </label>
                      <input
                        id="trainee-name-input"
                        type="text"
                        value={traineeName}
                        onChange={(e) => onUpdateTraineeName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                      />
                    </div>

                    <div className="text-xs text-slate-600 tabular-nums">
                      حالة الإتمام: {completedCount} من {allLessons.length} دروس
                    </div>
                  </div>

                  {/* Certificate Preview Card */}
                  <div className="border border-slate-200 rounded-xl p-6 sm:p-8 bg-slate-50 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="font-display text-lg font-extrabold text-slate-900">
                        كوتش هيثم دبابة
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isCourseCompleted ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {isCourseCompleted
                          ? 'مكتملة وجاهزة للتحميل'
                          : `متبقي ${allLessons.length - completedCount} دروس لإصدار الشهادة`}
                      </span>
                    </div>

                    <div className="space-y-2 py-2">
                      <p className="text-xs text-slate-500">شهادة إتمام برنامج تدريبي</p>
                      <h4 className="font-display text-2xl font-bold text-red-700">
                        {traineeName.trim() || 'بطل فريق دبابة'}
                      </h4>
                      <p className="text-sm text-slate-700">
                        أتم متطلبات البرنامج التدريبي:{' '}
                        <strong className="text-slate-900">{course.title}</strong>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                      <span>المدرب المشرف: {instructor?.name}</span>
                      <span className="tabular-nums">عدد الساعات: {course.totalHours} ساعة</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!isCourseCompleted}
                      onClick={handleDownloadCertificate}
                      className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>تحميل الشهادة</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar (~35%) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="font-display text-base font-bold text-slate-900">
                محتوى البرنامج التدريبي
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                اختر أي درس للانتقال المباشر أو اضغط على النص التفاعلي للمراجعة.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {course.modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 px-2 py-1">
                    {String(mIdx + 1).padStart(2, '0')}. {mod.title}
                  </h3>
                  <ul className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLesson.id;
                      const isDone = completedLessonIds.includes(lesson.id);
                      return (
                        <li
                          key={lesson.id}
                          className={`rounded-lg transition-colors flex items-center gap-2 px-2.5 py-2.5 ${
                            isActive ? 'bg-blue-50 text-blue-950' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleLessonComplete(lesson.id)}
                            aria-label={
                              isDone ? `إلغاء إتمام ${lesson.title}` : `تحديد ${lesson.title} كمكتمل`
                            }
                            className="shrink-0 p-1 cursor-pointer"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                isDone ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveLessonId(lesson.id)}
                            className="flex-1 text-right text-sm font-medium leading-snug cursor-pointer min-w-0"
                          >
                            <span className="block truncate">{lesson.title}</span>
                            <span className="text-xs text-slate-500 font-mono tabular-nums">
                              {lesson.durationMinutes} دقيقة
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

          {/* Synchronized Transcript Deck */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              النص التفاعلي للدرس
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeLesson.transcriptSegments.map((seg, idx) => {
                const isCurrent = idx === activeTranscriptIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setElapsedSeconds(Math.round((seg.atPercent / 100) * totalSeconds));
                    }}
                    className={`w-full text-right p-2.5 rounded-lg text-xs leading-relaxed transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 text-slate-900 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-blue-700 block mb-0.5">{seg.timeLabel}</span>
                    <span>{seg.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
