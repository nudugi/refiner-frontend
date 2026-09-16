import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import SimpleForm from '../components/SimpleForm';
import ExhibitionForm from '../components/ExhibitionForm';
import ResultBox from '../components/ResultBox';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { toolPage } from '../content/siteContent';

const MAX_FREE_USES = 5;

export default function RefinerTool() {
  useDocumentMeta(`${toolPage.title} | SUNYA`, toolPage.subtitle);

  const [style, setStyle] = useState('essay');
  const [result, setResult] = useState(null);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader />

      <div
        style={{
          maxWidth: 700,
          margin: '2rem auto',
          padding: '1.5rem',
          fontFamily: "'Consolas', monospace",
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '100%',
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: '900', fontSize: '2.2rem', margin: 0 }}>{toolPage.title}</h1>
          <p style={{ marginTop: '0.4rem', color: '#666', fontSize: '0.9rem' }}>
            {toolPage.subtitle}
          </p>
        </div>

        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          style={{
            padding: '0.8rem 1rem',
            borderRadius: 8,
            border: '2px solid #333',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <option value="poem">시</option>
          <option value="essay">에세이</option>
          <option value="diary">일기</option>
          <option value="작가노트 & 전시 서문">작가노트 & 전시 서문</option>
        </select>

        {style === '작가노트 & 전시 서문' ? (
          <ExhibitionForm setResult={setResult} />
        ) : (
          <SimpleForm style={style} setResult={setResult} />
        )}

        {result && <ResultBox result={result} style={style} />}

        <AboutSection />
      </div>

      <SiteFooter />
    </div>
  );
}

function AboutSection() {
  return (
    <div
      style={{
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: '#666',
        borderTop: '1px solid #ddd',
        paddingTop: '1.5rem',
        lineHeight: 1.6,
        textAlign: 'center',
      }}
    >
      {toolPage.aboutLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p style={{ marginTop: '0.5rem' }}>
        &#8791;&#8902; {toolPage.freeUsesNote(MAX_FREE_USES)} &#8902;&#8791;
      </p>
    </div>
  );
}
