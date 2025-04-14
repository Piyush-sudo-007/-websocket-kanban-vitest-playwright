import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const wrapWithDnd = (ui) => (
  <DndProvider backend={HTML5Backend}>{ui}</DndProvider>
);
