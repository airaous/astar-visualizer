# 🚀 Pathfinder AI – A* Visualizer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-00C7B7?style=for-the-badge&logo=vercel)](https://astar-visualizer-phi.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An advanced, interactive web application that visualizes multiple pathfinding algorithms in real-time. Built with modern React, TypeScript, and enhanced with real-world mapping capabilities. Experience intelligent search algorithms finding optimal paths through interactive grids and real geographic locations.

**🌐 [Live Demo](https://astar-visualizer-phi.vercel.app/)**

---

## 👥 Development Team

This project was collaboratively developed by:

### **Ayra** 
- **GitHub**: [@airaous](https://github.com/airaous)
- **LinkedIn**: [linkedin.com/in/ayraious](https://linkedin.com/in/ayraious)
- **Email**: [ayrawrk@gmail.com](mailto:ayrawrk@gmail.com)

### **Erebus (Kshitiz)**
- **GitHub**: [@Erebuzzz](https://github.com/Erebuzzz)
- **LinkedIn**: [linkedin.com/in/kksinha23](https://linkedin.com/in/kksinha23)
- **Email**: [kshitiz23kumar@gmail.com](mailto:kshitiz23kumar@gmail.com)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🧠 What This Project Does](#-what-this-project-does)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 Quick Start](#-quick-start)
- [🎮 How to Use](#-how-to-use)
- [🔍 Algorithm Deep Dive](#-algorithm-deep-dive)
- [📁 Project Structure](#-project-structure)
- [⚙️ Function Documentation](#️-function-documentation)
- [🔮 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 **Core Pathfinding Capabilities**
- **Multiple Algorithms**: A*, Dijkstra's, Breadth-First Search (BFS), and Greedy Best-First Search
- **Real-time Visualization**: Watch algorithms explore the grid with smooth animations
- **Interactive Grid**: Click and drag to create walls, move start/end nodes dynamically
- **Algorithm Comparison**: Run all algorithms simultaneously and compare performance metrics

### 🌍 **Real-World Integration**
- **Map Integration**: Use real geographic coordinates with OpenStreetMap
- **Live Traffic Simulation**: Experience pathfinding on actual road networks
- **Geographic Pathfinding**: Convert real-world locations to grid coordinates

### 🎨 **User Experience**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Performance Analytics**: Real-time metrics showing nodes visited, execution time, and memory usage
- **Customizable Settings**: Adjustable animation speed and grid sizes
- **Educational Interface**: Hover to see g, h, and f scores for each node

### 🛠️ **Advanced Features**
- **Maze Generation**: Multiple maze patterns for algorithm testing
- **Performance Monitoring**: Detailed statistics and comparison charts
- **Smooth Animations**: CSS-powered transitions and visual feedback
- **Modern UI**: Clean, professional interface with Tailwind CSS

---

## 🧠 What This Project Does

**Pathfinder AI** is an educational and interactive tool that demonstrates how intelligent search algorithms work. It bridges the gap between theoretical computer science concepts and practical visual understanding.

### **Primary Purpose:**
1. **Educational Tool**: Help students and developers understand pathfinding algorithms visually
2. **Algorithm Comparison**: Compare different search strategies and their trade-offs
3. **Real-World Application**: Show how these algorithms apply to GPS navigation and robotics
4. **Performance Analysis**: Demonstrate computational complexity in action

### **Key Learning Outcomes:**
- Understanding of graph traversal algorithms
- Heuristic vs. non-heuristic search strategies
- Time and space complexity analysis
- Real-world application of computer science concepts

---

## 🛠️ Technologies Used

### **Frontend Core**
- **React 18** - Modern functional components with hooks
- **TypeScript** - Type-safe development and better code maintainability
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

### **Visualization & Mapping**
- **Leaflet** - Interactive maps for real-world pathfinding
- **OpenStreetMap** - Open-source mapping data
- **React Hot Toast** - Elegant notifications and user feedback

### **Algorithm Implementation**
- **Custom A* Implementation** - No external pathfinding libraries
- **Priority Queue** - Efficient node processing for optimal pathfinding
- **Manhattan Distance Heuristic** - Intelligent path estimation

### **Development Tools**
- **Create React App** - Streamlined development setup
- **PostCSS** - Enhanced CSS processing
- **Vercel** - Seamless deployment and hosting

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/airaous/astar-visualizer.git
   cd astar-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### **Building for Production**
```bash
npm run build
# or
yarn build
```

### **Deployment**
```bash
# Using Vercel CLI
npm install -g vercel
vercel --prod
```

---

## 🎮 How to Use

### **Basic Operations**

1. **🏁 Set Start and End Points**
   - Drag the green start node (🚀) to your desired starting position
   - Drag the red end node (🎯) to your target destination

2. **🧱 Create Obstacles**
   - Click on empty cells to create walls (obstacles)
   - Click and drag to create multiple walls quickly

3. **🔍 Choose Algorithm**
   - Select from A*, Dijkstra's, BFS, or Greedy Best-First
   - Each algorithm has different characteristics and performance

4. **⚡ Adjust Settings**
   - **Speed**: Control animation speed (1-20)
   - **Grid Size**: Choose Small (15x30), Medium (25x50), or Large (35x70)

5. **🎬 Visualize**
   - Click "Visualize" to watch the algorithm in action
   - Observe how different algorithms explore the space

6. **📊 Compare Performance**
   - Use "Run All Algorithms" to compare all four algorithms
   - View detailed performance metrics and statistics

### **Advanced Features**

#### **🌍 Real-World Mapping**
1. Click "📍 Select Map Locations" in the Map Integration panel
2. Choose start and end points on the real map
3. Activate Map Mode to convert coordinates to grid
4. Run pathfinding algorithms on real geographic data

#### **🏗️ Maze Generation**
1. Select a maze pattern (Recursive, Spiral, Random)
2. Generate complex obstacles for algorithm testing
3. Test how algorithms perform with different maze layouts

#### **📈 Performance Analysis**
- View nodes visited, execution time, and memory usage
- Compare algorithm efficiency across different scenarios
- Understand computational complexity in practice

---

## 🔍 Algorithm Deep Dive

### **🌟 A* (A-Star) Algorithm**
**Best for**: Optimal pathfinding with heuristic guidance

**How it works:**
- Uses both actual distance (g-score) and heuristic estimate (h-score)
- f-score = g-score + h-score guides the search
- Guarantees shortest path while being more efficient than Dijkstra's

**Complexity:**
- Time: O(b^d) where b = branching factor, d = depth
- Space: O(b^d)
- Optimal: ✅ Yes

### **🎯 Dijkstra's Algorithm**
**Best for**: Guaranteed shortest path without heuristics

**How it works:**
- Explores all nodes systematically by distance from start
- Always chooses the closest unvisited node
- Guarantees optimal solution but explores more nodes

**Complexity:**
- Time: O(V²) or O((V + E) log V) with priority queue
- Space: O(V)
- Optimal: ✅ Yes

### **🌊 Breadth-First Search (BFS)**
**Best for**: Unweighted graphs and shortest path in terms of number of edges

**How it works:**
- Explores all neighbors before moving to next level
- Uses queue (FIFO) for systematic exploration
- Finds shortest path in unweighted graphs

**Complexity:**
- Time: O(V + E)
- Space: O(V)
- Optimal: ✅ Yes (for unweighted graphs)

### **⚡ Greedy Best-First Search**
**Best for**: Fast pathfinding when optimality isn't required

**How it works:**
- Only uses heuristic (h-score) to guide search
- Always moves toward the goal
- Fast but not guaranteed to find optimal path

**Complexity:**
- Time: O(b^m) where m = maximum depth
- Space: O(b^m)
- Optimal: ❌ No

---

## 📁 Project Structure

```
src/
├── 📱 components/              # React UI Components
│   ├── Node.tsx               # Individual grid cell with hover effects
│   ├── ControlPanel.tsx       # Main control interface
│   ├── Legend.tsx             # Visual guide for node types
│   ├── Instructions.tsx       # User guidance and tips
│   ├── AlgorithmComparison.tsx # Algorithm analysis panel
│   ├── PerformanceStats.tsx   # Real-time performance metrics
│   ├── MazeGenerator.tsx      # Maze creation utilities
│   ├── MapIntegration.tsx     # Real-world mapping features
│   └── LiveMap.tsx            # Interactive map component
├── 🧠 algorithms/             # Pathfinding Implementations
│   ├── aStar.ts               # A* and Dijkstra algorithms
│   └── additionalAlgorithms.ts # BFS and Greedy algorithms
├── 🛠️ utils/                 # Utility Functions
│   ├── gridUtils.ts           # Grid manipulation and helpers
│   └── mapUtils.ts            # Geographic coordinate conversion
├── 📝 types/                  # TypeScript Definitions
│   └── index.ts               # Core type definitions
├── 🎨 styling/                # Styles and Animations
│   ├── index.css              # Global styles and animations
│   └── tailwind.config.js     # Tailwind configuration
├── 🚀 App.tsx                 # Main application component
└── 📍 index.tsx              # Application entry point
```

---

## ⚙️ Function Documentation

### **🧠 Core Algorithm Functions**

#### **`aStarAlgorithm()`**
```typescript
async function aStarAlgorithm(
  grid: GridNode[][],
  startPos: Position,
  endPos: Position,
  onVisitNode?: (node: GridNode) => void,
  animationSpeed: number = 10
): Promise<{ path: GridNode[]; visitedNodes: GridNode[]; success: boolean }>
```
**Purpose**: Implements the A* pathfinding algorithm with heuristic guidance.

**Parameters**:
- `grid`: 2D array representing the search space
- `startPos`: Starting coordinates
- `endPos`: Target coordinates
- `onVisitNode`: Callback for animation (optional)
- `animationSpeed`: Delay between node visits in milliseconds

**Returns**: Object containing the found path, visited nodes, and success status.

**Algorithm Steps**:
1. Initialize all nodes with infinite g-score and calculated h-score
2. Create priority queue ordered by f-score (g + h)
3. Process nodes from queue, updating neighbors
4. Reconstruct path when target is reached

#### **`dijkstraAlgorithm()`**
```typescript
async function dijkstraAlgorithm(
  grid: GridNode[][],
  startPos: Position,
  endPos: Position,
  onVisitNode?: (node: GridNode) => void,
  animationSpeed: number = 10
): Promise<{ path: GridNode[]; visitedNodes: GridNode[]; success: boolean }>
```
**Purpose**: Implements Dijkstra's algorithm for guaranteed shortest path.

**Key Difference from A***: Uses only actual distance (g-score), no heuristic guidance.

#### **`bfsAlgorithm()`**
```typescript
async function bfsAlgorithm(
  grid: GridNode[][],
  startPos: Position,
  endPos: Position,
  onVisitNode?: (node: GridNode) => void,
  animationSpeed: number = 10
): Promise<{ path: GridNode[]; visitedNodes: GridNode[]; success: boolean }>
```
**Purpose**: Implements breadth-first search using queue-based exploration.

**Characteristics**: Explores level by level, guarantees shortest path in unweighted graphs.

#### **`greedyBestFirstAlgorithm()`**
```typescript
async function greedyBestFirstAlgorithm(
  grid: GridNode[][],
  startPos: Position,
  endPos: Position,
  onVisitNode?: (node: GridNode) => void,
  animationSpeed: number = 10
): Promise<{ path: GridNode[]; visitedNodes: GridNode[]; success: boolean }>
```
**Purpose**: Implements greedy best-first search using only heuristic guidance.

**Characteristics**: Fast but not optimal, always moves toward goal.

### **🛠️ Utility Functions**

#### **`manhattanDistance()`**
```typescript
function manhattanDistance(pos1: Position, pos2: Position): number
```
**Purpose**: Calculates Manhattan distance between two points.
**Formula**: `|x1 - x2| + |y1 - y2|`
**Use**: Heuristic function for A* and Greedy algorithms.

#### **`getNeighbors()`**
```typescript
function getNeighbors(
  node: GridNode,
  grid: GridNode[][],
  rows: number,
  cols: number
): GridNode[]
```
**Purpose**: Returns valid neighboring nodes (up, down, left, right).
**Filters**: Excludes wall nodes and out-of-bounds positions.

#### **`reconstructPath()`**
```typescript
function reconstructPath(endNode: GridNode): GridNode[]
```
**Purpose**: Traces back from end node to start using parent pointers.
**Returns**: Array of nodes representing the optimal path.

#### **`createInitialGrid()`**
```typescript
function createInitialGrid(rows: number, cols: number): GridNode[][]
```
**Purpose**: Generates initial grid with empty nodes.
**Initializes**: All nodes as 'empty' type with default scores.

#### **`resetGridPath()`**
```typescript
function resetGridPath(grid: GridNode[][]): GridNode[][]
```
**Purpose**: Clears visited nodes and path while preserving walls.
**Use**: Allows running multiple algorithms on same obstacle layout.

### **🌍 Mapping Functions**

#### **`mapToGrid()`**
```typescript
function mapToGrid(
  mapCoord: MapCoordinate,
  bounds: MapBounds,
  gridDimensions: GridDimensions
): Position
```
**Purpose**: Converts latitude/longitude coordinates to grid positions.
**Process**: Normalizes coordinates within bounds and maps to grid indices.

#### **`gridToMap()`**
```typescript
function gridToMap(
  gridPos: Position,
  bounds: MapBounds,
  gridDimensions: GridDimensions
): MapCoordinate
```
**Purpose**: Converts grid positions back to geographic coordinates.
**Use**: Displaying results on real-world maps.

### **📊 Performance Tracking**

#### **Performance Metrics Interface**
```typescript
interface PerformanceMetrics {
  algorithm: string;
  pathLength: number;
  nodesVisited: number;
  executionTime: number;
  memoryUsed: number;
}
```
**Purpose**: Standardized performance data for algorithm comparison.

---

## 🔮 Future Enhancements

### **🎯 Immediate Improvements**
- **Weighted Graphs**: Add terrain costs (grass, sand, water, mountains)
- **Custom Heuristics**: Multiple distance calculations (Euclidean, Chebyshev)
- **Step-by-Step Debugging**: Manual algorithm execution with state inspection
- **Dark Mode**: Theme toggle with accessibility features

### **🚀 Advanced Features**
- **3D Visualization**: Three-dimensional pathfinding with height obstacles
- **Dynamic Obstacles**: Moving walls and real-time path recalculation
- **Multi-Agent Pathfinding**: Multiple entities finding paths simultaneously
- **Machine Learning Integration**: AI-learned heuristics and optimization

### **🌐 Real-World Applications**
- **Traffic Simulation**: Live traffic data integration with routing APIs
- **Robot Navigation**: ROS (Robot Operating System) compatibility
- **Game AI Integration**: NPCs pathfinding in game environments
- **Logistics Optimization**: Warehouse and delivery route planning

### **📱 Platform Expansion**
- **Mobile App**: React Native version for iOS and Android
- **VR/AR Experience**: Immersive pathfinding visualization
- **API Service**: Standalone pathfinding service for other applications
- **Educational Course**: Structured learning modules and exercises

### **🔧 Technical Improvements**
- **WebWorkers**: Background processing for large grids
- **WebGL Rendering**: GPU-accelerated visualization for massive grids
- **Real-time Collaboration**: Multiple users editing same grid
- **Advanced Analytics**: Heat maps and statistical analysis

---

## 🎓 Educational Value

### **Computer Science Concepts Demonstrated**
- **Graph Theory**: Nodes, edges, and graph traversal
- **Algorithm Analysis**: Time and space complexity comparison
- **Heuristic Search**: Informed vs. uninformed search strategies
- **Data Structures**: Priority queues, graphs, and trees

### **Practical Applications**
- **GPS Navigation**: How navigation apps find routes
- **Game Development**: NPC movement and AI pathfinding
- **Robotics**: Autonomous navigation and obstacle avoidance
- **Network Routing**: Internet packet routing and optimization

### **Learning Outcomes**
- Understanding algorithm trade-offs and selection criteria
- Visual comprehension of abstract computer science concepts
- Appreciation for computational complexity and optimization
- Real-world application of theoretical knowledge

---

## 🤝 Contributing

We welcome contributions from the community! This project was built collaboratively and we encourage others to join in improving it.

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/airaous/astar-visualizer.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**
   - Follow TypeScript best practices
   - Maintain existing code style
   - Add comments for complex logic

4. **Test Your Changes**
   ```bash
   npm test
   npm run build
   ```

5. **Submit a Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### **Development Guidelines**
- **Code Style**: Use TypeScript strict mode and ESLint rules
- **Component Structure**: Follow React functional component patterns
- **Performance**: Optimize for smooth animations and responsiveness
- **Accessibility**: Ensure keyboard navigation and screen reader support

### **Areas for Contribution**
- 🐛 Bug fixes and performance improvements
- ✨ New algorithm implementations
- 🎨 UI/UX enhancements and accessibility
- 📚 Documentation improvements
- 🧪 Test coverage expansion
- 🌍 Internationalization support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 🙏 Acknowledgments

### **Inspiration and Resources**
- **Pathfinding.js** - Algorithm implementation references
- **OpenStreetMap** - Free geographic data
- **React Community** - Excellent documentation and examples
- **Computer Science Education** - Making algorithms accessible

### **Special Thanks**
- **Contributors**: All developers who submitted issues and pull requests
- **Educators**: Teachers and students who provided feedback
- **Open Source Community**: For tools and libraries that made this possible

---

## 📞 Contact & Support

### **Get in Touch**
- **Project Issues**: [GitHub Issues](https://github.com/airaous/astar-visualizer/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/airaous/astar-visualizer/discussions)

### **Connect with the Team**

**Ayra** - Lead Developer & Algorithm Specialist
- 🐙 GitHub: [@airaous](https://github.com/airaous)
- 💼 LinkedIn: [linkedin.com/in/ayraious](https://linkedin.com/in/ayraious)
- 📧 Email: [ayrawrk@gmail.com](mailto:ayrawrk@gmail.com)

**Erebus (Kshitiz)** - Frontend Developer & UI/UX Designer
- 🐙 GitHub: [@Erebuzzz](https://github.com/Erebuzzz)
- 💼 LinkedIn: [linkedin.com/in/kksinha23](https://linkedin.com/in/kksinha23)
- 📧 Email: [kshitiz23kumar@gmail.com](mailto:kshitiz23kumar@gmail.com)

---

<div align="center">

### 🌟 **Star this repository if you found it helpful!** 🌟

**Made by [Ayra](https://github.com/airaous) and [Erebus](https://github.com/Erebuzzz)**

[🚀 **Try the Live Demo**](https://astar-visualizer-phi.vercel.app/) | [📚 **Read the Docs**](https://github.com/airaous/astar-visualizer#readme) | [🐛 **Report Issues**](https://github.com/airaous/astar-visualizer/issues)

</div>
