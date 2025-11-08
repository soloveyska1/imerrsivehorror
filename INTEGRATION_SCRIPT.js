// ===== ИНТЕГРАЦИЯ ИСПРАВЛЕННОЙ СИСТЕМЫ ЖИВЫХ СЛОВ =====
// Этот код нужно вставить в HTML файл, заменив старые определения

// ============================================
// 1. ЗАМЕНИТЬ ОПРЕДЕЛЕНИЕ LivingWordsSystem
// ============================================
// В HTML найти class LivingWordsSystem { ... } (примерно строка 1520-1676)
// и ЗАМЕНИТЬ на код из living_words_system_fixed.js

// ============================================
// 2. ИЗМЕНИТЬ ФУНКЦИЮ increaseIntensity
// ============================================
// Заменить строки 2150-2188 на следующий код:

function increaseIntensity(lineIndex) {
    progressionLevel = lineIndex / story.length;
    updateAtmosphere(progressionLevel);
    
    // Обновляем интенсивность живых слов
    if (typeof livingWords !== 'undefined') {
        livingWords.setIntensity(progressionLevel);
    }
    
    // НОВОЕ: Автоматическое обновление виньетки
    if (typeof vignetteControl !== 'undefined') {
        vignetteControl.update(progressionLevel);
    }
    
    document.querySelector('.static').style.opacity = 0.12 + progressionLevel * 0.55;
    document.querySelector('.breath-overlay').style.animation = 
        `breatheOppressive ${Math.max(0.5, 7 - progressionLevel * 6.5)}s infinite`;
    document.querySelector('.grain').style.opacity = progressionLevel * 0.6;
    
    if (progressionLevel > 0.45 && Math.random() < (progressionLevel - 0.45) * 0.15) {
        triggerWatching();
    }
    if (progressionLevel > 0.35 && Math.random() < (progressionLevel - 0.35) * 0.18) {
        triggerPeripheralHorror();
    }
    if (progressionLevel > 0.25 && Math.random() < (progressionLevel - 0.25) * 0.9) {
        addForgottenWord();
    }
    if (progressionLevel > 0.5 && Math.random() < 0.04) {
        triggerScreenTear();
    }
    
    // НОВОЕ: Автоматическое формирование глаз при 60% прогресса
    if (progressionLevel > 0.6 && progressionLevel < 0.65 && !window.eyesFormed) {
        window.eyesFormed = true;
        setTimeout(() => {
            livingWords.formEyes();
        }, 2000);
    }
    
    // НОВОЕ: Все слова становятся красными при 85% прогресса
    if (progressionLevel > 0.85 && !window.allIntense) {
        window.allIntense = true;
        livingWords.makeAllIntense();
    }
    
    // НОВОЕ: Жуткий смайлик при 90% прогресса
    if (progressionLevel > 0.9 && !window.smileFormed) {
        window.smileFormed = true;
        setTimeout(() => {
            livingWords.formHorrorSmile();
            vignetteControl.suffocate(3000);
        }, 1000);
    }
}

// ============================================
// 3. ДОБАВИТЬ ОБРАБОТЧИКИ ЭФФЕКТОВ
// ============================================
// В секции обработки эффектов (примерно строка 2400+)
// ДОБАВИТЬ после существующих else if блоков:

else if (effect === 'smile') {
    // Вручную вызвать жуткий смайлик
    livingWords.formHorrorSmile();
    vignetteControl.suffocate(3000);
}
else if (effect === 'eyes') {
    // Вручную вызвать глаза
    livingWords.formEyes();
}
else if (effect === 'squeeze') {
    // Вручную сжать виньетку
    vignetteControl.squeeze(0.98, 1500);
}
else if (effect === 'allintense') {
    // Все слова становятся красными
    livingWords.makeAllIntense();
}

// ============================================
// 4. CSS ИЗМЕНЕНИЯ
// ============================================
// НАЙТИ в <style> секции:

// A) Строка ~259: Добавить z-index для #content
// БЫЛО:
//   #content { 
//       position: absolute; 
//       ...
//   }
// СТАЛО:
//   #content { 
//       position: absolute; 
//       ...
//       z-index: 1000;  /* <-- ДОБАВИТЬ! */
//   }

// B) Строка ~1032: Изменить z-index для .obsessive-word
// БЫЛО:
//   z-index: 70;
// СТАЛО:
//   z-index: 5;

// C) Строка ~1094: Удалить z-index из .forming-pattern
// БЫЛО:
//   .obsessive-word.forming-pattern {
//       transition: all 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) !important;
//       z-index: 100;  /* <-- УДАЛИТЬ эту строку */
//   }
// СТАЛО:
//   .obsessive-word.forming-pattern {
//       transition: all 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) !important;
//   }

// D) После строки ~1117: ДОБАВИТЬ новые стили для .pattern-word
/* PATTERN WORDS - СПЕЦИАЛЬНЫЕ СЛОВА ДЛЯ ОБРАЗОВ */
.pattern-word { 
    position: fixed; 
    font-family: 'Courier Prime', monospace; 
    font-size: 14px;
    color: #6a0000;
    pointer-events: none; 
    opacity: 0; 
    z-index: 15;  /* Выше фоновых слов, но НИЖЕ основного текста */
    letter-spacing: 1px; 
    font-weight: 700;
    transition: all 3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    will-change: transform, opacity;
    text-shadow: 0 0 15px rgba(106, 0, 0, 0.8);
}

.pattern-word.visible {
    opacity: 0.9;
    animation: patternPulse 3s ease-in-out infinite;
}

.pattern-word.fading-out {
    opacity: 0 !important;
    transform: scale(0.5);
    transition: all 1s ease-in;
}

@keyframes patternPulse {
    0%, 100% {
        text-shadow: 0 0 10px rgba(106, 0, 0, 0.7);
        transform: scale(1);
    }
    50% {
        text-shadow: 0 0 25px rgba(138, 0, 0, 1);
        transform: scale(1.1);
    }
}

// ============================================
// 5. ИСПОЛЬЗОВАНИЕ В STORY
// ============================================
// Можно добавить ручные вызовы в story массив:

// Вызвать жуткий смайлик:
'<span class="void">ФИНАЛ</span>.|7000|smile|...'

// Вызвать глаза:
'Он смотрит.|2000|eyes|...'

// Сжать виньетку:
'<span class="death">СТРАХ</span>.|2000|squeeze|...'

// Все слова красные:
'<span class="void">НИКОГДА</span>.|3000|allintense|...'

// ============================================
// ИТОГОВАЯ Z-INDEX ИЕРАРХИЯ:
// ============================================
// 10000 - cursor (всегда сверху)
// 1000  - #content (основной текст) 👈 НИКОГДА НЕ ПЕРЕКРЫВАЕТСЯ
// 600   - watching-overlay
// 200   - static, grain
// 100   - breath-overlay
// 80-85 - red-flicker, heartbeat
// 50    - vignette
// 15    - .pattern-word (образы из слов) 👈 ПОД ТЕКСТОМ
// 5     - .obsessive-word (фоновые слова) 👈 НА ЗАДНЕМ ПЛАНЕ
// 0     - background

// ============================================
// РЕЗУЛЬТАТ:
// ============================================
// ✅ Основной текст ВСЕГДА сверху и читаем
// ✅ Фоновые слова создают атмосферу, но не мешают
// ✅ Глаза формируются автоматически при 60% прогресса
// ✅ Жуткий смайлик появляется при 90% прогресса
// ✅ Виньетка плавно сжимается автоматически
// ✅ Все слова становятся красными в финале
// ✅ Можно вызывать эффекты вручную через story
