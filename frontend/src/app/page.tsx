import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 animate-fade-in flex-grow flex items-center justify-center py-12 md:py-24">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">
        
        {/* Text Content */}
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
            <i className="fa-solid fa-microchip"></i> AI Powered Agriculture
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#1B5E20] leading-tight">
            AgroVision AI<br/>
            <span className="text-gray-500 text-3xl md:text-4xl">Deteksi Penyakit Tanaman Berbasis Deep Learning</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl leading-relaxed">
            Upload gambar daun tanaman dan biarkan AI kami menganalisis penyakit secara otomatis menggunakan teknologi Convolutional Neural Network (CNN) terkini. Dapatkan hasil instan dan solusi penanganan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="btn-primary-custom text-center text-lg">
              Mulai Deteksi <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
            <Link href="#features" className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold rounded-lg px-6 py-3 text-center transition-colors">
              Pelajari Lebih Lanjut
            </Link>
          </div>
          
          <div className="mt-10 flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
              <span className="font-medium">Akurasi Tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bolt text-green-600 text-xl"></i>
              <span className="font-medium">Real-time Analysis</span>
            </div>
          </div>
        </div>

        {/* Image Content */}
        <div className="lg:w-1/2 relative flex justify-center">
          {/* Abstract blobs */}
          <div className="absolute top-[-50px] right-[-20px] w-72 h-72 bg-green-300/40 blur-[60px] rounded-full -z-10"></div>
          <div className="absolute bottom-[-50px] left-[-20px] w-64 h-64 bg-green-700/20 blur-[50px] rounded-full -z-10"></div>
          
          <div className="glass-card text-center p-10 max-w-md w-full relative">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2913/2913604.png" 
              alt="Smart Farming AI" 
              className="w-full max-h-[350px] object-contain animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
