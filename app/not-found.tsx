import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
                <Link
                    href="/"
                    className="inline-block bg-[#e91e63] text-white px-6 py-3 rounded-lg hover:bg-[#c2185b] transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    )
}