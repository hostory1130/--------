// displayRegistrations.js 파일 - 수정된 전체 코드

// 1. HTML 요소들을 자바스크립트에서 사용할 수 있도록 가져오기
// registrationTableBody: 방문자 목록 테이블의 <body> 부분 (여기에 행들이 추가됩니다)
// noRegistrationsMessage: "등록된 방문자가 없습니다." 메시지를 표시하는 <p> 태그
const registrationTableBody = document.getElementById('registrationTableBody');
const noRegistrationsMessage = document.getElementById('noRegistrationsMessage');

// 2. 등록 목록을 화면에 표시하는 함수 정의
// 이 함수는 localStorage에서 방문자 데이터를 불러와 테이블을 업데이트합니다.
function updateRegistrationList() {
    // 로컬 스토리지에서 'visitors' 데이터를 불러옵니다.
    // 데이터가 없으면 빈 배열([])로 초기화하여 에러를 방지합니다.
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

    // 기존 목록 비우기: 테이블 body 안의 모든 내용을 지웁니다.
    // 이렇게 해야 데이터가 중복해서 표시되지 않고 항상 최신 상태로 업데이트됩니다.
    if (registrationTableBody) {
        registrationTableBody.innerHTML = '';
    }

    // 방문자 배열이 비어있는지 확인하고, 그에 따라 메시지를 표시하거나 숨깁니다.
    if (noRegistrationsMessage) {
        if (visitors.length === 0) {
            noRegistrationsMessage.style.display = 'block'; // 메시지를 보이게 함
        } else {
            noRegistrationsMessage.style.display = 'none'; // 메시지를 숨김
        }
    }

    // 각 방문자 정보를 테이블에 행으로 추가합니다.
    // forEach를 사용하여 visitors 배열의 각 visitor 객체와 해당 인덱스를 가져옵니다.
    visitors.forEach((visitor, index) => {
        // 새 테이블 행(<tr>)을 생성합니다.
        const row = registrationTableBody.insertRow();
        
        // 각 셀(<td>)에 방문자 정보를 넣습니다.
        // insertCell(0)은 첫 번째 칸을 의미하며, 순서대로 칸이 추가됩니다.
        row.insertCell(0).textContent = visitor.name; // 이름
        row.insertCell(1).textContent = visitor.phone; // 연락처
        row.insertCell(2).textContent = visitor.purpose; // 방문 목적
        row.insertCell(3).textContent = visitor.time; // 등록 시간

        // ⭐ 3. 삭제 버튼을 위한 셀과 버튼 생성 및 추가 ⭐
        const deleteCell = row.insertCell(4); // 5번째 칸 (인덱스 4)에 새로운 셀 생성
        const deleteButton = document.createElement('button'); // <button> 요소 생성
        deleteButton.textContent = '삭제'; // 버튼에 '삭제' 텍스트 표시
        deleteButton.classList.add('delete-button'); // CSS 스타일링을 위한 클래스 추가

        // ⭐ 삭제 버튼에 클릭 이벤트 리스너 추가 ⭐
        // 이 버튼이 클릭되면 deleteVisitor 함수가 실행됩니다.
        deleteButton.addEventListener('click', function() {
            // 사용자에게 삭제 여부를 한 번 더 확인받습니다.
            if (confirm(`${visitor.name}님의 등록 기록을 정말 삭제하시겠습니까?`)) {
                deleteVisitor(index); // deleteVisitor 함수 호출, 삭제할 항목의 인덱스 전달
            }
        });
        deleteCell.appendChild(deleteButton); // 생성한 버튼을 deleteCell에 추가합니다.
    });
}

// ⭐ 4. 방문자 기록을 삭제하는 함수 정의 ⭐
function deleteVisitor(indexToDelete) {
    // 로컬 스토리지에서 현재 방문자 데이터를 다시 불러옵니다.
    // (삭제 버튼을 누른 시점의 최신 데이터를 반영하기 위함)
    let currentVisitors = JSON.parse(localStorage.getItem('visitors')) || [];

    // splice() 메서드를 사용하여 해당 인덱스의 항목을 배열에서 제거합니다.
    // indexToDelete 위치에서 1개의 항목을 제거하라는 의미입니다.
    currentVisitors.splice(indexToDelete, 1);

    // 변경된(삭제된 항목이 반영된) 배열을 다시 로컬 스토리지에 저장합니다.
    localStorage.setItem('visitors', JSON.stringify(currentVisitors));

    // 테이블 목록을 다시 그려 화면을 업데이트합니다.
    // 이렇게 하면 삭제된 항목이 화면에서도 사라집니다.
    updateRegistrationList();
}

// 5. 페이지가 처음 로드될 때 등록 목록을 업데이트합니다.
// 이 코드는 registrations.html 페이지가 웹 브라우저에 로드되면 즉시 실행되어
// localStorage에 저장된 방문자 목록을 테이블에 표시합니다.
window.addEventListener('load', updateRegistrationList);

// 참고: 만약 다른 스크립트(script.js)에서 이 updateRegistrationList 함수를 호출해야 한다면,
// script.js 파일에서 window.updateRegistrationList = updateRegistrationList; 처럼
// 전역 객체에 등록해야 합니다. 하지만 지금은 registrations.html 페이지 자체에서만
// 사용될 예정이므로 필요하지 않습니다.