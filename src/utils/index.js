import {  FORCE_HEADER, FORCE_CLEAN_ROW } from '../constants/force'
import { CELL_HEADER, CELL_FOOTER, CELL_HEADER_SECOND } from '../constants/cellContent'

import { vectorTableTransform } from './proccess'

const getForcesTable = (inputString) => {
  const splitedText = inputString.split(FORCE_HEADER)[1].split(FORCE_CLEAN_ROW)
  const forceTable = splitedText[2]
  const pattern = /\s*(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*/;
  const lines = forceTable.trim().split('\n');

  const data = [];
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      const element = match[2];
      const index = parseInt(match[3]);
      const x = parseFloat(match[4]);
      const y = parseFloat(match[5]);
      const z = parseFloat(match[6]);
      data.push({ element, index, x, y, z });
    }
  }
  return { forceTable: data }
}

const getCellContentTable = (inputString) => {
  const text4 = inputString.split(CELL_HEADER)[1].split(CELL_HEADER_SECOND)[1].split(CELL_FOOTER)
  const cellTable = text4.shift()
  const restText = text4.join()

  const pattern = /\s*(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*/;
  const lines = cellTable.trim().split('\n');
  const data = [];
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      const element = match[2];
      const index = parseInt(match[3]);
      const x = parseFloat(match[4]);
      const y = parseFloat(match[5]);
      const z = parseFloat(match[6]);
      data.push({ element, index, x, y, z });
    }
  }
  return { cellContentsTable: data, text4: restText }
}

const getFinalEnergy = (inputString) => {
  const pattern = /\s*(\S+)\s+(\S+)\s*/;
  const splitedText = inputString.split('Final energy =  ')[1]
  const value = splitedText.match(pattern)
  return { finalEnergy: { value: parseFloat(value[1]), label: value[2] }, text5: splitedText }
}

const getRealContent = (content, vector) => {
  const data = content.map((item) => {
    const [ x, y, z ] = vectorTableTransform(item, vector)

    return { ...item, x, y, z }
  })

  return data
}

const getCellData = (inputString) => {
  const pattern = /\s*(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*/;
  const text = inputString.split('Real Lattice(A)              Reciprocal Lattice(1/A)')[1].split('Lattice parameters(A)       Cell Angles')
  const unitCell1 = text[0].trim();
  const lines = unitCell1.trim().split('\n');

  // result
  const realLattice = { label: 'A', values: [] };
  const reciprocalLattice = { label: '1/A', values: [] };
  const latticeParameters = {}
  const cellAngles = {}
  const currentCellVolume = { value: 0, label: ''}
  //

  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      const realX = parseFloat(match[1]);
      const realY = parseFloat(match[2]);
      const realZ = parseFloat(match[3]);
      const reciprocalX = parseFloat(match[4]);
      const reciprocalY = parseFloat(match[5]);
      const reciprocalZ = parseFloat(match[6]);
      realLattice.values.push([realX, realY, realZ ])
      reciprocalLattice.values.push({ x: reciprocalX, y: reciprocalY, z: reciprocalZ })
    }
  }
  const text2 = text[1].split('Current cell volume = ')
  const unitCell2 = text2[0];
  const linesSecond = unitCell2.trim().split('\n');
  
  for (const line of linesSecond) {
    const match = line.match(pattern);
    if (match) {
      latticeParameters[match[1]] = match[3]
      cellAngles[match[4]] = match[6]
    }
  }

  const text3 = text2[1].split('Cell Contents')
  const unitCell3= text3[0];
  const lines3 = unitCell3.trim().split('\r\n')[0].split(' ');
  currentCellVolume.value = parseFloat(lines3[0])
  currentCellVolume.label = lines3[1]

  const responce = {
    realLattice,
    reciprocalLattice,
    latticeParameters,
    cellAngles,
    currentCellVolume,
  }

  const { cellContentsTable, text4 } = getCellContentTable(text3[1])
  const { finalEnergy, text5 } = getFinalEnergy(text4)
  const { forceTable } = getForcesTable(text5)
  const realTable = getRealContent(cellContentsTable, responce.realLattice.values)
  
  return {
    unitCell: responce,
    cellContentsTable,
    realTable,
    finalEnergy,
    forceTable
  }
}

export { getCellData }
