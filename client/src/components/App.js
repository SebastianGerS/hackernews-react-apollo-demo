import '../styles/App.css';
import Header from './Header';
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Search from './Search';

const App = () => {
  return (
    <div className="center w85">
      <Header/>
      <div className="ph3 pv1 background-gray">
        <Routes>
          <Route exact path="/" element={<Navigate to="/new/1" />} />
          <Route exact path="/create" element={<CreateLink/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/search" element={<Search/>} />
          <Route exact path="/top" element={<LinkList/>} />
          <Route exact path="/new/:page" element={<LinkList/>} />
        </Routes>
      </div>
    </div> 
  );
}

export default App;
