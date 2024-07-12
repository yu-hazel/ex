// Supabase 설정
const SUPABASE_URL = 'https://vovzpunshmcodmkletaw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdnpwdW5zaG1jb2Rta2xldGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMDg5MzUsImV4cCI6MjAzMzY4NDkzNX0.aVXi_AbLx-AGNwWVa0MB-WiNrkht2Eq0ECnBwDds2Kc';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 폼 요소 가져오기
const dataForm = document.getElementById('dataForm');

dataForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    // 입력된 사용자 이름 가져오기
    const username = document.getElementById('username').value;

    // Supabase에 데이터 삽입
    const { data, error } = await supabase
        .from('users') // 'users' 테이블 이름
        .insert([{ username }]); // 객체 형태로 데이터 삽입

    if (error) {
        console.error('데이터 삽입 오류:', error);
    } else {
        console.log('데이터 삽입 성공:', data);
        alert('데이터가 성공적으로 저장되었습니다!');
    }
});