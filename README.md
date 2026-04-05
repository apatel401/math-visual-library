# @stem_dev/math-visual-library

An interactive, highly customizable React library for mathematical visualizations. Built with a "Hardware Specialist" aesthetic, featuring smooth animations and real-time interactive controls.

[View on GitHub](https://github.com/apatel401/math-visual-library)

## 🚀 Features

- **Compound Component Architecture**: Highly modular and flexible layout.
- **Advanced Quadratic Visuals**: Real-time parabola updates with vertex tracking, discriminant analysis, and root labeling.
- **Customizable Themes**: Dynamic `colorTheme` prop to match your application's branding.
- **Smooth Animations**: Powered by `motion` (framer-motion) for snappier, responsive geometric updates.
- **Integrated UI**: Collapsible sidebar with synchronized layout shifts and top-right theory toggles.
- **Technical Aesthetic**: Clean, grid-based design with monospace typography.

## 📦 Installation

```bash
npm install @stem_dev/math-visual-library
```

## 🛠 Usage

### Pythagoras Theorem Visualizer

```tsx
import { MathLibrary, Pythagoras } from '@stem_dev/math-visual-library';

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
import { MathLibrary, UnitCircle } from '@stem_dev/math-visual-library';

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
import { MathLibrary, Quadratic } from '@stem_dev/math-visual-library';

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
import { MathLibrary, Calculus } from '@stem_dev/math-visual-library';

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
import { MathLibrary, NormalDistribution } from '@stem_dev/math-visual-library';

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
import { MathLibrary, Sierpinski } from '@stem_dev/math-visual-library';

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
import { MathLibrary, Projectile } from '@stem_dev/math-visual-library';

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
import { MathLibrary, PiVisualization } from '@stem_dev/math-visual-library';

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

## 🏗 Build & Development

The project uses a multi-target build system:

- **ESM/CJS Build**: Main library files located in `/dist`.
- **UMD Build**: Universal module definition in `/dist/build/` (excluded from npm package).
- **Demo Site**: A full React demo application built into the `/public` folder.

### Build Commands

```bash
# Build everything (Lib, UMD, and Demo)
npm run build

# Build only the library (ESM/CJS)
npm run build:lib

# Build only the UMD version
npm run build:umd

# Build the demo site
npm run build:demo
```

## 🚀 Publishing to npm

To publish this scoped package to npm, ensure you are logged in and use the `--access public` flag (or ensure `publishConfig` is set in `package.json`):

```bash
# Ensure you are logged in
npm login

# Build the library
npm run build

# Publish as a public scoped package
npm publish --access public
```

### ❓ Troubleshooting: "Scope not found"
If you get an error like `404 Not Found - Scope not found`, it means the `@stem_dev` organization does not exist on npm or you aren't a member. 

**To fix this:**
1. Run `npm whoami` to get your username.
2. Change the name in `package.json` from `@stem_dev/math-visual-library` to `@your-username/math-visual-library`.
3. Run `npm publish --access public` again.

## 🎨 Customization

The `MathLibrary.Root` component accepts a `colorTheme` prop (hex string) which propagates throughout all child components (sliders, SVG strokes, icons, etc.).

---

Built with ❤️ for Math Education.
