import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type ActivePage = 'home' | 'course-detail' | 'classroom' | 'my-learning';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage, sectionId?: string) => void;
  onOpenIntake: () => void;
}

export function Header({ activePage, onNavigate, onOpenIntake }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (page: ActivePage, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 rounded cursor-pointer"
        >
          كوتش هيثم دبابة
        </button>

        {/* Zone 2: 4 Single-Line Text Navigation Links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'packages')}
            className="hover:text-slate-900 hover:underline underline-offset-8 decoration-red-700 decoration-2 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            الباقات والأسعار
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'catalog')}
            className="hover:text-slate-900 hover:underline underline-offset-8 decoration-red-700 decoration-2 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            البرامج التدريبية
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'intake-form')}
            className="hover:text-slate-900 hover:underline underline-offset-8 decoration-red-700 decoration-2 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            استمارة الاشتراك
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('my-learning')}
            className={`hover:text-slate-900 hover:underline underline-offset-8 decoration-red-700 decoration-2 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              activePage === 'my-learning' ? 'text-red-700 font-semibold' : ''
            }`}
          >
            مساحة المتدرب
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenIntake();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            املأ الاستمارة الآن
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'packages')}
            className="w-full text-right px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
          >
            الباقات والأسعار
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'catalog')}
            className="w-full text-right px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
          >
            البرامج التدريبية
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'intake-form')}
            className="w-full text-right px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
          >
            استمارة الاشتراك
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('my-learning')}
            className="w-full text-right px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
          >
            مساحة المتدرب
          </button>
        </div>
      )}
    </header>
  );
}
