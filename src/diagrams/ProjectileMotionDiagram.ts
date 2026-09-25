import type { DiagramObjectData } from '../types/canvas';

export function createProjectileMotionDiagram(
  x: number = 180,
  y: number = 100,
  isDark: boolean = false
): DiagramObjectData {
  const blue = isDark ? '#60A5FA' : '#2563EB';
  const orange = isDark ? '#FB923C' : '#EA580C';
  const yellow = isDark ? '#FDE047' : '#CA8A04';
  const red = isDark ? '#F87171' : '#DC2626';
  const green = isDark ? '#4ADE80' : '#16A34A';
  const purple = isDark ? '#C084FC' : '#9333EA';
  const axisColor = isDark ? '#CBD5E1' : '#334155';

  return {
    id: `diagram-projectile-${Date.now()}`,
    type: 'diagram',
    subject: 'Projectile Motion & Kinematics',
    title: 'Kinematics of 2D Projectile Motion under Uniform Gravity',
    subtitle: 'Detailed Physics Vector & Trajectory Educational Diagram',
    x,
    y,
    width: 960,
    height: 680,
    zIndex: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    style: 'hand_drawn_scientific',
    components: [
      // 1. Ground & Axes
      {
        id: 'axes-ground',
        name: 'Coordinate Axes (X-Range, Y-Height)',
        type: 'axis',
        path: 'M 100,480 L 820,480 M 120,500 L 120,120',
        fill: 'none',
        stroke: axisColor,
        strokeWidth: 2.5,
      },
      // Axis Arrowheads
      {
        id: 'axis-arrows',
        name: 'Axis Arrowheads',
        type: 'axis',
        path: 'M 810,475 L 825,480 L 810,485 M 115,130 L 120,115 L 125,130',
        fill: 'none',
        stroke: axisColor,
        strokeWidth: 2.5,
      },
      // 2. Parabolic Trajectory (Smooth Quadratic Bezier)
      {
        id: 'trajectory-curve',
        name: 'Parabolic Trajectory Path y(x)',
        type: 'curve',
        path: 'M 120,480 Q 430,60 740,480',
        fill: 'none',
        stroke: orange,
        strokeWidth: 4.0,
      },
      // 3. Peak Maximum Height indicator (Dotted drop line)
      {
        id: 'max-height-line',
        name: 'Maximum Height H',
        type: 'dimension',
        path: 'M 430,270 L 430,480 M 420,270 L 440,270',
        fill: 'none',
        stroke: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
        strokeWidth: 2.0,
      },
      // 4. Launch Angle θ Arc
      {
        id: 'launch-angle-arc',
        name: 'Launch Angle θ',
        type: 'angle',
        path: 'M 190,480 A 70 70 0 0 0 175,430',
        fill: 'none',
        stroke: yellow,
        strokeWidth: 2.5,
      },
      // 5. Launch Velocity Vector v0
      {
        id: 'launch-v0-vector',
        name: 'Initial Velocity Vector v₀',
        type: 'vector',
        path: 'M 120,480 L 240,320 M 225,325 L 240,320 L 235,335',
        fill: 'none',
        stroke: blue,
        strokeWidth: 3.5,
      },
      // 5b. Horizontal component v0x
      {
        id: 'launch-v0x-vector',
        name: 'Horizontal Component v₀ₓ = v₀ cos θ',
        type: 'vector',
        path: 'M 120,480 L 240,480 M 230,475 L 240,480 L 230,485',
        fill: 'none',
        stroke: green,
        strokeWidth: 2.5,
      },
      // 5c. Vertical component v0y
      {
        id: 'launch-v0y-vector',
        name: 'Vertical Component v₀ᵧ = v₀ sin θ',
        type: 'vector',
        path: 'M 240,480 L 240,320 M 235,330 L 240,320 L 245,330',
        fill: 'none',
        stroke: red,
        strokeWidth: 2.5,
      },
      // 6. Apex Velocity Vector (v_y = 0, purely horizontal vx)
      {
        id: 'apex-velocity',
        name: 'Velocity at Peak (vy = 0, vx = v0 cos θ)',
        type: 'vector',
        path: 'M 430,270 L 510,270 M 500,265 L 510,270 L 500,275',
        fill: 'none',
        stroke: blue,
        strokeWidth: 3.0,
      },
      // 7. Gravity Vector g downwards
      {
        id: 'gravity-vector',
        name: 'Acceleration due to Gravity g',
        type: 'vector',
        path: 'M 540,160 L 540,220 M 535,210 L 540,220 L 545,210',
        fill: 'none',
        stroke: red,
        strokeWidth: 3.0,
      },
      // 8. Impact / Landing Velocity Vector
      {
        id: 'impact-velocity',
        name: 'Landing Velocity v',
        type: 'vector',
        path: 'M 740,480 L 830,590 M 825,575 L 830,590 L 815,585',
        fill: 'none',
        stroke: blue,
        strokeWidth: 3.0,
      },
      // 9. Range Bracket on Ground
      {
        id: 'range-bracket',
        name: 'Horizontal Range R',
        type: 'dimension',
        path: 'M 120,510 L 740,510 M 120,500 L 120,520 M 740,500 L 740,520',
        fill: 'none',
        stroke: purple,
        strokeWidth: 2.0,
      },
    ],
    labels: [
      {
        id: 'lbl-v0',
        targetPoint: { x: 190, y: 390 },
        labelPoint: { x: 120, y: 310 },
        text: 'Initial Velocity Vector v₀',
        description: 'Launch speed at angle θ above horizontal ground',
        side: 'top',
        color: blue,
        isKeyFact: true,
      },
      {
        id: 'lbl-v0x',
        targetPoint: { x: 180, y: 480 },
        labelPoint: { x: 170, y: 550 },
        text: 'v₀ₓ = v₀ cos θ (Constant)',
        description: 'No horizontal acceleration (aₓ = 0)',
        side: 'bottom',
        color: green,
      },
      {
        id: 'lbl-v0y',
        targetPoint: { x: 240, y: 400 },
        labelPoint: { x: 270, y: 390 },
        text: 'v₀ᵧ = v₀ sin θ',
        description: 'Undergoes deceleration: vᵧ(t) = v₀ᵧ - gt',
        side: 'right',
        color: red,
      },
      {
        id: 'lbl-peak',
        targetPoint: { x: 430, y: 270 },
        labelPoint: { x: 430, y: 160 },
        text: 'Apex: Max Height (H)',
        description: 'Vertical velocity vᵧ = 0, purely horizontal v = v₀ₓ',
        side: 'top',
        color: orange,
        isKeyFact: true,
      },
      {
        id: 'lbl-gravity',
        targetPoint: { x: 540, y: 190 },
        labelPoint: { x: 610, y: 180 },
        text: 'g = 9.8 m/s² (Downwards)',
        description: 'Uniform downward acceleration aᵧ = -g',
        side: 'right',
        color: red,
      },
      {
        id: 'lbl-range',
        targetPoint: { x: 430, y: 510 },
        labelPoint: { x: 430, y: 560 },
        text: 'Horizontal Range: R = (v₀² sin 2θ) / g',
        description: 'Maximum range achieved at launch angle θ = 45°',
        side: 'bottom',
        color: purple,
        isKeyFact: true,
      },
      {
        id: 'lbl-landing',
        targetPoint: { x: 740, y: 480 },
        labelPoint: { x: 750, y: 430 },
        text: 'Landing Point (x=R, y=0)',
        description: 'Impact speed equals launch speed v = v₀ (by energy conservation)',
        side: 'top',
        color: blue,
      },
    ],
    arrows: [
      {
        id: 'arrow-traj-dir',
        points: [{ x: 300, y: 350 }, { x: 340, y: 310 }],
        color: orange,
        label: 'Motion Trajectory',
        type: 'velocity',
      },
    ],
    callouts: [
      {
        id: 'callout-eqns',
        x: 40,
        y: 590,
        title: '📐 Fundamental Kinematic Equations',
        content: '• Time of Flight: T = (2 v₀ sin θ) / g\n• Maximum Height: H = (v₀² sin² θ) / (2g)\n• Horizontal Range: R = (v₀² sin 2θ) / g\n• Trajectory Parabola: y(x) = x tan θ - [g x² / (2 v₀² cos² θ)]',
        type: 'formula',
      },
      {
        id: 'callout-physics-insights',
        x: 520,
        y: 590,
        title: '💡 Key Physics Insights',
        content: '• Independence of Motion: Horizontal and vertical motions are 100% independent\n• Symmetry: Time to peak = Time from peak to ground = T / 2\n• Complementary Angles: Angles θ and (90° - θ) achieve the exact same Range R',
        type: 'fact',
      },
    ],
    legend: [
      { label: 'Initial Velocity Vector v₀', color: blue },
      { label: 'Parabolic Trajectory Path', color: orange },
      { label: 'Horizontal Component vₓ (Constant)', color: green },
      { label: 'Vertical Component vᵧ (Decelerating)', color: red },
    ],
  };
}
