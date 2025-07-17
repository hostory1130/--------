// 1. HTML 요소들을 자바스크립트에서 사용할 수 있도록 가져오기
// document.getElementById()는 HTML에서 특정 id를 가진 요소를 찾아줍니다.
const visitForm = document.getElementById('visitForm'); // 방문 등록 폼 전체
const nameInput = document.getElementById('name'); // 이름 입력 필드
const phoneInput = document.getElementById('phone'); // 연락처 입력 필드
const purposeSelect = document.getElementById('purpose'); // 방문 목적 선택 필드
const registrationTableBody = document.getElementById('registrationTableBody'); // 등록 목록 테이블의 body 부분
const noRegistrationsMessage = document.getElementById('noRegistrationsMessage'); // 등록된 방문자 없음 메시지

// 방문자 데이터를 저장할 배열 (로컬 스토리지에서 데이터 불러오기)
// 페이지 로드 시 로컬 스토리지에 저장된 'visitors' 데이터가 있는지 확인하고 가져옵니다.
// 만약 데이터가 없으면 빈 배열([])로 초기화합니다.
let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

// 2. 폼 제출(submit) 이벤트 감지하기
// visitForm에서 'submit' 이벤트(사용자가 '등록하기' 버튼을 눌렀을 때)가 발생하면,
// 지정된 함수(function)를 실행합니다.
visitForm.addEventListener('submit', function(event) {
    // 폼이 새로고침되는 기본 동작을 막기 (이게 없으면 입력 후 바로 페이지가 새로고침됩니다.)
    event.preventDefault();

    // 3. 입력된 값 가져오기
    // .value를 사용하면 input이나 select 요소에 입력된(선택된) 값을 얻을 수 있습니다.
    const name = nameInput.value;
    const phone = phoneInput.value;
    const purpose = purposeSelect.value;
    // 현재 시간을 'YYYY.MM.DD HH:MM:SS' 형식으로 가져옵니다.
    const registrationTime = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // 4. 입력 값 유효성 검사 (간단하게)
    // 필수 필드가 비어있으면 경고 메시지를 띄우고 함수 실행을 중단합니다.
    if (!name || !phone || !purpose) {
        alert('모든 필수 정보를 입력해주세요!');
        return; // 이 뒤의 코드는 실행되지 않습니다.
    }

    // 연락처 뒷 4자리 유효성 검사 추가
    // 정규표현식을 사용해 숫자로만 이루어진 4자리인지 확인합니다.
    const phonePattern = /^[0-9]{4}$/; // 0-9 숫자만 4개
    if (!phonePattern.test(phone)) {
        alert('연락처는 숫자 4자리로 입력해주세요. (예: 5678)');
        return; // 유효하지 않으면 함수 실행 중단
    }

    // 5. 새로운 방문자 객체 생성
    // 방문자 한 명의 정보를 하나의 묶음(객체)으로 만듭니다.
    const newVisitor = {
        name: name,
        phone: phone,
        purpose: purpose,
        time: registrationTime
    };

    // 6. 방문자 배열에 추가
    // visitors 배열의 맨 뒤에 newVisitor 객체를 추가합니다.
    visitors.push(newVisitor);

    // 7. 로컬 스토리지에 데이터 저장
    // visitors 배열이 변경될 때마다 로컬 스토리지에 최신 데이터를 저장합니다.
    // 객체 배열인 visitors를 JSON 문자열로 변환하여 저장해야 합니다.
    localStorage.setItem('visitors', JSON.stringify(visitors));


   

    // 9. 폼 초기화 (입력 필드 비우기)
    // 다음 방문자가 쉽게 정보를 입력할 수 있도록 폼을 깨끗하게 비웁니다.
    visitForm.reset();
    purposeSelect.value = ""; // select 박스는 reset으로 초기화가 안 될 수 있어서 명시적으로 비웁니다.
});

// 등록 목록을 화면에 표시하는 함수
// 이 함수는 visitors 배열의 내용을 바탕으로 테이블을 다시 그립니다.
function updateRegistrationList() {
    // 기존 목록 비우기: 테이블 body 안의 모든 내용을 지웁니다.
    registrationTableBody.innerHTML = '';

    // 방문자 배열이 비어있으면 "등록된 방문자 없음" 메시지 표시, 아니면 숨기기
    if (visitors.length === 0) {
        noRegistrationsMessage.style.display = 'block'; // 메시지를 보여줍니다.
    } else {
        noRegistrationsMessage.style.display = 'none'; // 메시지를 숨깁니다.
    }

    // 각 방문자 정보를 테이블에 추가
    // visitors 배열의 각 visitor 객체에 대해 다음 코드를 반복 실행합니다.
    visitors.forEach(visitor => {
        const row = registrationTableBody.insertRow(); // 새 테이블 행(<tr>)을 생성합니다.
        // 각 셀(<td>)에 방문자 정보를 넣습니다. insertCell(0)은 첫 번째 칸을 의미합니다.
        row.insertCell(0).textContent = visitor.name;
        row.insertCell(1).textContent = visitor.phone;
        row.insertCell(2).textContent = visitor.purpose;
        row.insertCell(3).textContent = visitor.time;
    });
}

// 페이지가 처음 로드될 때 로컬 스토리지에서 불러온 데이터로 등록 목록을 업데이트합니다.
updateRegistrationList();