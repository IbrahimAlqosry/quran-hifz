import { useT } from '../i18n';

export function Loader({ text }) {
  const { t } = useT();
  return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border text-success mb-3" role="status" />
      <div>{text || t('loading')}</div>
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  const { t } = useT();
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center gap-2">
      <span>{t('errorMsg')} ({error?.message || '?'})</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>{t('retry')}</button>
      )}
    </div>
  );
}
