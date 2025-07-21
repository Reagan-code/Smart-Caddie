import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";

export default function Show() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const space = '     '

  useEffect(() => {
      const q = query(
      collection(db, "todos"),
      where("userId", "==", user.uid) 
    );
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

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };


  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed
    });
  };

  if (loading) return <div>Loading Booking...</div>;

  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <p>No booking yet </p>
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
              <span>{space}{todo.email}</span>
              <span>{space}{todo.location}</span>
              <span>{space}{todo.date}</span>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}