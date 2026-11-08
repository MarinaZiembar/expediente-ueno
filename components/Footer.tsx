import { CREDITS, DISCLAIMER } from '@/content/meta';
import Legal from './Legal';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__disc">{DISCLAIMER}</p>
      <div className="footer__line">
        <span>
          {CREDITS.label}{' '}
          <a className="footer__me" href={CREDITS.url} target="_blank" rel="noopener noreferrer">
            {CREDITS.name} ↗
          </a>
        </span>
        <span aria-hidden>●</span>
        <span>
          <b>Fuente:</b> medios citados en cada dato
        </span>
        <span aria-hidden>●</span>
        <span>Noviembre 2026</span>
        <span aria-hidden>●</span>
        <Legal />
      </div>
    </footer>
  );
}
