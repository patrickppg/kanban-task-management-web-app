import { useState } from 'react'
import { SelectedBoardIdContext, SelectedTaskIdContext } from './contexts/contexts'
import SidePanel from './components/App/SidePanel/SidePanel'
import Board from './components/App/Board/Board'
import DialogAddBoard from './components/App/DialogAddBoard/DialogAddBoard'
import DialogEditBoard from './components/App/DialogEditBoard/DialogEditBoard'
import DialogDeleteBoard from './components/App/DialogDeleteBoard/DialogDeleteBoard'
import DialogAddTask from './components/App/DialogAddTask/DialogAddTask'
import DialogEditTask from './components/App/DialogEditTask/DialogEditTask'
import DialogDeleteTask from './components/App/DialogDeleteTask/DialogDeleteTask'
import DialogViewTask from './components/App/DialogViewTask/DialogViewTask'
import DialogAddColumn from './components/App/DialogAddColumn/DialogAddColumn'
import './App.css'

function App() {
  const [idOfSelectedBoard, setIdOfSelectedBoard] = useState("")
  const [idOfSelectedTask, setIdOfSelectedTask] = useState("")
  const [isDialogAddBoardOpen, setIsDialogAddBoardOpen] = useState(false)
  const [isDialogEditBoardOpen, setIsDialogEditBoardOpen] = useState(false)
  const [isDialogDeleteBoardOpen, setIsDialogDeleteBoardOpen] = useState(false)
  const [isDialogAddTaskOpen, setIsDialogAddTaskOpen] = useState(false)
  const [isDialogEditTaskOpen, setIsDialogEditTaskOpen] = useState(false)
  const [isDialogDeleteTaskOpen, setIsDialogDeleteTaskOpen] = useState(false)
  const [isDialogViewTaskOpen, setIsDialogViewTaskOpen] = useState(false)
  const [isDialogAddColumnOpen, setIsDialogAddColumnOpen] = useState(false)

  return (
    <SelectedBoardIdContext value={idOfSelectedBoard}>
      <SelectedTaskIdContext value={idOfSelectedTask}>
        <div id="app">
          <SidePanel
            onSelectBoard={id => setIdOfSelectedBoard(id)}
            onCommandAddition={() => setIsDialogAddBoardOpen(true)} />
          <Board
            onViewTask={id => { setIsDialogViewTaskOpen(true); setIdOfSelectedTask(id)}}
            onAddTask={() => setIsDialogAddTaskOpen(true)}
            onAddColumn={() => setIsDialogAddColumnOpen(true)}
            onCommandEdition={() => setIsDialogEditBoardOpen(true)}
            onCommandDeletion={() => setIsDialogDeleteBoardOpen(true)} />
          <DialogAddBoard
            isOpen={isDialogAddBoardOpen}
            onClose={() => setIsDialogAddBoardOpen(false)}
            onAdd={(id) => setIdOfSelectedBoard(id)} />
          <DialogEditBoard
            isOpen={isDialogEditBoardOpen}
            onClose={() => setIsDialogEditBoardOpen(false)} />
          <DialogDeleteBoard
            isOpen={isDialogDeleteBoardOpen}
            onCancel={() => setIsDialogDeleteBoardOpen(false)}
            onDelete={(id) => {setIsDialogDeleteBoardOpen(false); setIdOfSelectedBoard(id)}} 
            onClose={() => setIsDialogDeleteBoardOpen(false)} />
          <DialogAddTask
            isOpen={isDialogAddTaskOpen}
            onClose={() => setIsDialogAddTaskOpen(false)} />
          <DialogEditTask
            isOpen={isDialogEditTaskOpen}
            onClose={() => setIsDialogEditTaskOpen(false)} />
          <DialogDeleteTask
            isOpen={isDialogDeleteTaskOpen}
            onDelete={() => {setIsDialogDeleteTaskOpen(false); setIsDialogViewTaskOpen(false)}}
            onCancel={() => setIsDialogDeleteTaskOpen(false)}
            onClose={() => setIsDialogDeleteTaskOpen(false)} />
          <DialogViewTask
            isOpen={isDialogViewTaskOpen}
            onEdit={() => setIsDialogEditTaskOpen(true)}
            onDelete={() => setIsDialogDeleteTaskOpen(true)}
            onClose={() => setIsDialogViewTaskOpen(false)} />
          <DialogAddColumn
            isOpen={isDialogAddColumnOpen}
            onClose={() => setIsDialogAddColumnOpen(false)} />
        </div>
      </SelectedTaskIdContext>      
    </SelectedBoardIdContext>
  )
}

export default App