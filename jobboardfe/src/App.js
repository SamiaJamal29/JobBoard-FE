import Axios from 'axios'
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';
import { jwtDecode } from "jwt-decode";
import Home from './components/home/Home';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import About from './components/about/About';
import Signup from "./components/authentication/Signup";
import JobCategoryList from './components/jobCategory/JobCategoryList';
import SkillsList from './components/skills/SkillsList';
import CompanyList from './components/company/CompanyList';
import JobList from './components/job/JobList';
import Login from "./components/authentication/Login";
import CompanyCreateForm from './components/company/CompanyCreateForm';


function App() {
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [userInfo,setUserInfo]=useState()

  useEffect(() => {
    //const user = setUser();
    const user = getUser();
    console.log("INIT USER",user);
    if (user) {
      setIsAuth(true);
      setUser(user);
      // setUserInfo(user.id)
      // showUser(user.id)
    }
    else {
      logout()
    }
   
  }, []);

  const registerHandler = (user) => {
    Axios.post("/signup/", user)
      .then((res) => {
        console.log(res);
        console.log("Register Success");
      })
      .catch((err) => {
        console.log(err);
        console.log("Register Not Success");
      });
  };

  

  const handleLogin = (newLogin) => {
    Axios.post('/login/', newLogin)
    .then(res => {
        console.log('successfully logged in', res.data);
        const access_token = res.data.access_token
        const refresh_token = res.data.refresh_token
        console.log('access token', access_token);
        console.log('refresh token', refresh_token);
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        const user = jwtDecode(access_token).user_id;
        console.log("user",user);
        if (user) {
          setIsAuth(true)
          setUser(user);
        }
        else {
          setIsAuth(false);
          setUser(null);
        }
        // user ? showUser(user.id) : showUser(null);
        console.log('Login Success');
        // navigate("/");
    })
    .catch(err => {
        console.log('error logging in', err.response);
    })
  }


  // const loginHandler = (cred) => {
  //   Axios.post("/login/", cred)
  //     .then((res) => {
  //       console.log(res.data.token);
  //       //Makes sure the token is Valid
  //       let token = res.data.token;
  //       if (token != null) {
  //         localStorage.setItem("access_token", token);
  //         const user = getUser();
  //         console.log(user);
  //         user ? setIsAuth(true) : setIsAuth(false);
  //         user ? setUser(user) : setUser(null);
  //         user ? showUser(user.id) : showUser(null)
  //         console.log("Login Success");
  //         // user ? setUserInfo(user.id) : setUserInfo(null)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const logout = () => {
    setIsAuth(false);
    setUser({});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // navigate('/login');
    console.log('Logout Success');
    console.log("INIT USER",user);
  }


  const getUser = () => {
    const token = getToken();
    return token ? jwtDecode(token).user_id : null;
  };

  const getToken = () => {
    const token = localStorage.getItem("access_token");
    return token;
  };

  const handleLogout = () => {
    Axios.post('/logout/')
      .then((response) => {
        console.log('Have Successfully Logged out:', response.data);
        
      })
      .catch((error) => {
        console.error('Error logging out:', error.response);
      });
  };

  // const showUser = (id) =>{
  //   Axios.get(`/user/detail?id=${id}`)
  //   .then((response) => {
  //     console.log(response)
  //     let user = response.data.user
  //     setCurrentUser(user)
  //     setUserInfo(user)
  // })
  // .catch((err) => {
  //     console.log(err)
  // })
  // }
  const setHeaders =() =>{
    return {headers:{Authorization:`Bearer ${getToken()}`}}
  }
  return (
    <>
      <div className="App">
        <header className="p-3 purple-header">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a
                href="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              ></a>

              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <a href="/" className="nav-link px-2 text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="nav-link px-2 text-white">
                    About
                  </a>
                </li>
                {isAuth ? (
                  <>
                <li>
                  <Link to="/jobs/" className="nav-link px-2 text-white">
                    {" "}
                    Browse Category
                  </Link>
                </li>
                <li>
                  <Link to="/company/" className="nav-link px-2 text-white">
                    {" "}
                    Companies
                  </Link>
                </li>
                </>
                ):(
                  <li>
                  <a href="/jobs/" className="nav-link px-2 text-white">
                    Browse Category
                  </a>
                </li>
               
                )
              }
              </ul>

              <form
                className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
                role="search"
              >
                <input
                  type="search"
                  className="form-control form-control-dark"
                  placeholder="Search..."
                  aria-label="Search"
                />
              </form>

              <div className="text-end">
                {isAuth ? (
                  <button type="button" onClick={logout} className="btn btn-outline-light me-2">
                  Logout
                </button>
                ):(
                  <>
                <Link to="/login/">
                  <button type="button" className="btn btn-outline-light me-2">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button type="button" className="btn btn-warning text-black">
                    Sign-up
                  </button>
                </Link>
                </>
                )
                }
                  
              </div>
            </div>
          </div>
        </header>
      </div>
      
      <main>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/about" element={<About/>} />
          <Route path='/skills' element={<SkillsList/>} />
          <Route path='/company/' element={<CompanyList/>} />
          <Route path="/jobs" element={<JobList/>}/>
           <Route path="/company/create" element={<CompanyCreateForm />} />                       
          <Route path="/signup" element={isAuth ? (<Home /> ) : (<Signup register={registerHandler} /> )} />
          <Route path="/login/" element={isAuth ? (<Home/> ): <Login login={handleLogin} />} />
          <Route path='/logout' element={<Login/>}/>
          <Route path='/job_category' element={<JobCategoryList/>}/>
      
        </Routes>
      </main>

      <footer className="px-3 py-2  purple-header  footerbottom">
        <div className="container">
          <p className="mb-1 text-white text-center font">
            &copy; 2024 | SkillSail{" "}
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
