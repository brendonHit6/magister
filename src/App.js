import React, { useState } from 'react';

import FileSelector from './components/FileSelecto'
import Table from './components/Table'
import Headder from './components/Header'
import Modal from './components/Modal'

import { getCellData } from './utils'

import './App.css';

function App() {
  const [fileContent, setFileContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('')
  const [selectedStep, setSelectedStep] = useState({})
  const [showModal, setShowModal] = useState(false)

  function getMDIterationContent(inputString) {
    const pattern = 'Starting MD iteration';
    const array = inputString.split(pattern)
    array.splice(0, 1);
    return array
  }

  const handleFileChange = (event) => {
    setLoading(true)
    const file = event.target.files[0];
    setName(file.name)
    const reader = new FileReader();
    reader.onerror = () => {
      setLoading(false)
    }
    reader.onload = () => {
      setLoading(false)
      let result = {}
      const arraySteps =  getMDIterationContent(reader.result)
      arraySteps.forEach((text) => {
        const stepIndex = parseInt(text.match(/\d+/)[0])
        result[stepIndex] = {
          id: stepIndex,
          ...getCellData(text),
        }
      })
      setFileContent(result);
    };
    reader.readAsText(file);
  };

  const changeStep = (index) => {
    setSelectedStep(fileContent[index])
  }

  const onModalClose = () => {
    setShowModal(false)
  }

  const onModadlOpen = () => {
    setShowModal(true)
  }

  return (
    <div>
      <FileSelector handleFileChange={handleFileChange} />
      {name && (
        <Headder
          name={name}
          steps={Object.keys(fileContent).length}
          changeStep={changeStep}
          currentStep={selectedStep}
          onModadlOpen={onModadlOpen}
        />
      )}
      <Table loading={loading} step={selectedStep} />
      <Modal onClose={onModalClose} isOpen={showModal} data={fileContent} />
    </div>
  );
}

export default App;
