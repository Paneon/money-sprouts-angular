import { useTranslation } from 'react-i18next';
import AccountLayout from '@/client/layouts/AccountLayout';
import { useParams } from 'react-router-dom';
import './AccountDashboard.scss';

interface Section {
  name: string;
  image: string;
  url: string;
}

/**
 * This page shows the details of an account and is the entry point for any account holder
 * - Does not show a logout or back button
 */
export default function AccountDashboard() {
  const { t } = useTranslation();
  const { id } = useParams();

  const sections: Section[] = [
    {
      name: 'DASHBOARD.SECTION_NAME.OVERVIEW',
      image: './assets/images/overview.png',
      url: `/accounts/${id}/balance`,
    },
    {
      name: 'DASHBOARD.SECTION_NAME.HISTORY',
      image: './assets/images/history.png',
      url: `/accounts/${id}/transactions`,
    },
    {
      name: 'DASHBOARD.SECTION_NAME.PLAN',
      image: './assets/images/plan.png',
      url: `/accounts/${id}/plan`,
    },
  ];

  return (
    <AccountLayout title={t('PAGE_HEADER.PAGE_NAME.DASHBOARD')}>
      <div className="custom-container no-transparency">
        <div className="button-container">
          {sections.map((section) => (
            <div>
              <a href={section.url} className="image-text-button">
                <img src={section.image} />
                <label>{t(section.name)}</label>
              </a>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}