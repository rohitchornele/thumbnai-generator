// import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { Link, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";

// const Navbar = () => {

//     const {user, setShowLogin, setUser, logout, credit} = useContext(AppContext);

//     const navigate = useNavigate();
//   return (
//     <div className="flex items-center justify-between py-4">
//       <Link to='/'>
//         <img src={assets.logo} alt="" className="w-28 sm:w-32 lg:w-40" />
//       </Link>
      
//       <div className="">
//         {
//             user ? 
//             <div className="flex text-center gap-2 sm:gap-5 items-center">
//                 <button className="flex items-center gap-2 bg-blue-100 px-4 sm:px-5 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700 cursor-pointer" onClick={()=>navigate('/buy')}>
//                     <img src={assets.credit_star} alt="" className="w-5" />
//                     <p className="text-xs sm:text-sm font-medium text-gray-600">Credits Left : {credit}</p>
//                 </button>
//                 <p className="text-gray-600 max-sm:hidden pl-4">Hi, {user.name}</p>
//                 <div className="relative group">
//                     <img src={assets.profile_icon} alt="" className="w-10 drop-shadow" />
//                     <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
//                         <ul className="list-none m-0 p-2 bg-white rounded-md  text-sm">
//                             <li className="px-2 py-1 cursor-pointer pr-10" onClick={logout}>Logout</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div> :
//             <div className="flex gap-2 sm:gap-5 items-center">
//                 <p className="cursor-pointer" onClick={() => navigate('/buy')}>Pricing</p>
//                 <button className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer" onClick={() => setShowLogin(true)}>Login</button>
//             </div>
//         }
//       </div>
//     </div>
//   );
// };

// export default Navbar;



import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div
      className="
        flex items-center justify-between py-4
        border-b border-white/10
        text-white
      "
    >
      <Link to="/">
        <img src={assets.logo} alt="Home" className="w-28 sm:w-32 lg:w-40 opacity-90" />
      </Link>

      <div>
        {user ? (
          <div className="flex items-center text-center gap-2 sm:gap-5">
            <button
              className="
                flex items-center gap-2
                px-4 sm:px-5 py-1.5 sm:py-2.5
                rounded-full
                bg-[var(--accent-orange)]
                text-black
                hover:opacity-90
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
                motion-safe:transform-gpu motion-safe:transition-transform motion-safe:hover:scale-[1.03]
                duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                cursor-pointer
              "
              onClick={() => navigate("/buy")}
            >
              <img src={assets.credit_star} alt="" className="w-5" />
              <p className="text-xs sm:text-sm font-medium">
                Credits Left : {credit}
              </p>
            </button>

            <p className="text-white/70 max-sm:hidden pl-2 sm:pl-4">
              Hi, {user.name}
            </p>

            <div className="relative group focus-within:block">
              <img
                src={assets.profile_icon}
                alt="Account menu"
                className="w-10 drop-shadow cursor-pointer"
                tabIndex={0}
                aria-haspopup="menu"
                aria-expanded="false"
              />
              <div
                className="
                  absolute hidden group-hover:block focus-within:block
                  top-0 right-0 z-10
                  pt-12
                  text-white
                "
              >
                <ul
                  className="
                    list-none m-0 p-2
                    rounded-md
                    border border-white/10
                    bg-[var(--bg-app)]
                    text-sm
                    min-w-[140px]
                  "
                  role="menu"
                >
                  <li
                    className="px-3 py-2 cursor-pointer hover:bg-white/5 rounded"
                    role="menuitem"
                    onClick={logout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-5 items-center">
            <p className="cursor-pointer text-white/80 hover:text-white" onClick={() => navigate("/buy")}>
              Pricing
            </p>
            <button
              className="
                px-7 sm:px-10 py-2 text-sm rounded-full
                text-black bg-[var(--accent-orange)]
                hover:opacity-90
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
              "
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
