// РАДИКАЛЬНАЯ СИСТЕМА ПСИХОЛОГИЧЕСКОГО УЖАСА - ИСПРАВЛЕННАЯ ВЕРСИЯ

// ЖИВАЯ СИСТЕМА ФОНОВЫХ СЛОВ
class LivingWordsSystem {
    constructor() {
        this.words = [];
        this.container = null;
        this.wordBank = [
            'ЗАБЫЛ', 'ВОДА', 'СМЕРТЬ', 'БОЛЬ', 'СТРАХ', 'ОТЕЦ', 'МАШИНА', 'КРОВЬ',
            'ПУСТОТА', 'НИКОГДА', 'ПОВТОР', 'РАСПАД', 'ХОЛОД', 'ТРУП', 'ГЛАЗА',
            'РУКИ', 'КРИК', 'ТЬМА', 'БЕЗУМИЕ', 'ЦИКЛ', 'АД', 'ДЕМЕНЦИЯ', 'ПОТЕРЯН',
            'БЕЗЫСХОДНОСТЬ', 'УЖАС', 'КОНЕЦ', 'РАЗРУШЕНИЕ', 'ЖИВОЙ ТРУП', 'КАЖДЫЙ ДЕНЬ',
            'ЛУЖА', 'СЫН', 'ДОЛГ', 'ЛЮБОВЬ', 'СЕМЬЯ', 'НЕ ПОМНИТ', 'ЗАБВЕНИЕ'
        ];
        this.spawnRate = 3000; // начальная скорость
        this.minSpawnRate = 200; // финальная скорость
        this.intensity = 0;
        this.isActive = false;
        this.patterns = [];
        this.patternWords = []; // отдельные слова для образов
    }
    
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.isActive = true;
        this.startSpawning();
    }
    
    startSpawning() {
        if (!this.isActive) return;
        
        const currentRate = Math.max(
            this.minSpawnRate,
            this.spawnRate - (this.intensity * 2800)
        );
        
        // Спавним от 1 до 5 слов за раз в зависимости от интенсивности
        const wordsToSpawn = Math.floor(1 + this.intensity * 4);
        for (let i = 0; i < wordsToSpawn; i++) {
            setTimeout(() => this.spawnWord(), i * 100);
        }
        
        setTimeout(() => this.startSpawning(), currentRate);
    }
    
    spawnWord() {
        const word = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
        const wordEl = document.createElement('div');
        wordEl.className = 'obsessive-word spawned';
        wordEl.textContent = word;
        
        // Случайная позиция
        wordEl.style.left = Math.random() * window.innerWidth + 'px';
        wordEl.style.top = Math.random() * window.innerHeight + 'px';
        wordEl.style.fontSize = (10 + Math.random() * 10) + 'px';
        
        // Параметры для дрейфа
        wordEl.style.setProperty('--dx1', (Math.random() * 40 - 20) + 'px');
        wordEl.style.setProperty('--dy1', (Math.random() * 40 - 20) + 'px');
        wordEl.style.setProperty('--dx2', (Math.random() * 40 - 20) + 'px');
        wordEl.style.setProperty('--dy2', (Math.random() * 40 - 20) + 'px');
        wordEl.style.setProperty('--dx3', (Math.random() * 40 - 20) + 'px');
        wordEl.style.setProperty('--dy3', (Math.random() * 40 - 20) + 'px');
        wordEl.style.setProperty('--r1', (Math.random() * 6 - 3) + 'deg');
        wordEl.style.setProperty('--r2', (Math.random() * 6 - 3) + 'deg');
        wordEl.style.setProperty('--r3', (Math.random() * 6 - 3) + 'deg');
        
        this.container.appendChild(wordEl);
        this.words.push(wordEl);
        
        // Добавляем дрейф через секунду
        setTimeout(() => {
            wordEl.classList.add('drift');
            // Иногда добавляем blur-pulse
            if (Math.random() < 0.3) {
                wordEl.classList.add('blur-pulse');
            }
        }, 1000);
        
        // По мере роста интенсивности слова становятся краснее
        if (this.intensity > 0.5 && Math.random() < this.intensity - 0.5) {
            setTimeout(() => {
                wordEl.classList.add('intense');
            }, 2000);
        }
    }
    
    setIntensity(value) {
        this.intensity = Math.max(0, Math.min(1, value));
    }
    
    // НОВЫЙ МЕТОД: Спавн специального слова для образа
    spawnPatternWord(word, x, y, size = 14, delay = 0) {
        const wordEl = document.createElement('div');
        wordEl.className = 'pattern-word';
        wordEl.textContent = word;
        wordEl.style.fontSize = size + 'px';
        
        // Начальная позиция за пределами экрана
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        wordEl.style.left = startX + 'px';
        wordEl.style.top = startY + 'px';
        
        this.container.appendChild(wordEl);
        this.patternWords.push(wordEl);
        
        // Анимация к целевой позиции
        setTimeout(() => {
            wordEl.style.left = x + 'px';
            wordEl.style.top = y + 'px';
            wordEl.classList.add('visible');
        }, delay);
        
        return wordEl;
    }
    
    // Формирование глаз (автоматически)
    formEyes() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const leftEyeX = centerX - 150;
        const rightEyeX = centerX + 150;
        const eyeY = centerY - 50;
        
        // Левый глаз
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 30 + Math.random() * 20;
            const x = leftEyeX + Math.cos(angle) * radius;
            const y = eyeY + Math.sin(angle) * radius;
            
            const word = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
            this.spawnPatternWord(word, x, y, 14, i * 50);
        }
        
        // Правый глаз
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 30 + Math.random() * 20;
            const x = rightEyeX + Math.cos(angle) * radius;
            const y = eyeY + Math.sin(angle) * radius;
            
            const word = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
            this.spawnPatternWord(word, x, y, 14, i * 50);
        }
        
        // Зрачки (более плотные)
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const radius = 8 + Math.random() * 5;
            const x = leftEyeX + Math.cos(angle) * radius;
            const y = eyeY + Math.sin(angle) * radius;
            this.spawnPatternWord('•', x, y, 20, 1000 + i * 30);
        }
        
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const radius = 8 + Math.random() * 5;
            const x = rightEyeX + Math.cos(angle) * radius;
            const y = eyeY + Math.sin(angle) * radius;
            this.spawnPatternWord('•', x, y, 20, 1000 + i * 30);
        }
    }
    
    // ЖУТКИЙ СМАЙЛИК ДЛЯ ФИНАЛА
    formHorrorSmile() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const faceRadius = Math.min(window.innerWidth * 0.3, 300);
        
        // 1. КОНТУР ЛИЦА - делаем его неровным и жутким
        const facePoints = 60;
        for (let i = 0; i < facePoints; i++) {
            const angle = (i / facePoints) * Math.PI * 2;
            // Неровный радиус для искажённого лица
            const radiusVariation = Math.sin(angle * 5) * 15;
            const radius = faceRadius + radiusVariation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const word = ['ВОДА', 'ЗАБЫЛ', 'НИКОГДА', 'СМЕРТЬ'][Math.floor(Math.random() * 4)];
            this.spawnPatternWord(word, x, y, 16, i * 20);
        }
        
        // 2. ЛЕВЫЙ ГЛАЗ - пустой, провал
        const leftEyeX = centerX - faceRadius * 0.35;
        const leftEyeY = centerY - faceRadius * 0.25;
        const eyeRadius = faceRadius * 0.15;
        
        for (let i = 0; i < 25; i++) {
            const angle = (i / 25) * Math.PI * 2;
            const radius = eyeRadius + Math.random() * 10;
            const x = leftEyeX + Math.cos(angle) * radius;
            const y = leftEyeY + Math.sin(angle) * radius;
            
            this.spawnPatternWord('ПУСТОТА', x, y, 12, 1200 + i * 25);
        }
        
        // Чёрный зрачок левого глаза
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const radius = eyeRadius * 0.4;
            const x = leftEyeX + Math.cos(angle) * radius;
            const y = leftEyeY + Math.sin(angle) * radius;
            
            this.spawnPatternWord('█', x, y, 18, 1500 + i * 20);
        }
        
        // 3. ПРАВЫЙ ГЛАЗ - такой же пустой
        const rightEyeX = centerX + faceRadius * 0.35;
        const rightEyeY = centerY - faceRadius * 0.25;
        
        for (let i = 0; i < 25; i++) {
            const angle = (i / 25) * Math.PI * 2;
            const radius = eyeRadius + Math.random() * 10;
            const x = rightEyeX + Math.cos(angle) * radius;
            const y = rightEyeY + Math.sin(angle) * radius;
            
            this.spawnPatternWord('ПУСТОТА', x, y, 12, 1200 + i * 25);
        }
        
        // Чёрный зрачок правого глаза
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const radius = eyeRadius * 0.4;
            const x = rightEyeX + Math.cos(angle) * radius;
            const y = rightEyeY + Math.sin(angle) * radius;
            
            this.spawnPatternWord('█', x, y, 18, 1500 + i * 20);
        }
        
        // 4. ЖУТКАЯ УЛЫБКА - широкая, искажённая
        const smilePoints = 70;
        const smileWidth = faceRadius * 1.4;
        const smileHeight = faceRadius * 0.4;
        
        for (let i = 0; i < smilePoints; i++) {
            const t = i / smilePoints;
            // Парабола для улыбки, но искажённая
            const angle = Math.PI * 0.2 + t * Math.PI * 0.6;
            const baseRadius = smileWidth * 0.6;
            // Добавляем неровности
            const wobble = Math.sin(t * Math.PI * 8) * 8;
            const x = centerX + (t - 0.5) * smileWidth;
            const y = centerY + smileHeight + Math.sin(angle) * baseRadius * 0.5 + wobble;
            
            const word = ['НИКОГДА', 'ЗАБЫЛ', 'ПОВТОР', 'ЦИКЛ'][Math.floor(Math.random() * 4)];
            this.spawnPatternWord(word, x, y, 14, 2000 + i * 20);
        }
        
        // 5. ЗУБЫ В УЛЫБКЕ - ряд вертикальных линий
        const teethCount = 25;
        for (let i = 0; i < teethCount; i++) {
            const t = i / teethCount;
            const angle = Math.PI * 0.2 + t * Math.PI * 0.6;
            const x = centerX + (t - 0.5) * smileWidth;
            const y = centerY + smileHeight + Math.sin(angle) * smileWidth * 0.3;
            
            this.spawnPatternWord('│', x, y, 20, 2500 + i * 15);
        }
        
        // 6. НОС - маленький искажённый треугольник
        const nosePoints = [
            {x: centerX, y: centerY - faceRadius * 0.05},
            {x: centerX - 15, y: centerY + faceRadius * 0.1},
            {x: centerX + 15, y: centerY + faceRadius * 0.1}
        ];
        
        nosePoints.forEach((point, i) => {
            this.spawnPatternWord('▼', point.x, point.y, 14, 1800 + i * 50);
        });
        
        // 7. СЛЁЗЫ ИЗ ГЛАЗ - капли стекают вниз
        for (let i = 0; i < 8; i++) {
            const x = leftEyeX - 5 + Math.random() * 10;
            const y = leftEyeY + eyeRadius + i * 25;
            this.spawnPatternWord('│', x, y, 12, 3000 + i * 100);
        }
        
        for (let i = 0; i < 8; i++) {
            const x = rightEyeX - 5 + Math.random() * 10;
            const y = rightEyeY + eyeRadius + i * 25;
            this.spawnPatternWord('│', x, y, 12, 3000 + i * 100);
        }
        
        // 8. ДОПОЛНИТЕЛЬНЫЕ ЖУТКИЕ ДЕТАЛИ
        // Добавляем случайные слова вокруг лица
        const haloWords = ['ЗАБЫЛ', 'ВОДА', 'НИКОГДА', 'КОНЕЦ', 'СМЕРТЬ', 'ПУСТОТА'];
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = faceRadius * 1.3 + Math.random() * 50;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const word = haloWords[Math.floor(Math.random() * haloWords.length)];
            this.spawnPatternWord(word, x, y, 12 + Math.random() * 6, 3500 + i * 30);
        }
    }
    
    // Очистка всех слов паттернов
    clearPatterns() {
        this.patternWords.forEach(word => {
            word.classList.add('fading-out');
            setTimeout(() => word.remove(), 1000);
        });
        this.patternWords = [];
    }
    
    // Все слова становятся красными и интенсивными
    makeAllIntense() {
        this.words.forEach(word => {
            word.classList.add('intense');
        });
    }
}

// ВИНЬЕТКА С ДИНАМИЧЕСКИМ СЖАТИЕМ - ИСПРАВЛЕННАЯ
class DynamicVignette {
    constructor() {
        this.element = null;
        this.currentIntensity = 0.4;
    }
    
    init(selector) {
        this.element = document.querySelector(selector);
        if (this.element) {
            // Устанавливаем начальное состояние
            this.element.style.boxShadow = 'inset 0 0 500px rgba(0,0,0,0.4)';
        }
    }
    
    // Плавное сжатие по мере прогресса
    update(progression) {
        if (!this.element) return;
        
        // progression от 0 до 1
        // Начало: 500px, 0.4 opacity
        // Конец: 3000px, 0.95 opacity
        const size = 500 + progression * 2500;
        const darkness = 0.4 + progression * 0.55;
        
        this.element.style.transition = 'box-shadow 3s ease-out';
        this.element.style.boxShadow = `inset 0 0 ${size}px rgba(0,0,0,${darkness})`;
    }
    
    squeeze(intensity = 0.95, duration = 1000) {
        if (!this.element) return;
        
        // Резкое сжатие для критических моментов
        const size = 200 + (1 - intensity) * 2800;
        const darkness = 0.85 + intensity * 0.15;
        
        this.element.style.transition = `box-shadow ${duration}ms ease-out`;
        this.element.style.boxShadow = `inset 0 0 ${size}px rgba(0,0,0,${darkness})`;
        this.currentIntensity = intensity;
    }
    
    release(duration = 2000) {
        if (!this.element) return;
        
        const size = 800;
        this.element.style.transition = `box-shadow ${duration}ms ease-out`;
        this.element.style.boxShadow = `inset 0 0 ${size}px rgba(0,0,0,0.4)`;
        this.currentIntensity = 0.4;
    }
    
    // НОВЫЙ: Максимальное удушение для финала
    suffocate(duration = 2000) {
        if (!this.element) return;
        
        this.element.style.transition = `box-shadow ${duration}ms ease-in`;
        this.element.style.boxShadow = 'inset 0 0 3500px rgba(0,0,0,0.98)';
    }
}

// Экспорт для использования
if (typeof module !== 'undefined') {
    module.exports = { LivingWordsSystem, DynamicVignette };
}
