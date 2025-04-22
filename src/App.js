import React, { useState, useEffect, useRef } from 'react';

const CRMClicker = () => {
  // Store client in state for initial render, then use ref to prevent re-renders
  const [initialClient, setInitialClient] = useState(null);
  const clientRef = useRef(null);
  
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
  
  // Preload images
  useEffect(() => {
    // Preload all client images
    clients.forEach(client => {
      if (client.image) {
        const img = new Image();
        img.src = client.image;
      }
    });
  }, []);
  
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
  
  // Colors for different client types
  const colors = {
    student: '#4285F4',
    parent: '#EA4335',
    business: '#34A853',
    tech: '#FBBC04',
    creative: '#8000FF'
  };
  
  // Problems for different client types
  const problems = {
    // Students
    student: [
      { problem: "Студент не может оплатить полную стоимость подписки", solution: "Создать специальный студенческий тариф с 50% скидкой" },
      { problem: "Студент забыл пароль и не может войти", solution: "Настроить восстановление через студенческую почту" },
      { problem: "Студент хочет быстрее освоить ваш сервис", solution: "Предложить краткий курс обучения с основными функциями" },
      { problem: "Студент не успевает изучать длинные материалы", solution: "Создать короткие видеоуроки по 3-5 минут" },
      { problem: "Студент не понимает, как пользоваться сервисом", solution: "Внедрить интерактивную онбординг-систему" }
    ],
    
    // Parents
    parent: [
      { problem: "Родитель беспокоится о доступе детей к контенту", solution: "Внедрить настройки родительского контроля" },
      { problem: "Родитель не успевает на сложную настройку", solution: "Создать готовые шаблоны настроек для семей" },
      { problem: "Родитель хочет контролировать расходы на подписки", solution: "Разработать семейный тариф с единым счетом" },
      { problem: "Родитель не находит подходящий детский контент", solution: "Создать отдельный раздел для детей" },
      { problem: "Родитель отвлекается на уведомления при работе", solution: "Добавить режим без отвлекающих уведомлений" }
    ],
    
    // Business
    business: [
      { problem: "Бизнесмен не понимает выгоду от вашего продукта", solution: "Создать калькулятор ROI для бизнеса" },
      { problem: "Бизнесмен беспокоится о безопасности данных", solution: "Внедрить корпоративное шифрование" },
      { problem: "Бизнесмен не может интегрировать с CRM", solution: "Разработать коннекторы для популярных CRM" },
      { problem: "Бизнесмену не хватает отраслевых функций", solution: "Предложить индивидуальную настройку" },
      { problem: "Сотрудники не используют новую систему", solution: "Запустить программу обучения персонала" }
    ],
    
    // Tech
    tech: [
      { problem: "Технарь обнаружил баг в вашем приложении", solution: "Выпустить срочное исправление проблемы" },
      { problem: "Технарь хочет интегрировать ваш сервис", solution: "Предоставить документацию API с примерами" },
      { problem: "Технарь жалуется на низкую производительность", solution: "Провести технический аудит и оптимизацию" },
      { problem: "Технарю нужно изменить решение под свои задачи", solution: "Открыть часть кода для модификации" },
      { problem: "Технарь сталкивается с проблемами совместимости", solution: "Внедрить универсальный протокол обмена" }
    ],
    
    // Creative
    creative: [
      { problem: "Креативщику не хватает шаблонов в продукте", solution: "Запустить маркетплейс с дизайнами сообщества" },
      { problem: "Креативщик считает интерфейс неудобным", solution: "Внедрить персонализацию под творческие задачи" },
      { problem: "Креативщик не может работать с командой", solution: "Добавить инструменты для совместной работы" },
      { problem: "Креативщику сложно делиться результатами", solution: "Создать интеграцию с платформами портфолио" },
      { problem: "Креативщик теряет наработки из-за сбоев", solution: "Внедрить автосохранение и версионирование" }
    ],
    
    // Common problems
    common: [
      { problem: "Клиент давно не заходил в приложение", solution: "Настроить цепочку email-сообщений для возврата" },
      { problem: "Клиент оставил товары в корзине без оплаты", solution: "Отправить email с персональной скидкой" },
      { problem: "Много пользователей отписываются от рассылки", solution: "Внедрить сегментацию с персонализацией" },
      { problem: "Низкий процент повторных покупок клиентов", solution: "Запустить программу с бонусами лояльности" },
      { problem: "Высокая стоимость привлечения клиентов", solution: "Создать реферальную программу с наградами" }
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
  
  // Start game - использовать текущего клиента с intro экрана, а не создавать нового
  const startGame = () => {
    // Сохранить клиента с начального экрана
    if (!clientRef.current && initialClient) {
      clientRef.current = initialClient;
    }
    
    setLives(3);
    setScore(0);
    setStage('game');
    setAttempts(prev => prev + 1);
    setUsedProblems([]);
    
    nextRound();
  };
  
  // Handle answer option
  const handleOption = (option) => {
    if (option === problem.solution) {
      // Correct answer
      setCorrectAnswer(option);
      setShowScoreAnimation(true);
      
      // Delay before moving to next round or ending
      setTimeout(() => {
        const newScore = score + 1;
        setScore(newScore);
        
        if (newScore >= 10) {
          setStage('survey');
        } else {
          // Получаем новую проблему
          const nextProblem = getRandomProblem();
          
          // Если проблемы закончились, переходим к опросу
          if (!nextProblem) {
            if (newScore >= 7) { // Если набрано достаточно баллов для "победы"
              setStage('survey');
            } else {
              setStage('win'); // Если не хватает баллов, всё равно считаем победой
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
      
      setTimeout(() => {
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
          setStage('lose');
        } else {
          // Получаем новую проблему для следующего раунда
          const nextProblem = getRandomProblem();
          
          // Если проблемы закончились, завершаем игру
          if (!nextProblem) {
            if (score >= 7) {
              setStage('survey');
            } else {
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
      }, 1500);
    }
  };
  
  // Handle survey - разные состояния для положительного и отрицательного ответа
  const handleSurvey = (isLiked) => {
    setLiked(isLiked);
    // Переходим на разные экраны в зависимости от ответа
    if (isLiked) {
      setStage('win');
    } else {
      setStage('feedback');
    }
  };
  
  // Share game
  const shareGame = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        "https://t.me/share/url?url=https://crmlove.github.io/crm-clicker"
      );
    }
  };
  
  // Restart game - сохраняем согласованность между initialClient и clientRef
  const restart = () => {
    const newClient = getRandomClient();
    clientRef.current = newClient;
    setInitialClient(newClient); // Обновляем оба источника клиента
    
    setLives(3);
    setScore(0);
    setStage('intro');
    setShowError(false);
    setUsedProblems([]);
  };
  
  // Initialize game
  useEffect(() => {
    // Set initial client for intro screen
    const newClient = getRandomClient();
    clientRef.current = newClient;
    setInitialClient(newClient);
    console.log("Initial client set:", newClient);
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (stage === 'game' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            
            setErrorMessage("Время вышло! Клиент потерял интерес...");
            setShowError(true);
            
            setTimeout(() => {
              const newLives = lives - 1;
              setLives(newLives);
              
              if (newLives <= 0) {
                setStage('lose');
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
                setShowError(false);
                setCorrectAnswer(null);
                setShowScoreAnimation(false);
              }
            }, 1500);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [stage, timer, lives, score]);
  
  // Styles
  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0c1445',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center'
    },
    box: {
      backgroundColor: 'rgba(10, 20, 50, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box',
      marginBottom: '20px',
      border: '1px solid rgba(100, 200, 255, 0.5)',
      textAlign: 'center'
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
      cursor: 'pointer'
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
  
  // Render
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div style={styles.container}>
        <div style={styles.title}>CRM Clicker ⭐🚀</div>
        
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
            
            <p>{client.name} нашел(а) ваш бренд и почти совершил(а) покупку. 
            Но путь впереди — как космос: красивый, но опасный.</p>
            
            <p>У вас есть только 3 жизни. Ошибка — и клиент уйдёт навсегда.</p>
            
            <button style={styles.button} onClick={startGame}>
              Начать путь
            </button>
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
              maxWidth: '500px',
              marginTop: '15px'
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
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid rgba(100, 200, 255, 0.5)'
              }}>
                <h3 style={{color: '#5affb4', marginTop: '0'}}>🚀 Хотите открыть продолжение?</h3>
                
                <p>Подписка на канал студии <strong>CRMLOVE</strong> — это ваш доступ ко второй части игры.
                Только подписчики узнают, как развиваются события и какие герои появятся дальше.</p>
                
                <p>📈 Кроме того, вас ждёт полезный контент о росте продаж и любви к клиентам 💙</p>
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
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid rgba(100, 200, 255, 0.5)'
              }}>
                <h3 style={{color: '#f8ca00', marginTop: '0'}}>💡 Помогите нам стать лучше!</h3>
                
                <p>Спасибо, что сообщили, что игра вам не понравилась. Мы постоянно улучшаем наш продукт.</p>
                
                <p>Подпишитесь на канал <strong>CRMLOVE</strong>, чтобы увидеть наши новые, улучшенные игры и полезный контент о клиентском сервисе!</p>
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
    </>
  );
};

export default CRMClicker;