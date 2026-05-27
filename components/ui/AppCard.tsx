import React from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const AppCard: React.FC<Props> = ({ children, className = '', ...rest }) => {
  return (
    <View
      className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
};
