// loading.js - businessIdea 필수 해제

document.addEventListener('DOMContentLoaded', function() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    // 데이터 존재 여부 확인 - startupStatus만 필수로 체크
    const formData = getUserData("bizdraft_form_data");
    console.log("Loading page - Form data:", formData);
    
    if (!formData || !formData.startupStatus) {
        console.error("Required data missing, redirecting to start page");
        alert("창업 여부 정보가 없습니다. 처음부터 다시 시작합니다.");
        window.location.href = "startup-status.html";
        return;
    }
    
    // 프로그레스 바 애니메이션
    let progress = 0;
    progressFill.style.width = "0%";
    
    const updateProgress = setInterval(function() {
        progress += 5;
        progressFill.style.width = `${progress}%`;
        
        if (progress <= 90) {
            progressText.innerHTML = `아직 분석 중이에요...<br>${progress}% 진행 중`;
        } else {
            clearInterval(updateProgress);
            progressText.innerHTML = `분석 완료!<br>곧 결과 페이지로 이동합니다`;
        }
    }, 150);
    
    // 3초 후 결과 페이지로 자동 이동
    setTimeout(function() {
        console.log("Redirecting to results with data:", formData);
        window.location.href = "results.html";
    }, 3000);
});