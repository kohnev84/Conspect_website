import './App.css';
import SaveQuestion from './conponents/Page/SaveQuestion';
import SaveQuestionNew from './conponents/Page/SaveQuestionNew';
import Question from './conponents/Page/Question';
import Main from './conponents/Page/Main';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <nav>
        <Router>
          <div>
            <nav>
              <ul className='navbar'>
                <li>
                  <Link to="/">Главная</Link>
                </li>
                <li>
                  <Link to="/questions">Вопросы</Link>
                </li>
                <li>
                  <Link to="/savequestionsnew">Добавить вопрос</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <Routes>

              <Route path="/" element={<Main />} />
              <Route path="/questions" element={<Question />} />
              {/* <Route path="/savequestions" element={<SaveQuestion />} /> */}
              <Route path="/savequestionsnew" element={<SaveQuestionNew />} />
            </Routes>
          </div>
        </Router>
      </nav>
    </div>
  );
}

export default App;
