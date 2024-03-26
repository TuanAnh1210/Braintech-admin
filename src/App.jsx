import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts';
import { publicRoutes } from './routes/routes';
import { Fragment } from 'react';
import 'sweetalert2/src/sweetalert2.scss'
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={'/dashboard'} />} />
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = AdminLayout;
                    if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
