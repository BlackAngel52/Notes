import { useEffect, useRef } from "react";

function Main({ activeNote, onUpdateNote }) {
    /*
    Реф для доступа к DOM-элементу редактора.
    Позволяет работать с contentEditable напрямую.
    */

    const bodyRef = useRef(null);



    /*
    Инициализации редактора:
    1. Проверяем наличие активной заметки и DOM-элемента
    2. Устанавливаем HTML-содержимое из заметки
    3. Применяем сохраненные стили шрифта
    */
    useEffect(() => {
        // Проверка активной заметки
        if (!activeNote || !bodyRef.current) return;
        
        // Принудительное обновление содержимого
        bodyRef.current.innerHTML = activeNote.body;
        // Применяем сохраненные стили
        bodyRef.current.style.fontFamily = activeNote.fontFamily;
        bodyRef.current.style.fontSize = `${activeNote.fontSize}px`;
        

    }, [activeNote?.id]); // Реагируем только на смену ID

    /* 
    Обработчик изменения шрифта и размера:
    1. Создаем обновленную заметку с новыми значениями
    2. Приводим размер шрифта к числу (т.к. из input приходит строка)
    3. Обновляем состояние через onUpdateNote
    4. Немедленно применяем стили к редактору
    */
    const handleFontChange = (type, value) => {
        const updatedNote = {
            ...activeNote,
            [type]: type === "fontSize" ? Number(value) : value,
            lastModified: Date.now(),
        };
        onUpdateNote(updatedNote);

        // Применяем стили сразу к редактору
        if (bodyRef.current) {
            bodyRef.current.style.fontFamily = updatedNote.fontFamily;
            bodyRef.current.style.fontSize = `${updatedNote.fontSize}px`;
        }
    }

    /*
    Обработчик изменений содержимого.
    Вызывается при каждом вводе текста.
    */
    const handleInput = () => {

        // Получаем новое содержимое
        const newBody = bodyRef.current.innerHTML;

        // Пробрасываем изменения в родительский компонент
        onUpdateNote({
            ...activeNote,
            body: newBody,
            lastModified: Date.now(),
            // Сохраняем текущие стили
            fontFamily: bodyRef.current.style.fontFamily,
            fontSize: parseInt(bodyRef.current.style.fontSize) || 16,
        });


    };

    /*
    Применение форматирования к тексту.
    Использует нативную команду execCommand.
    */
    const formatText = (command) => {
        document.execCommand(command);
        bodyRef.current.focus(); // Возвращаем фокус в редактор
    };

    // Если активная заметка не выбрана, показываем заглушку
    if (!activeNote) return <div className="no-active-note">Создайте новую заметку!</div>;

    return (
        <div className="app-main">
            <div className="app-main-note-edit">

                {/*
                Выпадающий список для выбора шрифта:
                - value привязан к activeNote.fontFamily
                - onChange обновляет состояние через handleFontChange
                - inline-стили для минимальной ширины и отступов
                */}

                <div className="formatting-toolbar">
                    <select 
                        value={activeNote.fontFamily}
                        onChange={(e) => handleFontChange("fontFamily", e.target.value)}
                        className="format-button"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                    </select>


                    {/*
                    Поле для ручного ввода размера шрифта:
                    - type="number" для валидации
                    - min/max ограничивают диапазон
                    - Ширина фиксирована для компактности
                    */}

                    <input
                        type="number"
                        value={activeNote.fontSize}
                        onChange={(e) => handleFontChange("fontSize", e.target.value)}
                        className="format-button"
                        style={{width: '70px'}}
                        min="8"
                        max="72"
                    />
                </div>


                {/* Поле ввода заголовка */}

                <input
                    type="text"
                    className="note-title-input"
                    value={activeNote.title}
                    onChange={(e) => onUpdateNote({ 
                        ...activeNote, 
                        title: e.target.value, 
                        lastModified: Date.now() 
                    })}
                    autoFocus // Автофокус при создании
                />

                

                {/* Основной редактор содержимого */}
                <div
                    ref={bodyRef}
                    className="note-editor"
                    contentEditable // Разрешение редактирования
                    onInput={handleInput} // Обработчик изменений
                />

                {/* Панель форматирования */}
                <div className="formatting-toolbar">

                    <button 
                        className="format-button" 
                        onClick={() => formatText("bold")} // Жирный
                    >
                        <strong>Ж</strong>
                    </button>

                    <button 
                        className="format-button" 
                        onClick={() => formatText("italic")} // Курсив
                    >
                        <i>К</i>
                    </button>

                    <button 
                        className="format-button" 
                        onClick={() => formatText("underline")} // Подчеркивание
                    >
                        <u>Ч</u>
                    </button>

                    <button 
                        className="format-button" 
                        onClick={() => formatText("undo")} // Отменить действие
                    >
                        ↩
                    </button>

                    <button 
                        className="format-button" 
                        onClick={() => formatText("redo")} // Повтор действия (если отменено с помощью undo)
                    >
                        ↺
                    </button>


                </div>
            </div>
        </div>
    );
}

export default Main;