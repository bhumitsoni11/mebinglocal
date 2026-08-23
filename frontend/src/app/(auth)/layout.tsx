import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FCFAF5]">
      {/* Left side: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10 shadow-[4px_0_24px_rgba(26,59,43,0.05)]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A3B2B] font-serif">
              MebingLocal
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back. Plan your next slow travel experience.
            </p>
          </div>
          
          {children}
        </div>
      </div>

      {/* Right side: Immersive Area with Video */}
      <div className="relative hidden w-0 flex-1 lg:block bg-[#1A3B2B]">
        {/* Background Video */}
        <video
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          autoPlay
          loop
          muted
          playsInline
        >
          {/* High quality nature/travel stock video from Pixabay */}
          <source src="https://cdn.pixabay.com/video/2020/07/22/45366-443229672_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3B2B]/90 via-[#1A3B2B]/30 to-transparent z-10" />
        
        {/* Quote Content aligned to bottom left like the Stitch design */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 lg:p-24 pb-20">
          <div className="max-w-2xl text-white">
            <blockquote className="mb-6">
              <p className="text-4xl lg:text-5xl font-bold leading-tight mb-4 font-serif drop-shadow-md">
                "The world is a book and those who do not travel read only one page."
              </p>
            </blockquote>
            <div className="flex items-center space-x-4">
              <div className="h-[1px] w-12 bg-white/70"></div>
              <p className="text-sm font-medium text-white/90 uppercase tracking-wider">Saint Augustine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
