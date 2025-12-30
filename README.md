# Physics Animation App

A React Native app built with Expo that demonstrates projectile motion animations on mobile devices.

## Features

- Input parameters for projectile motion: initial velocity, launch angle, and incline angle.
- Real-time animation of the projectile following a parabolic trajectory.
- Collision detection with an inclined plane.
- Smooth animations using react-native-reanimated and graphics with react-native-svg.

## Installation

1. Ensure Node.js is installed on your system.
2. Install Expo CLI globally: `npm install -g @expo/cli`
3. Clone or download the project.
4. Navigate to the project directory and install dependencies: `npm install`

## Running the App

1. Start the Expo development server: `npx expo start`
2. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator/simulator.

## Usage

- Enter the initial velocity in m/s.
- Enter the launch angle in degrees.
- Enter the incline angle in degrees.
- Press "Start Animation" to view the projectile motion.

## Physics

The app uses the following physics equations:
- Horizontal displacement: x = v₀ cos(θ) t
- Vertical displacement: y = v₀ sin(θ) t - ½ g t²
- Collision time calculated using quadratic formula for intersection with the incline.

Assumes g = 9.8 m/s².