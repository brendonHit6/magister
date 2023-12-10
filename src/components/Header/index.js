import React, { useEffect } from "react";
import CN from 'classnames'

import { ReactComponent as ArrowIcon } from './assets/leftArrow.svg'

import styles from './styles.module.scss'

const Table = ({ name, steps, changeStep, currentStep, onModadlOpen }) => {

  useEffect(() => {
    steps && changeStep(1)
  }, [steps])

  const goNext = () => {
    changeStep(currentStep.id + 1)
  }

  const goBack = () => {
    changeStep(currentStep.id - 1)
  }

  return (
    <div className={styles.header}>
      <p>Вибраий файл: {name}</p>
      <button className={styles.calculate} onClick={onModadlOpen}>Розпочати обрахунки</button>
      <div className={styles.progress} >
        <span className={styles.stepText}>Крок</span>
        <button
          className={CN(styles.back, currentStep.id === 1 && styles.bntDisabled)}
          disabled={currentStep.id === 1}
          onClick={goBack}
        >
          <ArrowIcon/>
        </button>
        <p>{currentStep?.id } / {steps}</p>
        <button
          className={CN(styles.next, currentStep.id === steps && styles.bntDisabled)}
          disabled={currentStep.id === steps}
          onClick={goNext}
        >
          <ArrowIcon/>
        </button>
      </div>
    </div>
  )
}

export default Table;