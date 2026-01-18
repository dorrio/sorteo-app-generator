import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ComparisonRowProps {
  title: string;
  usText: string;
  usDesc: string;
  themText: string;
  themDesc: string;
  themIcon: string;
  themStatus?: 'danger' | 'muted'; // Add more if needed
  className?: string;
}

const ComparisonRow = ({
  title,
  usText,
  usDesc,
  themText,
  themDesc,
  themIcon,
  themStatus = 'danger',
  className
}: ComparisonRowProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 w-full", className)} role="row">
      <div className="md:p-4 font-bold text-foreground flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0" role="rowheader">
        {title}
      </div>
      <div className="bg-primary/5 border-primary/50 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm transform hover:scale-105 transition-transform duration-200" role="cell">
        <span className="text-primary font-bold text-xl md:text-2xl" aria-label={`Sorteo Pro: ${usText}`}>
          ✅ {usText}
        </span>
        <p className="text-sm text-muted-foreground mt-1">{usDesc}</p>
      </div>
      {/*
        Refactor Note:
        - Removed `opacity-75` from container to preserve text contrast. Used `bg-muted/50` instead.
        - Mapped `danger` to `text-red-600` (was red-500) for WCAG AA compliance.
      */}
      <div className="bg-muted/50 p-4 flex flex-col items-center justify-center text-center border border-border rounded" role="cell">
        <span
          className={cn(
            "font-bold text-lg",
            themStatus === 'danger' && "text-red-600 dark:text-red-400",
            themStatus === 'muted' && "text-muted-foreground"
          )}
          aria-label={`Competitor: ${themText}`}
        >
          {themIcon} {themText}
        </span>
        <p className="text-sm text-muted-foreground mt-1">{themDesc}</p>
      </div>
    </div>
  );
};

interface ComparisonTableProps {
  namespace?: string;
}

export const ComparisonTable = ({ namespace = 'Versus.table' }: ComparisonTableProps) => {
  const t = useTranslations(namespace);

  return (
    <div
      className="w-full max-w-4xl mx-auto my-12 px-4 flex flex-col gap-4"
      role="table"
      aria-label={t('us') + ' vs ' + t('them')}
    >
        {/* Header Row (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:grid grid-cols-3 gap-4" role="row">
          <div className="p-4 font-bold text-muted-foreground" role="columnheader">
              {t('feature')}
          </div>
          <div className="bg-primary/10 p-4 font-bold text-primary rounded-t-lg text-center border-t-4 border-primary" role="columnheader">
              {t('us')}
          </div>
          <div className="bg-muted p-4 font-bold text-muted-foreground rounded-t-lg text-center border-t-4 border-muted-foreground/50" role="columnheader">
              {t('them')}
          </div>
        </div>

        {/* Row 1: Price */}
        <ComparisonRow
          title={t('row_price')}
          usText={t('row_price_us')}
          usDesc={t('row_price_us_desc')}
          themText={t('row_price_them')}
          themDesc={t('row_price_them_desc')}
          themIcon="❌"
          themStatus="danger"
        />

        {/* Row 2: Limits */}
        <ComparisonRow
          title={t('row_limits')}
          usText={t('row_limits_us')}
          usDesc={t('row_limits_us_desc')}
          themText={t('row_limits_them')}
          themDesc={t('row_limits_them_desc')}
          themIcon="⚠️"
          themStatus="danger"
        />

         {/* Row 3: Design */}
         <ComparisonRow
          title={t('row_design')}
          usText={t('row_design_us')}
          usDesc={t('row_design_us_desc')}
          themText={t('row_design_them')}
          themDesc={t('row_design_them_desc')}
          themIcon="❌"
          themStatus="muted"
        />

        {/* Row 4: Login */}
        <ComparisonRow
          title={t('row_login')}
          usText={t('row_login_us')}
          usDesc={t('row_login_us_desc')}
          themText={t('row_login_them')}
          themDesc={t('row_login_them_desc')}
          themIcon="❌"
          themStatus="danger"
        />
    </div>
  );
};
