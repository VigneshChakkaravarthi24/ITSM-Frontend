import { RouterProvider, createHashRouter,createBrowserRouter } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import TestInstructionsPage from './Components/TestInstructions/TestInstructions';
import LoginPage from './Components/LoginPage/LoginPage';
import EssayPage from './Components/EssayPage/EssayPage';
import AudioTestPage from './Components/AudioTesting/AudioTestingPage';
import AudioPage from './Components/AudioPage/AduioPage';
import WriteEssayPage from './Components/WriteEssay/WriteEssay';
import SummaryPage from './Components/Summary/Summary';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import InstructionsLayout from './Components/InstructionsLayout/InstructionsLayout';
import ErrorPage from './Components/ErrorPage/ErrorPage';
import EssayPage2 from './Components/EssayPage2/Essaypage2';
import ITSMTool from './Components/Userhome/Userhome';
import AudioPage2 from './Components/AudioPage2/AduioPage2';
import NavigatePage from './Components/NavigatePage/NavigatePage';
import WriteEssayPage2 from './Components/WriteEssayPage2/WriteEssay';
import { loader as WelcomeLoader } from './Components/WelcomePage/WelcomePage';
import { loader as EssayLoader } from './Components/EssayPage/EssayPage';
import { loader as AudioPageLoader2 } from './Components/AudioPage2/AduioPage2';
import { loader as EssayPage2Loader } from './Components/EssayPage2/Essaypage2';
import AdminHome from './Components/AdminHome/AdminHomePage';
import TicketPage from './Components/AdminHome/TicketPage';
import UserHomePage from './Components/Userhome/Userhome';
import {loader as userHomePageLoader} from "./Components/Userhome/Userhome"
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    children:[
      {
     
      }
    ]
  },
{
path:"/userHome",
element:<UserHomePage/>,
errorElement: <ErrorPage />,
loader:userHomePageLoader

},
  {
    path:"tickets/:id",
    element:<TicketPage/>,
    errorElement: <ErrorPage />


  },
  {
    element: <PrivateRoute element={<InstructionsLayout />} />,
    children: [
      {
        path: "/welcome",
        element: <WelcomePage />,
        loader: WelcomeLoader,
        errorElement: <ErrorPage />
      },
      {
        path: "/audio-test",
        element: <AudioTestPage />,
        loader: WelcomeLoader,
        errorElement: <NavigatePage buttonText="Back to login" message="An error occurred in Audio Test" title="Oops!!" goToPath="/" />
      },
      {
        path: "/test-instructions",
        element: <TestInstructionsPage />,
        loader: WelcomeLoader,
        errorElement: <NavigatePage buttonText="Back to login" message="An error occurred in Audio Test" title="Oops!!" goToPath="/" />
      },
    ]
  },
  {
    path: "/essay",
    element: <PrivateRoute element={<EssayPage />} />,
    loader: EssayLoader,
    errorElement: <ErrorPage />
  },
  {
    path: "/essay-audio",
    element: <PrivateRoute element={<AudioPage />} />,
    loader: EssayLoader,
  },
  {
    path: "/write-test",
    element: <PrivateRoute element={<WriteEssayPage />} />,
    errorElement: <NavigatePage buttonText="Back to login" message="An error occurred in Write Test" title="Oops!!" goToPath="/" />
  },
  {
    path: "/summary",
    element: <SummaryPage />
  },
  {
    path: "/essay-2",
    element: <PrivateRoute element={<EssayPage2 />} />,
    loader: EssayPage2Loader,
    errorElement: <ErrorPage />
  },
  {
    path: "/essay-audio-2",
    element: <PrivateRoute element={<AudioPage2 />} />,
    loader: AudioPageLoader2
  },
  {
    path: "/write-test-2",
    element: <PrivateRoute element={<WriteEssayPage2 />} />,
  },
]);

function App() {

  



  return <RouterProvider router={router} />;
}

export default App;
