import { CREDITS, DISCLAIMER } from '@/content/meta';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__disc">{DISCLAIMER}</p>
      <div className="footer__line">
        <span>{CREDITS}</span>
        <span aria-hidden>●</span>
        <span>
          <b>Fuente:</b> medios citados en cada dato
        </span>
        <span aria-hidden>●</span>
        <span>Noviembre 2026</span>
      </div>
    </footer>
  );
}
