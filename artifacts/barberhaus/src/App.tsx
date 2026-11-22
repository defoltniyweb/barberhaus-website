import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Menu, Scissors, X } from 'lucide-react';

const services = [
  { name: 'Herrenhaarschnitt', price: '28 €', detail: 'Waschen, Schnitt & Styling' },
  { name: 'Skin Fade', price: '32 €', detail: 'Präziser Übergang, sauber ausgearbeitet' },
  { name: 'Bartpflege', price: '18 €', detail: 'Kontur, Form & warme Kompresse' },
  { name: 'Haare & Bart', price: '42 €', detail: 'Der komplette BARBERHAUS Look' },
];

const navItems = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Über uns', href: '#ueber-uns' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Kontakt', href: '#kontakt' },
];

type DialogMode = 'booking' | 'info' | null;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [infoTitle, setInfoTitle] = useState('');
  const [bookingSent, setBookingSent] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const openDialog = (mode: DialogMode, title = '') => {
    lastFocus.current = document.activeElement as HTMLElement;
    setInfoTitle(title);
    setBookingSent(false);
    setDialog(mode);
  };
  const closeDialog = () => {
    setDialog(null);
    window.setTimeout(() => lastFocus.current?.focus(), 0);
  };

  useEffect(() => {
    if (!dialog) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDialog();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href]'))
          .filter((el) => !el.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [dialog]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setBookingSent(true);
  };
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setContactSent(true);
    event.currentTarget.reset();
  };

  return (
    <main>
      <div className="demo-ribbon" data-testid="banner-concept">Konzept &amp; Demo · Kein echtes Geschäft</div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="BARBERHAUS Startseite" data-testid="link-home">
          <span className="brand-mark"><Scissors size={19} strokeWidth={1.5} /></span>
          <span>BARBER<span className="brand-light">HAUS</span><small>KARLSRUHE · KONZEPT</small></span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Hauptnavigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`nav-${item.href.slice(1)}`}>{item.label}</a>)}
          <button className="nav-book" onClick={() => { setMenuOpen(false); openDialog('booking'); }} data-testid="button-book-nav">Termin anfragen <ArrowUpRight size={15} /></button>
        </nav>
        <button className="menu-toggle" aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      {menuOpen && <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile Navigation" aria-hidden={!menuOpen}>
        <p className="eyebrow">GUTER STIL BEGINNT HIER</p>
        {navItems.map((item, index) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`mobile-nav-${item.href.slice(1)}`}><span>0{index + 1}</span>{item.label}<ArrowRight size={17} /></a>)}
        <button className="button button-gold mobile-book" onClick={() => { setMenuOpen(false); openDialog('booking'); }} data-testid="button-book-mobile">Termin anfragen <ArrowUpRight size={16} /></button>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-photo" src="/images/hero-barber.jpg" alt="Barbier arbeitet mit ruhiger Präzision an einem Haarschnitt" data-testid="img-hero" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow"><span /> HANDWERK. STIL. PERSÖNLICHKEIT.</p>
          <h1 id="hero-title">Dein Stil.<br /><em>Unser Handwerk.</em></h1>
          <p className="hero-copy">Ein guter Schnitt ist mehr als eine Frage der Länge. Er ist ein Gefühl, das bleibt – persönlich, präzise und ganz deiner.</p>
          <div className="hero-actions">
            <button className="button button-gold" onClick={() => openDialog('booking')} data-testid="button-book-hero">Termin anfragen <ArrowUpRight size={16} /></button>
            <a className="text-link light-link" href="#leistungen" data-testid="link-hero-services">Leistungen entdecken <ArrowDown size={15} /></a>
          </div>
          <div className="hero-foot"><span>KAISERSTRASSE 42 · KARLSRUHE</span><span>HANDWERK MIT HALTUNG</span></div>
        </div>
        <div className="hero-index"><span>01</span><i /></div>
      </section>

      <section className="intro section-pad">
        <div className="intro-mark">B<span>.</span>H</div>
        <div className="intro-copy">
          <p className="eyebrow">EIN ORT FÜR DEINEN STIL</p>
          <h2>Weniger Lärm.<br /><em>Mehr Haltung.</em></h2>
          <p>BARBERHAUS ist eine Idee von einem guten Barbershop: ehrliches Handwerk, aufmerksame Beratung und Zeit für den eigenen Stil. Ein Ort zum Ankommen – und mit einem guten Gefühl wieder zu gehen.</p>
          <a className="text-link" href="#ueber-uns" data-testid="link-intro-about">Das ist BARBERHAUS <ArrowRight size={15} /></a>
        </div>
        <div className="intro-note"><span className="note-line" />GUTE FORM<br />FÄNGT MIT<br />ZUHÖREN AN.</div>
      </section>

      <section className="services section-pad" id="leistungen">
        <div className="section-heading">
          <div><p className="eyebrow">KLAR IM SCHNITT. FAIR IM PREIS.</p><h2>Unsere <em>Leistungen</em></h2></div>
          <p>Jeder Termin beginnt mit einem Gespräch. Damit am Ende nicht irgendein Schnitt steht, sondern deiner.</p>
        </div>
        <div className="service-list">
          {services.map((service, index) => <article className="service-row" key={service.name} data-testid={`service-${index + 1}`}>
            <span className="service-number">0{index + 1}</span>
            <div className="service-name"><h3>{service.name}</h3><p>{service.detail}</p></div>
            <span className="service-price">{service.price}</span>
            <button className="service-arrow" aria-label={`${service.name} anfragen`} onClick={() => openDialog('booking')} data-testid={`button-service-${index + 1}`}><ArrowUpRight size={19} /></button>
          </article>)}
        </div>
        <p className="service-footnote">Alle Preise verstehen sich als Konzeptpreise und dienen der Veranschaulichung.</p>
      </section>

      <section className="craft" id="ueber-uns">
        <div className="craft-image-wrap"><img src="/images/interior.jpg" alt="Ruhiger, hochwertig gestalteter Barbershop mit klassischem Friseurstuhl" data-testid="img-interior" /><span className="image-caption">EIN PLATZ FÜR GUTE GESPRÄCHE.</span></div>
        <div className="craft-content">
          <p className="eyebrow">UNSER ANSPRUCH</p>
          <h2>Das Detail macht<br /><em>den Unterschied.</em></h2>
          <p>Eine klare Kontur. Ein Übergang, der sitzt. Ein Handgriff, der nicht zu viel und nicht zu wenig tut. Das ist die Ruhe, die gutes Handwerk ausstrahlt – und unser Anspruch an jeden Look.</p>
          <div className="craft-values">
            <div><span>01</span><strong>Präzision</strong><small>Jeder Schnitt mit Absicht.</small></div>
            <div><span>02</span><strong>Persönlichkeit</strong><small>Dein Stil gibt die Richtung vor.</small></div>
            <div><span>03</span><strong>Willkommen</strong><small>Gute Atmosphäre, ganz ohne Eile.</small></div>
          </div>
          <a className="text-link" href="#kontakt" data-testid="link-craft-contact">Lern uns kennen <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="gallery section-pad" id="galerie">
        <div className="section-heading gallery-heading">
          <div><p className="eyebrow">EINBLICKE &amp; INSPIRATION</p><h2>Form folgt <em>Gefühl.</em></h2></div>
          <p>Unaufgeregt im Auftritt. Sorgfältig bis in die letzte Kontur.</p>
        </div>
        <div className="gallery-grid">
          <figure className="gallery-item gallery-large"><img src="/images/fade-detail.jpg" alt="Detail eines präzise ausgearbeiteten Skin Fade" data-testid="img-gallery-fade" /><figcaption><span>01 / PRÄZISION</span>Der saubere Übergang</figcaption></figure>
          <figure className="gallery-item gallery-tall"><img src="/images/portrait.jpg" alt="Klassischer, gepflegter Look mit Bart" data-testid="img-gallery-portrait" /><figcaption><span>02 / PERSÖNLICHKEIT</span>Ein Look, der bleibt</figcaption></figure>
          <div className="gallery-quote"><span className="quote-mark">„</span><p>Guter Stil muss nicht laut sein. Nur deiner.</p><span className="quote-caption">BARBERHAUS · KARLSRUHE</span></div>
        </div>
      </section>

      <section className="contact section-pad" id="kontakt">
        <div className="contact-top">
          <div><p className="eyebrow">KOMM VORBEI – IN GEDANKEN</p><h2>Bereit für<br />einen <em>neuen Look?</em></h2></div>
          <p className="contact-lead">Lust auf einen frischen Schnitt? Frag deinen Wunschtermin an. In diesem Konzept bleibt alles lokal – ganz ohne echte Buchung.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-block"><span className="detail-label">ADRESSE</span><p>Kaiserstraße 42<br />76133 Karlsruhe</p><a className="text-link" href="#map" data-testid="link-map-scroll">Karte ansehen <ArrowDown size={14} /></a></div>
            <div className="contact-block"><span className="detail-label">ÖFFNUNGSZEITEN</span><div className="hours"><span>Montag – Freitag</span><b>10:00 – 19:00</b><span>Samstag</span><b>10:00 – 16:00</b><span>Sonntag</span><b>Geschlossen</b></div></div>
            <div className="hours-note"><Clock3 size={15} /> Öffnungszeiten sind Teil dieses Konzeptes.</div>
          </div>
          <div className="map-card" id="map" data-testid="map-demo">
            <div className="map-grid" aria-hidden="true"><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-road road-three" /><span className="map-block block-one" /><span className="map-block block-two" /><span className="map-block block-three" /><span className="map-block block-four" /></div>
            <div className="map-label"><span className="map-pin"><Scissors size={17} /></span><strong>BARBERHAUS</strong><small>Kaiserstraße 42 · Karlsruhe</small></div>
            <span className="map-disclaimer">ILLUSTRATIVE DEMO-KARTE · KEINE ECHTE ORTSSUCHE</span>
          </div>
        </div>
        <div className="contact-form-wrap">
          <div><p className="eyebrow">SCHREIB UNS</p><h3>Ein guter Anfang<br />ist ein <em>Hallo.</em></h3><p>Für Fragen oder ein paar Worte zum Konzept.</p></div>
          {contactSent ? <div className="success-panel" role="status" data-testid="status-contact-success"><span className="success-icon"><Check size={20} /></span><strong>Danke für deine Nachricht.</strong><p>Dies ist nur eine lokale Demo-Bestätigung. Es wurde nichts versendet oder gespeichert.</p><button className="text-link" onClick={() => setContactSent(false)} data-testid="button-contact-again">Weitere Nachricht schreiben <ArrowRight size={14} /></button></div> :
          <form className="contact-form" onSubmit={submitContact} noValidate>
            <label>Name<input name="name" autoComplete="name" required minLength={2} placeholder="Dein Name" data-testid="input-contact-name" /></label>
            <label>E-Mail<input name="email" type="email" autoComplete="email" required placeholder="du@beispiel.de" data-testid="input-contact-email" /></label>
            <label className="full-field">Nachricht<textarea name="message" required minLength={10} rows={3} placeholder="Was liegt dir auf dem Herzen?" data-testid="input-contact-message" /></label>
            <div className="form-submit-row"><p>Lokale Demo – deine Angaben werden nicht versendet.</p><button className="button button-dark" type="submit" data-testid="button-contact-submit">Nachricht ansehen <ArrowUpRight size={15} /></button></div>
          </form>}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#" data-testid="link-footer-home"><span className="brand-mark"><Scissors size={19} strokeWidth={1.5} /></span><span>BARBER<span className="brand-light">HAUS</span><small>KARLSRUHE · KONZEPT</small></span></a>
          <p>Dein Stil. Unser Handwerk.<br />Eine Idee für Karlsruhe.</p>
          <div className="footer-nav"><span className="detail-label">ENTDECKEN</span>{navItems.map((item) => <a key={item.href} href={item.href} data-testid={`footer-${item.href.slice(1)}`}>{item.label}</a>)}</div>
          <div className="footer-nav"><span className="detail-label">WEITERE INFOS</span><button onClick={() => openDialog('info', 'Social Media')} data-testid="link-social">Instagram <ArrowUpRight size={13} /></button><button onClick={() => openDialog('info', 'Impressum (Demo)')} data-testid="link-impressum">Impressum <ArrowUpRight size={13} /></button><button onClick={() => openDialog('info', 'Datenschutz (Demo)')} data-testid="link-datenschutz">Datenschutz <ArrowUpRight size={13} /></button></div>
          <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Zurück nach oben" data-testid="button-back-top"><ArrowUpRight /></button>
        </div>
        <div className="footer-bottom"><span>© BARBERHAUS · FIKTIVES KONZEPT</span><span>GESTALTET MIT RUHE &amp; PRÄZISION</span><button onClick={() => openDialog('info', 'Hinweis zum Konzept')} data-testid="link-footer-concept">Konzept-Hinweis</button></div>
      </footer>

      {dialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }} data-testid="dialog-backdrop">
        <div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={dialogRef}>
          <button className="dialog-close" ref={closeRef} onClick={closeDialog} aria-label="Dialog schließen" data-testid="button-dialog-close"><X size={19} /></button>
          {dialog === 'booking' ? <BookingContent onSubmit={submitBooking} sent={bookingSent} minDate={minDate} onClose={closeDialog} /> :
            <><p className="eyebrow">BARBERHAUS · KONZEPT</p><h2 id="dialog-title">{infoTitle}</h2><p className="info-copy">BARBERHAUS ist ein fiktives Website-Konzept. Diese Funktion führt zu keinem echten Profil und stellt keine rechtsverbindliche Information dar. Es werden keine Daten übertragen oder gespeichert.</p><div className="info-notice">DEMO-HINWEIS · ALLE ANGABEN SIND BEISPIELHAFT.</div><button className="button button-dark info-close" onClick={closeDialog} data-testid="button-info-close">Verstanden <Check size={16} /></button></>}
        </div>
      </div>}
      <div className="concept-disclaimer" role="note" data-testid="text-demo-disclaimer"><span>DEMO</span> BARBERHAUS ist ein fiktives Konzept. Keine echte Geschäftsadresse, Buchung oder Kontaktaufnahme.</div>
    </main>
  );
}

function BookingContent({ onSubmit, sent, minDate, onClose }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; sent: boolean; minDate: string; onClose: () => void }) {
  if (sent) return <div className="booking-success" role="status" data-testid="status-booking-success"><span className="success-icon"><Check size={21} /></span><p className="eyebrow">ANFRAGE-VORSCHAU</p><h2 id="dialog-title">Danke für dein Interesse.</h2><p>Dies ist nur eine lokale, unverbindliche Anfrage-Vorschau. Es wird keine Anfrage gesendet oder gespeichert und kein Termin gebucht oder bestätigt.</p><button className="button button-dark" onClick={onClose} data-testid="button-booking-done">Schließen <Check size={16} /></button></div>;
  return <><p className="eyebrow">UNVERBINDLICHE DEMO</p><h2 id="dialog-title">Termin <em>anfragen.</em></h2><p className="dialog-intro">Teile uns deinen Wunsch mit. Das Formular zeigt nur, wie eine Anfrage aussehen könnte.</p><form className="booking-form" onSubmit={onSubmit} noValidate>
    <label>Name<input name="name" required minLength={2} autoComplete="name" placeholder="Dein Name" data-testid="input-booking-name" /></label>
    <label>Leistung<select name="service" required defaultValue="" data-testid="select-booking-service"><option value="" disabled>Bitte auswählen</option>{services.map((service) => <option key={service.name} value={service.name}>{service.name} · {service.price}</option>)}</select></label>
    <label>Wunschtermin<input name="date" type="date" required min={minDate} data-testid="input-booking-date" /></label>
    <label>Nachricht <span className="optional">(optional)</span><textarea name="message" rows={3} placeholder="Deine Wünsche oder Hinweise" data-testid="input-booking-message" /></label>
    <p className="form-privacy">Nur eine lokale Vorschau – keine Übermittlung, Speicherung oder Terminbestätigung.</p>
    <div className="dialog-actions"><button type="button" className="button button-outline" onClick={onClose} data-testid="button-booking-cancel">Abbrechen</button><button type="submit" className="button button-dark" data-testid="button-booking-submit">Vorschau anzeigen <ArrowUpRight size={15} /></button></div>
  </form></>;
}

export default App;
