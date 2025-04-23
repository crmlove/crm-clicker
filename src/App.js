import React, { useState, useEffect, useRef } from 'react';
// Yandex Metrika tracking function
  const trackYandexMetrikaEvent = (eventName, eventParams = {}) => {
    if (window.ym) {
      window.ym(101298371, 'reachGoal', eventName, eventParams);
      console.log('Tracked event:', eventName, eventParams);
    } else {
      console.warn('Yandex Metrika not available');
    }
  };
  


// StarfieldAnimation component using Canvas
const StarfieldAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Star parameters
    const stars = [];
    const starCount = 150;
    const starSpeed = 2;
    
    // Create stars with random positions
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1 + starSpeed
      });
    }
    
    // Animation function
    const render = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0c1445');
      gradient.addColorStop(1, '#1a237e');
      
      // Clear canvas and fill with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw stars
      stars.forEach(star => {
        // Move star
        star.y += star.speed;
        
        // Reset star position if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Draw star
        const opacity = Math.min(1, star.speed / 3);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star trail
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x, star.y - star.speed * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = star.size * 0.7;
        ctx.stroke();
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

const CRMClicker = () => {
  // Store client in state for initial render, then use ref to prevent re-renders
  const [initialClient, setInitialClient] = useState(null);
  const clientRef = useRef(null);
  const [penaltyTimeoutId, setPenaltyTimeoutId] = useState(null);
  // Initialize state with predefined images
  // Initialize state variables
  const [stage, setStage] = useState('intro');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(7);
  const [usedProblems, setUsedProblems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [liked, setLiked] = useState(false);
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  
  // Component to create a Star Trek style warp speed effect
  const WarpStarField = () => {
    const [stars, setStars] = useState([]);
    
    useEffect(() => {
      // Create initial stars
      createStars();
      
      // Recreate stars periodically to maintain the effect
      const interval = setInterval(() => {
        createStars();
      }, 2000);
      
      return () => clearInterval(interval);
    }, []);
    
    const createStars = () => {
      const newStars = [];
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Create regular warp stars
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * screenWidth;
        const size = Math.random() * 2 + 1;
        const speedFactor = Math.random() * 0.8 + 0.5; // Between 0.5 and 1.3
        const startDelay = Math.random() * 2; // Random start delay
        
        newStars.push({
          id: `warp-${Date.now()}-${i}`,
          x,
          size,
          speedFactor,
          startDelay,
          type: 'regular'
        });
      }
      
      // Create bright warp stars
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * screenWidth;
        const size = Math.random() * 3 + 2;
        const speedFactor = Math.random() * 0.5 + 0.7; // Between 0.7 and 1.2
        const startDelay = Math.random() * 3; // Random start delay
        
        newStars.push({
          id: `warp-bright-${Date.now()}-${i}`,
          x,
          size,
          speedFactor,
          startDelay,
          type: 'bright'
        });
      }
      
      setStars(prev => [...prev, ...newStars]);
      
      // Remove old stars after they complete their animation
      setTimeout(() => {
        setStars(prev => prev.filter(star => 
          !newStars.some(newStar => newStar.id === star.id)
        ));
      }, 4000);
    };
    
    return (
      <>
        {stars.map(star => (
          star.type === 'regular' ? (
            <div
              key={star.id}
              className="warp-star"
              style={{
                left: `${star.x}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${2.5 / star.speedFactor}s`,
                animationDelay: `${star.startDelay}s`
              }}
            />
          ) : (
            <div
              key={star.id}
              className="warp-star-bright"
              style={{
                left: `${star.x}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${3 / star.speedFactor}s`,
                animationDelay: `${star.startDelay}s`
              }}
            />
          )
        ))}
      </>
    );
  };
  
  // Error messages for different client types
  const errors = {
    student: "Студент потерял интерес и переключился на соцсети...",
    parent: "Родитель отвлекся на семейные дела...",
    business: "Бизнесмен открыл сайт вашего конкурента...",
    tech: "Технарь нашел техническую ошибку и закрыл страницу...",
    creative: "Креативщик увлекся другим проектом..."
  };
  
  // Client types with proper image paths
  const clients = [
    { name: "Алексей", type: "student", desc: "студент, ищет доступные решения для учебы", image: "./images/student.png" },
    { name: "Мария", type: "parent", desc: "мама двоих детей, ценит экономию времени", image: "./images/parent.png" },
    { name: "Сергей", type: "business", desc: "владелец малого бизнеса, нуждается в росте продаж", image: "./images/business.png" },
    { name: "Иван", type: "tech", desc: "технический специалист, ценит инновационные решения", image: "./images/tech.png" },
    { name: "Екатерина", type: "creative", desc: "дизайнер, ищет креативные инструменты", image: "./images/creative.png" }
  ];
  
  // Женские имена для проверки пола клиента
  const femaleNames = ["Мария", "Екатерина"];
  
  // Colors for different client types
  const colors = {
    student: '#4285F4',
    parent: '#EA4335',
    business: '#34A853',
    tech: '#FBBC04',
    creative: '#8000FF'
  };
  
  // Problems for different client types
  // Problems for different client types
	const problems = {
	  // Students
	  student: [
		{ problem: "Студент не может оплатить полную стоимость подписки", solution: "Создать специальный студенческий тариф с 50% скидкой" },
		{ problem: "Студент забыл пароль и не может войти", solution: "Настроить восстановление через студенческую почту" },
		{ problem: "Студент хочет быстрее освоить ваш сервис", solution: "Предложить краткий курс обучения с основными функциями" },
		{ problem: "Студент не успевает изучать длинные материалы", solution: "Создать короткие видеоуроки по 3–5 минут" },
		{ problem: "Студент не понимает, как пользоваться сервисом", solution: "Внедрить интерактивную онбординг-систему" },
		{ problem: "Студент использует только смартфон и жалуется на тяжёлый интерфейс", solution: "Добавить облегчённый мобильный режим (PWA)" },
		{ problem: "Студенту нужен групповой тариф для однокурсников", solution: "Запустить «Study-группу» с общей скидкой при 3+ подписках" },
		{ problem: "Студенту неудобно платить картой банка", solution: "Подключить Apple Pay / Google Pay и «СБП»" },
		{ problem: "Студент живёт в другом часовом поясе и пропускает вебинары", solution: "Делать автозаписи и выдавать on-demand доступ" },
		{ problem: "Студент хочет оф-лайн доступ во время пути", solution: "Реализовать скачивание материалов в кэш приложения" },
		{ problem: "Студент боится утечки своих заметок", solution: "Шифровать пользовательские конспекты «на клиенте»" },
		{ problem: "Студент забывает продлевать подписку", solution: "Автоматические напоминания + бонус за досрочное продление" },
		{ problem: "Студенту мешают push-уведомления во время учёбы", solution: "Сделать режим «Фокус» с тихими уведомлениями" },
		{ problem: "Студент не видит связи курса с учебной программой вуза", solution: "Показывать рекомендованные модули по предметам семестра" },
		{ problem: "Студент просит интеграцию с LMS университета", solution: "Добавить LTI-коннектор для Moodle / Canvas" }
	  ],
	  
	  // Parents
	  parent: [
		{ problem: "Родитель беспокоится о доступе детей к контенту", solution: "Внедрить настройки родительского контроля" },
		{ problem: "Родитель не успевает на сложную настройку", solution: "Создать готовые шаблоны настроек для семей" },
		{ problem: "Родитель хочет контролировать расходы на подписки", solution: "Разработать семейный тариф с единым счётом" },
		{ problem: "Родитель не находит подходящий детский контент", solution: "Создать отдельный раздел для детей" },
		{ problem: "Родитель отвлекается на уведомления при работе", solution: "Добавить режим без отвлекающих уведомлений" },
		{ problem: "Родитель хочет ограничить экран-тайм ребёнка", solution: "Настроить ежедневные лимиты и отчёты по времени" },
		{ problem: "Родитель использует устройство с ребёнком по очереди", solution: "Ввести мультипрофиль с PIN-кодом" },
		{ problem: "Родителю нужен контент на разных языках", solution: "Добавить переключатель языка с детским дубляжом" },
		{ problem: "Родитель хочет отслеживать прогресс ребёнка", solution: "Сделать дашборд достижений с бейджами" },
		{ problem: "Родитель опасается случайных покупок внутри приложения", solution: "Включить блокировку In-App Purchases по паролю" },
		{ problem: "Родителю нужны готовые обучающие планы", solution: "Кураторские плейлисты «3–5 лет», «6–8 лет» и т.д." },
		{ problem: "Родитель ищет семейные скидки", solution: "Добавить кэшбэк-баллы за совместное пользование" },
		{ problem: "Родители хотят голосового управления на смарт-колонке", solution: "Интеграция с Alice/Google Assistant" },
		{ problem: "Родитель просит включить «режим сна» перед сном", solution: "Автоматический плейлист спокойных историй + тёплый режим экрана" },
		{ problem: "Родитель заботится о безопасной рекламе", solution: "Предложить полностью ad-free подписку Family Premium" }
	  ],
	  
	  // Business
	  business: [
		{ problem: "Бизнесмен не понимает выгоду от вашего продукта", solution: "Создать калькулятор ROI для бизнеса" },
		{ problem: "Бизнесмен беспокоится о безопасности данных", solution: "Внедрить корпоративное шифрование" },
		{ problem: "Бизнесмен не может интегрировать с CRM", solution: "Разработать коннекторы для популярных CRM" },
		{ problem: "Бизнесмену не хватает отраслевых функций", solution: "Предложить индивидуальную настройку" },
		{ problem: "Сотрудники не используют новую систему", solution: "Запустить программу обучения персонала" },
		{ problem: "Компания хочет управлять ролями пользователей", solution: "Добавить многоуровневые права доступа (Admin/Manager/User)" },
		{ problem: "Бизнес требует SSO", solution: "Поддержать SAML 2.0 и OAuth 2.0 SSO" },
		{ problem: "Отдел аналитики просит экспорт данных", solution: "Сделать CSV/BigQuery выгрузку по расписанию" },
		{ problem: "Бизнесу нужен SLA", solution: "Ввести тариф Enterprise с 99,9 % uptime" },
		{ problem: "Маркетологи хотят white-label", solution: "Предоставить кастомный бренд-скан и домен" },
		{ problem: "Финансы просят биллинг по отделам", solution: "Поддержать cost centers и счёт-сплит" },
		{ problem: "HR хочет быстрый онбординг сотрудников", solution: "Импорт пользователей через CSV/SCIM" },
		{ problem: "Компания работает в EU и требует GDPR", solution: "Добавить экспорт/удаление данных по запросу" },
		{ problem: "Топ-менеджмент хочет дорожную карту", solution: "Создать публичный портал roadmap + голосование фич" },
		{ problem: "Бизнес требует офлайн-режим при плохом интернете", solution: "Кэшировать основные функции в PWA" },
		{ problem: "Бизнес опасается утечки ПДн из-за непонятной политики конфиденциальности", solution: "Обновить политику в соответствии с требованиями ФЗ-420 и отдельно уведомить клиентов (e-mail + pop-up)" }
	  ],
	  
	  // Tech
	  tech: [
		{ problem: "Технарь обнаружил баг в вашем приложении", solution: "Выпустить срочное исправление проблемы" },
		{ problem: "Технарь хочет интегрировать ваш сервис", solution: "Предоставить документацию API с примерами" },
		{ problem: "Технарь жалуется на низкую производительность", solution: "Провести технический аудит и оптимизацию" },
		{ problem: "Технарю нужно изменить решение под свои задачи", solution: "Открыть часть кода для модификации" },
		{ problem: "Технарь сталкивается с проблемами совместимости", solution: "Внедрить универсальный протокол обмена" },
		{ problem: "Технарю нужен dark mode", solution: "Добавить переключение тёмной темы" },
		{ problem: "Технарь требует CLI-утилиту", solution: "Выпустить node-cli для DevOps" },
		{ problem: "Технарю нужны webhooks", solution: "Реализовать систему событий с подписью HMAC" },
		{ problem: "Технарю интересен self-hosted вариант", solution: "Предоставить Docker-image с auto-update" },
		{ problem: "Технарь просит SDK на разных языках", solution: "Опубликовать SDK для Python, Go, JS" },
		{ problem: "Технарю нужны unit-test примеры", solution: "Выдать репозиторий с test-suites" },
		{ problem: "Технарь хочет staging окружение", solution: "Дать песочницу с throttling API-ключом" },
		{ problem: "Технарю нужны feature-flags", solution: "Интегрировать LaunchDarkly/Flagsmith" },
		{ problem: "Технарю важно знать latency по регионам", solution: "Сделать публичный статус-пейдж с метриками" },
		{ problem: "Технарь хочет офлайн-документацию", solution: "Позволить загрузку HTML-Docs одним архивом" }
	  ],
	  
	  // Creative
	  creative: [
		{ problem: "Креативщику не хватает шаблонов в продукте", solution: "Запустить маркетплейс с дизайнами сообщества" },
		{ problem: "Креативщик считает интерфейс неудобным", solution: "Внедрить персонализацию под творческие задачи" },
		{ problem: "Креативщик не может работать с командой", solution: "Добавить инструменты для совместной работы" },
		{ problem: "Креативщику сложно делиться результатами", solution: "Создать интеграцию с платформами портфолио" },
		{ problem: "Креативщик теряет наработки из-за сбоев", solution: "Внедрить автосохранение и версионирование" },
		{ problem: "Креативщик ищет новые палитры", solution: "Построить генератор цветовых схем + AI рекомендациями" },
		{ problem: "Креативщик работает с 3D и не видит поддержки", solution: "Добавить 3D-шаблоны и glTF экспорт" },
		{ problem: "Креативщик хочет историю версий", solution: "Версионирование с возможностью отката в 1 клик" },
		{ problem: "Креативщик просит live-collab", solution: "Реализовать одновременное редактирование в реальном времени" },
		{ problem: "Креативщику нужна искра вдохновения", solution: "Добавить AI-генератор идей от ключевых слов" },
		{ problem: "Креативщик хочет premium-ассеты", solution: "Ввести подписку на pro-пакеты стоков" },
		{ problem: "Креативщик просит продвинутую типографику", solution: "Инструмент подбора пар шрифтов и кернинг AI" },
		{ problem: "Креативщик хочет AR-превью на смартфоне", solution: "Показ работы в AR через WebAR" },
		{ problem: "Креативщик экспортирует в разные форматы", solution: "Однокнопочный экспорт PNG/SVG/PDF/MP4" },
		{ problem: "Креативщик требует настраиваемые хоткеи", solution: "Сделать редактор горячих клавиш" }
	  ],
	  
	  // Common problems
	  common: [
		{ problem: "Клиент давно не заходил в приложение", solution: "Настроить цепочку email-сообщений для возврата" },
		{ problem: "Клиент оставил товары в корзине без оплаты", solution: "Отправить email с персональной скидкой" },
		{ problem: "Много пользователей отписываются от рассылки", solution: "Внедрить сегментацию с персонализацией" },
		{ problem: "Низкий процент повторных покупок клиентов", solution: "Запустить программу с бонусами лояльности" },
		{ problem: "Высокая стоимость привлечения клиентов", solution: "Создать реферальную программу с наградами" },
		{ problem: "Пользователи на мобильных часто бросают корзину", solution: "Подключить push-напоминания с deep-link на чек-аут" },
		{ problem: "Низкая открываемость писем", solution: "A/B-тестировать тему, тайм-слот и отправителя" },
		{ problem: "Высокий отток после триала", solution: "Сделать drip-онбординг с подсветкой value-point" },
		{ problem: "Негативные отзывы в сторах", solution: "Автоматически собирать фидбек до публичной оценки" },
		{ problem: "Клиенты путаются в тарифах", solution: "Интерактивный квиз по выбору подписки + всплывающий помощник" }
	  ]
	};

  
  // Animation styles
  const animationStyles = `
    @keyframes fadeUpAndOut {
      0% { opacity: 0; transform: translate(-50%, 0); }
      20% { opacity: 1; transform: translate(-50%, -30px); }
      80% { opacity: 1; transform: translate(-50%, -50px); }
      100% { opacity: 0; transform: translate(-50%, -70px); }
    }
    
    @keyframes warpSpeed {
      0% { 
        transform: translateZ(0) translateY(-100vh);
        opacity: 1;
      }
      100% { 
        transform: translateZ(600px) translateY(100vh);
        opacity: 0;
      }
    }
    
    @keyframes rotateAndWarp {
      0% {
        transform: rotate(0deg) translateZ(-50px) translateY(-10vh);
        opacity: 0.2;
      }
      30% {
        opacity: 1;
      }
      100% {
        transform: rotate(360deg) translateZ(250px) translateY(120vh);
        opacity: 0;
      }
    }
    
    .warp-star {
      position: absolute;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background-color: #fff;
      animation: warpSpeed 2.5s linear infinite;
      z-index: 0;
    }
    
    .warp-star-bright {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: #5affb4;
      box-shadow: 0 0 4px #5affb4;
      animation: rotateAndWarp 3s linear infinite;
      z-index: 1;
    }
  `;
  
  // Get random client
  const getRandomClient = () => {
    return clients[Math.floor(Math.random() * clients.length)];
  };
  
  // Get random problem for current client
  const getRandomProblem = () => {
    const client = clientRef.current;
    if (!client) return problems.common[0];
    
    // Combine specific and common problems
    const availableProblems = [...problems[client.type], ...problems.common];
    
    // Filter out already used problems
    const unusedProblems = availableProblems.filter(
      problem => !usedProblems.some(used => used.problem === problem.problem)
    );
    
    // Если неиспользованных проблем не осталось, возвращаем null
    // Это будет сигналом к окончанию игры
    if (unusedProblems.length === 0) {
      console.log("Все вопросы использованы!");
      // Если ответов достаточно для победы, перейти к опросу
      if (score >= 9) { // 9 вместо 10, т.к. текущий правильный ответ добавит еще 1 к счету
        setStage('survey');
        return null;
      }
      // Иначе завершить игру как выигрыш
      setStage('win');
      return null;
    }
    
    // Choose a random unused problem
    const randomIndex = Math.floor(Math.random() * unusedProblems.length);
    const selectedProblem = unusedProblems[randomIndex];
    
    // Add to used problems list
    setUsedProblems(prev => [...prev, selectedProblem]);
    console.log(`Выбрана проблема: "${selectedProblem.problem}". Осталось неиспользованных: ${unusedProblems.length-1}`);
    
    return selectedProblem;
  };
  
  // Generate answer options
  const generateOptions = (correctAnswer) => {
    // Create array with correct answer
    let result = [correctAnswer];
    
    // Collect all possible solutions
    const allSolutions = [];
    
    // Add solutions from all categories
    Object.values(problems).forEach(category => {
      category.forEach(item => {
        if (!allSolutions.includes(item.solution)) {
          allSolutions.push(item.solution);
        }
      });
    });
    
    // Filter out the correct answer
    const filteredOptions = allSolutions.filter(option => option !== correctAnswer);
    
    // Add two random incorrect options
    while (result.length < 3) {
      const randomIndex = Math.floor(Math.random() * filteredOptions.length);
      const option = filteredOptions[randomIndex];
      
      if (!result.includes(option)) {
        result.push(option);
      }
    }
    
    // Shuffle options
    return result.sort(() => Math.random() - 0.5);
  };
  
  // Next round - обновлено для обработки случая, когда проблемы закончились
  const nextRound = () => {
    const randomProblem = getRandomProblem();
    
    // Если проблемы закончились, завершаем игру
    if (!randomProblem) {
      if (score >= 7) {
        setStage('survey');
      } else {
        setStage('win');
      }
      return;
    }
    
    setProblem(randomProblem);
    setOptions(generateOptions(randomProblem.solution));
    setTimer(7);
    setShowError(false);
    setCorrectAnswer(null);
    setShowScoreAnimation(false);
  };
  
  // Start game
  const startGame = () => {
    // Set the client for the entire game session
    if (!clientRef.current && initialClient) {
      clientRef.current = initialClient;
    }
    
    setLives(3);
    setScore(0);
    setStage('game');
    setAttempts(prev => prev + 1);
    setUsedProblems([]);
    
    // Track game start event
    trackYandexMetrikaEvent('game_started', { 
      client_type: clientRef.current ? clientRef.current.type : 'unknown',
      attempt_number: attempts + 1
    });
    
    nextRound();
  };
  
  // Handle answer option
  // Handle answer option
  const handleOption = (option) => {
    // Clear the penalty timeout immediately on *any* answer click
    if (penaltyTimeoutId) {
      clearTimeout(penaltyTimeoutId);
      setPenaltyTimeoutId(null);
    }
    // Clear any visual error immediately on *any* answer click
    if (showError) {
        setShowError(false);
        setErrorMessage(''); // Clear the message too
    }
    
    if (option === problem.solution) {
      // Correct answer
      setCorrectAnswer(option);
      setShowScoreAnimation(true);
      
      // Track correct answer
      trackYandexMetrikaEvent('correct_answer', {
        client_type: clientRef.current ? clientRef.current.type : 'unknown',
        problem: problem.problem,
        solution: problem.solution,
        current_score: score
      });
      
      // Delay before moving to next round or ending
      setTimeout(() => {
        const newScore = score + 1;
        setScore(newScore);
        
        if (newScore >= 10) {
          trackYandexMetrikaEvent('game_won', { final_score: newScore, lives_left: lives });
          setStage('survey');
        } else {
          // Получаем новую проблему
          const nextProblem = getRandomProblem();
          
          // Если проблемы закончились, переходим к опросу/победе
          if (!nextProblem) {
            if (newScore >= 7) {
              trackYandexMetrikaEvent('game_won', { final_score: newScore, lives_left: lives });
              setStage('survey');
            } else {
              trackYandexMetrikaEvent('game_won', { final_score: newScore, lives_left: lives });
              setStage('win');
            }
            return;
          }
          
          // Продолжаем игру с новой проблемой
          setProblem(nextProblem);
          setOptions(generateOptions(nextProblem.solution));
          setTimer(7);
          setShowError(false);
          setCorrectAnswer(null);
          setShowScoreAnimation(false);
        }
      }, 1000);
    } else {
      // Incorrect answer
      const client = clientRef.current;
      const message = errors[client.type] || "Клиент потерял интерес...";
      setErrorMessage(message);
      setShowError(true);
      
      // Track incorrect answer
      trackYandexMetrikaEvent('incorrect_answer', {
        client_type: client ? client.type : 'unknown',
        problem: problem.problem,
        wrong_solution: option,
        correct_solution: problem.solution,
        current_score: score,
        lives_left: lives - 1
      });
      
      setTimeout(() => {
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
          // Проверяем количество очков при проигрыше
          if (score >= 7) {
            trackYandexMetrikaEvent('game_won', { final_score: score, lives_left: 0 });
            setStage('survey');
          } else {
            trackYandexMetrikaEvent('game_lost', { final_score: score });
            setStage('lose');
          }
        } else {
          // Получаем новую проблему для следующего раунда
          const nextProblem = getRandomProblem();
          
          // Если проблемы закончились, завершаем игру
          if (!nextProblem) {
            if (score >= 7) {
              trackYandexMetrikaEvent('game_won', { final_score: score, lives_left: newLives });
              setStage('survey');
            } else {
              trackYandexMetrikaEvent('game_won', { final_score: score, lives_left: newLives });
              setStage('win');
            }
            return;
          }
          
          // Продолжаем игру с новой проблемой
          setProblem(nextProblem);
          setOptions(generateOptions(nextProblem.solution));
          setTimer(7);
          setShowError(false); // Clear error when starting new round
          setCorrectAnswer(null);
          setShowScoreAnimation(false);
        }
      }, 1500);
    }
  };
  
  // Handle survey - разные состояния для положительного и отрицательного ответа
  const handleSurvey = (isLiked) => {
    setLiked(isLiked);
    
    // Track survey response
    trackYandexMetrikaEvent('survey_response', { 
      liked: isLiked,
      final_score: score
    });
    
    // Переходим на разные экраны в зависимости от ответа
    if (isLiked) {
      setStage('win');
    } else {
      setStage('feedback');
    }
  };
  
  // Функция для сохранения лучшего результата в бот и показа сообщения о второй части
	  const saveBestScoreToBotAndShowMessage = () => {
	  // Проверяем, доступен ли Telegram API
	  if (window.Telegram && window.Telegram.WebApp) {
		try {
		  // Получаем идентификатор пользователя из Telegram WebApp
		  const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id || 
						 window.Telegram.WebApp.initData?.user?.id || 
						 "unknown";
		  
		  // Отправляем данные не напрямую через API Telegram, а через промежуточный сервер или функцию WebApp
		  // Это более безопасный подход, который не раскрывает токен бота
		  if (window.Telegram.WebApp.sendData) {
			// Используем встроенный метод Telegram для отправки данных боту
			window.Telegram.WebApp.sendData(JSON.stringify({
			  action: 'saveScore',
			  score: score,
			  message: `Сохранен результат игры: ${score} из 10 очков\n\nХотите получить доступ ко второй части? Подписывайтесь на канал t.me/crmlove В нем больше стратегий для удержания клиентов`
			}));
			console.log('Запрос на сохранение результата отправлен через WebApp');
		  } else {
			// Альтернативный вариант - отправить данные на ваш собственный сервер
			// Токен бота хранится на сервере, а не в клиентском коде
			fetch('https://ваш-сервер.com/api/save-score', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({
				userId: userId,
				score: score,
				clientType: clientRef.current?.type || 'unknown'
			  })
			})
			.then(response => {
			  if (!response.ok) {
				console.error('Ошибка сохранения результата');
			  } else {
				console.log('Результат успешно сохранен');
			  }
			})
			.catch(error => {
			  console.error('Ошибка при отправке результата:', error);
			});
		  }
		} catch (error) {
		  console.error('Ошибка при сохранении результата:', error);
		}
	  } else {
		console.log('Telegram WebApp API недоступен для сохранения результата');
		
		// Если WebApp недоступен, показываем пользователю сообщение
		
	  }
	};
  
  // Share game
  const shareGame = () => {
    // Формируем текст для шаринга
    const clientName = clientRef.current ? clientRef.current.name : "клиент";
    const scoreText = `Мой результат в CRM Clicker: ${score} из 10 очков!`;
    const clientText = `${clientName} ${stage === 'lose' ? 'ушел к конкурентам' : 'успешно прошел путь'}!`;
    const shareText = `${scoreText}\n${clientText}\nПопробуй и ты: https://t.me/crmclicker_bot/crmclicker`;
    
    // Сохраняем лучший результат в боте
    saveBestScoreToBotAndShowMessage();
    
    // Метрика
    trackYandexMetrikaEvent('share_game', { 
      final_score: score,
      client_type: clientRef.current ? clientRef.current.type : 'unknown',
      share_text: shareText
    });
    
    // Шаринг через Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=https://t.me/crmclicker_bot/crmclicker&text=${encodeURIComponent(shareText)}`
      );
    } else {
      // Запасной вариант для тестирования вне Telegram
      try {
        // Попытка использовать Web Share API если доступно
        if (navigator.share) {
          navigator.share({
            title: 'CRM Clicker',
            text: shareText,
            url: 'https://t.me/crmclicker_bot/crmclicker'
          });
        } else {
          // Если Web Share API недоступно, открываем обычную ссылку
          window.open(`https://t.me/share/url?url=https://t.me/crmclicker_bot/crmclicker&text=${encodeURIComponent(shareText)}`, '_blank');
        }
      } catch (error) {
        console.error('Ошибка при шаринге:', error);
        alert('Не удалось открыть окно шаринга. Попробуйте еще раз!');
      }
    }
  };
  
  // Restart game - сохраняем согласованность между initialClient и clientRef
  const restart = () => {
    // Сохраняем лучший результат в бот перед рестартом, если игра была окончена
    if (stage === 'win' || stage === 'lose' || stage === 'survey' || stage === 'feedback') {
      saveBestScoreToBotAndShowMessage();
    }
    
    const newClient = getRandomClient();
    clientRef.current = newClient;
    setInitialClient(newClient); // Обновляем оба источника клиента
    
    setLives(3);
    setScore(0);
    setStage('intro');
    setShowError(false);
    setUsedProblems([]);
  };
  
  // Initialize game, preload images, init client
  useEffect(() => {
    // Set initial client for intro screen
    const newClient = getRandomClient();
    clientRef.current = newClient;
    setInitialClient(newClient);
    console.log("Initial client set:", newClient);
    
    // Preload all client images
    clients.forEach(client => {
      if (client.image) {
        const img = new Image();
        img.src = client.image;
      }
    });
    
    // Track initial page view
    if (window.ym) {
      setTimeout(() => {
        trackYandexMetrikaEvent('game_loaded');
      }, 1000);
    }
  }, []);
  
  // Timer effect
// Timer effect
  useEffect(() => {
    if (stage === 'game' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) { // Still check <= 1 to show the last second
            clearInterval(interval);
            
            // Set a timeout for the penalty and visual error
            const timeoutId = setTimeout(() => {
              // Only apply penalty and show error if an answer hasn't been given
              // This check inside the timeout is redundant because penaltyTimeoutId is cleared,
              // but it makes the logic explicit. The main fix is that setting the error
              // is now inside this delayed timeout.
              if (stage === 'game') { // Ensure we are still in the game stage
                setErrorMessage("Время вышло! Клиент потерял интерес...");
                setShowError(true);
                
                const newLives = lives - 1;
                setLives(newLives);
                
                if (newLives <= 0) {
                  // Когда игра заканчивается из-за отсутствия жизней
                  // Проверяем количество очков для определения исхода
                  if (score >= 7) {
                    setStage('survey');
                  } else {
                    setStage('lose');
                  }
                } else {
                  // Получаем новую проблему - интегрируем проверку на доступность проблем
                  const nextProblem = getRandomProblem();
                  if (!nextProblem) {
                    if (score >= 7) {
                      setStage('survey');
                    } else {
                      setStage('win');
                    }
                    return;
                  }
                  
                  // Продолжаем с новой проблемой
                  setProblem(nextProblem);
                  setOptions(generateOptions(nextProblem.solution));
                  setTimer(7);
                  setShowError(false); // Clear error when starting new round
                  setCorrectAnswer(null);
                  setShowScoreAnimation(false);
                }
              }
              setPenaltyTimeoutId(null); // Clear the timeout ID state after it executes
            }, 1500);
            
            // Store the timeout ID so it can be cleared by handleOption
            setPenaltyTimeoutId(timeoutId);
            
            return 0; // Set timer to 0 immediately when it reaches 1
          }
          return prev - 1;
        });
      }, 1000);
      
      // Cleanup function to clear interval and any pending timeout
      return () => {
        clearInterval(interval);
        if (penaltyTimeoutId) {
          clearTimeout(penaltyTimeoutId);
          setPenaltyTimeoutId(null); // Clear state on cleanup
        }
      };
    } else if (stage !== 'game' && penaltyTimeoutId) {
       // Clear any pending penalty timeout if game stage changes
       clearTimeout(penaltyTimeoutId);
       setPenaltyTimeoutId(null);
       setShowError(false); // Also clear the error message if stage changes
    }
  }, [stage, timer, lives, score, penaltyTimeoutId]); // Add penaltyTimeoutId to dependency array
  
  // Styles
  // Styles
  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      textAlign: 'center'
    },
    footer: {
      width: '100%',
      textAlign: 'center',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.7)',
      padding: '10px 0',
      marginTop: '20px',
      position: 'relative',
      zIndex: 10
    },
    footerLink: {
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    box: {
      backgroundColor: 'rgba(10, 20, 50, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      width: '100%',
      maxWidth: '450px',
      boxSizing: 'border-box',
      marginBottom: '15px',
      border: '1px solid rgba(100, 200, 255, 0.5)',
      textAlign: 'center',
      boxShadow: '0 0 20px rgba(100, 200, 255, 0.2)',
      backdropFilter: 'blur(5px)',
      position: 'relative',
      zIndex: 10,
      fontSize: '14px'
    },
    avatar: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      backgroundColor: '#1a237e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 15px auto',
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white'
    },
    button: {
      backgroundColor: 'rgba(41, 98, 255, 0.8)',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '12px',
      margin: '5px 0',
      width: '100%',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(41, 98, 255, 0.9)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)'
      },
      '&:active': {
        transform: 'translateY(1px)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    },
    buttonGreen: {
      backgroundColor: 'rgba(52, 168, 83, 0.8)'
    },
    buttonRed: {
      backgroundColor: 'rgba(234, 67, 53, 0.8)'
    },
    buttonCorrect: {
      backgroundColor: '#4CAF50',
      boxShadow: '0 0 15px rgba(76, 175, 80, 0.8)'
    },
    highlight: {
      color: '#5affb4',
      fontWeight: 'bold'
    },
    errorOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      color: '#ff5a5f',
      fontSize: '20px',
      textAlign: 'center',
      padding: '0 20px'
    },
    scoreAnimation: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#4CAF50',
      fontSize: '48px',
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(76, 175, 80, 0.8)',
      animation: 'fadeUpAndOut 1s forwards',
      zIndex: 200
    }
  };
  
  // Get the current client (either from state or ref)
  const client = clientRef.current || initialClient;
  
  // Debug вывод перед рендерингом для проверки
  console.log("Rendering with client:", client ? client.name : "no client", 
              "initialClient:", initialClient ? initialClient.name : "none", 
              "clientRef:", clientRef.current ? clientRef.current.name : "none",
              "stage:", stage);
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Yandex Metrika counter - noscript fallback */}
      <noscript>
        <div>
          <img src="https://mc.yandex.ru/watch/101298371" style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
      
      <div style={styles.container}>
        <StarfieldAnimation />
        <div style={styles.title}>
          CRM Clicker ⭐🚀
          <div style={{
            fontSize: '14px',
            fontWeight: 'normal',
            marginTop: '5px',
            opacity: 0.9,
            color: '#167DFF'
          }}>
            от студии CRMLOVE 💙
          </div>
        </div>
        
        {/* Introduction */}
        {stage === 'intro' && client && (
          <div style={styles.box}>
            <h2>Клиентский путь начинается!</h2>
            
            {client.image ? (
              <img 
                src={client.image} 
                alt={client.name}
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 15px auto',
                  display: 'block',
                  objectFit: 'contain'
                }} 
              />
            ) : (
              <div style={{
                ...styles.avatar,
                backgroundColor: colors[client.type] || '#1a237e'
              }}>
                {client.name.charAt(0)}
              </div>
            )}
            
            <p>Это <span style={styles.highlight}>{client.name}</span> — {client.desc}.</p>
            
            <p>{client.name} {femaleNames.includes(client.name) ? "нашла" : "нашел"} ваш бренд и почти совершил{femaleNames.includes(client.name) ? "а" : ""} покупку. 
            Но путь впереди — как космос: красивый, но опасный.</p>
            
            <p>У вас есть только 3 жизни. Ошибка — и клиент уйдёт навсегда.</p>
            
            <button style={styles.button} onClick={startGame}>
              Начать путь
            </button>
            
            <div style={{fontSize: '12px', marginTop: '15px', opacity: 0.7}}>
              Разработано CRMLOVE · <a 
                href="https://crmlove.ru/privacy" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'underline'}}
                onClick={() => trackYandexMetrikaEvent('privacy_policy_click', {location: 'intro_screen'})}
              >
                Политика конфиденциальности
              </a>
            </div>
          </div>
        )}
        
        {/* Game */}
        {stage === 'game' && problem && client && (
          <>
            <div style={styles.box}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
              {client.image ? (
                <img 
                  src={client.image} 
                  alt={client.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '10px',
                    objectFit: 'contain'
                  }} 
                />
              ) : (
                <div style={{
                  ...styles.avatar,
                  backgroundColor: colors[client.type] || '#1a237e',
                  width: '50px',
                  height: '50px',
                  marginRight: '10px',
                  marginBottom: 0
                }}>
                  {client.name.charAt(0)}
                </div>
              )}
              <div style={{textAlign: 'left'}}>
                <div><span style={styles.highlight}>{client.name}</span></div>
                <div>🔥 Проблема:</div>
              </div>
            </div>
              
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                "{problem.problem}"
              </div>
            </div>
            
            <div style={{
              ...styles.box,
              backgroundColor: 'rgba(25, 118, 210, 0.5)',
              padding: '8px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              ⏱️ {timer}с
            </div>
            
            <div style={{width: '100%', maxWidth: '500px'}}>
              {options.map((option, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.button,
                    ...(correctAnswer === option ? styles.buttonCorrect : {})
                  }}
                  onClick={() => handleOption(option)}
                  disabled={showError || correctAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {showScoreAnimation && (
              <div style={styles.scoreAnimation}>+1</div>
            )}
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '450px',
              marginTop: '10px',
              fontSize: '14px'
            }}>
              <div>❤️ Жизни: {lives}</div>
              <div>⭐ Очки: {score}/10</div>
            </div>
            
            {showError && (
              <div style={styles.errorOverlay}>
                <div>{errorMessage}</div>
              </div>
            )}
          </>
        )}
        
        {/* Survey */}
        {stage === 'survey' && client && (
          <div style={styles.box}>
            <h2>Спасибо за игру!</h2>
            
            {client.image ? (
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 15px auto',
                backgroundImage: `url(${client.image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}></div>
            ) : (
              <div style={{
                ...styles.avatar,
                backgroundColor: colors[client.type] || '#1a237e'
              }}>
                {client.name.charAt(0)}
              </div>
            )}
            
            <p>Клиент <span style={styles.highlight}>{client.name}</span> успешно прошел путь!</p>
            
            <p>Вы собрали {score} очков из 10</p>
            
            <h3>Понравилась ли вам игра?</h3>
            
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <button 
                style={{...styles.button, ...styles.buttonGreen, width: '48%'}}
                onClick={() => handleSurvey(true)}
              >
                👍 Да
              </button>
              
              <button 
                style={{...styles.button, ...styles.buttonRed, width: '48%'}}
                onClick={() => handleSurvey(false)}
              >
                👎 Нет
              </button>
            </div>
          </div>
        )}
        
        {/* Win */}
        {stage === 'win' && client && (
          <div style={styles.box}>
            <h2 style={{color: '#5affb4'}}>Поздравляем! Вы победили! 🏆</h2>
            
            {client.image ? (
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 15px auto',
                backgroundImage: `url(${client.image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}></div>
            ) : (
              <div style={{
                ...styles.avatar,
                backgroundColor: colors[client.type] || '#1a237e'
              }}>
                {client.name.charAt(0)}
              </div>
            )}
            
            <p>Клиент <span style={styles.highlight}>{client.name}</span> успешно завершил путь!</p>
            
            <p>Вы собрали {score} очков из 10</p>
            
            <div style={{margin: '20px 0'}}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '15px',
                border: '1px solid rgba(100, 200, 255, 0.5)',
                fontSize: '13px'
              }}>
                <h3 style={{color: '#5affb4', marginTop: '0', fontSize: '16px'}}>🚀 Хотите открыть продолжение?</h3>
                
                <p style={{margin: '5px 0'}}>Подписка на канал студии <strong>CRMLOVE</strong> — это ваш доступ ко второй части игры.
                Только подписчики узнают, как развиваются события и какие герои появятся дальше.</p>
                
                <p style={{margin: '5px 0'}}>📈 Кроме того, вас ждёт полезный контент о росте продаж и любви к клиентам 💙</p>
              </div>
              
              <a 
                href="https://t.me/crmlove" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  ...styles.button,
                  backgroundColor: '#22a0ff',
                  fontSize: '18px',
                  padding: '15px',
                  textDecoration: 'none',
                  display: 'block',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0, 136, 204, 0.5)',
                  marginBottom: '25px'
                }}
              >
                ✨ Подписаться на канал ✨
              </a>
              
              <p>Понравилась игра? Поделитесь с друзьями!</p>
              
              <button 
                style={styles.button}
                onClick={shareGame}
              >
                Поделиться игрой
              </button>
            </div>
            
            <button style={{
              ...styles.button,
              backgroundColor: '#4CAF50',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(76, 175, 80, 0.5)'
            }}
            onClick={restart}
          >
            🎮 Играть еще раз
          </button>
          </div>
        )}
        
        {/* Feedback screen when player didn't like the game */}
        {stage === 'feedback' && client && (
          <div style={styles.box}>
            <h2 style={{color: '#f8ca00'}}>Спасибо за отзыв! 📝</h2>
            
            {client.image ? (
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 15px auto',
                backgroundImage: `url(${client.image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}></div>
            ) : (
              <div style={{
                ...styles.avatar,
                backgroundColor: colors[client.type] || '#1a237e'
              }}>
                {client.name.charAt(0)}
              </div>
            )}
            
            <p>Вы успешно помогли клиенту <span style={styles.highlight}>{client.name}</span>!</p>
            
            <p>Вы набрали {score} очков из 10</p>
            
            <div style={{margin: '20px 0'}}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '15px',
                border: '1px solid rgba(100, 200, 255, 0.5)',
                fontSize: '13px'
              }}>
                <h3 style={{color: '#f8ca00', marginTop: '0', fontSize: '16px'}}>💡 Помогите нам стать лучше!</h3>
                
                <p style={{margin: '5px 0'}}>Спасибо, что сообщили, что игра вам не понравилась. Мы постоянно улучшаем наш продукт.</p>
                
                <p style={{margin: '5px 0'}}>Подпишитесь на канал <strong>CRMLOVE</strong>, чтобы увидеть наши новые, улучшенные игры и полезный контент о клиентском сервисе!</p>
              </div>
              
              <a 
                href="https://t.me/crmlove" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  ...styles.button,
                  backgroundColor: '#22a0ff',
                  fontSize: '18px',
                  padding: '15px',
                  textDecoration: 'none',
                  display: 'block',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0, 136, 204, 0.5)',
                  marginBottom: '25px'
                }}
              >
                ✨ Подписаться на канал ✨
              </a>
            </div>
            
            <button 
              style={{
                ...styles.button,
                backgroundColor: '#4CAF50',
                padding: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.5)'
              }}
              onClick={restart}
            >
              🎮 Играть еще раз
            </button>
          </div>
        )}
        
        {/* Lose */}
        {stage === 'lose' && client && (
          <div style={styles.box}>
            <h2 style={{color: '#ff5a5f'}}>Игра окончена! 💔</h2>
            
            {client.image ? (
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 15px auto',
                backgroundImage: `url(${client.image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'grayscale(100%)',
                opacity: '0.7'
              }}></div>
            ) : (
              <div style={{
                ...styles.avatar,
                backgroundColor: colors[client.type] || '#1a237e'
              }}>
                {client.name.charAt(0)}
              </div>
            )}
            
            <p>Клиент <span style={{color: '#ff5a5f'}}>{client.name}</span> ушел к конкурентам!</p>
            
            <p>Вы собрали {score} очков из 10</p>
            
            {attempts >= 3 && (
              <>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(100, 200, 255, 0.5)'
                }}>
                  <h3 style={{color: '#5affb4', marginTop: '0'}}>🚀 Хотите узнать как победить?</h3>
                  
                  <p>Подписка на канал студии <strong>CRMLOVE</strong> откроет вам секреты успешного прохождения игры!</p>
                  
                  <p>📈 Вас ждёт полезный контент о росте продаж и любви к клиентам 💙</p>
                </div>
                
                <a 
                  href="https://t.me/crmlove" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    ...styles.button,
                    backgroundColor: '#22a0ff',
                    fontSize: '16px',
                    padding: '12px',
                    textDecoration: 'none',
                    display: 'block',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0, 136, 204, 0.5)',
                    marginBottom: '15px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onClick={() => trackYandexMetrikaEvent('channel_subscription_click', { from: 'win_screen' })}
                >
                  ✨ Подписаться на канал ✨
                </a>
                
                <p>Хотите поделиться своими результатами?</p>
                
                <button 
                  style={{
                    ...styles.button,
                    marginBottom: '20px'
                  }}
                  onClick={shareGame}
                >
                  Поделиться игрой
                </button>
              </>
            )}
            
            <button 
              style={{
                ...styles.button,
                backgroundColor: '#4CAF50',
                padding: '15px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
              onClick={restart}
            >
              🎮 Играть еще раз
            </button>
          </div>
        )}
      </div>

      {/* Глобальный футер для всего приложения */}
      <div style={styles.footer}>
        Разработано CRMLOVE · <a 
          href="https://crmlove.ru/privacy" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={styles.footerLink}
          onClick={() => trackYandexMetrikaEvent('privacy_policy_click')}
        >
          Политика конфиденциальности
        </a>
      </div>
    </>
  );
};

export default CRMClicker;