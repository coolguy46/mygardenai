"use client"

export default function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                {/* Left side - Garden View (placeholder) */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">My Garden</h2>
                    <p className="text-gray-500">Your plants will appear here</p>
                </div>

                {/* Right side - Upload Area */}
                <div className="w-80 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Identify Plant</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500 mb-2">Drop an image here or</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Select File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}