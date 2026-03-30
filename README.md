# @math-visual-library

An interactive, highly customizable React library for mathematical visualizations. Built with a "Hardware Specialist" aesthetic, featuring smooth animations and real-time interactive controls.

## 🚀 Features

- **Compound Component Architecture**: Highly modular and flexible layout.
- **Customizable Themes**: Dynamic `colorTheme` prop to match your application's branding.
- **Smooth Animations**: Powered by `motion` (framer-motion) for snappier, responsive geometric updates.
- **Technical Aesthetic**: Clean, grid-based design with monospace typography.

## 📦 Installation

```bash
npm install @math-visual-library
```

## 🛠 Usage

### Pythagoras Theorem Visualizer

```tsx
import { MathLibrary, Pythagoras } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#2563eb">
      <Pythagoras.Provider>
        <MathLibrary.Sidebar>
          <Pythagoras.Header />
          <Pythagoras.Controls />
          <Pythagoras.MathBreakdown />
        </MathLibrary.Sidebar>

        <MathLibrary.Display>
          <Pythagoras.Diagram />
          <Pythagoras.PrecisionMonitor />
        </MathLibrary.Display>
      </Pythagoras.Provider>
    </MathLibrary.Root>
  );
}
```

### Unit Circle Visualizer

```tsx
import { MathLibrary, UnitCircle } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#f59e0b">
      <UnitCircle.Provider>
        <MathLibrary.Sidebar>
          <UnitCircle.Header />
          <UnitCircle.Controls />
          <UnitCircle.MathBreakdown />
        </MathLibrary.Sidebar>

        <MathLibrary.Display>
          <UnitCircle.Diagram />
          <UnitCircle.PrecisionMonitor />
        </MathLibrary.Display>
      </UnitCircle.Provider>
    </MathLibrary.Root>
  );
}
```

### Quadratic Equations
Understand how coefficients change the shape of a parabola ($y = ax^2 + bx + c$).

```tsx
import { MathLibrary, Quadratic } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#10b981">
      <Quadratic.Provider>
        <MathLibrary.Sidebar>
          <Quadratic.Header />
          <Quadratic.Controls />
          <Quadratic.MathBreakdown />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <Quadratic.Diagram />
          <Quadratic.PrecisionMonitor />
        </MathLibrary.Display>
      </Quadratic.Provider>
    </MathLibrary.Root>
  );
}
```

### Calculus: The Derivative
Visualize the slope of a tangent line at any point on a curve.

```tsx
import { MathLibrary, Calculus } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#8b5cf6">
      <Calculus.Provider>
        <MathLibrary.Sidebar>
          <Calculus.Header />
          <Calculus.Controls />
          <Calculus.MathBreakdown />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <Calculus.Diagram />
          <Calculus.PrecisionMonitor />
        </MathLibrary.Display>
      </Calculus.Provider>
    </MathLibrary.Root>
  );
}
```

### Statistics: Normal Distribution
Understand Mean and Standard Deviation through the Bell Curve.

```tsx
import { MathLibrary, NormalDistribution } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#f43f5e">
      <NormalDistribution.Provider>
        <MathLibrary.Sidebar>
          <NormalDistribution.Header />
          <NormalDistribution.Controls />
          <NormalDistribution.MathBreakdown />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <NormalDistribution.Diagram />
          <NormalDistribution.PrecisionMonitor />
        </MathLibrary.Display>
      </NormalDistribution.Provider>
    </MathLibrary.Root>
  );
}
```

### Fractals: The Sierpinski Triangle
Explore recursion and self-similarity in fractal geometry.

```tsx
import { MathLibrary, Sierpinski } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#06b6d4">
      <Sierpinski.Provider>
        <MathLibrary.Sidebar>
          <Sierpinski.Header />
          <Sierpinski.Controls />
          <Sierpinski.MathBreakdown />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <Sierpinski.Diagram />
          <Sierpinski.PrecisionMonitor />
        </MathLibrary.Display>
      </Sierpinski.Provider>
    </MathLibrary.Root>
  );
}
```

### Physics: Projectile Motion
Simulate parabolic trajectories with gravity and velocity.

```tsx
import { MathLibrary, Projectile } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#f97316">
      <Projectile.Provider>
        <MathLibrary.Sidebar>
          <Projectile.Header />
          <Projectile.Controls />
          <Projectile.MathBreakdown />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <Projectile.Diagram />
          <Projectile.PrecisionMonitor />
        </MathLibrary.Display>
      </Projectile.Provider>
    </MathLibrary.Root>
  );
}
```

### Circle Geometry: Pi Visualization
Watch a circle unroll to see the relationship between C and d.

```tsx
import { MathLibrary, PiVisualization } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="#6366f1">
      <PiVisualization.Provider>
        <MathLibrary.Sidebar>
          <PiVisualization.Header />
          <PiVisualization.Controls />
          <PiVisualization.MathBreakdown />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <PiVisualization.Diagram />
          <PiVisualization.PrecisionMonitor />
        </MathLibrary.Display>
      </PiVisualization.Provider>
    </MathLibrary.Root>
  );
}
```

## 📂 Project Structure

- `src/components/common/`: Shared layout components (`Root`, `Sidebar`, `Display`).
- `src/concepts/`: Individual math concepts (e.g., `pythagoras/`).
- `src/lib/`: Library entry point and exports.

## 🎨 Customization

The `MathLibrary.Root` component accepts a `colorTheme` prop (hex string) which propagates throughout all child components (sliders, SVG strokes, icons, etc.).

---

Built with ❤️ for Math Education.
