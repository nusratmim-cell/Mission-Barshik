import Image from 'next/image';

export const PartnerLogos = () => {
  return (
    <div className="flex justify-center items-center gap-4 mb-4">
      <div className="flex items-center justify-center w-[120px]">
        <Image
          src="/shikho-logo.svg"
          alt="Shikho Logo"
          width={120}
          height={60}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};