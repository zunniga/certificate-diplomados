import React, { ReactNode } from 'react';

interface SecondaryLayoutProps {
  children: ReactNode;
}

const SecondaryLayout: React.FC<SecondaryLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
}

export default SecondaryLayout;
