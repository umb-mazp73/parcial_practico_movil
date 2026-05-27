import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<Props> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width as number,
        height,
        borderRadius,
        backgroundColor: '#e5e7eb',
        opacity,
      }}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
    <SkeletonLoader height={16} width="60%" borderRadius={6} />
    <View className="h-2" />
    <SkeletonLoader height={12} width="40%" borderRadius={6} />
    <View className="h-3" />
    <SkeletonLoader height={12} width="80%" borderRadius={6} />
  </View>
);
