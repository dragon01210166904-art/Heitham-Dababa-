import { useState, useEffect, useCallback } from 'react';
import { IntakeSubmission, TrainingProgressState } from '../types';

const STORAGE_KEY = 'dababa_bodybuilding_state_v1';

const DEFAULT_STATE: TrainingProgressState = {
  traineeName: 'بطل فريق دبابة',
  enrolledCourseIds: ['course-hypertrophy'],
  completedLessonIds: [],
  lessonNotes: {},
  quizScores: {},
  submissions: [],
};

export function useTrainingState() {
  const [state, setState] = useState<TrainingProgressState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw) as Partial<TrainingProgressState>;
      return {
        traineeName: parsed.traineeName || DEFAULT_STATE.traineeName,
        enrolledCourseIds: Array.isArray(parsed.enrolledCourseIds)
          ? parsed.enrolledCourseIds
          : DEFAULT_STATE.enrolledCourseIds,
        completedLessonIds: Array.isArray(parsed.completedLessonIds)
          ? parsed.completedLessonIds
          : [],
        lessonNotes: parsed.lessonNotes || {},
        quizScores: parsed.quizScores || {},
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [state]);

  const enrollInCourse = useCallback((courseId: string) => {
    setState((prev) => {
      if (prev.enrolledCourseIds.includes(courseId)) return prev;
      return {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      };
    });
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setState((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      return {
        ...prev,
        completedLessonIds: exists
          ? prev.completedLessonIds.filter((id) => id !== lessonId)
          : [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  const saveLessonNote = useCallback((lessonId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      lessonNotes: {
        ...prev.lessonNotes,
        [lessonId]: note,
      },
    }));
  }, []);

  const recordQuizResult = useCallback((lessonId: string, passed: boolean) => {
    setState((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [lessonId]: passed,
      },
    }));
  }, []);

  const updateTraineeName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      traineeName: name,
    }));
  }, []);

  const addSubmission = useCallback((submission: IntakeSubmission) => {
    setState((prev) => ({
      ...prev,
      traineeName: submission.fullName || prev.traineeName,
      submissions: [submission, ...prev.submissions],
    }));
  }, []);

  return {
    state,
    enrollInCourse,
    toggleLessonComplete,
    markLessonComplete,
    saveLessonNote,
    recordQuizResult,
    updateTraineeName,
    addSubmission,
  };
}
