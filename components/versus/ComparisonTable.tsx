import { useTranslations } from 'next-intl';

export const ComparisonTable = () => {
  const t = useTranslations('Versus.table');

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Header Row (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:block p-4 font-bold text-gray-500">
            {t('feature')}
        </div>
        <div className="hidden md:block bg-green-100 p-4 font-bold text-green-800 rounded-t-lg text-center border-t-4 border-green-500">
            {t('us')}
        </div>
        <div className="hidden md:block bg-gray-100 p-4 font-bold text-gray-600 rounded-t-lg text-center border-t-4 border-gray-400">
            {t('them')}
        </div>

        {/* Row 1: Price */}
        <div className="md:contents">
            <div className="md:p-4 font-bold text-gray-700 flex items-center md:block mb-2 md:mb-0">
               {t('row_price')}
            </div>
            <div className="bg-green-50 border-green-500 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm transform hover:scale-105 transition-transform duration-200">
                <span className="text-green-700 font-bold text-xl md:text-2xl">✅ {t('row_price_us')}</span>
                <p className="text-sm text-green-600 mt-1">{t('row_price_us_desc')}</p>
            </div>
            <div className="bg-gray-50 opacity-75 p-4 flex flex-col items-center justify-center text-center border border-gray-200 rounded">
                <span className="text-red-500 font-bold text-lg">❌ {t('row_price_them')}</span>
                <p className="text-sm text-gray-500 mt-1">{t('row_price_them_desc')}</p>
            </div>
        </div>

        {/* Row 2: Limits */}
        <div className="md:contents">
            <div className="md:p-4 font-bold text-gray-700 flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0">
                {t('row_limits')}
            </div>
            <div className="bg-green-50 border-green-500 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-green-700 font-bold text-xl md:text-2xl">✅ {t('row_limits_us')}</span>
                <p className="text-sm text-green-600 mt-1">{t('row_limits_us_desc')}</p>
            </div>
            <div className="bg-gray-50 opacity-75 p-4 flex flex-col items-center justify-center text-center border border-gray-200 rounded">
                <span className="text-red-500 font-bold text-lg">⚠️ {t('row_limits_them')}</span>
                <p className="text-sm text-gray-500 mt-1">{t('row_limits_them_desc')}</p>
            </div>
        </div>

         {/* Row 3: Design */}
         <div className="md:contents">
            <div className="md:p-4 font-bold text-gray-700 flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0">
                {t('row_design')}
            </div>
            <div className="bg-green-50 border-green-500 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-green-700 font-bold text-lg">✅ {t('row_design_us')}</span>
                <p className="text-sm text-green-600 mt-1">{t('row_design_us_desc')}</p>
            </div>
            <div className="bg-gray-50 opacity-75 p-4 flex flex-col items-center justify-center text-center border border-gray-200 rounded">
                <span className="text-gray-500 font-bold text-lg">❌ {t('row_design_them')}</span>
                <p className="text-sm text-gray-500 mt-1">{t('row_design_them_desc')}</p>
            </div>
        </div>

        {/* Row 4: Login */}
        <div className="md:contents">
            <div className="md:p-4 font-bold text-gray-700 flex items-center md:block mt-6 md:mt-0 mb-2 md:mb-0">
                {t('row_login')}
            </div>
            <div className="bg-green-50 border-green-500 border-2 rounded p-4 flex flex-col items-center justify-center text-center shadow-sm rounded-b-lg">
                <span className="text-green-700 font-bold text-lg">✅ {t('row_login_us')}</span>
                <p className="text-sm text-green-600 mt-1">{t('row_login_us_desc')}</p>
            </div>
            <div className="bg-gray-50 opacity-75 p-4 flex flex-col items-center justify-center text-center border border-gray-200 rounded rounded-b-lg">
                <span className="text-red-500 font-bold text-lg">❌ {t('row_login_them')}</span>
                <p className="text-sm text-gray-500 mt-1">{t('row_login_them_desc')}</p>
            </div>
        </div>

      </div>
    </div>
  );
};
