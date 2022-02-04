import React, {useState, useEffect} from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const fetcher = (url) => fetch(url).then((res) => res.json())


const questionList = [
  {
    q: "대통령은 KBS 방송 편성에 관여할 수 없다",
    a: "O",
    desc: "방송법 위반 사항이에요."
  },
  {
    q: "북한 핵실험은 문재인 대통령 때가 박근혜 대통령 때보다 많았다",
    a: "X",
    desc: "박근혜 5회 문재인 1회"
  }
]

export default function Home() {

  const {data, error} = useSWR('/api/hello', fetcher)

  const [userState, setUserState] = useState(0);
  const [userName, setUserName] = useState('');

  
  const [stage, setStage] = useState("intro")
  const [step, setStep] = useState(0);
  const [onSolve, setOnSolve] = useState(true);
  const [timer, setTimer] = useState(11);
  const [score, setScore] = useState(0);

  const postAnswer = (answer) => {
    setOnSolve(false);
    offTimer();
    if (answer && answer == questionList[step].a) {
      setScore(score + 1)
    }
  }

  const goToNext = () => {
    if (step == questionList.length - 1) {
      setStage("result");
    } else {
      setStep(step+1); 
      setOnSolve(true);
      onTimer();
    }
  }

  const onTimer = () => {
    let quizTimer = setInterval(() => {
      setTimer(timer--);
      if (timer < 0) {
        postAnswer(null);
      }
    }, 1000);
  }

  const offTimer = () => {
    for (var i = 1; i < 99999; i++) window.clearInterval(i);
    setTimer(11);
  }

  return (
    <div>
      <Head>
        <title>비겁하게 팩트로 승부하는 퀴즈</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="비겁하게 팩트로 승부하는 언론"></meta>
        <meta property="og:description" content="비겁하게 팩트로 승부하는 언론"></meta>
      </Head>
      <div className='container'>
        {
          stage == "intro" && 
          <div>
            <h1>20대 대선 팩트체크 퀴즈대회!</h1>
            <button onClick={() => {setStage("quiz"); onTimer();}}>시작하기</button>
          </div>
        }
        {
          stage == "quiz" && onSolve &&
          <div>
            <div>
              <h1>{questionList[step].q}</h1>
              <h2>{timer - 1}</h2>
            </div>
            <div>
              <button className="ox button" onClick={() => postAnswer("O")}>O</button>
              <button className="ox button" onClick={() => postAnswer("X")}>X</button>
            </div>
          </div>
        }
        {
          stage == "quiz" && !onSolve &&
          <div>
            <div>정답은 {questionList[step].a}</div>
            <div>{questionList[step].desc}</div>
            <button onClick={() => goToNext()}>다음 질문으로</button>
          </div>
        }
        {
          stage == "result" &&
          <div>총 {questionList.length}문제 중 {score}문제를 맞추셨네요!</div>
        }
      </div>
    </div>
  )
}
