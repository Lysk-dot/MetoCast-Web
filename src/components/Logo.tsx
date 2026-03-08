import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-[#1B4B8A] flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo-metocast.png"
        alt="MetôCast Logo"
        width={size}
        height={size}
        className="object-cover"
        priority
      />
    </div>
  );
}
