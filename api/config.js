/**
 * Vercel 서버리스 함수: Supabase 설정을 환경 변수에서 읽어 클라이언트에 전달합니다.
 * Vercel 대시보드에서 SUPABASE_URL, SUPABASE_ANON_KEY 환경 변수를 설정하세요.
 */
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
  });
};
