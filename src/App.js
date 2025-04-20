import React, { useState, useEffect, useRef } from 'react';

const StarfieldAnimation = () => {
  // Animation params for the starfield
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
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
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={500} 
      height={800}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: -1,
        opacity: 1
      }}
    />
  );
};

const App = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [timer, setTimer] = useState(3);
  const [highScore, setHighScore] = useState(0);
  
   // ВОТ СЮДА НУЖНО ВСТАВИТЬ КОД ИНТЕГРАЦИИ С TELEGRAM
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // CRM problems database - each with a problem description and correct solution
  const crmProblems = [
    { problem: "Клиент ушёл в оффлайн", solution: "Email с бонусом" },
    { problem: "Письмо не открылось", solution: "A/B тест" },
    { problem: "Низкая конверсия в первой покупке", solution: "Push-уведомление" },
    { problem: "Клиент давно не заходил", solution: "Цепочка реактивации" },
    { problem: "Корзина брошена", solution: "Email с напоминанием" },
    { problem: "Много отписок от рассылки", solution: "Сегментация базы" },
    { problem: "Низкий процент повторных покупок", solution: "Программа лояльности" },
    { problem: "Высокая стоимость привлечения", solution: "Реферальная программа" },
    { problem: "Плохие отзывы о продукте", solution: "Опрос удовлетворенности" },
    { problem: "Клиенты не используют новую функцию", solution: "Обучающие материалы" },
    { problem: "Высокий процент возвратов", solution: "Анализ причин возврата" },
    { problem: "Клиенты не переходят на платный тариф", solution: "Ограничение пробного периода" }
  ];

  // All possible CRM mechanisms (including the correct solutions)
  const allMechanisms = [
    "Email с бонусом", "A/B тест", "Push-уведомление", "Цепочка реактивации",
    "Email с напоминанием", "Сегментация базы", "Программа лояльности",
    "Реферальная программа", "Опрос удовлетворенности", "Обучающие материалы",
    "Анализ причин возврата", "Ограничение пробного периода"
  ];

  // Get random problem
  const getRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * crmProblems.length);
    return crmProblems[randomIndex];
  };

  // Generate options (1 correct + 2 random wrong ones)
  const generateOptions = (correctSolution) => {
    // Start with the correct solution
    let optionsArray = [correctSolution];
    
    // Filter out the correct solution from all mechanisms
    const wrongOptions = allMechanisms.filter(option => option !== correctSolution);
    
    // Randomly select 2 wrong options
    while (optionsArray.length < 3) {
      const randomIndex = Math.floor(Math.random() * wrongOptions.length);
      const option = wrongOptions[randomIndex];
      
      // Add only if not already in options
      if (!optionsArray.includes(option)) {
        optionsArray.push(option);
      }
    }
    
    // Shuffle options
    return optionsArray.sort(() => Math.random() - 0.5);
  };

  // Start new problem round
  const startNewRound = () => {
    const problem = getRandomProblem();
    setCurrentProblem(problem);
    setOptions(generateOptions(problem.solution));
    setTimer(3);
  };

  // Handle option selection
  const handleOptionClick = (selectedOption) => {
    if (selectedOption === currentProblem.solution) {
      // Correct answer
      setScore(score + 1);
      if (score + 1 >= 10) {
        setGameStatus('won');
      } else {
        startNewRound();
      }
    } else {
      // Wrong answer
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setGameStatus('lost');
      } else {
        startNewRound();
      }
    }
  };

  // Restart game
  const restartGame = () => {
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
    }
    
    setScore(0);
    setLives(3);
    setGameStatus('playing');
    startNewRound();
  };

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameStatus === 'playing') {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            startNewRound();
            return 3;
          }
          return prevTimer - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdown);
    }
  }, [gameStatus, currentProblem]);

  // Styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      maxWidth: '500px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#fff',
      textShadow: '0 0 10px rgba(100, 200, 255, 0.8), 0 0 20px rgba(100, 200, 255, 0.5)',
      zIndex: 1,
      position: 'relative',
    },
    problemBox: {
      backgroundColor: 'rgba(10, 20, 50, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(100, 200, 255, 0.7)',
      marginBottom: '20px',
      width: '100%',
      textAlign: 'center',
      zIndex: 1,
      border: '1px solid rgba(100, 200, 255, 0.5)',
    },
    problemTitle: {
      fontSize: '16px',
      color: 'rgba(100, 200, 255, 1)',
      marginBottom: '10px',
      textShadow: '0 0 5px rgba(100, 200, 255, 0.8)',
    },
    problemText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
    },

    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: '15px',
    },
    option: {
      padding: '15px',
      fontSize: '18px',
      backgroundColor: 'rgba(41, 98, 255, 0.8)',
      color: 'white',
      border: '1px solid rgba(100, 200, 255, 0.5)',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      zIndex: 1,
      position: 'relative',
      boxShadow: '0 0 10px rgba(100, 200, 255, 0.5)',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.5)',
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '20px',
      zIndex: 1,
      position: 'relative',
      backgroundColor: 'rgba(10, 20, 50, 0.7)',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(100, 200, 255, 0.6)',
      border: '1px solid rgba(100, 200, 255, 0.5)',
    },
    stat: {
      fontWeight: 'bold',
      fontSize: '18px',
    },
    lives: {
      color: '#ff5a5f',
      textShadow: '0 0 5px rgba(255, 90, 95, 0.8)',
    },
    score: {
      color: '#5affb4',
      textShadow: '0 0 5px rgba(90, 255, 180, 0.8)',
    },
    timer: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff',
      margin: '10px 0',
      zIndex: 1,
      position: 'relative',
      backgroundColor: 'rgba(25, 118, 210, 0.7)',
      padding: '5px 15px',
      borderRadius: '20px',
      boxShadow: '0 0 15px rgba(100, 200, 255, 0.7)',
      textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
    },
    gameOver: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ff5a5f',
      margin: '20px 0',
      textShadow: '0 0 10px rgba(255, 90, 95, 0.8), 0 0 20px rgba(255, 90, 95, 0.5)',
    },
    gameWon: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#5affb4',
      margin: '20px 0',
      textShadow: '0 0 10px rgba(90, 255, 180, 0.8), 0 0 20px rgba(90, 255, 180, 0.5)',
    },
    restartButton: {
      padding: '15px 30px',
      fontSize: '18px',
      backgroundColor: 'rgba(41, 128, 255, 0.8)',
      color: 'white',
      border: '1px solid rgba(100, 200, 255, 0.7)',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      boxShadow: '0 0 15px rgba(100, 200, 255, 0.7)',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.5)',
      transition: 'all 0.3s',
    }
  };

  return (
    <div style={styles.container}>
      <StarfieldAnimation />
      <div style={styles.header}>
        <h1>CRM Clicker 🚀</h1>
      </div>
      
      {gameStatus === 'playing' && currentProblem && (
        <>
          <div style={styles.problemBox}>
            <div style={styles.problemTitle}>🔥 Проблема:</div>
            <div style={styles.problemText}>"{currentProblem.problem}"</div>
          </div>
          
          <div style={styles.timer}>⏱️ {timer}с</div>
          
          <div style={styles.optionsContainer}>
            {options.map((option, index) => (
              <button
                key={index}
                style={styles.option}
                onClick={() => handleOptionClick(option)}
                onMouseOver={(e) => {
                  e.target.style.boxShadow = '0 0 20px rgba(100, 200, 255, 1)';
                  e.target.style.transform = 'scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.target.style.boxShadow = '0 0 10px rgba(100, 200, 255, 0.5)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {option}
              </button>
            ))}
          </div>
          
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.lives}>❤️ Жизни: {lives}</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.score}>⭐ Очки: {score}/10</span>
            </div>
          </div>
        </>
      )}

      {gameStatus === 'won' && (
        <>
          <div style={styles.gameWon}>Поздравляем! Вы победили! 🏆</div>
          <div style={{color: '#fff', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', margin: '10px 0'}}>Вы собрали {score} очков из 10</div>
          {highScore > 0 && (
            <div style={{color: '#5affb4', textShadow: '0 0 5px rgba(90, 255, 180, 0.8)', margin: '10px 0'}}>
              Ваш рекорд: {Math.max(score, highScore)} очков
            </div>
          )}
          <button 
            style={styles.restartButton} 
            onClick={restartGame}
            onMouseOver={(e) => e.target.style.boxShadow = '0 0 20px rgba(100, 200, 255, 1)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(100, 200, 255, 0.7)'}
          >
            Играть снова
          </button>
        </>
      )}

      {gameStatus === 'lost' && (
        <>
          <div style={styles.gameOver}>Игра окончена! 💔</div>
          <div style={{color: '#fff', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', margin: '10px 0'}}>Вы собрали {score} очков из 10</div>
          {highScore > 0 && (
            <div style={{color: '#5affb4', textShadow: '0 0 5px rgba(90, 255, 180, 0.8)', margin: '10px 0'}}>
              Ваш рекорд: {Math.max(score, highScore)} очков
            </div>
          )}
          <button 
            style={styles.restartButton} 
            onClick={restartGame}
            onMouseOver={(e) => e.target.style.boxShadow = '0 0 20px rgba(100, 200, 255, 1)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(100, 200, 255, 0.7)'}
          >
            Попробовать снова
          </button>
        </>
      )}
    </div>
  );
};

export default App;