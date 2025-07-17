// script.js 파일 - 최종 웹 앱 URL 적용 버전

// ⭐ 1. Google Apps Script 웹 앱 URL (제공해주신 URL로 교체 완료) ⭐
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyTgrU2uEa3Afzu3_F65Bnh5WBTCp-Ca8Sq_RBO7IplKstIGLJf0KdxOa3MPO1uFoyd/exec';

// 1. HTML 요소들을 자바스크립트에서 사용할 수 있도록 가져오기
const visitForm = document.getElementById('visitForm'); // 방문 등록 폼 전체
const nameInput = document.getElementById('name'); // 이름 입력 필드
const phoneInput = document.getElementById('phone'); // 연락처 입력 필드
const purposeSelect = document.getElementById('purpose'); // 방문 목적 선택 필드

const registrationMessageDiv = document.getElementById('registrationMessage'); // 등록 완료 메시지 div

// 방문자 데이터를 저장할 배열 (로컬 스토리지에서 데이터 불러오기)
let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

// 2. 폼 제출(submit) 이벤트 감지하기
if (visitForm) { // visitForm이 존재하는지 먼저 확인 (혹시 HTML에 id가 없으면 에러 방지)
    visitForm.addEventListener('submit', function(event) {
        // 폼이 새로고침되는 기본 동작을 막기
        event.preventDefault();

        // 3. 입력된 값 가져오기
        const name = nameInput.value;
        const phone = phoneInput.value;
        const purpose = purposeSelect.value;
        const registrationTime = new Date().toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 4. 입력 값 유효성 검사 (간단하게)
        if (!name || !phone || !purpose) {
            alert('모든 필수 정보를 입력해주세요!');
            return;
        }

        const phonePattern = /^[0-9]{4}$/; // 숫자 4자리 검증
        if (!phonePattern.test(phone)) {
            alert('연락처는 숫자 4자리로 입력해주세요. (예: 5678)');
            return;
        }

        // 5. 새로운 방문자 객체 생성
        const newVisitor = {
            name: name,
            phone: phone,
            purpose: purpose,
            time: registrationTime
        };

        // 6. 로컬 스토리지에 데이터 저장
        visitors.push(newVisitor); // 새 방문자 객체를 visitors 배열에 추가
        localStorage.setItem('visitors', JSON.stringify(visitors)); // 배열을 JSON 문자열로 변환하여 로컬 스토리지에 저장

        // ⭐ 7. Google Apps Script 웹 앱으로 데이터 전송 ⭐
        fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // CORS 정책 때문에 no-cors로 설정 (실제 응답은 못 받음)
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVisitor) // 방문자 객체를 JSON 문자열로 변환하여 전송
        })
        .then(response => {
            // no-cors 모드에서는 응답을 직접 읽을 수 없으므로 성공 여부만 확인합니다.
            console.log('데이터가 Google Sheet로 전송되었습니다.');
            // console.log('Response:', response); // no-cors에서는 응답이 opaque합니다.
        })
        .catch(error => {
            console.error('Google Sheet로 데이터 전송 중 오류 발생:', error);
            alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        });
        // ⭐ 여기까지 GAS 데이터 전송 로직 ⭐

        // 8. 등록 완료 메시지 표시 및 숨기기
        if (registrationMessageDiv) {
            registrationMessageDiv.style.display = 'block';
            registrationMessageDiv.textContent = '등록이 완료되었습니다!';
            setTimeout(() => {
                registrationMessageDiv.style.display = 'none';
            }, 3000); // 3초 후 메시지 숨김
        }

        // 9. 폼 초기화 (입력 필드 비우기)
        visitForm.reset();
        purposeSelect.value = ""; // select 박스는 reset()으로 초기화가 안 될 수 있어서 명시적으로 비웁니다.

        // updateRegistrationList 함수는 displayRegistrations.js에 있으므로,
        // 이 페이지(index.html)에서는 일반적으로 호출할 필요가 없습니다.
        // 만약 이 페이지에서도 등록 후 바로 목록을 업데이트해야 한다면,
        // displayRegistrations.js 스크립트도 index.html에 포함하고,
        // updateRegistrationList 함수가 전역으로 접근 가능하도록 설정해야 합니다.
    });
}