import './App.css';

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [effort, setEffort] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load tasks on page load
  useEffect(() => {

    const loadData = async() => {

      setLoading(true)

      const res = await fetch(API + "/tasks")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTasks(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskin = {
      id: Math.random(),
      title,
      effort,
      done: false,
    }

    await fetch(API + "/tasks", {
      method: "POST",
      body: JSON.stringify(taskin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTasks((prevState) => [...prevState, taskin]);

    setTitle("");
    setEffort("");
  };

  const handleDelete = async (id) => {

    await fetch(API + "/tasks/" + id, {
      method: "DELETE",      
    });

    setTasks((prevState) => prevState.filter((task) => task.id !== id));
  };

  const handleEdit = async(task) => {
    task.done = !task.done;

    const data = await fetch(API + "/tasks/" + task.id, {
      method: "PUT",      
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTasks((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <div className="taskin-header">
        <h1>React TaskIn</h1>
      </div>
      <div className="form-taskin">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="effort">Duração:</label>
            <input
              type="text"
              name="effort"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setEffort(e.target.value)}
              value={effort || ""}
              required
            />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className="list-taskin">
        <h2>Lista de Tarefas:</h2>
        {tasks.length === 0 && <p>Não existem tarefas!</p>}
        {tasks.map((task) => (
          <div className="task" key={task.id}>
            <h3 className={task.done ? "task-done" : ""}>{task.title}</h3>
            <p>Duração: {task.effort}</p>
            <div className="actions">
              <span onClick={() => handleEdit(task)}>
                {!task.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(task.id)} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
