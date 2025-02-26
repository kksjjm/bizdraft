// 로딩 화면 관리 스크립트

// 결과 페이지로 자동 이동
document.addEventListener('DOMContentLoaded', function() {
    // 프로그레스 바 애니메이션 후 결과 페이지로 이동
    const progressFill = document.querySelector('.progress-fill');
    
    // 3초 후 결과 페이지로 자동 이동
    setTimeout(function() {
        window.location.href = "results.html";
    }, 3000);
    
    // 진행률 텍스트 업데이트 (모션 효과)
    let progress = 0;
    const progressText = document.querySelector('.progress-text');
    
    const updateProgress = setInterval(function() {
        progress += 5;
        if (progress <= 90) {
            progressText.innerHTML = `아직 분석 중이에요...<br>${progress}% 진행 중`;
        } else {
            clearInterval(updateProgress);
        }
    }, 150);
});