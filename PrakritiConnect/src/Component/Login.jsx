import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice';
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Dispatch login action to Redux
        dispatch(login({
          user: {
            uid: user.uid,
            email: user.email,
            fullName: userData.fullName,
            role: userData.role
          },
          role: userData.role
        }));
        
        alert(`Login successful! Welcome ${userData.fullName} (${userData.role})`);
        
        // Navigate to home page
        navigate("/home");
      } else {
        alert("User record not found in database. Please sign up first.");
      }
    } catch (error) {
      console.error(error.message);
      if(error.code==="auth/invalid-credential"){
        alert("user not found");
      };
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] overflow-x-hidden"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ef] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0e1b17]">
            <div className="size-4">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#0e1b17] text-lg font-bold leading-tight tracking-[-0.015em]">
              PrakritiConnect
            </h2>
          </div>
        </header>
        <form
          onSubmit={handleLogin}
          className="px-40 flex flex-1 justify-center py-5"
        >
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5">
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#f8fcfa] @[480px]:rounded-lg min-h-[218px]"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLcjsZakDmusBAM_Sl8pKLyNdqexU6OYb6Y9vFK4DMECo_TE5Zt50LzjHsfvDx6lXqKFd2LTSQodrwUSZ2cNL2PGEHt4akGPCcgmoY0hG-tCupdKCKp1-ilcQ4fugENdUjDHFFO213inJh3l-YIMx-gb1BYOgy1ZHquQPKa9voflSTi5EiuMWtv0Bl1RiYgl6HNNEjD38oUkFc6uttFN-j47pYaEit-Tt8gzKhh8-O4xM2oXqHT2AxN3oL9iHYWlxpDhAMV31WeTw2')"
                  }}
                ></div>
              </div>
            </div>
            <h2 className="text-[#0e1b17] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Login to PrakritiConnect
            </h2>

            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e1b17] text-base font-medium leading-normal pb-2">
                  Email
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b17] focus:outline-0 focus:ring-0 border border-[#d0e7df] bg-[#f8fcfa] focus:border-[#d0e7df] h-14 placeholder:text-[#4e977f] p-[15px] text-base font-normal leading-normal"
                  required
                />
              </label>
            </div>

            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e1b17] text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1b17] focus:outline-0 focus:ring-0 border border-[#d0e7df] bg-[#f8fcfa] focus:border-[#d0e7df] h-14 placeholder:text-[#4e977f] p-[15px] text-base font-normal leading-normal"
                  required
                />
              </label>
            </div>

            <div className="flex px-4 py-3">
              <button
                type="submit"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#14b881] text-[#0e1b17] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </button>
            </div>

            <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
              Don't have an account? Sign up
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
