import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Copy, Mail, MessageCircle, Phone } from 'lucide-react';
import {
  COACH_EMAIL,
  COACH_NAME,
  COACH_PHONE_DISPLAY,
  COACH_PHONE_RAW,
  COACHING_PACKAGES,
} from '../data/courses';
import { IntakeSubmission } from '../types';

interface SubscriptionIntakeFormProps {
  selectedPackageId: string;
  onSelectPackage: (pkgId: string) => void;
  onSubmitIntake: (submission: IntakeSubmission) => void;
}

export function SubscriptionIntakeForm({
  selectedPackageId,
  onSelectPackage,
  onSubmitIntake,
}: SubscriptionIntakeFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [goal, setGoal] = useState('تضخيم عضلي صافي');
  const [experience, setExperience] = useState('متوسط (٦ شهور – سنتين)');
  const [trainingDays, setTrainingDays] = useState('٤ أيام في الأسبوع');
  const [trainingPlace, setTrainingPlace] = useState('جيم متكامل');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<IntakeSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError(null);
  }, [selectedPackageId]);

  const activePackage =
    COACHING_PACKAGES.find((p) => p.id === selectedPackageId) || COACHING_PACKAGES[1];

  const formatSubmissionBody = (sub: IntakeSubmission) => {
    return [
      `طلب اشتراك جديد - ${COACH_NAME}`,
      `--------------------------------`,
      `الاسم الكامل: ${sub.fullName}`,
      `رقم الهاتف / واتساب: ${sub.phone}`,
      `البريد الإلكتروني: ${sub.email}`,
      `الباقة المختارة: ${sub.packageTitle}`,
      `العمر: ${sub.age} سنة`,
      `الطول: ${sub.heightCm} سم`,
      `الوزن الحالي: ${sub.weightKg} كجم`,
      `الهدف الأساسي: ${sub.goal}`,
      `الخبرة في التمرين: ${sub.experience}`,
      `أيام التمرين المتاحة: ${sub.trainingDays}`,
      `مكان التمرين: ${sub.trainingPlace}`,
      `إصابات أو ملاحظات غذائية: ${sub.notes || 'لا توجد ملاحظات إضافية'}`,
      `تاريخ الطلب: ${new Date(sub.submittedAt).toLocaleString('ar-EG')}`,
    ].join('\n');
  };

  const buildMailtoHref = (sub: IntakeSubmission) => {
    const subject = `اشتراك جديد (${sub.packageTitle}) - ${sub.fullName}`;
    const body = formatSubmissionBody(sub);
    return `mailto:${COACH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;
  };

  const buildWhatsappHref = (sub: IntakeSubmission) => {
    const body = formatSubmissionBody(sub);
    return `https://wa.me/${COACH_PHONE_RAW}?text=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (fullName.trim().length < 2) {
      setError('يرجى إدخال الاسم الكامل.');
      return;
    }

    if (phone.trim().length < 8) {
      setError('يرجى إدخال رقم هاتف أو واتساب صحيح للتواصل معك.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    if (!age.trim() || !heightCm.trim() || !weightKg.trim()) {
      setError('يرجى إدخال العمر والطول والوزن بدقة لتصميم البرنامج المناسب لك.');
      return;
    }

    const submission: IntakeSubmission = {
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      packageId: activePackage.id,
      packageTitle: `${activePackage.title} (${activePackage.priceNote})`,
      age: age.trim(),
      heightCm: heightCm.trim(),
      weightKg: weightKg.trim(),
      goal,
      experience,
      trainingDays,
      trainingPlace,
      notes: notes.trim(),
    };

    setError(null);
    onSubmitIntake(submission);
    setLastSubmission(submission);

    // Trigger pre-filled email dispatch safely via anchor element (no window.open)
    const mailLink = document.createElement('a');
    mailLink.href = buildMailtoHref(submission);
    mailLink.style.display = 'none';
    document.body.appendChild(mailLink);
    mailLink.click();
    document.body.removeChild(mailLink);
  };

  const handleCopySummary = async () => {
    if (!lastSubmission) return;
    try {
      await navigator.clipboard.writeText(formatSubmissionBody(lastSubmission));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored cleanly
    }
  };

  if (lastSubmission) {
    return (
      <div className="bg-white border border-emerald-300 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-3 text-emerald-800">
          <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-slate-900">
              تم تسجيل استمارتك بنجاح يا {lastSubmission.fullName}
            </h3>
            <p className="text-sm text-slate-600">
              تم تجهيز بياناتك الكاملة للباقة: <strong>{lastSubmission.packageTitle}</strong>. اضغط أدناه لإرسال الاستمارة مباشرة عبر البريد الإلكتروني أو واتساب {COACH_NAME} لتأكيد التفعيل.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
          {formatSubmissionBody(lastSubmission)}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={buildMailtoHref(lastSubmission)}
            className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>إرسال الاستمارة بالبريد الإلكتروني</span>
          </a>

          <a
            href={buildWhatsappHref(lastSubmission)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>إرسال على واتساب الكوتش ({COACH_PHONE_DISPLAY})</span>
          </a>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span>{copied ? 'تم نسخ الاستمارة' : 'نسخ نص الاستمارة'}</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            البريد المستلم: <span className="font-mono">{COACH_EMAIL}</span>
          </span>
          <button
            type="button"
            onClick={() => setLastSubmission(null)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
          >
            تعديل البيانات أو إرسال استمارة جديدة
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            استمارة الاشتراك وتفاصيل المتدرب
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            املأ بياناتك بدقة ليتم إرسالها لبريد {COACH_NAME} وتجهيز برنامج التمرين والتغذية المناسب لك.
          </p>
        </div>
        <a
          href={`tel:+${COACH_PHONE_RAW}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 hover:underline whitespace-nowrap shrink-0"
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          <span dir="ltr">{COACH_PHONE_DISPLAY}</span>
        </a>
      </div>

      {/* Package Selector */}
      <div className="space-y-1.5">
        <label htmlFor="intake-package" className="block text-xs font-semibold text-slate-700">
          الباقة المطلوبة
        </label>
        <select
          id="intake-package"
          value={selectedPackageId}
          onChange={(e) => onSelectPackage(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          {COACHING_PACKAGES.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.title} — {pkg.priceNote}
            </option>
          ))}
        </select>
      </div>

      {/* Personal Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="intake-name" className="block text-xs font-medium text-slate-700">
            الاسم الكامل *
          </label>
          <input
            id="intake-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="مثال: محمود أحمد"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-phone" className="block text-xs font-medium text-slate-700">
            رقم الموبايل / واتساب *
          </label>
          <input
            id="intake-phone"
            type="tel"
            required
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+20 10..."
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 text-left focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-email" className="block text-xs font-medium text-slate-700">
            بريدك الإلكتروني *
          </label>
          <input
            id="intake-email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 text-left focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>
      </div>

      {/* Body Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="intake-age" className="block text-xs font-medium text-slate-700">
            العمر (سنة) *
          </label>
          <input
            id="intake-age"
            type="number"
            min={14}
            max={80}
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-height" className="block text-xs font-medium text-slate-700">
            الطول (سم) *
          </label>
          <input
            id="intake-height"
            type="number"
            min={120}
            max={230}
            required
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="178"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-weight" className="block text-xs font-medium text-slate-700">
            الوزن (كجم) *
          </label>
          <input
            id="intake-weight"
            type="number"
            min={35}
            max={220}
            required
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="80"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>
      </div>

      {/* Training Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="intake-goal" className="block text-xs font-medium text-slate-700">
            الهدف الأساسي
          </label>
          <select
            id="intake-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="تضخيم عضلي صافي">تضخيم عضلي صافي</option>
            <option value="تنشيف وحرق دهون">تنشيف وحرق دهون مع الحفاظ على العضل</option>
            <option value="إعادة تشكيل الجسم (خسارة دهون وبناء عضل)">
              إعادة تشكيل الجسم (خسارة دهون وبناء عضل)
            </option>
            <option value="زيادة القوة البدنية وتجهيز بطولات">
              زيادة القوة البدنية وتجهيز بطولات
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-exp" className="block text-xs font-medium text-slate-700">
            مستوى الخبرة في التمرين
          </label>
          <select
            id="intake-exp"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="مبتدئ (أقل من ٦ شهور)">مبتدئ (أقل من ٦ شهور)</option>
            <option value="متوسط (٦ شهور – سنتين)">متوسط (٦ شهور – سنتين)</option>
            <option value="متقدم (أكثر من سنتين)">متقدم (أكثر من سنتين)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-days" className="block text-xs font-medium text-slate-700">
            عدد أيام التمرين المتاحة أسبوعياً
          </label>
          <select
            id="intake-days"
            value={trainingDays}
            onChange={(e) => setTrainingDays(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="٣ أيام في الأسبوع">٣ أيام في الأسبوع</option>
            <option value="٤ أيام في الأسبوع">٤ أيام في الأسبوع</option>
            <option value="٥ أيام في الأسبوع">٥ أيام في الأسبوع</option>
            <option value="٦ أيام في الأسبوع">٦ أيام في الأسبوع</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="intake-place" className="block text-xs font-medium text-slate-700">
            مكان التمرين
          </label>
          <select
            id="intake-place"
            value={trainingPlace}
            onChange={(e) => setTrainingPlace(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="جيم متكامل">جيم متكامل بالأجهزة والأوزان</option>
            <option value="تمرين منزلي بأدوات">تمرين في المنزل بأدوات متوفرة</option>
          </select>
        </div>
      </div>

      {/* Health / Food Notes */}
      <div className="space-y-1.5">
        <label htmlFor="intake-notes" className="block text-xs font-medium text-slate-700">
          إصابات سابقة أو تفاصيل إضافية (أطعمة غير مفضلة، أوقات العمل، أدوية)
        </label>
        <textarea
          id="intake-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="اكتب أي تفاصيل تساعد كوتش هيثم في تصميم الجدول المناسب لك..."
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          className="px-6 py-3.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          تأكيد الاشتراك وإرسال الاستمارة بالبريد
        </button>

        <span className="text-xs text-slate-500">
          تُرسل البيانات مباشرة لبريد الكوتش: <span className="font-mono">{COACH_EMAIL}</span>
        </span>
      </div>
    </form>
  );
}
