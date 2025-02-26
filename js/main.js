// 사용자 세션 데이터 관리
function saveUserData(key, value) {
    // 기존 데이터와 병합하여 저장 (부분 업데이트 가능하도록)
    const existingData = getUserData(key) || {};
    const updatedData = { ...existingData, ...value };
    localStorage.setItem(key, JSON.stringify(updatedData));
    console.log(`Data saved to ${key}:`, updatedData);
}

function getUserData(key) {
    const data = localStorage.getItem(key);
    const parsedData = data ? JSON.parse(data) : null;
    console.log(`Data retrieved from ${key}:`, parsedData);
    return parsedData;
}

// 사용자 데이터 리셋 함수
function resetUserData(key) {
    if (key) {
        // 특정 키만 삭제
        localStorage.removeItem(key);
        console.log(`Data reset for ${key}`);
    } else {
        // 모든 bizdraft 관련 데이터 삭제
        localStorage.removeItem("bizdraft_form_data");
        console.log("All user data has been reset");
    }
}

// 페이지 간 데이터 전송
function storeFormData() {
    // 기존 데이터 가져오기
    const existingData = getUserData('bizdraft_form_data') || {};

    // 현재 페이지에 창업 여부 선택 요소가 있다면 사용하고, 없으면 기존 값 유지
    const userTypeElement = document.querySelector('.user-type.selected');
    const startupStatus = userTypeElement 
        ? userTypeElement.querySelector('.user-type-label').textContent 
        : existingData.startupStatus || null;

    // 사업 아이디어 입력값은 해당 요소가 있을 경우 가져오고, 없으면 기존 값 사용
    const inputField = document.querySelector('.input-field');
    const businessIdea = inputField 
        ? inputField.value 
        : existingData.businessIdea || null;

    const formData = {
        startupStatus: startupStatus,
        businessIdea: businessIdea
    };

    saveUserData('bizdraft_form_data', formData);
}

// 사업 분석 함수 - businessIdea가 없는 경우 처리
function analyzeBusinessIdea(startupStatus, businessIdea) {
    let analysis = {
        successRate: 0,
        totalAmount: 0,
        fundingList: []
    };
    
    // 예비창업자/기창업자 기본 점수 설정
    if (startupStatus === '예비창업자') {
        analysis.successRate = parseFloat((Math.random() * (52 - 43) + 43).toFixed(1));
        analysis.totalAmount = parseInt((Math.random() * (67 - 48) + 48).toFixed(0) * 1000000);
        analysis.fundingList = [
            {name: '예비창업패키지', amount: analysis.totalAmount},
            {name: '데이터바우처 사업', amount: analysis.totalAmount-4000000}
        ];
    } else if (startupStatus === '기창업자') {
        analysis.successRate = parseFloat((Math.random() * (61 - 54) + 54).toFixed(1));
        analysis.totalAmount = parseInt((Math.random() * (93 - 83) + 83).toFixed(0) * 1000000);
        analysis.fundingList = [
            {name: '창업도약패키지', amount: analysis.totalAmount},
            {name: '기술개발사업', amount: analysis.totalAmount+6000000}
        ];
    }
    // 사업 아이디어가 있는 경우에만 키워드 분석 수행
    if (businessIdea && businessIdea.trim() !== "") {
        // 사업 아이디어 키워드 분석
        const techKeywords = ['AI', '인공지능', '빅데이터', 'IoT', '블록체인'];
        const socialKeywords = ['환경', '친환경', '사회문제', '복지'];
        
        techKeywords.forEach(keyword => {
            if (businessIdea.includes(keyword)) {
                analysis.successRate = parseFloat(analysis.successRate) + 3.1;
                analysis.totalAmount += 10000000;
            }
        });
        
        socialKeywords.forEach(keyword => {
            if (businessIdea.includes(keyword)) {
                analysis.successRate = parseFloat(analysis.successRate) + 2.3;
                analysis.totalAmount += 5000000;
            }
        });
    }
    
    // 최종 값 포맷팅
    analysis.successRate = analysis.successRate.toFixed(1);
    
    return analysis;
}

// 결과 페이지 데이터 표시 함수
function displayResults() {
    const formData = getUserData('bizdraft_form_data');
    console.log('Results page - Form data:', formData);
    
    // startupStatus만 필수로 체크하도록 변경
    if (!formData || !formData.startupStatus) {
        console.error('Required data missing for results - startup status');
        alert('창업 여부 정보가 없습니다. 처음부터 다시 시작합니다.');
        window.location.href = "startup-status.html";
        return;
    }
    
    // businessIdea가 없으면 빈 문자열로 대체
    const businessIdea = formData.businessIdea || "";
    
    const analysis = analyzeBusinessIdea(formData.startupStatus, businessIdea);
    console.log('Analysis result:', analysis);
    
    // 결과 페이지 요소 업데이트
    document.querySelector('.progress-percentage span').textContent = analysis.successRate;
    document.querySelector('.amount-value').textContent = 
        `${Math.floor(analysis.totalAmount / 10000).toLocaleString()}만 원`;
    
    // 지원사업 목록 업데이트
    const fundingList = document.querySelector('.funding-list');
    fundingList.innerHTML = '';
    
    analysis.fundingList.forEach((fund, index) => {
        const fundingItem = document.createElement('div');
        fundingItem.className = 'funding-item';
        fundingItem.innerHTML = `
            <div class="funding-icon ${index === 0 ? 'primary' : 'secondary'}">
                <img src="images/ri_building-fill.png" alt="Icon" style="width: 30px; height: 30px;">
            </div>
            <div class="funding-details">
                <div class="funding-title">${fund.name}</div>
            </div>
            <div class="funding-amount">${fund.amount.toLocaleString()}원</div>
        `;
        fundingList.appendChild(fundingItem);
    });
}

// 진행률 관련 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // 만약 현재 페이지에 사업 아이디어 입력 필드가 있다면(즉, business-idea 페이지라면) 글로벌 이벤트 리스너를 등록하지 않음
    if (!document.querySelector('.input-field')) {
        const nextButtons = document.querySelectorAll('.action-button');
        nextButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                storeFormData();
            });
        });
    }

    const progressCircle = document.querySelector('.progress-circle');
    const percentageElement = document.querySelector('.progress-percentage span');
    
    if (percentageElement && progressCircle) {
        const targetPercentage = parseInt(percentageElement.textContent, 10);
        const duration = 1000;
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
    }
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