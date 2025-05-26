import React from 'react';
import { cn } from '@/lib/utils';

interface IIcon {
  className?: string;
}

const Icon: React.FC<{
  icon: React.ElementType<IIcon>;
  className?: string;
}> = ({ icon: IconComponent, className }) => {
  
  return <IconComponent className={cn("text-nobleBlack-400", className)}/>;
};

export default Icon;
export type { IIcon };

