// 공통 JavaScript 함수

// 사용자 세션 데이터 관리
function saveUserData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getUserData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// 페이지 간 데이터 전송
function storeFormData() {
    const formData = {
        startupStatus: document.querySelector('.user-type.selected') ? 
            document.querySelector('.user-type.selected .user-type-label').textContent : null,
        businessIdea: document.querySelector('.input-field') ? 
            document.querySelector('.input-field').value : null
    };
    
    saveUserData('bizdraft_form_data', formData);
}

// 진행률 관련 스크립트
document.addEventListener('DOMContentLoaded', function() {
    const progressCircle = document.querySelector('.progress-circle');
    // 내부의 <span> 요소에서 숫자 읽어오기 (클래스명이 중복되어 있으므로, 구체적으로 지정)
    const percentageElement = document.querySelector('.progress-percentage span');
    const targetPercentage = parseInt(percentageElement.textContent, 10);
    const duration = 2000; // 애니메이션 시간 (2초)
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentPercentage = progress * targetPercentage;
        progressCircle.style.setProperty('--percentage', currentPercentage);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
});

// 페이지 이동 시 데이터 저장
document.addEventListener('DOMContentLoaded', function() {
    // 다음 버튼 클릭 시 데이터 저장
    const nextButtons = document.querySelectorAll('.action-button');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            storeFormData();
        });
    });
    
    // 이전 페이지에서 저장된 데이터 로드
    const formData = getUserData('bizdraft_form_data');
    
    // 폼에 데이터 채우기
    if (formData) {
        // 창업여부 페이지
        if (document.querySelectorAll('.user-type').length > 0) {
            document.querySelectorAll('.user-type').forEach(type => {
                if (type.querySelector('.user-type-label').textContent === formData.startupStatus) {
                    type.classList.add('selected');
                    document.getElementById('nextButton').classList.remove('secondary-button');
                }
            });
        }
        
        // 사업 아이디어 페이지
        if (document.querySelector('.input-field') && formData.businessIdea) {
            document.querySelector('.input-field').value = formData.businessIdea;
        }
    }
});