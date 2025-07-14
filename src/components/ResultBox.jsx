export default function ResultBox({ result, style }) {
  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f5f5f5',
        padding: '1.2rem',
        borderRadius: 10,
        border: '1.5px solid #aaa',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        fontFamily: "'Consolas', monospace",
        color: '#222',
        overflowY: 'auto',
      }}
    >
      {typeof result === 'string' ? (
        result
      ) : (
        <>
          <h3 style={{ fontWeight: '900', marginBottom: 8 }}>작가노트</h3>
          <p style={{ marginBottom: 12 }}>{result.artist_note}</p>

          <h3 style={{ fontWeight: '900', marginBottom: 8 }}>전시 서문</h3>
          <p style={{ marginBottom: 12 }}>{result.exhibition_preface}</p>

          <h3 style={{ fontWeight: '900', marginBottom: 8 }}>작품 설명</h3>
          <p>{result.work_explanation}</p>
        </>
      )}
    </div>
  );
}
