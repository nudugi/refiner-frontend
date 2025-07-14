import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExhibitionForm({ setResult }) {
  const [form, setForm] = useState({
    exhibition_title: '',
    exhibition_theme: '',
    artist_name: '',
    work_description: '',
    exhibition_intent: '',
    additional_info: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const MAX_FREE_USES = 5;

  useEffect(() => {
    const count = parseInt(localStorage.getItem('refineCount') || '0', 10);
    setUsageCount(count);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (usageCount >= MAX_FREE_USES) {
      setError('무료 사용 횟수를 초과했습니다. 결제를 진행해 주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/refine', {
        style: '작가노트 & 전시 서문',
        ...form,
      });

      setResult(res.data);
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
      <input
        name="exhibition_title"
        placeholder="전시 제목"
        value={form.exhibition_title}
        onChange={handleChange}
        style={inputStyle}
        disabled={loading || usageCount >= MAX_FREE_USES}
      />
      <input
        name="exhibition_theme"
        placeholder="전시 주제"
        value={form.exhibition_theme}
        onChange={handleChange}
        style={inputStyle}
        disabled={loading || usageCount >= MAX_FREE_USES}
      />
      <input
        name="artist_name"
        placeholder="작가 이름"
        value={form.artist_name}
        onChange={handleChange}
        style={inputStyle}
        disabled={loading || usageCount >= MAX_FREE_USES}
      />
      <textarea
        name="work_description"
        placeholder="작품 설명"
        value={form.work_description}
        onChange={handleChange}
        style={textAreaStyle}
        disabled={loading || usageCount >= MAX_FREE_USES}
      />
      <textarea
        name="exhibition_intent"
        placeholder="전시 의도"
        value={form.exhibition_intent}
        onChange={handleChange}
        style={textAreaStyle}
        disabled={loading || usageCount >= MAX_FREE_USES}
      />
      <textarea
        name="additional_info"
        placeholder="추가 정보"
        value={form.additional_info}
        onChange={handleChange}
        style={textAreaStyle}
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
          padding: '0.8rem',
          backgroundColor: usageCount >= MAX_FREE_USES ? '#999' : '#222',
          color: 'white',
          borderRadius: 8,
          fontWeight: '700',
          cursor: loading || usageCount >= MAX_FREE_USES ? 'not-allowed' : 'pointer',
          fontFamily: "'Consolas', monospace",
          fontSize: 16,
          border: 'none',
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

const inputStyle = {
  padding: 12,
  fontSize: 16,
  borderRadius: 8,
  border: '1.5px solid #444',
  fontFamily: "'Consolas', monospace",
};

const textAreaStyle = {
  ...inputStyle,
  height: 100,
  resize: 'vertical',
};
