import { useTranslations } from 'next-intl';

export const ComparisonTable = () => {
  const t = useTranslations('Versus.table');

  return (
    <div
      className="w-full max-w-4xl mx-auto my-12 px-4"
      role="table"
      aria-label={t('us') + ' vs ' + t('them')}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="rowgroup">
        {/* Header Row (Hidden on mobile, visible on desktop) */}
        <div className="contents" role="row">
          <div className="hidden md:block p-4 font-bold text-muted-foreground" role="columnheader">
              {t('feature')}
          </div>
          <div className="hidden md:block bg-primary/10 p-4 font-bold text-primary rounded-t-lg text-center border-t-4 border-primary" role="columnheader">
              {t('us')}
          </div>
          <div className="hidden md:block bg-muted p-4 font-bold text-muted-foreground rounded-t-lg text-center border-t-4 border-muted-foreground/50" role="columnheader">
              {t('them')}
          </div>
        </div>

        {/* Row 1: Price */}
        <div className="md:contents" role="row">
            <div className="md:p-4 font-bold text-foreground flex items-center md:block mb-2 md:mb-0" role="rowheader">
               {t('row_price')}
            </div>
            <div className="bg-primary/5 border-primary/50 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm transform hover:scale-105 transition-transform duration-200" role="cell">
                <span className="text-primary font-bold text-xl md:text-2xl" aria-label={`${t('us')}: ${t('row_price_us')}`}>✅ {t('row_price_us')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_price_us_desc')}</p>
            </div>
            <div className="bg-muted opacity-75 p-4 flex flex-col items-center justify-center text-center border border-border rounded" role="cell">
                <span className="text-red-500 font-bold text-lg" aria-label={`${t('them')}: ${t('row_price_them')}`}>❌ {t('row_price_them')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_price_them_desc')}</p>
            </div>
        </div>

        {/* Row 2: Limits */}
        <div className="md:contents" role="row">
            <div className="md:p-4 font-bold text-foreground flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0" role="rowheader">
                {t('row_limits')}
            </div>
            <div className="bg-primary/5 border-primary/50 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm" role="cell">
                <span className="text-primary font-bold text-xl md:text-2xl" aria-label={`${t('us')}: ${t('row_limits_us')}`}>✅ {t('row_limits_us')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_limits_us_desc')}</p>
            </div>
            <div className="bg-muted opacity-75 p-4 flex flex-col items-center justify-center text-center border border-border rounded" role="cell">
                <span className="text-red-500 font-bold text-lg" aria-label={`${t('them')}: ${t('row_limits_them')}`}>⚠️ {t('row_limits_them')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_limits_them_desc')}</p>
            </div>
        </div>

         {/* Row 3: Design */}
         <div className="md:contents" role="row">
            <div className="md:p-4 font-bold text-foreground flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0" role="rowheader">
                {t('row_design')}
            </div>
            <div className="bg-primary/5 border-primary/50 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm" role="cell">
                <span className="text-primary font-bold text-lg" aria-label={`${t('us')}: ${t('row_design_us')}`}>✅ {t('row_design_us')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_design_us_desc')}</p>
            </div>
            <div className="bg-muted opacity-75 p-4 flex flex-col items-center justify-center text-center border border-border rounded" role="cell">
                <span className="text-muted-foreground font-bold text-lg" aria-label={`${t('them')}: ${t('row_design_them')}`}>❌ {t('row_design_them')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_design_them_desc')}</p>
            </div>
        </div>

        {/* Row 4: Login */}
        <div className="md:contents" role="row">
            <div className="md:p-4 font-bold text-foreground flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0" role="rowheader">
                {t('row_login')}
            </div>
            <div className="bg-primary/5 border-primary/50 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm rounded-b-lg" role="cell">
                <span className="text-primary font-bold text-lg" aria-label={`${t('us')}: ${t('row_login_us')}`}>✅ {t('row_login_us')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_login_us_desc')}</p>
            </div>
            <div className="bg-muted opacity-75 p-4 flex flex-col items-center justify-center text-center border border-border rounded rounded-b-lg" role="cell">
                <span className="text-red-500 font-bold text-lg" aria-label={`${t('them')}: ${t('row_login_them')}`}>❌ {t('row_login_them')}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('row_login_them_desc')}</p>
            </div>
        </div>

      </div>
    </div>
  );
};
