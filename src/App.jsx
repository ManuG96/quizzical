import preguntas from "./preguntas";
import { useState, useEffect } from "react"

function App() {
  const [ preguntaActual, setPreguntaActual ] = useState(0);
  const [ puntuacion, setPuntuacion ] = useState(0);
  const [ isFinished, setIsFinished ] = useState(false);
  const [ tiempoRestante, setTiempoRestante ] = useState(30);
  const [ areDisable, setAreDisable ] = useState(false);
  const [ answerShown, setAnswerShown ] = useState(false);


  function handleAnswerSubmit(isCorrect, e){
    //Añadir puntuacion
    if(isCorrect) setPuntuacion(puntuacion + 1);
    //Añadir estilos
    e.target.classList.add(isCorrect ? "correct" : "incorrect")
    //Cambiar a la siguiente pregunta
    setTimeout(() => {
      if(preguntaActual === preguntas.length - 1){
        setIsFinished(true)
      } else {
        setPreguntaActual(preguntaActual + 1)
      }
    }, 1000)
  }

  useEffect(() => {
    const intervalo = setInterval(() => {
      if(tiempoRestante > 0) setTiempoRestante((prev) => prev -1);
      if(tiempoRestante === 0) setAreDisable(true);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [tiempoRestante]);

  if(isFinished) return (
    <main className="app">
      <div className="juego-terminado">
        <span>Obtuviste { puntuacion } de { preguntas.length }</span>
        <button onClick={ ()=>window.location.href = "/" }>Volver a jugar</button>
        <button onClick={ ()=> {
          setIsFinished(false);
          setAnswerShown(true);
          setPreguntaActual(0);
        }}>Ver respuestas</button>
      </div>
    </main>
  );

  if(answerShown) return(
    <main className="app">
      <div className="lado-izquierdo">
        <div className="pregunta-numero">
          <span>Pregunta { preguntaActual + 1 } de { preguntas.length }</span> 
        </div>
        <div className="pregunta-titulo">{preguntas[preguntaActual].titulo}</div>
        <div>{preguntas[preguntaActual].opciones.filter((opcion) => opcion.isCorrect)[0].textoRespuesta}</div>
        <button onClick={() => {
          if(preguntaActual === preguntas.length - 1){
            window.location.href = "/"
          } else {
            setPreguntaActual(preguntaActual + 1)
          }
        }}>{preguntaActual === preguntas.length - 1 ? "Volver a jugar" : "Siguiente"}</button>
      </div>
    </main>
  );

  return (
    <main className="app">
      <div className="lado-izquierdo">
        <div className="pregunta-numero">
          <span>Pregunta { preguntaActual + 1 } de { preguntas.length }</span> 
        </div>
        <div className="pregunta-titulo">{preguntas[preguntaActual].titulo}</div>
        <div>
          {!areDisable ? (<span className="tiempo-restante">Tiempo restante: { tiempoRestante }</span>) : 
          (
            <button onClick={() => {
              setTiempoRestante(10);
              setAreDisable(false);
              setPreguntaActual(preguntaActual + 1)
              }}>
                Continuar
            </button>
          )}
        </div>
      </div>
      <div className="lado-derecho">
        { preguntas[preguntaActual].opciones.map((opcion) => <button disabled={ areDisable } key={ opcion.textoRespuesta } onClick={ (e)=>handleAnswerSubmit(opcion.isCorrect, e) }> {opcion.textoRespuesta} </button>) }
      </div>
    </main>
  )
}

export default App;
