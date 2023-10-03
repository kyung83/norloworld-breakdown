import { MainForm, StatusComponent } from "./components"
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Header from "./components/Header";

export default function App() {
  return (
    <Router basename="/norloworld-breakdown">
          <Header/>
      <div className="py-4 flex flex-col flex-1">
        <header className="mb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Breakdowns</h1>
          </div>
        </header>
        <main className="flex flex-col flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col flex-1 w-full">
            <Routes>
              <Route path="/" exact element={<MainForm />} />
              <Route path="/status" element={<StatusComponent />} />
              {/* Añade más rutas según lo necesites */}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

