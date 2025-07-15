# Pathfinder AI – A* Visualizer

A modern, interactive web application that visualizes the A* pathfinding algorithm in real-time. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Interactive Grid**: Click and drag to create walls, move start and end nodes
- **Algorithm Visualization**: Watch A* and Dijkstra algorithms explore the grid in real-time
- **Multiple Algorithms**: Switch between A* and Dijkstra's algorithm
- **Customizable Speed**: Adjust animation speed (Slow, Normal, Fast)
- **Responsive Grid Sizes**: Choose from Small, Medium, or Large grid sizes
- **Smooth Animations**: Beautiful CSS animations for visited nodes and path discovery
- **Educational**: Hover over nodes to see g, h, and f scores
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🎯 How It Works

### A* Algorithm
The A* algorithm uses a heuristic function (Manhattan distance) to intelligently search for the shortest path. It combines:
- **g score**: Distance from start node
- **h score**: Heuristic estimate to goal (Manhattan distance)
- **f score**: g + h (total estimated cost)

### Dijkstra's Algorithm
Dijkstra's algorithm guarantees the shortest path by exploring all possibilities without using heuristics.

## 🛠️ Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications
- **Custom A* Implementation** (no external pathfinding libraries)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/astar-visualizer.git
cd astar-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## 🎮 Usage

1. **Create Walls**: Click on empty cells to create walls
2. **Move Start/End**: Drag the start (🚀) or end (🎯) nodes to new positions
3. **Select Algorithm**: Choose between A* or Dijkstra
4. **Adjust Settings**: Change speed and grid size as needed
5. **Visualize**: Click "Visualize" to watch the algorithm in action
6. **Clear Path**: Remove only the visited nodes and path
7. **Reset Grid**: Clear everything and start fresh

## 📁 Project Structure

```
src/
├── components/
│   ├── Node.tsx              # Individual grid cell component
│   ├── ControlPanel.tsx      # Main control buttons and settings
│   ├── Legend.tsx            # Color legend for different node types
│   └── Instructions.tsx      # Usage instructions
├── algorithms/
│   └── aStar.ts             # A* and Dijkstra implementations
├── utils/
│   └── gridUtils.ts         # Grid manipulation utilities
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main application component
├── index.tsx                # Application entry point
└── index.css                # Global styles and Tailwind imports
```

---

**Built with ❤️ for educational purposes**
