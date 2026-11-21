import { toArabicDigits } from '../utils/arabic';

export default function AyahMarker({ n }) {
  return <span className="ayah-marker">﴿{toArabicDigits(n)}﴾</span>;
}
