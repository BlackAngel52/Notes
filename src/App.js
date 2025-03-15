import { useState, useEffect } from "react";
import uuid from "react-uuid";
import './App.css';
import Main from './Main';
import Sidebar from './Sidebar';

function App() {
    
    /*
    Основное состояние приложения.

    notes: массив всех заметок
    activeNote: ID активной заметки
    
    Инициализация происходит через функцию, чтобы избежать 
    повторных вычислений при рендеринге.
    */

    const [state, setState] = useState(() => {
        // Пытаемся получить сохраненные заметки из localStorage
        const savedNotes = localStorage.getItem("notes");

        // Если есть сохраненные данные
        if (savedNotes) {
            const notes = JSON.parse(savedNotes);
            return {
                notes,
                // Автоматически выбираем первую заметку при загрузке
                activeNote: notes[0]?.id || null
            };
        } else {
            // Создаем начальную заметку для новых пользователей
            const firstNote = {
                id: uuid(), // Генерация уникального идентификатора
                title: "Это - ваша первая заметка!", // Стандартный заголовок
                body: "Впишите сюда текст!", // Стартовый текст
                fontFamily: "Arial", // Стартовый шрифт
                fontSize: 16, // Стартовый размер шрифта
                lastModified: Date.now(), // Метка времени последнего изменения
            };
            return {
                notes: [firstNote],
                // Автовыбор созданной заметки
                activeNote: firstNote.id
            };
        }
    });

     /*
     Синхронизация с localStorage.
     Срабатывает при любом изменении массива заметок.
     Сохраняет текущее состояние в формате JSON.
     */
    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(state.notes));
    }, [state.notes]);

    /*
    Создание новой заметки.
    Генерирует уникальный ID
    Устанавливает стандартные значения
    Добавляет в начало списка
    Автоматически делает новую заметку активной
    */
    const onAddNote = () => {
        const newNote = {
            id: uuid(),
            title: "Заголовок",
            body: "", // Пустое содержимое по умолчанию
            lastModified: Date.now(),
        };
        setState((prev) => ({
            notes: [newNote, ...prev.notes], // Новые заметки добавляются сверху
            activeNote: newNote.id // Фокус на новой заметке
        }));
    };

    /*
    Обновление содержимого заметки.
    
    Алгоритм:
    1. Находим заметку с ID === activeNote
    2. Заменяем её содержимое
    3. Сохраняем обновленный массив
    */
    const onUpdateNote = (updatedNote) => {
        setState((prev) => ({
            ...prev,
            notes: prev.notes.map((note) => 
                note.id === prev.activeNote ? updatedNote : note
            )
        }));
    };

    /*
    Удаление заметки.
    Если удаляется активная заметка, сбрасываем активную
    Фильтрация массива без измененного элемента
    */
    const onDeleteNote = (idToDelete) => {
        setState((prev) => ({
            notes: prev.notes.filter((note) => note.id !== idToDelete),
            activeNote: prev.activeNote === idToDelete ? null : prev.activeNote
        }));
    };

    /*
    Получение данных активной заметки.
    Используется для передачи в компонент Main
    */
    const getActiveNote = () => {
        return state.notes.find((note) => note.id === state.activeNote);
    };
    
    return (
        <div className="App">
            {/* Левый сайдбар со списком заметок */}
            <Sidebar
                notes={state.notes}
                onAddNote={onAddNote}
                onDeleteNote={onDeleteNote}
                activeNote={state.activeNote}
                setActiveNote={(id) => setState((prev) => ({ ...prev, activeNote: id }))}
            />
            {/* Основная область редактирования */}
            <Main
                activeNote={getActiveNote()}
                onUpdateNote={onUpdateNote}
            />
        </div>
    );
}

export default App;