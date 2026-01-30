export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#3593A6]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-[#3593A6] rounded-full animate-spin"></div>
                </div>

                {/* Text */}
                <p className="text-xl font-bold text-[#3593A6] tracking-wide">Hold on</p>
            </div>
        </div>
    );
}
