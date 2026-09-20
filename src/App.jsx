import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Bell, BookOpen, Cpu, ExternalLink, GitBranch, Globe, Mail, Menu, Monitor, Phone, Radio, ScanLine, X } from 'lucide-react';
import './App.css';
import { profile } from './data/profile';
import { education } from './data/education';
import { skills } from './data/skills';
import { projects } from './data/projects';
import { certificates } from './data/certificates';
import PortfolioAssistant from './components/PortfolioAssistant';
import ThemeToggle from './components/ThemeToggle';

function Reveal({ children, delay = 0, className = '' }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function SectionMarker({ index, label, title }) {
  return <div className="section-marker"><span className="section-marker__index">{index}</span><span className="section-marker__rule" /><span className="section-marker__label">{label}</span><h2>{title}</h2></div>;
}

function RevaUniversityPlate() {
  return <div className="hero-plate"><span className="hero-plate__top">ACADEMIC ARCHIVE / 03</span><span className="hero-plate__side hero-plate__side--left">REVA UNIVERSITY</span><a className="hero-plate__link" href="https://www.reva.edu.in/" target="_blank" rel="noopener noreferrer" aria-label="Visit REVA University"><img src="/assets/reva-university.jpg" alt="REVA University" /></a><span className="hero-plate__side hero-plate__side--right">SCHOOL OF COMPUTER SCIENCE &amp; ENGINEERING</span><span className="hero-plate__degree">B.TECH · COMPUTER SCIENCE &amp; ENGINEERING</span></div>;
}

function BatAtmosphere() {
  return <div className="bat-atmosphere" aria-hidden="true"><span className="bat bat--one" /><span className="bat bat--two" /><span className="bat bat--three" /></div>;
}

function SignalDiagram({ activeNode, onNodeFocus, onEscape }) {
  const nodes = [
    { id: 'laser-emitter', label: 'Laser emitter', detail: 'Establishes the optical security beam.', icon: Radio },
    { id: 'laser-receiver', label: 'Laser receiver', detail: 'Monitors the beam and detection input.', icon: ScanLine },
    { id: 'esp32', label: 'ESP32', detail: 'Processes receiver events and coordinates the response.', icon: Cpu },
    { id: 'buzzer', label: 'Piezoelectric buzzer', detail: 'Provides the audible alarm when the path is interrupted.', icon: Bell },
    { id: 'status-leds', label: 'Status LEDs', detail: 'Provide visual system status.', icon: Radio },
    { id: 'lcd', label: '16×2 I²C LCD', detail: 'Displays status and warning information.', icon: Monitor },
    { id: 'blynk-cloud', label: 'Blynk Cloud', detail: 'Handles documented cloud communication and monitoring.', icon: Globe },
    { id: 'web-dashboard', label: 'Web dashboard', detail: 'Presents documented status, alerts, telemetry or controls.', icon: Monitor }
  ];
  return <div className="signal-diagram"><div className="signal-beam" /><div className="signal-line" aria-hidden="true" />{nodes.map(({ id, label, detail, icon: Icon }, index) => <button key={id} type="button" className={`signal-node ${activeNode === id ? 'is-active' : ''}`} onMouseEnter={() => onNodeFocus(id)} onFocus={() => onNodeFocus(id)} onBlur={onEscape} onClick={() => onNodeFocus(id)} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.currentTarget.blur(); onEscape(); } }} aria-label={`Inspect ${label}`}><span className="signal-node__index">{String(index + 1).padStart(2, '0')}</span><span className="signal-node__icon"><Icon size={17} /></span><span className="signal-node__text"><strong>{label}</strong><small>{detail}</small></span><span className="signal-node__pulse" /></button>)}</div>;
}

function ArchiveList({ label, values }) {
  return <div className="archive-list"><span>{label}</span>{values.map((value) => <strong key={value}>{value}</strong>)}</div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedSignal, setSelectedSignal] = useState('esp32');
  const [signalNoteOpen, setSignalNoteOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('omsai-theme') || 'dark');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 450, damping: 32 });
  const smoothY = useSpring(cursorY, { stiffness: 450, damping: 32 });

  const goTo = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const openAdriel = () => { setMenuOpen(false); window.dispatchEvent(new Event('adriel:open')); };
  const nextCertificate = (direction) => { if (!selectedCertificate) return; const index = certificates.findIndex((certificate) => certificate.id === selectedCertificate.id); setSelectedCertificate(certificates[(index + direction + certificates.length) % certificates.length]); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onMove = (event) => { cursorX.set(event.clientX); cursorY.set(event.clientY); };
    const onKeydown = (event) => {
      if (event.key === 'Escape') { setSelectedProject(null); setSelectedCertificate(null); setSignalNoteOpen(false); }
      if (selectedCertificate && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        const index = certificates.findIndex((certificate) => certificate.id === selectedCertificate.id);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        setSelectedCertificate(certificates[(index + direction + certificates.length) % certificates.length]);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('keydown', onKeydown);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onMove); window.removeEventListener('keydown', onKeydown); };
  }, [cursorX, cursorY, selectedCertificate]);

  useEffect(() => { document.body.classList.toggle('modal-open', Boolean(selectedCertificate || selectedProject)); return () => document.body.classList.remove('modal-open'); }, [selectedCertificate, selectedProject]);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('omsai-theme', theme); }, [theme]);

  const vanta = projects.find((project) => project.id === 'vanta');
  const lineEditor = projects.find((project) => project.id === 'line-editor');
  const graphicsEditor = projects.find((project) => project.id === 'graphics-editor');
  const noetica = projects.find((project) => project.id === 'noetica');
  const focusSignal = (id) => { setSelectedSignal(id); setSignalNoteOpen(true); };

  return <div className="site-shell">
    <motion.div className="custom-cursor" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />
    <BatAtmosphere />
    <header className={`archive-nav ${scrolled ? 'archive-nav--scrolled' : ''}`}>
      <button className="archive-brand" type="button" onClick={() => goTo('home')} aria-label="Return to archive index"><span>OMSAI</span><small>PRIVATE DIGITAL ARCHIVE</small></button>
      <div className="archive-nav__section">ARCHIVE / 01 <span /> INDEX</div>
      <nav className="archive-links" aria-label="Archive navigation"><button type="button" onClick={() => goTo('about')}>ABOUT</button><button type="button" onClick={() => goTo('work')}>WORK</button><button type="button" onClick={() => goTo('certificates')}>CERTIFICATES</button><button type="button" onClick={() => goTo('lab')}>LAB</button><button type="button" onClick={openAdriel}>ADRIEL</button><button type="button" onClick={() => goTo('contact')}>CONTACT</button></nav>
      <div className="archive-nav__actions"><ThemeToggle theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} /><button className="archive-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close archive menu' : 'Open archive menu'}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
    </header>
    <AnimatePresence>{menuOpen && <motion.nav className="archive-mobile-nav" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} aria-label="Mobile archive navigation">{[['about', 'ABOUT / 01'], ['work', 'WORK / 02'], ['certificates', 'CERTIFICATES / 03'], ['lab', 'LAB / 04'], ['contact', 'CONTACT / 05']].map(([id, label]) => <button key={id} type="button" onClick={() => goTo(id)}>{label}<ArrowUpRight size={15} /></button>)}<button type="button" onClick={openAdriel}>ADRIEL / OPEN<ArrowUpRight size={15} /></button></motion.nav>}</AnimatePresence>

    <main id="home">
      <section className="archive-hero section-pad"><div className="hero-archive-code">ACADEMIC ARCHIVE / 03</div><div className="hero-constellation" aria-hidden="true"><span /><span /><span /><span /><span /></div><div className="hero-editorial"><motion.div className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}><span>03</span><span>REVA UNIVERSITY</span><span>{profile.location.toUpperCase()}</span></motion.div><motion.p className="hero-overline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>COMPUTER SCIENCE / UNDERGRADUATE</motion.p><motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}><span>OMSAI</span><em>P. OMSAI REDDY</em></motion.h1><motion.p className="hero-statement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>I build systems, study their behaviour, and follow interesting problems wherever they lead.</motion.p><div className="hero-actions"><motion.button className="archive-enter" type="button" onClick={() => goTo('work')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.88 }}>ENTER THE ARCHIVE <ArrowDownRight size={17} /></motion.button><motion.button className="archive-enter archive-enter--quiet" type="button" onClick={openAdriel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>MEET ADRIEL <ArrowUpRight size={17} /></motion.button></div></div><div className="hero-orbit-wrap"><RevaUniversityPlate /></div><div className="hero-footnote"><span>BANGALORE · INDIA · 2026</span><span>LEARNING THROUGH CODE, SYSTEMS &amp; EXPERIMENTATION</span></div></section>

      <section id="about" className="archive-section dossier-section section-pad"><SectionMarker index="01" label="THE PERSON" title="A student record, still in motion." /><div className="dossier-layout"><Reveal className="dossier-copy"><div className="dossier-header"><span>SUBJECT: {profile.fullName}</span><span>FILE / 001</span></div><h3>{profile.title}</h3><p className="dossier-lead">{profile.bio}</p><div className="dossier-meta"><div><span>UNIVERSITY</span><strong>{profile.university}</strong></div><div><span>LOCATION</span><strong>{profile.location}</strong></div><div><span>STAGE</span><strong>{profile.semester}</strong></div><div><span>GRADUATION</span><strong>{profile.graduation}</strong></div></div></Reveal></div><div className="archive-lists"><ArchiveList label="LANGUAGES" values={skills.programmingLanguages} /><ArchiveList label="DATABASE" values={skills.databases} /><ArchiveList label="TOOLS" values={skills.tools} /><ArchiveList label="CURRENT STUDY" values={education.coursework} /></div></section>

      <section id="work" className="archive-section work-section section-pad"><SectionMarker index="02" label="THE WORK" title="Artefacts from the build log." /><Reveal className="vanta-artefact"><div className="artefact-visual"><div className="artefact-topline"><span>PROJECT / 001</span><span>IO / EMBEDDED</span><span>STATUS: PROTOTYPE</span></div><div className="vanta-beam" /><div className="vanta-ring vanta-ring--one" /><div className="vanta-ring vanta-ring--two" /><div className="artefact-crosshair"><span>VANTA</span><small>OPTICAL SECURITY ARRAY</small></div><span className="artefact-coordinate artefact-coordinate--one">13° 01' / 77° 35'</span><span className="artefact-coordinate artefact-coordinate--two">ESP32 / 01</span></div><div className="artefact-copy"><span className="archive-label">PROJECT / 001</span><h3>PROJECT VANTA<em>Laser Tripwire<br />Security Alarm System</em></h3><p>{vanta.description}</p><div className="artefact-facts"><span>CONTRIBUTION</span><strong>{vanta.role}</strong></div><div className="artefact-facts"><span>TECHNOLOGIES</span><strong>{vanta.technologies.join(' · ')}</strong></div><div className="artefact-actions"><button type="button" className="archive-link" onClick={() => setSelectedProject(vanta)}>INSPECT ARTEFACT <ArrowUpRight size={15} /></button><a className="archive-link" href={vanta.documentation} target="_blank" rel="noopener noreferrer">VIEW PROJECT DOCUMENTATION <ExternalLink size={15} /></a></div></div></Reveal><Reveal className="secondary-artefact" delay={0.1}><div><span className="archive-label">PROJECT / 002</span><h3>NEXUS Line Editor <em>Group project</em></h3></div><p>{lineEditor.description}</p><span className="collab-note">{lineEditor.technologies.join(' · ')}</span><a className="archive-link" href={lineEditor.github} target="_blank" rel="noopener noreferrer">GROUP REPOSITORY <ExternalLink size={15} /></a></Reveal><Reveal className="secondary-artefact" delay={0.15}><div><span className="archive-label">PROJECT / 003</span><h3>2D Graphics Editor <em>Separate repository</em></h3></div><p>{graphicsEditor.description}</p><span className="collab-note">{graphicsEditor.technologies.join(' · ')}</span><a className="archive-link" href={graphicsEditor.github} target="_blank" rel="noopener noreferrer">OPEN REPOSITORY <ExternalLink size={15} /></a></Reveal><Reveal className="secondary-artefact" delay={0.2}><div><span className="archive-label">PROJECT / 004</span><h3>{noetica.title}</h3></div><p>{noetica.description}</p><span className="collab-note">{noetica.technologies.join(' · ')}</span><a className="archive-link" href={noetica.documentation} target="_blank" rel="noopener noreferrer">READ PROJECT DOCUMENTATION <ExternalLink size={15} /></a></Reveal></section>

      <section id="lab" className="archive-section lab-section section-pad"><SectionMarker index="03" label="THE LABORATORY" title="Trace the signal through VANTA." /><div className="lab-intro"><p>Inspect each documented component. Focus, hover or tap a node to open its engineering note.</p><span>FIG. 01 / SYSTEM PATH</span></div><Reveal className="signal-frame"><SignalDiagram activeNode={selectedSignal} onNodeFocus={focusSignal} onEscape={() => { setSelectedSignal(null); setSignalNoteOpen(false); }} /><div className="signal-caption"><span>LASER → RECEIVER → ESP32 → OUTPUTS → CLOUD</span><small>PROJECT VANTA / SYSTEM ARCHITECTURE</small></div><div className="signal-note" aria-live="polite">{signalNoteOpen && selectedSignal ? (() => { const note = [{ id: 'laser-emitter', label: 'Laser emitter', detail: 'Establishes the optical security beam.' }, { id: 'laser-receiver', label: 'Laser receiver', detail: 'Monitors the beam and detection input.' }, { id: 'esp32', label: 'ESP32', detail: 'Processes receiver events and coordinates the response.' }, { id: 'buzzer', label: 'Piezoelectric buzzer', detail: 'Provides the audible alarm when the path is interrupted.' }, { id: 'status-leds', label: 'Status LEDs', detail: 'Provide visual system status.' }, { id: 'lcd', label: '16×2 I²C LCD', detail: 'Displays status and warning information.' }, { id: 'blynk-cloud', label: 'Blynk Cloud', detail: 'Handles documented cloud communication and monitoring.' }, { id: 'web-dashboard', label: 'Web dashboard', detail: 'Presents documented status, alerts, telemetry or controls.' }].find((item) => item.id === selectedSignal); return note && <><span>{note.label}</span><strong>{note.detail}</strong><button type="button" onClick={() => { setSelectedSignal(null); setSignalNoteOpen(false); }} aria-label="Close engineering note"><X size={14} /></button></>; })() : <span>Select a system component to inspect its note.</span>}</div></Reveal></section>

      <section id="certificates" className="archive-section evidence-section section-pad"><SectionMarker index="04" label="THE EVIDENCE" title="Documents preserved from the learning record." /><div className="evidence-header"><p>Four certificates, kept as issued. No substitute artwork. Select a document to examine it at full scale.</p><span>CERTIFICATE ARCHIVE / 04 FILES</span></div><div className="certificate-grid archive-certificate-grid">{certificates.map((certificate, index) => <Reveal key={certificate.id} delay={index * 0.06}><button type="button" className="document-card" onClick={() => setSelectedCertificate(certificate)} aria-label={`View ${certificate.title}`}><span className="document-index">0{index + 1} / {certificate.issuer}</span><span className="document-image"><img src={certificate.image} alt={certificate.title} /></span><span className="document-caption"><strong>{certificate.title}</strong><small>VIEW DOCUMENT <ArrowUpRight size={13} /></small></span></button></Reveal>)}</div></section>

      <section id="contact" className="archive-section contact-section section-pad"><SectionMarker index="06" label="THE CONTACT SHEET" title="Open to the next interesting problem." /><div className="contact-layout"><div><p className="contact-statement">For academic projects, software development, systems, and emerging technologies in Computer Science and Engineering.</p><span className="archive-label">CORRESPONDENCE / OMSAI</span></div><div className="contact-list"><a href={`mailto:${profile.email}`}><Mail size={16} /><span>{profile.email}</span><ArrowUpRight size={14} /></a><a href={`tel:${profile.phone.replace(/\s+/g, '')}`}><Phone size={16} /><span>{profile.phone}</span><ArrowUpRight size={14} /></a><a href={profile.github} target="_blank" rel="noreferrer"><GitBranch size={16} /><span>GitHub</span><ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Globe size={16} /><span>LinkedIn</span><ArrowUpRight size={14} /></a><a href={profile.leetcode} target="_blank" rel="noreferrer"><BookOpen size={16} /><span>LeetCode</span><ArrowUpRight size={14} /></a></div></div></section>
    </main>

    <footer className="archive-footer"><span>OMSAI / PRIVATE DIGITAL ARCHIVE</span><span>{profile.university} / {profile.location}</span><span>END OF INDEX</span></footer><PortfolioAssistant />

    <AnimatePresence>{selectedProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="case-study archive-modal" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}><button type="button" className="case-close" onClick={() => setSelectedProject(null)} aria-label="Close project file"><X size={16} /> CLOSE FILE</button><div className={`case-hero case-hero--${selectedProject.id}`}><div className="case-hero__inner"><span>{selectedProject.category}</span><strong>{selectedProject.title}</strong></div></div><div className="case-study__content"><div className="case-study__grid"><div><span className="detail-label">OVERVIEW</span><p>{selectedProject.overview}</p></div><div><span className="detail-label">PURPOSE</span><p>{selectedProject.challenge}</p></div><div><span className="detail-label">ROLE</span><p>{selectedProject.role}</p></div></div><div className="case-study__sections">{[['SYSTEM ARCHITECTURE', selectedProject.architecture], ['IMPLEMENTATION', selectedProject.implementation], ['TESTING', selectedProject.testing], ['RESULT', selectedProject.result]].map(([label, text]) => <div key={label}><span className="detail-label">{label}</span><p>{text}</p></div>)}</div><div className="case-study__actions">{selectedProject.github && <a href={selectedProject.github} target="_blank" rel="noreferrer" className="archive-link">GITHUB <ExternalLink size={14} /></a>}<button type="button" className="archive-link" onClick={() => setSelectedProject(null)}>RETURN TO INDEX <ArrowLeft size={14} /></button></div></div></motion.div></motion.div>}</AnimatePresence>

    <AnimatePresence>{selectedCertificate && <motion.div className="modal-backdrop certificate-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="certificate-modal archive-document-viewer" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}><button type="button" className="case-close" onClick={() => setSelectedCertificate(null)} aria-label="Close certificate viewer"><X size={16} /> CLOSE DOCUMENT</button><div className="document-viewer__image"><img src={selectedCertificate.image} alt={selectedCertificate.title} /></div><div className="document-viewer__meta"><span>{selectedCertificate.issuer} / {selectedCertificate.category}</span><strong>{selectedCertificate.title}</strong><small>Use ← → to move through the archive. ESC to close.</small></div><div className="certificate-modal__nav"><button type="button" onClick={() => nextCertificate(-1)}>PREVIOUS <ArrowLeft size={14} /></button><button type="button" onClick={() => nextCertificate(1)}>NEXT <ArrowUpRight size={14} /></button></div></motion.div></motion.div>}</AnimatePresence>
  </div>;
}

export default App;