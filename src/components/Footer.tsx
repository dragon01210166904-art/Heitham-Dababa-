import {
  COACH_EMAIL,
  COACH_NAME,
  COACH_PHONE_DISPLAY,
  COACH_PHONE_RAW,
} from '../data/courses';
import { ActivePage } from './Header';

interface FooterProps {
  onNavigate: (page: ActivePage, sectionId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          <div className="md:col-span-5 space-y-3">
            <span className="font-display text-2xl font-extrabold text-slate-900 block">
              {COACH_NAME}
            </span>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              تدريب أونلاين متخصص في كمال الأجسام، التضخيم الصافي، التنشيف، وتصحيح الأداء الحركي ببرامج مخصصة وأسعار مناسبة للجميع.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">الأقسام الرئيسية</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'packages')}
                  className="hover:text-red-700 transition-colors cursor-pointer"
                >
                  الباقات والأسعار
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'catalog')}
                  className="hover:text-red-700 transition-colors cursor-pointer"
                >
                  البرامج التدريبية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', 'intake-form')}
                  className="hover:text-red-700 transition-colors cursor-pointer"
                >
                  استمارة الاشتراك
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('my-learning')}
                  className="hover:text-red-700 transition-colors cursor-pointer"
                >
                  مساحة المتدرب
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">اشترك معنا مباشرة</h4>
            <p className="text-sm text-slate-600">
              تواصل مباشرة على رقم {COACH_NAME} عبر واتساب أو الهاتف:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${COACH_PHONE_RAW}`}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="text-sm font-mono font-semibold text-red-700 hover:underline"
              >
                {COACH_PHONE_DISPLAY}
              </a>
              <span className="text-slate-300" aria-hidden="true">|</span>
              <a
                href={`tel:+${COACH_PHONE_RAW}`}
                className="text-xs font-medium text-slate-700 hover:text-slate-900"
              >
                اتصال مباشر
              </a>
            </div>
            <p className="text-xs font-mono text-slate-500" dir="ltr">
              {COACH_EMAIL}
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© ٢٠٢٦ {COACH_NAME} للتدريب الأونلاين لكمال الأجسام. جميع الحقوق محفوظة.</p>
          <p>برامج تمرين وتغذية مخصصة · متابعة مباشرة</p>
        </div>
      </div>
    </footer>
  );
}
