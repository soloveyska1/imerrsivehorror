# ПАТЧ ДЛЯ ИСПРАВЛЕНИЯ Z-INDEX И ДОБАВЛЕНИЯ ЖУТКОГО СМАЙЛИКА

## ЧТО НУЖНО ИЗМЕНИТЬ В HTML:

### 1. ДОБАВИТЬ Z-INDEX ДЛЯ #content (после строки 259)

```css
#content { 
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    width: 90%; 
    max-width: 1000px; 
    text-align: center;
    padding: 0 15px;
    z-index: 1000;  /* <-- ДОБАВИТЬ ЭТУ СТРОКУ! */
}
```

### 2. ИЗМЕНИТЬ Z-INDEX ДЛЯ .obsessive-word (строка 1032)

БЫЛО:
```css
.obsessive-word { 
    position: fixed; 
    font-family: 'Courier Prime', monospace; 
    font-size: 14px;
    color: #3a3a3a; 
    pointer-events: none; 
    opacity: 0; 
    z-index: 70;  /* <-- БЫЛО 70 */
```

СТАЛО:
```css
.obsessive-word { 
    position: fixed; 
    font-family: 'Courier Prime', monospace; 
    font-size: 14px;
    color: #3a3a3a; 
    pointer-events: none; 
    opacity: 0; 
    z-index: 5;  /* <-- СТАЛО 5 */
    letter-spacing: 1px; 
    font-weight: 400;
    transition: all 0.5s ease-out;
    will-change: transform, opacity;
}
```

### 3. УДАЛИТЬ z-index из .forming-pattern (строка 1094)

БЫЛО:
```css
.obsessive-word.forming-pattern {
    transition: all 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) !important;
    z-index: 100;  /* <-- УДАЛИТЬ ЭТУ СТРОКУ */
}
```

СТАЛО:
```css
.obsessive-word.forming-pattern {
    transition: all 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) !important;
}
```

### 4. ДОБАВИТЬ НОВЫЕ СТИЛИ ДЛЯ .pattern-word (после строки 1117)

```css
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
}

.pattern-word.fading-out {
    opacity: 0 !important;
    transform: scale(0.5);
    transition: all 1s ease-in;
}

/* Пульсация для слов паттернов */
.pattern-word.visible {
    animation: patternPulse 3s ease-in-out infinite;
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
```

### 5. ЗАМЕНИТЬ СКРИПТ living_words_system.js

В секции `<script>` в конце файла (примерно строка 2900+), нужно:

1. Заменить определение `LivingWordsSystem` на новую версию из `living_words_system_fixed.js`

2. Заменить определение `DynamicVignette` на новую версию из `living_words_system_fixed.js`

### 6. ДОБАВИТЬ АВТОМАТИЧЕСКИЕ ВЫЗОВЫ В STORY

В разделе где обрабатываются эффекты (примерно строка 2500+), добавить:

```javascript
// После progressionLevel определения добавить автоматические вызовы:

// Автоматическая виньетка
vignetteControl.update(progressionLevel);

// Автоматические глаза при progression > 0.6
if (progressionLevel > 0.6 && progressionLevel < 0.65 && !window.eyesFormed) {
    window.eyesFormed = true;
    setTimeout(() => {
        livingWords.formEyes();
    }, 2000);
}

// Автоматический жуткий смайлик при progression > 0.9
if (progressionLevel > 0.9 && !window.smileFormed) {
    window.smileFormed = true;
    setTimeout(() => {
        livingWords.formHorrorSmile();
        vignetteControl.suffocate(3000);
    }, 1000);
}

// Все слова красные при progression > 0.85
if (progressionLevel > 0.85 && !window.allIntense) {
    window.allIntense = true;
    livingWords.makeAllIntense();
}
```

### 7. ДОБАВИТЬ ЭФФЕКТ 'smile' В ОБРАБОТЧИК

В функции где обрабатываются эффекты типа 'obsess', 'break' и т.д., добавить:

```javascript
else if (effect === 'smile') {
    livingWords.formHorrorSmile();
    vignetteControl.suffocate(3000);
}
else if (effect === 'squeeze') {
    vignetteControl.squeeze(0.98, 1500);
}
else if (effect === 'allintense') {
    livingWords.makeAllIntense();
}
```

## РЕЗУЛЬТАТ:

✅ Основной текст (#content) всегда сверху (z-index: 1000)
✅ Фоновые слова (.obsessive-word) на заднем плане (z-index: 5)
✅ Слова для образов (.pattern-word) между ними (z-index: 15)
✅ Виньетка плавно сжимается автоматически
✅ Глаза формируются при 60% прогресса
✅ ЖУТКИЙ СМАЙЛИК появляется при 90% прогресса
✅ Все слова становятся красными при 85% прогресса

## Z-INDEX ИЕРАРХИЯ:

```
10000 - cursor
1000  - #content (основной текст) 👈 ВСЕГДА СВЕРХУ
600   - watching-overlay
200   - static, grain
100   - breath-overlay
80-85 - red-flicker, heartbeat
50    - vignette
15    - .pattern-word (образы) 👈 ПОД ТЕКСТОМ
5     - .obsessive-word (фон) 👈 НА ЗАДНЕМ ПЛАНЕ
```

Теперь фоновые слова НИКОГДА не перекроют основной текст!
