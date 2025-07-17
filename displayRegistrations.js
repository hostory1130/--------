// HTML 요소 가져오기
const registrationTableBody = document.getElementById('registrationTableBody');
const noRegistrationsMessage = document.getElementById('noRegistrationsMessage');

// 페이지 로드 시 실행되는 함수
document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
});

function loadRegistrations() {
    // 로컬 스토리지에서 방문자 데이터 불러오기
    // 데이터가 없으면 빈 배열로 초기화
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];

    // 기존 목록 비우기 (불필요하지만 안전을 위해)
    registrationTableBody.innerHTML = '';

    // 방문자 배열이 비어있으면 메시지 표시, 아니면 숨기기
    if (visitors.length === 0) {
        noRegistrationsMessage.style.display = 'block';
    } else {
        noRegistrationsMessage.style.display = 'none';
    }

    // 각 방문자 정보를 테이블에 추가
    visitors.forEach(visitor => {
        const row = registrationTableBody.insertRow(); // 새 행 생성
        row.insertCell(0).textContent = visitor.name; // 이름 셀
        row.insertCell(1).textContent = visitor.phone; // 연락처 셀
        row.insertCell(2).textContent = visitor.purpose; // 방문 목적 셀
        row.insertCell(3).textContent = visitor.time; // 등록 시간 셀
    });
}