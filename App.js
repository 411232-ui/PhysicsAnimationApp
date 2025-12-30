import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Svg, Path, Line, Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const g = 9.8;
const h = 100; // height of launch point from bottom

export default function App() {
  const [velocity, setVelocity] = useState('10');
  const [angle, setAngle] = useState('45');
  const [inclineAngle, setInclineAngle] = useState('30');
  const [animating, setAnimating] = useState(false);

  const progress = useSharedValue(0);
  const ballX = useSharedValue(0);
  const ballY = useSharedValue(screenHeight - h);

  const calculateCollisionTime = (v0, theta, phi) => {
    const thetaRad = (theta * Math.PI) / 180;
    const phiRad = (phi * Math.PI) / 180;
    const cosTheta = Math.cos(thetaRad);
    const sinTheta = Math.sin(thetaRad);
    const tanPhi = Math.tan(phiRad);

    // Quadratic: 0.5 g t^2 - v0 (sin theta + cos theta tan phi) t = 0
    const a = 0.5 * g;
    const b = -v0 * (sinTheta + cosTheta * tanPhi);
    const c = 0;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return null; // no collision
    const t = (-b - Math.sqrt(discriminant)) / (2 * a); // take the smaller positive root
    return t > 0 ? t : null;
  };

  const startAnimation = () => {
    const v0 = parseFloat(velocity);
    const theta = parseFloat(angle);
    const phi = parseFloat(inclineAngle);
    if (isNaN(v0) || isNaN(theta) || isNaN(phi)) return;

    const tCollision = calculateCollisionTime(v0, theta, phi);
    if (!tCollision) return;

    setAnimating(true);
    progress.value = 0;
    ballX.value = 0;
    ballY.value = screenHeight - h;

    progress.value = withTiming(1, { duration: tCollision * 1000 }, () => {
      runOnJS(setAnimating)(false);
    });
  };

  const animatedBallStyle = useAnimatedStyle(() => {
    const v0 = parseFloat(velocity);
    const theta = parseFloat(angle);
    const phi = parseFloat(inclineAngle);
    const thetaRad = (theta * Math.PI) / 180;
    const phiRad = (phi * Math.PI) / 180;
    const t = progress.value * calculateCollisionTime(v0, theta, phi);

    const x = v0 * Math.cos(thetaRad) * t;
    const yPhys = v0 * Math.sin(thetaRad) * t - 0.5 * g * t * t;
    const yScreen = screenHeight - h - yPhys;

    ballX.value = x;
    ballY.value = yScreen;

    return {
      transform: [{ translateX: x }, { translateY: yScreen - (screenHeight - h) }],
    };
  });

  const generateTrajectoryPath = () => {
    const v0 = parseFloat(velocity);
    const theta = parseFloat(angle);
    const phi = parseFloat(inclineAngle);
    if (isNaN(v0) || isNaN(theta) || isNaN(phi)) return '';

    const tCollision = calculateCollisionTime(v0, theta, phi);
    if (!tCollision) return '';

    const thetaRad = (theta * Math.PI) / 180;
    let path = `M 0 ${screenHeight - h}`;
    for (let t = 0; t <= tCollision; t += 0.01) {
      const x = v0 * Math.cos(thetaRad) * t;
      const yPhys = v0 * Math.sin(thetaRad) * t - 0.5 * g * t * t;
      const yScreen = screenHeight - h - yPhys;
      path += ` L ${x} ${yScreen}`;
    }
    return path;
  };

  const inclineYStart = screenHeight - h;
  const inclineYEnd = screenHeight - h - screenWidth * Math.tan((parseFloat(inclineAngle) * Math.PI) / 180);

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <Text>Initial Velocity (m/s):</Text>
        <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="numeric" />
        <Text>Launch Angle (degrees):</Text>
        <TextInput style={styles.input} value={angle} onChangeText={setAngle} keyboardType="numeric" />
        <Text>Incline Angle (degrees):</Text>
        <TextInput style={styles.input} value={inclineAngle} onChangeText={setInclineAngle} keyboardType="numeric" />
        <Button title="Start Animation" onPress={startAnimation} disabled={animating} />
      </View>
      <Svg width={screenWidth} height={screenHeight} style={styles.svg}>
        <Path d={generateTrajectoryPath()} stroke="blue" strokeWidth="2" fill="none" />
        <Line x1="0" y1={inclineYStart} x2={screenWidth} y2={inclineYEnd} stroke="green" strokeWidth="3" />
        <Animated.View style={[styles.ball, animatedBallStyle]}>
          <Circle cx="0" cy="0" r="10" fill="red" />
        </Animated.View>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputs: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
  svg: {
    flex: 1,
  },
  ball: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
});
