const Logo = ({ size = 160, className = '' }) => {
  return (
    <img 
      src="/images/logo-metocast.png" 
      alt="MetoCast Logo"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        borderRadius: '50%',
      }}
      className={className}
    />
  );
};

export default Logo;
