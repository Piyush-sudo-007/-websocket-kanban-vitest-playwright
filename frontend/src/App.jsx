import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import ErrorBoundary from "./components/ErrorBoundary";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => (
  <ErrorBoundary>
    <DndProvider backend={HTML5Backend}>
      <KanbanBoard />
    </DndProvider>
  </ErrorBoundary>
);

export default App;
