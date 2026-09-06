import TaskItem from "./Components/Atoms/TaskItem";
import { TaskService, type Task } from "./service/TaskService";
import { useEffect, useState } from "react";

function App() {
  const taskService = TaskService();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let isMounted = true;
    const initTables = async () => {
      const data = await fetchTasks();
      if (isMounted && data) setTasks(data);
    };
    initTables();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchTasks = async () => {
    try {
      return await taskService.getTasks();
    } catch (error) {
      console.error("Fehler beim Laden der Tasks:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
      }}
    >
      {tasks.map((n: Task) => {
        // So ruft man React-Komponenten richtig auf!
        return <TaskItem task={n} />;
      })}
    </div>
  );
}

export default App;
