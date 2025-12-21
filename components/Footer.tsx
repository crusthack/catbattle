export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      {/*
        bg-gray-50: 배경 연한 회색
        border-t: 상단 테두리
        mt-auto: 상단 여백 자동 (하단에 붙음)
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*
          max-w-7xl: 최대 너비 1280px
          mx-auto: 가로 중앙 정렬
          px-4: 좌우 여백
          py-8: 상하 여백 2rem
        */}
        <p className="text-center text-gray-600 text-sm">
          {/*
            text-center: 텍스트 중앙 정렬
            text-gray-600: 텍스트 중간 회색
            text-sm: 작은 텍스트
          */}
          © 부산대학교 2025 웹응용프로그래밍 개인 프로젝트 페이지입니다.
        </p>
      </div>
    </footer>
  );
}