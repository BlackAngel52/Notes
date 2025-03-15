function Sidebar({ notes, onAddNote, onDeleteNote, activeNote, setActiveNote }) {

    /*
    Сортируем заметки по дате изменения:
    1. Создаем копию массива через [...notes], чтобы не изменять оригинал
    2. Сортируем от новых к старым (b.lastModified - a.lastModified)
    */ 
    const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

    return (
        <div className="app-sidebar">
            {/* Шапка сайдбара */}
            <div className="app-sidebar-header">
                <h1 className="sidebar-title">Заметки</h1>

                {/* Кнопка добавления новой заметки */}
                <button 
                    className="add-note-button" 
                    onClick={onAddNote}>
                    ➕
                </button>
            </div>

            {/* Контейнер для списка заметок */}
            <div className="app-sidebar-notes">
                {sortedNotes.map((note) => (
                    /*
                    Контейнер для каждой заметки в списке:
                    - key: Уникальный ключ для React
                    - className: Добавляет класс 'active' для выбранной заметки
                    - onClick: Выбирает заметку при клике
                    */
                    <div
                        key={note.id}
                        className={`app-sidebar-note ${note.id === activeNote && "active"}`}
                        onClick={() => setActiveNote(note.id)}
                    >
                        {/* Заголовок заметки и кнопка удаления */}
                        <div className="sidebar-note-title">
                            <strong>{note.title}</strong>
                            {/* 
                            Кнопка удаления:
                            - e.stopPropagation() предотвращает всплытие события,
                            чтобы клик не триггерил выбор заметки
                            */}
                            <button 
                                className="delete-note-button"
                                onClick={(e) => {

                                    e.stopPropagation();
                                    onDeleteNote(note.id);
                                }}
                            >
                                ❌
                            </button>
                        </div>

                        {/* 
                        Превью содержимого:
                        - dangerouslySetInnerHTML позволяет вставить HTML
                        - Обрезаем текст до 100 символов
                        - Добавляем многоточие если текст длинный
                        */}
                        <div 
                            className="note-preview"
                            dangerouslySetInnerHTML={{
                                __html: note.body 
                                    ? note.body.substring(0, 45) + "..." 
                                    : ""
                            }} 
                        />

                        {/*
                        Обозначение даты редактирования записки:
                        - Приводим часы и минуты в формате максимум 2 цифры
                         */}
                        <small className="note-meta">
                            {new Date(note.lastModified).toLocaleDateString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;