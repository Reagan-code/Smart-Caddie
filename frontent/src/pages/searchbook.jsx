import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Show() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos from Firebase
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Delete todo
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  // Toggle todo completion status
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed
    });
  };

  if (loading) return <div>Loading todos...</div>;

  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <p>No todos found. Add one above!</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo)}
              />
              <span>{todo.title}</span>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}