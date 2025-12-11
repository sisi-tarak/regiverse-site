import { Link } from 'react-router-dom';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
        <svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:scale-105"
        >
          <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
          <path
            d="M16 8L9 13V22C9 22.5304 9.21071 23.0391 9.58579 23.4142C9.96086 23.7893 10.4696 24 11 24H21C21.5304 24 22.0391 23.7893 22.4142 23.4142C22.7893 23.0391 23 22.5304 23 22V13L16 8Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 24V16H19V24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-2xl font-bold text-foreground">Regiverse</span>
      </Link>
      <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
      <p className="text-muted-foreground">
        Sign in to access your event management dashboard
      </p>
    </div>
  );
};

export default LoginHeader;