import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { SpinnerDiamond } from 'spinners-react';

import styles from './styles.module.scss'

import { arrayAverage } from '../../utils/array'
import { isEmpty } from "../../utils/object";
import { LAYER_BREAK_POINT } from "../../constants";

const Table = ({ isOpen, onClose, data = {} }) => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState({})

  useEffect(() => {
    const initial = () => {
      setLoading(true)
      const d1List = []
      const d2List = []
      const dList = []
      const deltaList = []

      Object.values(data).forEach((item) => {
        const upLayer = item.realTable.filter((item) => item.z > LAYER_BREAK_POINT)
        const downLayer = item.realTable.filter((item) => item.z < LAYER_BREAK_POINT)
        const up_P_list = upLayer.filter((item) => item.element === 'P')
        const down_P_list = downLayer.filter((item) => item.element === 'P')
        const up_Cu_list = upLayer.filter((item) => item.element === 'Cu')
        const down_Cu_list = downLayer.filter((item) => item.element === 'Cu')
        const up_In_list = upLayer.filter((item) => item.element === 'In')
        const down_In_list = downLayer.filter((item) => item.element === 'In')

        const UP_P_LENGTH = up_P_list.length

        const Z0_UP_LIST = []
        const Z0_DOWN_LIST = []

        const Cu_d1_up = []
        const Cu_d1_down = []

        const In_d2_up = []
        const In_d2_down = []
    
        for (let index = 0; index < UP_P_LENGTH/2; index++) {
          const loopIndex = index * 2
          const z0_up = Math.abs(up_P_list[loopIndex +1].z - up_P_list[loopIndex].z)/2 + Math.min(up_P_list[loopIndex +1].z, up_P_list[loopIndex].z)
          const z0_down = Math.abs(down_P_list[loopIndex +1].z - down_P_list[loopIndex].z)/2 + Math.min(down_P_list[loopIndex +1].z, down_P_list[loopIndex].z)

          Z0_UP_LIST.push(z0_up)
          Z0_DOWN_LIST.push(z0_down)
        }
        
        up_Cu_list.forEach((_, index) => {
          Cu_d1_up.push(Math.abs(up_Cu_list[index].z - Z0_UP_LIST[index]))
          Cu_d1_down.push(Math.abs(down_Cu_list[index].z - Z0_DOWN_LIST[index]))
        })

        up_In_list.forEach((_, index) => {
          In_d2_up.push(Math.abs(up_In_list[index].z - Z0_UP_LIST[index]))
          In_d2_down.push(Math.abs(down_In_list[index].z - Z0_DOWN_LIST[index]))
        })


        const maxZup = Math.max(...upLayer.map((item) => item.z))
        const minZup = Math.min(...upLayer.map((item) => item.z))
        const maxZdown = Math.max(...downLayer.map((item) => item.z))
        const minZdown = Math.min(...downLayer.map((item) => item.z))
        const layerHeight = [ maxZup - minZup, maxZdown - minZdown ]

        const deltaTop =  Math.min(...upLayer.map((item) => item.z))
        const deltaBot = Math.max(...downLayer.map((item) => item.z))
        const delta = deltaTop - deltaBot

        const d1 = arrayAverage([...Cu_d1_up, ...Cu_d1_down])
        const d2 = arrayAverage([...In_d2_up, ...In_d2_down])
        const d = arrayAverage(layerHeight)

        d1List.push(d1)
        d2List.push(d2)
        dList.push(d)
        deltaList.push(delta)
      })

      const d1 = arrayAverage(d1List)
      const d2 = arrayAverage(d2List)
      const d = arrayAverage(dList)
      const delta = arrayAverage(deltaList)

      setRes({ d1, d2, d, delta })
      setLoading(false)
    }
    !isEmpty(data) && isOpen && initial()
  }, [data, isOpen])


  return (
    <ReactModal
      className={styles.modal}
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="Modal info"
    >
      <h2 className={styles.title}>Результати</h2>
      <p className={styles.about}>*Обрахування виконані як середнє арифметичне</p>
      <div className={styles.content}>
        { loading && (
          <div className={styles.loader}>
            <SpinnerDiamond
              size={90}
              thickness={98}
              speed={180}
              color="#36ad47"
              secondaryColor="rgba(0, 0, 0, 0.89)"
            />
          </div>
        )}
        <p>Відстань Сu до центра сполуки: <span className={styles.value}>{res.d1}</span></p>
        <p>Відстань In до центра сполуки: <span className={styles.value}>{res.d2}</span></p>
        <p>Ширина сполуки: <span className={styles.value}>{res.d}</span></p>
        <p>Відстань між шарами: <span className={styles.value}>{res.delta}</span></p>
      </div>
    </ReactModal>
  )
}

export default Table;