import { useState } from 'react';
import SimpleForm from './components/SimpleForm';
import ExhibitionForm from './components/ExhibitionForm';
import ResultBox from './components/ResultBox';

export default function AppMain() {
  const [style, setStyle] = useState('essay');
  const [result, setResult] = useState(null);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '2rem auto',
        padding: '1.5rem',
        fontFamily: "'Consolas', monospace",
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minHeight: '90vh',
      }}
    >
      <h1 style={{ fontWeight: '900', fontSize: '2.5rem', textAlign: 'center' }}>
        27.42 Refiner
      </h1>

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

      {/* 테스트 결제 버튼 */}
      <button
        onClick={() => window.location.href = "https://refiner-frontend.vercel.app/payment/test"}
        style={{
          padding: "1rem 2rem",
          marginTop: 30,
          fontSize: "1rem",
          backgroundColor: "#0064FF",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        테스트 결제하기
      </button>
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
      <p>이 도구는 예술가와 창작자를 위한 AI 글 정제기입니다.</p>
      <p>시 / 에세이 / 일기 / 전시 서문 / 작가 노트 등을 정제해줍니다.</p>
      <p>지속적인 사용을 원하신다면 유료 전환을 기다려주세요.</p>
      <p style={{ marginTop: '0.5rem' }}>&#8791;&#8902; 27.42 | 초반 무료 사용 5회 제한 &#8902;&#8791;</p>
    </div>
  );
}
