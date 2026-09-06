import type { Task } from "../../service/TaskService";

interface TaskItemProp {
  task: Task;
}

function TaskItem({ task }: TaskItemProp) {
  return (
    <div
      style={{
        border: "1px solid #ffffff",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <h1>{task.name}</h1>
    </div>
  );
}

export default TaskItem;
