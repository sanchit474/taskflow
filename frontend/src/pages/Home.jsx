import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menubar from "../component/MenuBar";
import Header from "../component/Header";
import { AppContext } from '../context/AppContext.jsx';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    useEffect(() => {
        if (user?.role) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, user]);

    return (
        <div className="flex flex-column items-center justify-content-center min-vh-100">
            <Menubar />
            <Header />
        </div>
    );
};

export default Home;