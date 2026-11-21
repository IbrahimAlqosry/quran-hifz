export function Loader({ text = 'جارٍ التحميل…' }) {
  return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border text-success mb-3" role="status" />
      <div>{text}</div>
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center">
      <span>حدث خطأ: {error?.message || 'غير معروف'} — تأكد من اتصالك بالإنترنت.</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
