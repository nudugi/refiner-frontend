import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SimpleForm({ style, setResult }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const MAX_FREE_USES = 5;

  // 컴포넌트 로드 시 로컬 저장된 사용 횟수 불러오기
  useEffect(() => {
    const count = parseInt(localStorage.getItem('refineCount') || '0', 10);
    setUsageCount(count);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('텍스트를 입력하세요.');
      return;
    }

    if (usageCount >= MAX_FREE_USES) {
      setError('무료 사용 횟수를 초과했습니다. 결제를 진행해 주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('https://refiner-backend.onrender.com//refine', { style, text });
      setResult(res.data.result);

      // 사용 횟수 업데이트
      const newCount = usageCount + 1;
      localStorage.setItem('refineCount', newCount);
      setUsageCount(newCount);
    } catch (e) {
      setError('API 요청 실패: ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <textarea
        placeholder="여기에 텍스트를 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          height: 160,
          padding: 12,
          fontSize: 15,
          borderRadius: 8,
          border: '1.5px solid #444',
          fontFamily: "'Consolas', monospace",
          resize: 'vertical',
          backgroundColor: '#f9f9f9',
        }}
        disabled={loading || usageCount >= MAX_FREE_USES}
      />
      <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
        무료 사용 횟수: {usageCount}/{MAX_FREE_USES}
      </div>
      {error && <div style={{ color: 'crimson', fontWeight: '700' }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={loading || usageCount >= MAX_FREE_USES}
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: usageCount >= MAX_FREE_USES ? '#888' : '#111',
          color: 'white',
          borderRadius: 8,
          fontWeight: '700',
          cursor: loading || usageCount >= MAX_FREE_USES ? 'not-allowed' : 'pointer',
          fontFamily: "'Consolas', monospace",
          fontSize: 15,
          border: 'none',
          letterSpacing: '0.5px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!loading && usageCount < MAX_FREE_USES) e.target.style.backgroundColor = '#555';
        }}
        onMouseLeave={(e) => {
          if (!loading && usageCount < MAX_FREE_USES) e.target.style.backgroundColor = '#222';
        }}
      >
        {loading ? '정제 중...' : '정제하기'}
      </button>
    </div>
  );
}
